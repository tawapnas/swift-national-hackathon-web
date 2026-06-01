import { format } from '../data/content'
import Section from './Section'

export default function Format() {
  return (
    <Section id="format" heading={format.heading} lead={format.lead}>
      {/* Rounds — stacked rows with a left meta column, divider-separated (no cards) */}
      <div className="divide-y divide-line border-y border-line">
        {format.rounds.map((round) => (
          <div
            key={round.tag}
            className="grid gap-6 py-10 md:grid-cols-[260px_1fr] md:gap-12"
          >
            <div>
              <span className="text-xs font-semibold tracking-wide text-swift-orange uppercase">
                {round.tag}
              </span>
              <h3 className="mt-3 text-2xl font-bold leading-tight">{round.title}</h3>
              <p className="mt-2 text-sm font-medium text-swift-gold">{round.mode}</p>
            </div>
            <ul className="space-y-3.5">
              {round.points.map((point) => (
                <li key={point} className="flex gap-3 text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-swift-orange"
                  />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Eligibility — plain checklist, no enclosing box */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold">{format.eligibility.title}</h3>
        <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {format.eligibility.items.map((item) => (
            <li key={item} className="flex items-center gap-3 text-muted">
              <span aria-hidden className="font-semibold text-swift-orange">
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
