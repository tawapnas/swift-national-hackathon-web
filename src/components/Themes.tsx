import { themes } from '../data/content'
import Section from './Section'

export default function Themes() {
  return (
    <Section id="themes" heading={themes.heading} lead={themes.lead}>
      {/* Editorial list — divider-separated rows, no cards */}
      <div className="border-t border-line">
        {themes.items.map((theme, i) => (
          <div
            key={theme.en}
            className="group grid items-baseline gap-x-6 gap-y-2 border-b border-line py-7 md:grid-cols-[3.5rem_1fr_minmax(0,22rem)] md:gap-x-10"
          >
            <span className="text-sm font-medium tabular-nums text-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-swift-orange">
                <span className="mr-2.5">{theme.icon}</span>
                {theme.th}
              </h3>
              <p className="mt-1 text-sm font-medium text-swift-orange">{theme.en}</p>
            </div>
            <p className="leading-relaxed text-muted">{theme.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
