import { eligibility } from '../data/content'
import Section from './Section'

export default function Eligibility() {
  return (
    <Section id="eligibility" heading={eligibility.heading} icon="/sf/graduationcap.fill.svg">
      <div className="max-w-3xl text-lg leading-relaxed text-muted">
        <p>{eligibility.body}</p>
      </div>
    </Section>
  )
}
