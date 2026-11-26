import { sponsors } from '../data/content'
import Section from './Section'

// Logo box per tier: the first tier (higher sponsorship package) is larger.
// Each logo fills the tier's height but is also capped in width (letterboxed
// by object-contain), so lockups with very different aspect ratios — a tall
// mark vs. a wide wordmark — carry similar visual weight on one row.
const TIER_CLASSES = [
  'h-14 max-w-[15rem] md:h-20 md:max-w-[19rem]',
  'h-8 max-w-[8rem] md:h-10 md:max-w-[10rem]',
]

export default function Sponsors() {
  return (
    <Section heading={sponsors.heading}>
      <div className="mt-10 space-y-14">
        {sponsors.tiers.map((tier, i) => (
          <div key={tier.title}>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-muted">
              {tier.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-10 md:gap-x-16">
              {tier.logos.map((logo) => (
                <img
                  key={logo.src}
                  src={logo.src}
                  alt={logo.name}
                  className={`${TIER_CLASSES[i] ?? TIER_CLASSES[TIER_CLASSES.length - 1]} w-auto rounded-sm object-contain opacity-90`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
