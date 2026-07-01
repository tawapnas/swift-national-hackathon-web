import { portal } from '../data/content'
import PortalSection from './PortalSection'

/** Section 2 — hackathon detail & rules. Copy is placeholder until finalized. */
export default function HackathonDetailSection() {
  const d = portal.detail

  return (
    <PortalSection heading={d.heading}>
      <div className="space-y-3 text-lg leading-relaxed text-muted">
        {d.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h3 className="mt-8 mb-2 text-sm font-semibold uppercase tracking-wide text-swift-orange">
        {d.rulesHeading}
      </h3>
      <ul className="list-disc space-y-2 pl-5 text-lg leading-relaxed text-muted marker:text-swift-orange">
        {d.rules.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </PortalSection>
  )
}
