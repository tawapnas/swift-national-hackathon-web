import type { CSSProperties } from 'react'
import { useReveal } from '../hooks/useReveal'

/**
 * Decorative emojis placed down the page near the left/right gutters.
 * Each one slides in from its side (and gently bobs) the first time it
 * scrolls into view, driven by `.float-emoji` / `.float-wrap` in index.css.
 * Purely ornamental: pointer-events-none and pinned behind the content.
 *
 * To add / move / restyle an emoji, edit the EMOJIS array below — every
 * placement is fully defined here, nothing is randomized.
 */

type Floater = {
  emoji: string
  side: 'left' | 'right' // which edge it sits at and slides in from
  top: number // how far down the full page, in %
  edge?: number // distance from its side edge, in vw (default 3)
  size?: number // font size, in rem (default 3)
  rot?: number // resting rotation, in deg (default 0)
  delay?: number // slide-in delay, in s (default 0)
  opacity?: number // resting opacity, 0–1 (default 0.85)
}

// ---- Define your emojis here ----
const EMOJIS: Floater[] = [
  // { emoji: '🚀', side: 'left', top: 14, size: 3.5, rot: -12 },
  // { emoji: '💻', side: 'right', top: 22, size: 3, rot: 10 },
  // { emoji: '⚡️', side: 'left', top: 32, size: 2.6, rot: 8 },
  // { emoji: '🎯', side: 'right', top: 40, size: 3, rot: -8 },
  // { emoji: '🧑‍💻', side: 'left', top: 50, size: 3.2, rot: 6 },
  // { emoji: '🏆', side: 'right', top: 58, size: 2.8, rot: 12 },
  // { emoji: '💡', side: 'left', top: 66, size: 2.6, rot: -10 },
  // { emoji: '🎉', side: 'right', top: 74, size: 3.2, rot: 8 },
  // { emoji: '✨', side: 'left', top: 82, size: 2.4, rot: 0 },
  // { emoji: '📱', side: 'right', top: 90, size: 2.8, rot: -10 },
]

function FloatingEmoji({ f }: { f: Floater }) {
  const ref = useReveal<HTMLSpanElement>()

  const wrapStyle: CSSProperties = {
    top: `${f.top}%`,
    [f.side]: `${f.edge ?? 3}vw`,
    animationDelay: `${f.delay ?? 0}s`,
  }

  const emojiStyle = {
    fontSize: `${f.size ?? 3}rem`,
    '--from-x': f.side === 'left' ? '-180%' : '180%',
    '--rot': `${f.rot ?? 0}deg`,
    '--peak-opacity': f.opacity ?? 0.85,
    '--delay': `${f.delay ?? 0}s`,
  } as CSSProperties

  return (
    <span className="float-wrap" style={wrapStyle} aria-hidden>
      <span ref={ref} className="float-emoji select-none" style={emojiStyle}>
        {f.emoji}
      </span>
    </span>
  )
}

export default function ScrollEmojis() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {EMOJIS.map((f, i) => (
        <FloatingEmoji key={i} f={f} />
      ))}
    </div>
  )
}
