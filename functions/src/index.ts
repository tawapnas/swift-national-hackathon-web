// Cloud Functions for the Young iOS Developer Hackathon portal.
//
// sendWelcomeEmail: an HTTPS callable invoked by the portal right after a team
// registers (createTeam() in src/portal/api.ts). It emails the team a welcome
// message via Resend. Running this server-side keeps the Resend API key off the
// browser (Resend also blocks CORS from browsers).
//
// Why a callable and not a Firestore onCreate trigger: this project's Firestore
// database lives in asia-southeast3 (Bangkok), which Eventarc does not support,
// so a Firestore-triggered function can't be deployed. A callable has no
// Eventarc/database-region constraint and runs in asia-southeast1.
//
// The recipient is taken from the caller's authenticated sign-in token — never
// from client input — so it can only ever email the signed-in user. An
// idempotency guard on the team doc (welcomeEmailSentAt) prevents duplicate sends.

import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { defineSecret } from 'firebase-functions/params'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { logger } from 'firebase-functions/v2'

initializeApp()

// Stored in Cloud Secret Manager — set with `firebase functions:secrets:set RESEND_API_KEY`.
const RESEND_API_KEY = defineSecret('RESEND_API_KEY')

export const sendWelcomeEmail = onCall(
  { region: 'asia-southeast1', secrets: [RESEND_API_KEY] },
  async (request) => {
    const email = request.auth?.token?.email
    if (!email) {
      throw new HttpsError('unauthenticated', 'Sign-in required.')
    }

    // The team doc id is the (lowercased) leader email — see createTeam().
    const teamRef = getFirestore().doc(`teams/${email.toLowerCase()}`)
    const snap = await teamRef.get()
    if (!snap.exists) {
      // Only teams that have registered get the welcome email.
      logger.warn('sendWelcomeEmail: no team doc for caller, skipping', { email })
      return { ok: false, skipped: 'no-team' as const }
    }

    // Idempotency guard: never send twice, even if the client retries.
    if (snap.get('welcomeEmailSentAt')) {
      logger.info('sendWelcomeEmail: already sent, skipping', { email })
      return { ok: true, skipped: 'already-sent' as const }
    }

    const payload = {
      from: 'Swift Coding Club TH <no-reply@yidh.swiftcodingclubth.com>',
      to: [email],
      subject: 'ยินดีต้อนรับเข้าสู่การแข่งขัน Young iOS Developer Hackathon 2026',
      template: { id: 'hackathon-register', variables: {} },
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY.value()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.text()
      logger.error('sendWelcomeEmail: Resend returned an error', {
        email,
        status: res.status,
        body,
      })
      throw new HttpsError('internal', 'Failed to send welcome email.')
    }

    logger.info('sendWelcomeEmail: sent', { email, status: res.status })

    // Mark the doc so a retry won't re-send.
    await teamRef.update({ welcomeEmailSentAt: FieldValue.serverTimestamp() })

    return { ok: true }
  },
)
