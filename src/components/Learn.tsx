import { learn } from '../data/content'
import Section from './Section'

const { video } = learn
const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?list=${video.playlistId}&rel=0`

export default function Learn() {
  return (
    <Section id="learn" heading={learn.heading} lead={learn.lead}>
      <div className="max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-bold">{video.title}</h3>
        <p className="mt-2 leading-relaxed text-muted">{video.description}</p>
      </div>
    </Section>
  )
}
