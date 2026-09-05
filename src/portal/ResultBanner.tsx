import { useNavigate } from 'react-router-dom'
import { portal } from '../data/content'
import type { Team } from './types'
import PortalButton, { portalButtonClass } from './PortalButton'
import { RESULTS_ANNOUNCED } from './config'

/**
 * Top-of-portal banner once regional results are out. Finalists get the
 * orange-glow card that leads to the national-round page (with their
 * confirmation status); every other submitted team gets a quiet card with
 * just the participation-certificate download. Teams that never submitted
 * (or whose flag is undecided) see nothing.
 */
export default function ResultBanner({ team }: { team: Team }) {
  if (!RESULTS_ANNOUNCED || !team.submission || team.isQualifyingFinalRound === null) return null
  return team.isQualifyingFinalRound ? (
    <QualifiedBanner confirmed={team.finalRound != null} />
  ) : (
    <CertificateBanner url={team.certificateUrl} />
  )
}

function QualifiedBanner({ confirmed }: { confirmed: boolean }) {
  const b = portal.banner.qualified
  const navigate = useNavigate()

  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-swift-orange/40 bg-surface p-6 md:p-8">
      {/* Soft brand glow from the top-left corner. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 0% 0%, color-mix(in srgb, var(--color-swift-orange) 18%, transparent) 0%, transparent 60%)',
        }}
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-swift-orange">
            {b.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight">{b.heading}</h2>
          <p className="mt-2 text-pretty leading-relaxed text-muted">{b.body}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <PortalButton onClick={() => navigate('/portal/final-round')}>
              {confirmed ? b.ctaConfirmed : b.cta}
            </PortalButton>
            {confirmed && <ConfirmedPill />}
          </div>
        </div>
        <img
          src={b.memoji}
          alt=""
          aria-hidden
          className="hidden h-24 w-24 flex-none select-none sm:block"
        />
      </div>
    </section>
  )
}

/** Shown once the team has confirmed its participation. */
function ConfirmedPill() {
  const b = portal.banner.qualified
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-swift-orange bg-swift-orange/15 px-3 py-1 text-xs font-medium text-swift-orange">
      <CheckIcon />
      {b.confirmed}
    </span>
  )
}

function CertificateBanner({ url }: { url?: string }) {
  const b = portal.banner.notQualified

  return (
    <section className="mb-10 rounded-2xl border border-line bg-surface p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-swift-orange">
            {b.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight">{b.heading}</h2>
          <p className="mt-2 text-pretty leading-relaxed text-muted">{b.body}</p>
          {!url && <p className="mt-2 text-sm text-swift-gold">{b.preparing}</p>}
        </div>
        {url ? (
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className={`${portalButtonClass()} flex-none`}
          >
            <DownloadIcon />
            {b.download}
          </a>
        ) : (
          // Same footprint as the live button, so the layout doesn't jump
          // once the file lands.
          <span aria-disabled className={`${portalButtonClass()} flex-none opacity-40`}>
            <DownloadIcon />
            {b.download}
          </span>
        )}
      </div>
    </section>
  )
}

/* ---------- tiny inline icons (no icon library in this project) ---------- */

export function DownloadIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />
    </svg>
  )
}

export function CheckIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
