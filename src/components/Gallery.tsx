import { ImageAutoSlider } from '@/components/ui/image-auto-slider'
import { gallery } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export default function Gallery() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="reveal border-b border-line py-20 md:py-28">
      <div className="mx-auto mb-12 max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-bold leading-tight md:text-4xl">{gallery.heading}</h2>
      </div>

      {/* Full-bleed marquee */}
      <ImageAutoSlider images={gallery.images} />
    </section>
  )
}
