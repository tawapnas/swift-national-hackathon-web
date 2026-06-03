import type { CSSProperties } from 'react'
import { useReveal } from '../hooks/useReveal'

/**
 * Decorative SF Symbols placed down the page near the left/right gutters.
 * Each one slides in from its side (and gently bobs) the first time it
 * scrolls into view, driven by `.float-emoji` / `.float-wrap` in index.css.
 * Purely ornamental: pointer-events-none and pinned behind the content.
 *
 * ── Assets ──────────────────────────────────────────────────────────────
 * Export each SF Symbol from the SF Symbols app as an **SVG** and drop it in
 * `public/sf/` using the symbol's own name (e.g. `graduationcap.fill.svg`).
 * They are referenced by absolute path at runtime, so the build never breaks
 * if a file is still missing — that symbol simply won't paint yet.
 *
 * Each SVG is rendered as-is (its own exported colors are kept), so style the
 * color in the SF Symbols app — Multicolor / Hierarchical / Palette all work.
 *
 * To add / move / restyle a symbol, edit the SYMBOLS array below — every
 * placement is fully defined here, nothing is randomized.
 */

type Floater = {
  asset: string // path under /public, e.g. '/sf/swift.svg'
  side: 'left' | 'right' // which edge it sits at and slides in from
  top: number // how far down the full page, in %
  edge?: number // distance from its side edge, in vw (default 3)
  size?: number // box size, in rem (default 3)
  rot?: number // resting rotation, in deg (default 0)
  delay?: number // slide-in delay, in s (default 0)
  opacity?: number // resting opacity, 0–1 (default 0.85)
}

// ---- Define your SF Symbols here ----
// Designed so each symbol echoes the section it floats beside, top → bottom:
//   Hero · Gallery · About · Format · Eligibility · Timeline · Learn · Organizers
const SYMBOLS: Floater[] = [
  // Hero — creativity / turning ideas into apps
  // { asset: '/sf/sparkles.svg', side: 'left', top: 9, size: 3, rot: -10 }, // TODO: add asset
  { asset: '/sf/swift.svg', side: 'right', top: 15, size: 3.2, rot: 10 },

  // Gallery — moments from last year
  // { asset: '/sf/camera.fill.svg', side: 'left', top: 25, size: 2.8, rot: 8 }, // TODO: add asset

  // About — the idea behind the contest / Apple technologies
  { asset: '/sf/lightbulb.fill.svg', side: 'right', top: 34, size: 3, rot: -8 },
  // { asset: '/sf/apple.logo.svg', side: 'left', top: 42, size: 2.6, rot: 6 }, // TODO: add asset

  // Format — Round 1 online regional, Round 2 national final
  // { asset: '/sf/laptopcomputer.svg', side: 'right', top: 50, size: 3, rot: 8 }, // TODO: add asset
  // { asset: '/sf/flag.checkered.svg', side: 'left', top: 58, size: 2.8, rot: -10 }, // TODO: add asset

  // Eligibility — high-school & vocational students
  { asset: '/sf/graduationcap.fill.svg', side: 'right', top: 66, size: 3, rot: 10 },

  // Timeline — the schedule
  { asset: '/sf/calendar.svg', side: 'left', top: 74, size: 2.6, rot: 8 },

  // Learn — Swift Playgrounds / learning resources
  { asset: '/sf/book.fill.svg', side: 'right', top: 82, size: 2.8, rot: -8 },

  // Organizers / closing — the prize, celebration
  // { asset: '/sf/trophy.fill.svg', side: 'left', top: 91, size: 3, rot: 6 }, // TODO: add asset
]

function FloatingSymbol({ f }: { f: Floater }) {
  // Observe the wrap (which never moves), NOT the image — the image starts
  // translated off-screen (translateX ±180%) inside the overflow-hidden
  // container, so observing it would never intersect the viewport and the
  // slide-in would never fire. `.is-visible` lands on the wrap; the CSS
  // (`.float-wrap.is-visible .float-emoji` in index.css) drives the image in.
  const ref = useReveal<HTMLSpanElement>()

  const wrapStyle: CSSProperties = {
    top: `${f.top}%`,
    [f.side]: `${f.edge ?? 3}vw`,
    animationDelay: `${f.delay ?? 0}s`,
  }

  const size = `${f.size ?? 3}rem`
  const symbolStyle = {
    width: size,
    height: size,
    objectFit: 'contain',
    '--from-x': f.side === 'left' ? '-180%' : '180%',
    '--rot': `${f.rot ?? 0}deg`,
    '--peak-opacity': f.opacity ?? 0.85,
    '--delay': `${f.delay ?? 0}s`,
  } as CSSProperties

  return (
    <span ref={ref} className="float-wrap" style={wrapStyle} aria-hidden>
      <img
        src={f.asset}
        alt=""
        draggable={false}
        className="float-emoji select-none"
        style={symbolStyle}
      />
    </span>
  )
}

export default function ScrollEmojis() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {SYMBOLS.map((f, i) => (
        <FloatingSymbol key={i} f={f} />
      ))}
    </div>
  )
}
