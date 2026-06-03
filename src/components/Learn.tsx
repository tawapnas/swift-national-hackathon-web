import { learn } from '../data/content'
import Section from './Section'

const { video, tool } = learn
const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?list=${video.playlistId}&rel=0`

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-semibold transition-all duration-200 active:scale-[0.98]'

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

        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:gap-7 md:p-8">
          <img
            src={tool.icon}
            alt={tool.name}
            className="h-20 w-20 shrink-0 rounded-2xl shadow-lg"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold">{tool.name}</h3>
            <p className="mt-1.5 leading-relaxed text-muted">{tool.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {tool.downloads.map((dl, i) => (
                <a
                  key={dl.href}
                  href={dl.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnBase} ${
                    i === 0
                      ? 'bg-swift-orange text-white shadow-lg shadow-swift-orange/25 hover:brightness-110 hover:shadow-swift-orange/40'
                      : 'border border-line text-fg hover:border-swift-orange hover:text-swift-orange'
                  }`}
                >
                  {dl.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
