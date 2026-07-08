import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { portal } from '../data/content'
import type { Team } from './types'
import { useAuth } from './useAuth'
import { getTeam, updateLastLogin } from './api'
import FullScreenLoader from './FullScreenLoader'
import RegistrationScreen from './RegistrationScreen'
import RegistrationSuccessScreen from './RegistrationSuccessScreen'
import TeamPortalScreen from './TeamPortalScreen'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'

/**
 * Self-guarding /portal entry: Firestore team lookup → registration (no team
 * yet) or the team portal. Sign-in happens on the site's ส่งผลงาน CTA before
 * arriving here; signed-out visits bounce back to the home page.
 */
export default function PortalPage() {
  const { user, loading, signOut } = useAuth()
  const [team, setTeam] = useState<Team | null>(null)
  const [teamLoading, setTeamLoading] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  // True right after registering in this session — shows the success screen
  // until the team clicks through to the portal.
  const [justRegistered, setJustRegistered] = useState(false)
  // Bumped by the retry button to re-run the lookup effect.
  const [attempt, setAttempt] = useState(0)

  const email = user?.email ?? null

  useEffect(() => {
    if (!email) {
      setTeam(null)
      return
    }
    let cancelled = false
    setTeamLoading(true)
    setLoadFailed(false)
    getTeam(email)
      .then((t) => {
        if (cancelled) return
        setTeam(t)
        // Best-effort login stamp for existing teams; never blocks the portal.
        // New registrations get their first stamp in createTeam().
        if (t) updateLastLogin(email).catch(() => {})
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true)
      })
      .finally(() => {
        if (!cancelled) setTeamLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [email, attempt])

  if (loading || teamLoading) return <FullScreenLoader />
  if (!email) return <Navigate to="/" replace />

  if (loadFailed) {
    return (
      <PortalShell onSignOut={signOut}>
        <p className="leading-relaxed text-muted">{portal.errors.load}</p>
        <div className="mt-6">
          <PortalButton onClick={() => setAttempt((n) => n + 1)}>
            {portal.errors.retry}
          </PortalButton>
        </div>
      </PortalShell>
    )
  }

  if (!team) {
    return (
      <RegistrationScreen
        email={email}
        onRegistered={(t) => {
          setTeam(t)
          setJustRegistered(true)
        }}
        onSignOut={signOut}
      />
    )
  }
  if (justRegistered) {
    return (
      <RegistrationSuccessScreen
        onContinue={() => setJustRegistered(false)}
        onSignOut={signOut}
      />
    )
  }
  return <TeamPortalScreen team={team} onSignOut={signOut} />
}
