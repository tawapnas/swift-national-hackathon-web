import { useRef, useState } from 'react'
import { portal } from '../data/content'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'
import { withBold } from './HackathonDetailSection'
import { CONFETTI_COLORS, shareResultCard } from './shareResultCard'

// Ambient SSC-style confetti for the winner screen (see .confetti in index.css).
// ~16 deterministic pieces (index-based scatter, no Math.random so the shower
// is stable across renders). Every 3rd piece is a "far" one: smaller, dimmer,
// soft-blurred — the depth that makes the drift read as SSC-like.
const CONFETTI_PIECES = Array.from({ length: 16 }, (_, i) => {
  const far = i % 3 === 0
  const dur = 8 + ((i * 2.31) % 6) // 8–14s per fall — slow float, not a burst
  return {
    '--x': `${(i * 61.8 + 7) % 100}%`,
    '--delay': `${-((i * 3.7) % dur).toFixed(2)}s`, // negative: mid-air on first paint
    '--dur': `${dur.toFixed(2)}s`,
    '--size': `${(far ? 7 : 10) + ((i * 1.7) % 4)}px`,
    '--sway': `${22 + ((i * 13) % 38)}px`,
    '--spin': `${(i % 2 ? 1 : -1) * (360 + ((i * 47) % 360))}deg`,
    '--clr': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    '--o': far ? 0.55 : 0.9,
    '--blur': far ? '1.5px' : '0px',
  } as React.CSSProperties
})

/** Full-screen regional-round result announcement (WWDC-SSC style): congrats
 *  for finalists, thank-you for the other submitted teams. The CTA continues
 *  into the regular team portal; the organizer preview overrides its label. */
export default function ResultScreen({
  qualified,
  teamName,
  onContinue,
  onSignOut,
  ctaLabel,
}: {
  qualified: boolean
  teamName: string
  onContinue: () => void
  onSignOut: () => void
  ctaLabel?: string
}) {
  const s = qualified ? portal.result.qualified : portal.result.notQualified
  const share = portal.result.share
  const [sharing, setSharing] = useState(false)
  const [shareError, setShareError] = useState(false)
  // Synchronous re-entry guard: the `sharing` state only disables the button
  // after a re-render, so a fast double-tap could start two shares without it.
  const sharingRef = useRef(false)

  const handleShare = async () => {
    if (sharingRef.current) return
    sharingRef.current = true
    setSharing(true)
    setShareError(false)
    try {
      await shareResultCard(teamName)
    } catch {
      setShareError(true)
    } finally {
      sharingRef.current = false
      setSharing(false)
    }
  }

  return (
    <PortalShell onSignOut={onSignOut}>
      {qualified && (
        <div className="confetti" aria-hidden>
          {CONFETTI_PIECES.map((style, i) => (
            <span key={i} className="confetti-piece" style={style}>
              <i />
            </span>
          ))}
        </div>
      )}
      <div className="py-10">
        <img src={s.memoji} alt="" aria-hidden className="h-32 w-32 select-none" />
        <h1 className="mt-8 text-3xl font-bold leading-tight md:text-4xl">{s.heading}</h1>
        <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted [word-break:auto-phrase]">
          {s.body.map((p, i) => (
            <p key={i}>{withBold(p.replace('{teamName}', teamName))}</p>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <PortalButton onClick={onContinue}>{ctaLabel ?? s.cta}</PortalButton>
          {qualified && (
            <PortalButton variant="outline" onClick={handleShare} disabled={sharing}>
              {sharing ? share.preparing : share.button}
            </PortalButton>
          )}
        </div>
        {shareError && <p className="mt-3 text-sm text-swift-orange">{share.error}</p>}
      </div>
    </PortalShell>
  )
}
