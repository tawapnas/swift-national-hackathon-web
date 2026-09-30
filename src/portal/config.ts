/**
 * Competition phase flags. Flip a flag back to `false` to reopen that phase —
 * the UI (and the matching rules in firestore.rules / storage.rules) is the
 * only gate; there is no date arithmetic anywhere.
 */

/** Regional-round deadline (16 ส.ค. 2569, 23:59) has passed — no new submissions. */
export const SUBMISSION_CLOSED: boolean = true

/** Team registration is closed — no new teams. */
export const REGISTRATION_CLOSED: boolean = true

/** Regional-round results are announced — submitted teams with a decided
 *  isQualifyingFinalRound see the full-screen result on portal sign-in. */
export const RESULTS_ANNOUNCED: boolean = true

/** Finalist-info form (/portal/final-round/info) is closed — no new
 *  submissions. Mirror in firestore.rules / storage.rules when flipping. */
export const FINALIST_INFO_CLOSED: boolean = false

/** While true, the finalist-info form (/portal/final-round/info, and its entry
 *  card on the national-round page) is visible ONLY to the staff test
 *  account(s) below — for testing on production before opening it to every
 *  finalist. Flip to false to launch. */
export const FINALIST_INFO_STAFF_ONLY: boolean = false
export const STAFF_TEST_EMAILS: readonly string[] = ['staff@swiftcodingclubth.com']

/** Whether this team (by its leader email) may see the finalist-info form. */
export const canSeeFinalistInfo = (email: string): boolean =>
  !FINALIST_INFO_STAFF_ONLY || STAFF_TEST_EMAILS.includes(email.toLowerCase())
