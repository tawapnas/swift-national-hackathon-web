import { invitation } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export default function InvitationQuote() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="reveal relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 50%, var(--color-swift-orange) 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-36">
        <span
          aria-hidden
          className="block text-6xl leading-none text-swift-orange/40 md:text-7xl"
        >
          &ldquo;
        </span>
        <blockquote className="mt-2 whitespace-pre-line text-2xl font-light leading-snug tracking-tight text-fg sm:text-3xl md:text-4xl">
          {invitation.quote}
        </blockquote>
        <cite className="mt-8 block text-sm font-medium not-italic text-muted">
          — {invitation.attribution}
        </cite>
      </div>
    </section>
  )
}
