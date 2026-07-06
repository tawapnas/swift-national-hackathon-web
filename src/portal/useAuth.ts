import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from './firebase'

/** Firebase auth state + sign-out. `loading` is true until the first auth
 *  snapshot arrives (avoid bouncing signed-in users off /portal). Sign-in
 *  itself lives in firebase.ts (signInWithGoogle), triggered by the site CTA. */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u)
        setLoading(false)
      }),
    [],
  )

  return {
    user,
    loading,
    signOut: () => signOut(auth),
  }
}
