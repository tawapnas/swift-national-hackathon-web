interface ImageAutoSliderProps {
  /** Image URLs to scroll. For a seamless loop, 4+ images work best. */
  images: string[]
  className?: string
}

/**
 * Infinite horizontal marquee of images. The list is duplicated and the track
 * is animated from 0 to -50%, so it loops seamlessly. Respects
 * prefers-reduced-motion and pauses on hover.
 */
export function ImageAutoSlider({ images, className = '' }: ImageAutoSliderProps) {
  // Duplicate images for the seamless loop.
  const duplicatedImages = [...images, ...images]

  return (
    <>
      <style>{`
        @keyframes image-slider-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .image-slider-track {
          animation: image-slider-scroll 45s linear infinite;
        }
        .image-slider-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .image-slider-track { animation: none; }
        }

        .image-slider-mask {
          mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        .image-slider-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .image-slider-item:hover {
          transform: scale(1.04);
          filter: brightness(1.08);
        }
      `}</style>

      <div className={`relative w-full overflow-hidden ${className}`}>
        <div className="image-slider-mask w-full">
          <div className="image-slider-track flex w-max gap-5 md:gap-6">
            {duplicatedImages.map((image, index) => (
              <div
                key={index}
                className="image-slider-item h-44 w-44 flex-shrink-0 overflow-hidden rounded-2xl border border-line shadow-2xl md:h-60 md:w-60 lg:h-72 lg:w-72"
              >
                <img
                  src={image}
                  alt={`ภาพกิจกรรม ${(index % images.length) + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
