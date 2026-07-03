// Firebase app singletons. Config comes from VITE_FIREBASE_* env vars
// (.env.local for dev — see .env.example; Vercel project env vars for deploys).
// Only imported by portal code, and the /portal route is lazy-loaded, so the
// marketing site never pulls in Firebase.

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)

/** Google sign-in popup. Also dynamically imported by the site's ส่งผลงาน CTA
 *  so the popup opens straight from the click. */
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
