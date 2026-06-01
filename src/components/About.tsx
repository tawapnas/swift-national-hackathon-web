import { about } from '../data/content'
import Section from './Section'

const PLAYGROUNDS_URL = 'https://www.apple.com/th/swift/playgrounds/'
const PLAYGROUNDS_TERM = 'Swift Playgrounds'

// Linkify the "Swift Playgrounds" phrase within a paragraph.
function renderParagraph(text: string) {
  const idx = text.indexOf(PLAYGROUNDS_TERM)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <a
        href={PLAYGROUNDS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-swift-orange transition-colors hover:text-swift-gold"
      >
        {PLAYGROUNDS_TERM}
      </a>
      {text.slice(idx + PLAYGROUNDS_TERM.length)}
    </>
  )
}

export default function About() {
  return (
    <Section id="about" heading={about.heading}>
      <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
        {about.body.map((paragraph) => (
          <p key={paragraph}>{renderParagraph(paragraph)}</p>
        ))}
      </div>
    </Section>
  )
}
