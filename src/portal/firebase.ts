// The portal's Firebase singletons, on the app from src/firebaseApp.ts (where
// the VITE_FIREBASE_* config is read). Only imported by portal code, and the
// /portal route is lazy-loaded, so the marketing site never pulls in Firebase.

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getStorage } from 'firebase/storage'
import { app } from '../firebaseApp'

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)

// Callable Cloud Functions live in asia-southeast1 (the Firestore DB region,
// asia-southeast3, isn't supported by Eventarc/functions). Best-effort welcome
// email sent right after registration; the function reads the recipient from the
// caller's auth token, so no arguments are passed.
const functions = getFunctions(app, 'asia-southeast1')
export const sendWelcomeEmail = httpsCallable(functions, 'sendWelcomeEmail')

/** Google sign-in popup. Also dynamically imported by the site's ส่งผลงาน CTA
 *  so the popup opens straight from the click. */
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
