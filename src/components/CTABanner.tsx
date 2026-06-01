import { cta } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import RegisterButton from './RegisterButton'

export default function CTABanner() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="reveal relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-3xl opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, var(--color-swift-orange) 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <span className="mx-auto mb-7 block h-0.5 w-12 rounded-full bg-swift-orange" />
        <h2 className="text-3xl font-bold leading-tight md:text-4xl">{cta.heading}</h2>
        <p className="mx-auto mt-5 max-w-xl whitespace-pre-line text-lg leading-relaxed text-muted">{cta.body}</p>
        <div className="mt-9">
          <RegisterButton size="lg">{cta.button}</RegisterButton>
        </div>
      </div>
    </section>
  )
}
