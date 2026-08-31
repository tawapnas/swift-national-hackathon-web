import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { portal } from '../data/content'
import type { Team } from './types'
import { useAuth } from './useAuth'
import { getTeam, updateLastLogin } from './api'
import FullScreenLoader from './FullScreenLoader'
import RegistrationScreen from './RegistrationScreen'
import RegistrationClosedScreen from './RegistrationClosedScreen'
import RegistrationSuccessScreen from './RegistrationSuccessScreen'
import TeamPortalScreen from './TeamPortalScreen'
import ResultScreen from './ResultScreen'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'
import { REGISTRATION_CLOSED, RESULTS_ANNOUNCED } from './config'

/**
 * Self-guarding /portal entry: Firestore team lookup → the team portal, or —
 * with no team doc — registration (closed: see REGISTRATION_CLOSED). Sign-in
 * happens on the site's เข้าร่วมการแข่งขัน CTA before arriving here;
 * signed-out visits bounce back to the home page.
 */
export default function PortalPage() {
  const { user, loading, signOut } = useAuth()
  const [team, setTeam] = useState<Team | null>(null)
  const [teamLoading, setTeamLoading] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  // True right after registering in this session — shows the success screen
  // until the team clicks through to the portal.
  const [justRegistered, setJustRegistered] = useState(false)
  // True once the team clicks through the result announcement to the portal.
  const [resultSeen, setResultSeen] = useState(false)
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
    return REGISTRATION_CLOSED ? (
      <RegistrationClosedScreen onSignOut={signOut} />
    ) : (
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
  // Announced + submitted + decided → full-screen result until clicked through.
  const showResult =
    RESULTS_ANNOUNCED &&
    team.submission != null &&
    team.isQualifyingFinalRound !== null &&
    !resultSeen

  if (showResult) {
    return (
      <ResultScreen
        qualified={team.isQualifyingFinalRound === true}
        teamName={team.teamName}
        onContinue={() => setResultSeen(true)}
        onSignOut={signOut}
      />
    )
  }

  return <TeamPortalScreen team={team} onSignOut={signOut} />
}
