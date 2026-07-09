import { useEffect, useState } from 'react'
import { portal } from '../data/content'
import { useAuth } from './useAuth'
import { isOrganizer } from './api'
import { signInWithGoogle } from './firebase'
import FullScreenLoader from './FullScreenLoader'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'
import OrganizerDashboard from './OrganizerDashboard'

/**
 * Self-guarding /organizer entry. Unlike /portal, signed-out visitors are NOT
 * bounced home — they get a sign-in screen (organizers navigate here directly).
 * Gate: loading → not-signed-in → signed-in-but-not-allowlisted → dashboard.
 * Authorization is enforced server-side by firestore.rules; this is just the UI.
 */
export default function OrganizerPage() {
  const { user, loading, signOut } = useAuth()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  const email = user?.email ?? null

  useEffect(() => {
    if (!email) {
      setAllowed(null)
      return
    }
    let cancelled = false
    setChecking(true)
    isOrganizer(email)
      .then((ok) => !cancelled && setAllowed(ok))
      .catch(() => !cancelled && setAllowed(false))
      .finally(() => !cancelled && setChecking(false))
    return () => {
      cancelled = true
    }
  }, [email])

  const o = portal.organizer

  if (loading || checking) return <FullScreenLoader />

  // Not signed in → sign-in screen.
  if (!email) {
    const handleSignIn = async () => {
      if (signingIn) return
      setSigningIn(true)
      try {
        await signInWithGoogle()
      } catch (err) {
        console.error('organizer sign-in failed:', err)
      } finally {
        setSigningIn(false)
      }
    }
    return (
      <PortalShell>
        <h1 className="text-3xl font-bold md:text-4xl">{o.signIn.heading}</h1>
        <p className="mt-3 leading-relaxed text-muted">{o.signIn.body}</p>
        <div className="mt-6">
          <PortalButton onClick={handleSignIn} disabled={signingIn}>
            {o.signIn.cta}
          </PortalButton>
        </div>
      </PortalShell>
    )
  }

  // Signed in but not an organizer → access denied.
  if (allowed === false) {
    return (
      <PortalShell onSignOut={signOut}>
        <h1 className="text-3xl font-bold md:text-4xl">{o.denied.heading}</h1>
        <p className="mt-3 leading-relaxed text-muted">{o.denied.body}</p>
      </PortalShell>
    )
  }

  if (allowed === true) return <OrganizerDashboard onSignOut={signOut} />

  // allowed === null while the check is settling.
  return <FullScreenLoader />
}
