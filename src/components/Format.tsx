import { format } from '../data/content'
import Section from './Section'

export default function Format() {
  return (
    <Section id="format" heading={format.heading} lead={format.lead} icon="/sf/swift.svg">
      <div className="max-w-3xl space-y-12">
        {format.rounds.map((round, i) => (
          <div key={round.tag} className={i > 0 ? 'border-t border-line pt-12' : ''}>
            <p className="text-base font-semibold tracking-wide text-swift-orange uppercase">
              {round.tag}
            </p>
            <h3 className="mt-2 text-2xl font-bold">{round.title}</h3>
            <p className="mt-1 text-base text-muted">{round.mode}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-lg leading-relaxed text-muted marker:text-swift-orange">
              {round.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
