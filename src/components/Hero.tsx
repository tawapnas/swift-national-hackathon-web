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
        {/* Memoji — big, overlapping, sitting fully above the title,
            flanked by device emojis inside liquid-glass circles.
            `isolate` scopes their z-stacking (they overlap each other). */}
        <div className="relative isolate mb-6 flex items-center justify-center gap-2 sm:mb-8 sm:gap-4 md:gap-6">
          <GlassDevice emoji="💻" delay={0.1} />

          <div className="flex items-end justify-center">
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
          </div>

          <GlassDevice emoji="📱" delay={0.25} />
        </div>

        <h1 className="title-grow relative z-10 mx-auto whitespace-pre-line bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl">
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
function GlassDevice({ emoji, delay }: { emoji: string; delay: number }) {
  return (
    <span
      aria-hidden
      className="glass-device relative z-10 shrink-0"
      style={{ animationDelay: `${delay}s` }}
    >
      <span
        className="glass-device-inner flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-3xl backdrop-blur-xl sm:h-20 sm:w-20 sm:text-4xl md:h-24 md:w-24 md:text-5xl"
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
  )
}
