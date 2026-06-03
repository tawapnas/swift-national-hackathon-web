import { timeline } from '../data/content'
import Section from './Section'

export default function Timeline() {
  return (
    <Section id="timeline" heading={timeline.heading} icon="/sf/calendar.svg">
      <ol className="relative ml-2 border-l border-line">
        {timeline.milestones.map((m) => (
          <li key={m.date} className="relative mb-9 pl-8 last:mb-0">
            <span
              className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                m.current
                  ? 'border-swift-orange bg-swift-orange'
                  : 'border-swift-orange bg-ink'
              }`}
            />
            <p className="text-sm font-semibold text-swift-orange">{m.date}</p>
            <p className="mt-1 text-lg leading-snug text-fg">{m.title}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
