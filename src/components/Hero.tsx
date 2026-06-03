import type { CSSProperties } from 'react'
import { hero, site } from '../data/content'
import RegisterButton from './RegisterButton'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-line pt-24 pb-20 md:pt-28 md:pb-24"
    >
      {/* Royal-blue → navy radial glow, spanning the whole cover (matches poster) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(125% 95% at 50% 12%, var(--color-cover-blue) 0%, var(--color-cover-navy) 42%, transparent 78%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(var(--color-fg) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Memoji — big, overlapping, sitting fully above the title. The device
            chips are absolutely positioned over the memojis' lower corners, so
            they never steal horizontal space and the memojis stay large on
            mobile. `isolate` scopes the z-stacking. */}
        <div className="relative isolate mb-6 flex justify-center sm:mb-8">
          <div className="relative inline-flex items-end justify-center">
            {hero.memojis.map((src, i) => (
              <span
                key={src}
                className={`relative ${i === 1 ? 'z-20' : 'z-10'} ${i > 0 ? '-ml-10 sm:-ml-16 md:-ml-20' : ''
                  }`}
                style={{ filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.5))' }}
              >
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className={`memoji block select-none object-contain ${i === 1
                      ? 'h-44 w-44 sm:h-60 sm:w-60 md:h-72 md:w-72'
                      : 'h-36 w-36 sm:h-48 sm:w-48 md:h-56 md:w-56'
                    }`}
                  style={
                    {
                      '--memoji-rot': `${[-10, 0, 10][i] ?? 0}deg`,
                      animationDelay: `${0.15 + i * 0.15}s`,
                    } as CSSProperties
                  }
                />
              </span>
            ))}
            {/* Device chips. On mobile they overlap the memojis' lower corners
                (kept low + scattered). At md+ the translate-x overrides push them
                fully outside the group's edges, so they flank without overlapping. */}
            <GlassDevice
              emoji="🎨"
              sizeClass="h-9 w-9 text-base sm:h-11 sm:w-11 sm:text-lg md:h-12 md:w-12 md:text-xl"
              className="absolute bottom-6 left-0 -translate-x-1/3 sm:bottom-8 md:bottom-32 md:-translate-x-[130%]"
              rot={-9}
              delay={0.05}
            />
            <GlassDevice
              emoji="💻"
              sizeClass="h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl md:h-16 md:w-16 md:text-3xl"
              className="absolute -bottom-1 left-6 sm:left-9 md:bottom-10 md:left-0 md:-translate-x-[125%]"
              rot={6}
              delay={0.15}
            />
            <GlassDevice
              emoji="📱"
              sizeClass="h-11 w-11 text-lg sm:h-12 sm:w-12 sm:text-xl md:h-14 md:w-14 md:text-2xl"
              className="absolute bottom-0 right-6 sm:right-9 md:bottom-12 md:right-0 md:translate-x-[125%]"
              rot={9}
              delay={0.2}
            />
            <GlassDevice
              emoji="🏆"
              sizeClass="h-9 w-9 text-base sm:h-10 sm:w-10 sm:text-lg md:h-11 md:w-11 md:text-xl"
              className="absolute bottom-6 right-0 translate-x-1/3 sm:bottom-8 md:bottom-32 md:translate-x-[125%]"
              rot={-7}
              delay={0.3}
            />
          </div>
        </div>

        <h1 className="title-grow relative z-10 mx-auto whitespace-pre-line text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          {hero.heading}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          <span className="whitespace-pre-line">{hero.subheading}</span>
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <RegisterButton size="lg">{hero.primaryCta}</RegisterButton>
          <a
            href="#about"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-8 py-3.5 text-lg font-semibold text-fg transition-colors hover:border-swift-orange hover:text-swift-orange"
          >
            {hero.secondaryCta}
          </a>
        </div>

        {hero.facts.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted">
            {hero.facts.map((fact) => (
              <span key={fact.label} className="inline-flex items-center gap-2">
                <span aria-hidden>{fact.icon}</span>
                {fact.label}
              </span>
            ))}
          </div>
        )}

        <p className="sr-only">{site.tagline}</p>
      </div>
    </section>
  )
}

/**
 * A device emoji floating inside a frosted "liquid glass" circle —
 * translucent fill, blurred backdrop, bright top highlight + soft drop
 * shadow. Drops in with the memoji, then gently bobs.
 */
type GlassDeviceProps = {
  emoji: string
  sizeClass: string // Tailwind h/w/text classes — lets each circle vary in size
  className?: string // absolute-placement utilities positioning it over the memojis
  rot?: number // resting tilt in deg
  delay?: number // drop-in delay in s
}

function GlassDevice({ emoji, sizeClass, className = '', rot = 0, delay = 0 }: GlassDeviceProps) {
  return (
    // Outer span = placement (absolute, over the memojis); middle span = drop-in
    // + tilt; inner span = bob + glass surface. Separate elements so the
    // transforms don't clobber one another. z-30 keeps chips above the memojis.
    <span aria-hidden className={`z-30 block ${className}`}>
      <span
        className="glass-device block"
        style={
          { animationDelay: `${delay}s`, '--memoji-rot': `${rot}deg` } as CSSProperties
        }
      >
        <span
          className={`glass-device-inner flex items-center justify-center rounded-full border border-white/20 backdrop-blur-xl ${sizeClass}`}
          style={{
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -10px 22px rgba(255,255,255,0.06), 0 14px 30px rgba(0,0,0,0.45)',
          }}
        >
          <span className="select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
            {emoji}
          </span>
        </span>
      </span>
    </span>
  )
}
