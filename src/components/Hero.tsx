import { hero, site } from '../data/content'
import RegisterButton from './RegisterButton'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-line pt-32 pb-24 md:pt-44 md:pb-32"
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
        <h1 className="mx-auto whitespace-pre-line bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl">
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
