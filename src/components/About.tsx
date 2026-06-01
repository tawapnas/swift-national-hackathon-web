import { about } from '../data/content'
import Section from './Section'

export default function About() {
  return (
    <Section id="about" heading={about.heading} lead={about.lead}>
      <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
        {about.points.map((point) => (
          <div key={point.title}>
            <span className="block h-0.5 w-10 rounded-full bg-swift-orange" />
            <div className="mt-5 flex h-9 items-center text-3xl leading-none">
              {point.icon.startsWith('/') ? (
                <img
                  src={point.icon}
                  alt=""
                  className="h-9 w-9 object-contain"
                />
              ) : (
                point.icon
              )}
            </div>
            <h3 className="mt-3 text-lg font-semibold">{point.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{point.body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
