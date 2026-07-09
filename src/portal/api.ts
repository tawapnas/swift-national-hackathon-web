// Firestore/Storage data layer for the portal. A team doc lives at
// teams/{leaderEmail} (lowercased); the submission ZIP at
// submissions/{leaderEmail}/{fileName}. Security rules mirror this layout
// (see firestore.rules / storage.rules at the repo root).

import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from './firebase'
import type { Submission, Team } from './types'

const teamDoc = (email: string) => doc(db, 'teams', email.toLowerCase())
const teamsCol = () => collection(db, 'teams')

export async function getTeam(email: string): Promise<Team | null> {
  const snap = await getDoc(teamDoc(email))
  return snap.exists() ? (snap.data() as Team) : null
}

export async function createTeam(
  team: Omit<Team, 'createdAt' | 'submission' | 'isQualifyingFinalRound' | 'lastLogin'>,
): Promise<void> {
  await setDoc(teamDoc(team.email), {
    ...team,
    email: team.email.toLowerCase(),
    isQualifyingFinalRound: null,
    createdAt: serverTimestamp(),
    // Registration is itself a sign-in, so stamp the first login now.
    lastLogin: serverTimestamp(),
  })
}

/** Records the current sign-in time on the team doc. Best-effort — a failure
 *  here must not block portal access, so callers ignore rejections. */
export async function updateLastLogin(email: string): Promise<void> {
  await updateDoc(teamDoc(email), { lastLogin: serverTimestamp() })
}

/** Uploads the ZIP to Storage, then locks the submission onto the team doc. */
export async function submitProject(
  email: string,
  essays: Record<string, string>,
  runEnvironment: string,
  file: File,
): Promise<Submission> {
  const fileRef = ref(storage, `submissions/${email.toLowerCase()}/${file.name}`)
  await uploadBytes(fileRef, file, { contentType: 'application/zip' })
  const fileUrl = await getDownloadURL(fileRef)
  const submission: Submission = {
    essays,
    runEnvironment,
    fileUrl,
    fileName: file.name,
    // The submit UI requires the terms checkbox, so acceptance is always true here.
    termsAccepted: true,
    submittedAt: serverTimestamp(),
    locked: true,
  }
  await updateDoc(teamDoc(email), { submission })
  return submission
}

// ---------------------------------------------------------------------------
// Organizer dashboard (/organizer). All reads below require the caller to be on
// the organizers/{email} allowlist — enforced by firestore.rules, which grants
// allowlisted users read+list over every team. See scripts/manage-organizers.mjs.
// ---------------------------------------------------------------------------

/** Whether the signed-in email is on the organizer allowlist (the access gate).
 *  A non-organizer is still allowed to read only their OWN organizers/{email}
 *  doc, so this check never trips the rules for anyone. */
export async function isOrganizer(email: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'organizers', email.toLowerCase()))
  return snap.exists()
}

/** Total number of teams. Server-side aggregation — billed as ~1 read, not N. */
export async function getTeamsCount(): Promise<number> {
  const snap = await getCountFromServer(teamsCol())
  return snap.data().count
}

/** How many teams have a locked submission. Every submission sets locked:true,
 *  and nested fields are auto-indexed, so no composite index is needed. */
export async function getSubmittedCount(): Promise<number> {
  const snap = await getCountFromServer(query(teamsCol(), where('submission.locked', '==', true)))
  return snap.data().count
}

/** How many teams have signed in to the portal at least once. lastLogin is
 *  stamped on every sign-in and is null until the first; `!= null` matches the
 *  signed-in ones (and excludes any doc still missing the field). */
export async function getSignedInCount(): Promise<number> {
  const snap = await getCountFromServer(query(teamsCol(), where('lastLogin', '!=', null)))
  return snap.data().count
}

export interface TeamsPage {
  teams: Team[]
  // Cursor for the next page (pass back as `cursor`); null on an empty page.
  lastDoc: QueryDocumentSnapshot | null
  hasMore: boolean
}

/** One page of teams (newest first), for the default browse. Fetches one extra
 *  doc to detect whether a next page exists. ~pageSize reads per call. Pass the
 *  previous page's `lastDoc` as `cursor` to advance. */
export async function listTeamsPage(
  cursor?: QueryDocumentSnapshot | null,
  pageSize = 10,
): Promise<TeamsPage> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  if (cursor) constraints.push(startAfter(cursor))
  const snap = await getDocs(query(teamsCol(), ...constraints, limit(pageSize + 1)))
  const hasMore = snap.docs.length > pageSize
  const pageDocs = hasMore ? snap.docs.slice(0, pageSize) : snap.docs
  return {
    teams: pageDocs.map((d) => d.data() as Team),
    lastDoc: pageDocs.length ? pageDocs[pageDocs.length - 1] : null,
    hasMore,
  }
}

/** Every team in one shot (newest first). Used ONLY by search / the
 *  not-submitted filter / CSV export — Firestore can't do substring search or a
 *  "field-absent" query server-side. A national round is bounded (low hundreds),
 *  so this one-time full read is cheap and only runs when the organizer opts in. */
export async function fetchAllTeams(): Promise<Team[]> {
  const snap = await getDocs(query(teamsCol(), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => d.data() as Team)
}
