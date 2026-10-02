// The Firebase app itself, without any product SDK. Config comes from
// VITE_FIREBASE_* env vars (.env.local for dev — see .env.example; Vercel
// project env vars for deploys). Split from portal/firebase.ts so the public
// daily-lessons page (src/lessons/) can read Firestore without pulling in the
// portal's Auth / Storage / Functions. Only imported from lazy-loaded routes,
// so the marketing page itself still never loads Firebase.

import { initializeApp } from 'firebase/app'

export const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})
