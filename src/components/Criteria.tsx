import { criteria } from '../data/content'
import Section from './Section'

export default function Criteria() {
  return (
    <Section heading={criteria.heading}>
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        {/* Round 1 — percentage bars, no enclosing box */}
        <div>
          <h3 className="mb-7 text-lg font-bold">{criteria.round1.title}</h3>
          <div className="space-y-5">
            {criteria.round1.items.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <span className="text-sm leading-snug text-muted">{item.label}</span>
                  <span className="text-sm font-bold text-swift-orange">{item.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-swift-gold to-swift-orange"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Round 2 — qualitative, separated by a hairline rule */}
        <div className="border-t border-line pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-16">
          <h3 className="mb-5 text-lg font-bold">{criteria.round2.title}</h3>
          <ul className="space-y-3">
            {criteria.round2.items.map((item) => (
              <li key={item} className="flex items-center gap-3 text-fg">
                <span aria-hidden className="h-1.5 w-1.5 flex-none rounded-full bg-swift-orange" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 leading-relaxed text-muted">{criteria.round2.note}</p>
        </div>
      </div>
    </Section>
  )
}
