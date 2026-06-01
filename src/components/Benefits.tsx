import { benefits } from '../data/content'
import Section from './Section'

export default function Benefits() {
  return (
    <Section id="benefits" heading={benefits.heading}>
      {/* Icon rows, divider-separated (no cards) */}
      <div className="divide-y divide-line border-y border-line">
        {benefits.items.map((item) => (
          <div key={item.title} className="flex gap-5 py-7 md:gap-8">
            <span className="text-3xl leading-none">{item.icon}</span>
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
