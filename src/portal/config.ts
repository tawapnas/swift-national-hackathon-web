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
export const RESULTS_ANNOUNCED: boolean = false
