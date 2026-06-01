import { themes } from '../data/content'
import Section from './Section'

export default function Themes() {
  return (
    <Section id="themes" eyebrow={themes.eyebrow} heading={themes.heading} lead={themes.lead}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {themes.items.map((theme) => (
          <div
            key={theme.en}
            className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-swift-orange/60"
          >
            <div className="mb-4 text-3xl">{theme.icon}</div>
            <h3 className="text-lg font-bold leading-snug">{theme.th}</h3>
            <p className="mt-1 text-sm font-medium text-swift-orange">{theme.en}</p>
            <p className="mt-3 leading-relaxed text-muted">{theme.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
