import { useReveal } from '../hooks/useReveal'

interface SectionProps {
  id?: string
  eyebrow?: string
  heading?: string
  lead?: string
  divider?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Shared section wrapper enforcing the Apple-SSC-like rhythm:
 * max-width container, generous vertical padding, eyebrow + heading with
 * an orange underline accent, and an optional bottom divider line.
 */
export default function Section({
  id,
  eyebrow,
  heading,
  lead,
  divider = true,
  children,
  className = '',
}: SectionProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal ${divider ? 'border-b border-line' : ''} ${className}`}
    >
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        {(eyebrow || heading) && (
          <header className="mb-12 max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-sm font-semibold tracking-wide text-swift-orange uppercase">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                {heading}
                <span className="mt-4 block h-1 w-14 rounded-full bg-swift-orange" />
              </h2>
            )}
            {lead && (
              <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
