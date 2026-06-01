import { cta } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import RegisterButton from './RegisterButton'

export default function CTABanner() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="reveal border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-8 py-16 text-center md:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25 blur-3xl"
            style={{
              background:
                'radial-gradient(70% 90% at 50% 0%, var(--color-swift-orange) 0%, transparent 65%)',
            }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight md:text-4xl">
              {cta.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
              {cta.body}
            </p>
            <div className="mt-8">
              <RegisterButton size="lg">{cta.button}</RegisterButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
