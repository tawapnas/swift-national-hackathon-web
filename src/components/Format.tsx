import { format } from '../data/content'
import Section from './Section'

export default function Format() {
  return (
    <Section id="format" eyebrow={format.eyebrow} heading={format.heading} lead={format.lead}>
      <div className="grid gap-5 md:grid-cols-2">
        {format.rounds.map((round) => (
          <div
            key={round.tag}
            className="flex flex-col rounded-2xl border border-line bg-surface p-7"
          >
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-swift-orange/12 px-3 py-1 text-xs font-semibold tracking-wide text-swift-orange uppercase">
              {round.tag}
            </span>
            <h3 className="text-xl font-bold">{round.title}</h3>
            <p className="mt-1 text-sm font-medium text-swift-gold">{round.mode}</p>
            <ul className="mt-5 space-y-3">
              {round.points.map((point) => (
                <li key={point} className="flex gap-3 text-muted">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-swift-orange"
                  />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Eligibility */}
      <div className="mt-8 rounded-2xl border border-line bg-gradient-to-br from-surface to-surface-2 p-7">
        <h3 className="text-lg font-semibold">{format.eligibility.title}</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {format.eligibility.items.map((item) => (
            <li key={item} className="flex items-center gap-3 text-muted">
              <span aria-hidden className="text-swift-orange">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
