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
  team: Omit<Team, 'createdAt' | 'submission' | 'isQualifyingFinalRound'>,
): Promise<void> {
  await setDoc(teamDoc(team.email), {
    ...team,
    email: team.email.toLowerCase(),
    isQualifyingFinalRound: null,
    createdAt: serverTimestamp(),
  })
}

/** Uploads the ZIP to Storage, then locks the submission onto the team doc. */
export async function submitProject(
  email: string,
  essays: Record<string, string>,
  file: File,
): Promise<Submission> {
  const fileRef = ref(storage, `submissions/${email.toLowerCase()}/${file.name}`)
  await uploadBytes(fileRef, file, { contentType: 'application/zip' })
  const fileUrl = await getDownloadURL(fileRef)
  const submission: Submission = {
    essays,
    fileUrl,
    fileName: file.name,
    submittedAt: serverTimestamp(),
    locked: true,
  }
  await updateDoc(teamDoc(email), { submission })
  return submission
}
