import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { portal } from '../data/content'
import type { FinalistInfoInput, Team, WifiIdCards } from './types'
import { useAuth } from './useAuth'
import {
  confirmFinalRound,
  getTeam,
  getWifiIdCards,
  submitFinalistInfo,
  submitWifiIdCards,
  updateLastLogin,
} from './api'
import FullScreenLoader from './FullScreenLoader'
import RegistrationScreen from './RegistrationScreen'
import RegistrationClosedScreen from './RegistrationClosedScreen'
import RegistrationSuccessScreen from './RegistrationSuccessScreen'
import TeamPortalScreen from './TeamPortalScreen'
import ResultScreen from './ResultScreen'
import FinalRoundScreen from './FinalRoundScreen'
import FinalistInfoScreen from './FinalistInfoScreen'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'
import {
  canSeeFinalistInfo,
  FINALIST_INFO_CLOSED,
  REGISTRATION_CLOSED,
  RESULTS_ANNOUNCED,
  WIFI_ID_CLOSED,
} from './config'

/**
 * Self-guarding /portal entry: Firestore team lookup → the team portal, or —
 * with no team doc — registration (closed: see REGISTRATION_CLOSED). Sign-in
 * happens on the site's เข้าร่วมการแข่งขัน CTA before arriving here;
 * signed-out visits bounce back to the home page.
 *
 * `view` selects the screen once the team is loaded: the portal itself,
 * (/portal/final-round) the national-round page, or (/portal/final-round/info)
 * the finalist-info form — both finalists only; everyone else is sent back to
 * /portal, and the form additionally requires a confirmed team.
 */
export default function PortalPage({
  view = 'portal',
}: {
  view?: 'portal' | 'finalRound' | 'finalistInfo'
}) {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
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
  // The students' Wi-Fi ID-card doc, read only on the finalist-info screen:
  // undefined = not loaded yet, null = not sent.
  const [wifiIds, setWifiIds] = useState<WifiIdCards | null | undefined>(undefined)
  const [wifiIdsError, setWifiIdsError] = useState(false)

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

  // Gated like the screen itself, so the read never trips the rules.
  const wantWifiIds =
    view === 'finalistInfo' && team?.isQualifyingFinalRound === true && Boolean(team.finalRound)
  const teamEmail = team?.email ?? null
  useEffect(() => {
    if (!wantWifiIds || !teamEmail) return
    let cancelled = false
    setWifiIdsError(false)
    getWifiIdCards(teamEmail)
      .then((d) => {
        if (!cancelled) setWifiIds(d)
      })
      .catch(() => {
        if (!cancelled) setWifiIdsError(true)
      })
    return () => {
      cancelled = true
    }
  }, [wantWifiIds, teamEmail])

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

  if (view === 'finalistInfo') {
    if (team.isQualifyingFinalRound !== true) return <Navigate to="/portal" replace />
    if (!team.finalRound) return <Navigate to="/portal/final-round" replace />
    // Staff-only while FINALIST_INFO_STAFF_ONLY (production testing).
    if (!canSeeFinalistInfo(team.email)) return <Navigate to="/portal/final-round" replace />
    // Uploads the images + writes the locked form, then re-reads the doc so
    // the screen flips to its summary with the stored URLs and timestamp.
    const handleSubmitInfo = async (info: FinalistInfoInput, files: File[]) => {
      await submitFinalistInfo(team.email, info, files)
      const fresh = await getTeam(team.email)
      if (fresh) setTeam(fresh)
    }
    // Creates the one-shot ID-card doc, then re-reads it for the server time.
    const handleSubmitWifiIds = async (idCards: string[]) => {
      await submitWifiIdCards(team.email, idCards)
      setWifiIds(await getWifiIdCards(team.email))
    }
    return (
      <FinalistInfoScreen
        team={team}
        onSubmit={handleSubmitInfo}
        closed={FINALIST_INFO_CLOSED}
        wifiIds={wifiIds}
        wifiIdsError={wifiIdsError}
        wifiIdsClosed={WIFI_ID_CLOSED}
        onSubmitWifiIds={handleSubmitWifiIds}
        onBack={() => navigate('/portal/final-round')}
        onSignOut={signOut}
      />
    )
  }

  if (view === 'finalRound') {
    if (team.isQualifyingFinalRound !== true) return <Navigate to="/portal" replace />
    // Writes the one-shot confirmation to Firestore, then re-reads the doc so
    // local state carries the server timestamp; the page flips to its locked
    // view and the banner to "confirmed".
    const handleConfirm = async () => {
      await confirmFinalRound(team.email)
      const fresh = await getTeam(team.email)
      setTeam(
        (t) =>
          fresh ??
          (t && { ...t, finalRound: { confirmedAt: new Date().toISOString(), locked: true } }),
      )
    }
    return (
      <FinalRoundScreen
        team={team}
        onConfirm={handleConfirm}
        onOpenInfo={() => navigate('/portal/final-round/info')}
        infoClosed={FINALIST_INFO_CLOSED}
        infoAvailable={canSeeFinalistInfo(team.email)}
        onBack={() => navigate('/portal')}
        onSignOut={signOut}
      />
    )
  }

  return <TeamPortalScreen team={team} onSignOut={signOut} />
}
