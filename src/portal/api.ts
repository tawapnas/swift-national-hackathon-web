// Firestore/Storage data layer for the portal. A team doc lives at
// teams/{leaderEmail} (lowercased); the submission ZIP at
// submissions/{leaderEmail}/{fileName}. Security rules mirror this layout
// (see firestore.rules / storage.rules at the repo root).

import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from './firebase'
import type { Submission, Team } from './types'

const teamDoc = (email: string) => doc(db, 'teams', email.toLowerCase())

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
