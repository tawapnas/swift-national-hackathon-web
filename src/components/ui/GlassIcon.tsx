import type { CSSProperties } from 'react'

/**
 * An SF Symbol sitting inside a frosted "liquid glass" circle — translucent
 * fill, blurred backdrop, bright top highlight + soft drop shadow. Mirrors the
 * cover-page chips (Hero's GlassDevice) and reuses the same circle size and
 * `.glass-device` / `.glass-device-inner` drop-in + bob animations from
 * index.css. Used as a decorative badge beside each section title.
 *
 * The symbol is a plain <img> from `public/sf/`, keeping its own exported
 * colors. Purely ornamental: aria-hidden.
 */

// Same circle size as the cover page's center chip (Hero.tsx).
const CIRCLE = 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16'

type GlassIconProps = {
  asset: string // path under /public, e.g. '/sf/lightbulb.fill.svg'
  rot?: number // resting tilt in deg (default 0)
  className?: string // extra placement utilities (e.g. flex-none)
}

export default function GlassIcon({ asset, rot = 0, className = '' }: GlassIconProps) {
  return (
    <span aria-hidden className={`block ${className}`}>
      <span
        className="glass-device block"
        style={{ '--memoji-rot': `${rot}deg` } as CSSProperties}
      >
        <span
          className={`glass-device-inner flex items-center justify-center rounded-full border border-white/20 backdrop-blur-xl ${CIRCLE}`}
          style={{
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -10px 22px rgba(255,255,255,0.06), 0 14px 30px rgba(0,0,0,0.45)',
          }}
        >
          <img
            src={asset}
            alt=""
            draggable={false}
            className="h-1/2 w-1/2 select-none object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
          />
        </span>
      </span>
    </span>
  )
}
