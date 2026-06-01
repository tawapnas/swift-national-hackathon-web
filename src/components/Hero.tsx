import type { CSSProperties } from 'react'
import { hero, site } from '../data/content'
import RegisterButton from './RegisterButton'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-line pt-24 pb-20 md:pt-28 md:pb-24"
    >
      {/* Orange radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, var(--color-swift-orange) 0%, var(--color-swift-gold) 35%, transparent 70%)',
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
        {/* Memoji — big, overlapping, sitting fully above the title.
            `isolate` scopes their z-stacking (they overlap each other). */}
        <div className="relative isolate mb-6 flex items-end justify-center sm:mb-8">
          {hero.memojis.map((src, i) => (
            <span
              key={src}
              className={`relative ${i === 1 ? 'z-20' : 'z-10'} ${
                i > 0 ? '-ml-10 sm:-ml-16 md:-ml-20' : ''
              }`}
              style={{ filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.5))' }}
            >
              <img
                src={src}
                alt=""
                aria-hidden
                draggable={false}
                className={`memoji block select-none object-contain ${
                  i === 1
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

        <h1 className="relative z-10 mx-auto whitespace-pre-line bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl">
          {hero.heading}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          {hero.subheading}
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
