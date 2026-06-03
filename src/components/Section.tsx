import { useReveal } from '../hooks/useReveal'
import GlassIcon from './ui/GlassIcon'

// Temporarily hide the liquid-glass SF-symbol badges beside section titles.
// Flip to `true` to bring them back — all the `icon` wiring stays in place.
const SHOW_SECTION_ICONS = false

interface SectionProps {
  id?: string
  heading?: string
  icon?: string // optional SF Symbol asset shown in a glass circle after the heading
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
  icon,
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
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">{heading}</h2>
              {SHOW_SECTION_ICONS && icon && (
                <GlassIcon asset={icon} className="flex-none" />
              )}
            </div>
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
