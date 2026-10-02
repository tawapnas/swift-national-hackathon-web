// Firestore reads for the daily lessons: lessons/{1..14}, written by
// scripts/seed-lessons.mjs. Public — no sign-in. firestore.rules lets anyone
// get a lesson once its unlockAt has passed (by the server's clock), so a
// lesson cannot be read before its day.
//
// Uses the lite SDK on purpose, and not only for size: it sends one request
// per read, so each read is judged at the time it is made. The full SDK reads
// over a long-lived stream whose request.time stays at the moment the stream
// opened — a browser refused just before midnight would keep being refused
// after it.

import { doc, getDoc, getFirestore } from 'firebase/firestore/lite'
import { app } from '../firebaseApp'

const db = getFirestore(app)

// Text in blocks may carry **bold** and `code`.
export type LessonBlock = { type: 'p'; text: string } | { type: 'ul'; items: string[] }

export interface LessonResource {
  title: string
  url: string
  isNew: boolean // needs the iOS 27 SDK (stored, not shown on the card)
  // Video thumbnail (the video page's own preview image); absent or null for
  // documents and for lessons seeded before thumbnails existed.
  image?: string | null
}

export interface Lesson {
  day: number // 1–14
  unlockAt: unknown // Timestamp; the rules hold the lesson until then
  workshop: string // stored, not shown on the page
  title: string
  // Topic icon: a small PNG data URL used as a CSS mask on the lesson's card.
  // Absent on lessons seeded before icons existed.
  icon?: string | null
  isNew: boolean
  blocks: LessonBlock[]
  resources: LessonResource[]
}

export type LessonResult =
  | { status: 'ok'; lesson: Lesson }
  // The rules refused: the lesson's day hasn't come by the server's clock, or
  // it isn't seeded yet (the rules can't tell those apart).
  | { status: 'locked' }
  // Readable but not seeded — only seen while every lesson is forced open.
  | { status: 'missing' }

/** The lesson of one day. Lessons are read one at a time because the rules
 *  check each lesson's unlockAt against the server time — a collection query
 *  could not be gated that way. */
export async function getLesson(day: number): Promise<LessonResult> {
  try {
    const snap = await getDoc(doc(db, 'lessons', String(day)))
    return snap.exists() ? { status: 'ok', lesson: snap.data() as Lesson } : { status: 'missing' }
  } catch (e) {
    if ((e as { code?: string }).code === 'permission-denied') return { status: 'locked' }
    throw e
  }
}
