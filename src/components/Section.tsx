import { useReveal } from '../hooks/useReveal'

interface SectionProps {
  id?: string
  heading?: string
  lead?: string
  divider?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Shared section wrapper enforcing the Apple-SSC-like rhythm:
 * max-width container, generous vertical padding, a heading + optional lead,
 * and an optional bottom divider line.
 */
export default function Section({
  id,
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
        {heading && (
          <header className={`max-w-3xl ${lead ? 'mb-12' : 'mb-6'}`}>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">{heading}</h2>
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
