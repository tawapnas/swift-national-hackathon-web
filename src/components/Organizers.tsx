import { organizers } from '../data/content'
import Section from './Section'

export default function Organizers() {
  return (
    <Section heading={organizers.heading}>
      <div className="mb-12 flex flex-wrap items-center gap-x-12 gap-y-8">
        {organizers.logos.map((logo) => (
          <img
            key={logo.src}
            src={logo.src}
            alt={logo.name}
            className={`${logo.className} opacity-90`}
          />
        ))}
      </div>
      <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
        <p>{organizers.body}</p>
        <p>{organizers.judges}</p>
      </div>
    </Section>
  )
}
