import { benefits } from '../data/content'
import Section from './Section'

export default function Benefits() {
  return (
    <Section id="benefits" eyebrow={benefits.eyebrow} heading={benefits.heading}>
      <div className="grid gap-5 sm:grid-cols-2">
        {benefits.items.map((item) => (
          <div
            key={item.title}
            className="flex gap-5 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-swift-orange/50"
          >
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-swift-orange/12 text-2xl">
              {item.icon}
            </div>
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
