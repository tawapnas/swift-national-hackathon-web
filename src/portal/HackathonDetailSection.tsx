import { portal } from '../data/content'
import PortalSection from './PortalSection'

// Renders **...** spans in a copy string as bold. Odd-indexed parts of the
// split are the text between a `**` pair.
const withBold = (text: string) =>
  text.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-fg">
        {part}
      </strong>
    ) : (
      part
    ),
  )

/** Section 2 — project brief + submission requirements (SSC-style). */
export default function HackathonDetailSection() {
  const d = portal.detail

  return (
    <PortalSection heading={d.heading}>
      <p className="text-lg leading-relaxed text-muted">{d.body}</p>

      <p className="mt-8 mb-3 text-lg font-semibold">{d.rulesHeading}</p>
      <ul className="list-disc space-y-2 pl-5 text-lg leading-relaxed text-muted marker:text-swift-orange">
        {d.rules.map((r, i) => (
          <li key={i}>{withBold(r)}</li>
        ))}
      </ul>
    </PortalSection>
  )
}
