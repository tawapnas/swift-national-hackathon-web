// Daily lessons (/explore): the page's two switches and the schedule — one
// lesson a day in the run-up to the national round. The lessons'
// CONTENT is not here — it is read from Firestore one lesson at a time
// (getLesson in api.ts), where firestore.rules holds each lesson back until
// its day. This file has no Firebase import: the navbar reads LESSONS_IN_NAV
// from it on the marketing page.

/** Shows the page's link in the navigation bar. While false the page still
 *  works at /explore — it just isn't linked from anywhere. */
export const LESSONS_IN_NAV: boolean = false

/** While true, EVERY lesson can be read by ANYONE who opens the page,
 *  whatever its date — for checking the lessons ahead of time. The date check
 *  is enforced by firestore.rules, so this must match allLessonsOpen()
 *  there: change both, and deploy both the rules and the site. */
export const LESSONS_ALL_OPEN: boolean = false

export const LESSON_COUNT = 14

const DAY_MS = 86_400_000
// Lesson 1 opens 3 ต.ค. 2569 at 00:00 Bangkok time, then one more lesson each
// midnight. Thailand has no daylight saving, so whole days are exact. Keep in
// sync with FIRST_UNLOCK in scripts/seed-lessons.mjs, which stamps the same
// instants on the docs for the rules to check.
const FIRST_UNLOCK = Date.parse('2026-10-03T00:00:00+07:00')

/** The instant (ms) the lesson of day `day` (1–14) opens. */
export const lessonUnlockAt = (day: number): number => FIRST_UNLOCK + (day - 1) * DAY_MS

/** How many lessons are open at `now` (0 before the first day, capped at 14). */
export const unlockedCount = (now: number): number =>
  Math.min(LESSON_COUNT, Math.max(0, Math.floor((now - FIRST_UNLOCK) / DAY_MS) + 1))

/** The day (1–14) whose lesson is today's at `now`; null before the first day
 *  and from the day after the last lesson on. */
export const todayLesson = (now: number): number | null => {
  const n = unlockedCount(now)
  return n >= 1 && now < lessonUnlockAt(n) + DAY_MS ? n : null
}

/** The clock the page runs on. In dev, `?now=<ISO date-time>` overrides it so
 *  each date state can be walked through without waiting for the day. */
export function lessonsNow(): number {
  if (import.meta.env.DEV) {
    const override = Date.parse(new URLSearchParams(window.location.search).get('now') ?? '')
    if (!Number.isNaN(override)) return override
  }
  return Date.now()
}
