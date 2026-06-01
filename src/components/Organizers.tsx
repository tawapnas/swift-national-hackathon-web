import { organizers } from '../data/content'
import Section from './Section'

export default function Organizers() {
  return (
    <Section eyebrow={organizers.eyebrow} heading={organizers.heading}>
      <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
        <p>{organizers.body}</p>
        <p>{organizers.judges}</p>
      </div>
    </Section>
  )
}
