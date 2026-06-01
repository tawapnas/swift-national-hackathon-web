import { criteria } from '../data/content'
import Section from './Section'

export default function Criteria() {
  return (
    <Section eyebrow={criteria.eyebrow} heading={criteria.heading}>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Round 1 — with percentage bars */}
        <div className="rounded-2xl border border-line bg-surface p-7">
          <h3 className="mb-6 text-lg font-bold">{criteria.round1.title}</h3>
          <div className="space-y-5">
            {criteria.round1.items.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <span className="text-sm leading-snug text-muted">{item.label}</span>
                  <span className="text-sm font-bold text-swift-orange">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-swift-gold to-swift-orange"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Round 2 — qualitative only */}
        <div className="flex flex-col rounded-2xl border border-line bg-gradient-to-br from-surface to-surface-2 p-7">
          <h3 className="mb-4 text-lg font-bold">{criteria.round2.title}</h3>
          <div className="flex flex-wrap gap-2">
            {criteria.round2.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-ink/40 px-3 py-1.5 text-sm text-fg"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-5 leading-relaxed text-muted">{criteria.round2.note}</p>
        </div>
      </div>
    </Section>
  )
}
