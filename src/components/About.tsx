import { about } from '../data/content'
import Section from './Section'

export default function About() {
  return (
    <Section id="about" eyebrow={about.eyebrow} heading={about.heading} lead={about.lead}>
      <div className="grid gap-5 sm:grid-cols-2">
        {about.points.map((point) => (
          <div
            key={point.title}
            className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-swift-orange/50"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-2xl">
              {point.icon}
            </div>
            <h3 className="text-lg font-semibold">{point.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{point.body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
