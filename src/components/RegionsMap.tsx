import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { regions } from '../data/content'
import { type RegionId } from '../data/provinceRegions'
import Section from './Section'

// Thailand geometry dissolved into the 5 regions (internal province borders
// merged away — see scratchpad generate-regions.mjs / provinceRegions.ts).
// Each feature carries properties.region; only region + coastline borders remain.
const GEO_URL = '/thailand-regions.json'

const { items, unit } = regions
const total = items.reduce((sum, r) => sum + r.teams, 0)
const max = Math.max(...items.map((r) => r.teams))
const byId = Object.fromEntries(items.map((r) => [r.id, r])) as Record<
  RegionId,
  (typeof items)[number]
>
// Fixed legend layout: row 1 = central / east / isan, row 2 = north / south.
const legendOrder: RegionId[] = ['central', 'east', 'isan', 'north', 'south']
const ordered = legendOrder.map((id) => byId[id])

// Choropleth: registration count drives a color ramp from a muted blue-grey
// (fewest teams) to the cover's full royal-blue (most teams).
const SHADE_LO = [100, 116, 139] // muted blue-grey
const SHADE_HI = [44, 95, 201] // cover royal-blue (#2c5fc9)
const shade = (teams: number) => {
  const t = max === 0 ? 0 : teams / max
  const c = SHADE_LO.map((lo, i) => Math.round(lo + (SHADE_HI[i] - lo) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

export default function RegionsMap() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<RegionId | null>(null)
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)

  const moveTip = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (rect) setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const clear = () => {
    setHoveredId(null)
    setTip(null)
  }

  const active = hoveredId ? byId[hoveredId] : null

  return (
    <Section heading={regions.heading} lead={regions.lead}>
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
        {/* Map */}
        <div
          ref={wrapRef}
          className="relative mx-auto w-full max-w-sm"
          aria-label="แผนที่ประเทศไทยแสดงจำนวนทีมที่ลงทะเบียนตามภูมิภาค"
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [101, 13.2], scale: 2000 }}
            width={400}
            height={560}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const region = (geo.properties as { region: RegionId }).region
                  const teams = byId[region].teams
                  const isHovered = hoveredId === region
                  const dimmed = hoveredId !== null && !isHovered
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredId(region)}
                      onMouseMove={moveTip}
                      onMouseLeave={clear}
                      style={{
                        default: {
                          fill: isHovered ? 'var(--color-cover-blue)' : shade(teams),
                          fillOpacity: dimmed ? 0.45 : 1,
                          stroke: 'var(--color-ink)',
                          strokeWidth: 0.9,
                          outline: 'none',
                          transition: 'fill-opacity 0.2s ease, fill 0.2s ease',
                        },
                        hover: {
                          fill: 'var(--color-cover-blue)',
                          fillOpacity: 1,
                          stroke: 'var(--color-swift-blue-light)',
                          strokeWidth: 1.2,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: 'var(--color-cover-blue)',
                          fillOpacity: 1,
                          outline: 'none',
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Cursor-following tooltip */}
          <AnimatePresence>
            {active && tip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.14 }}
                style={{ left: tip.x, top: tip.y }}
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-xl border border-line bg-surface-2/95 px-3.5 py-2 shadow-lg backdrop-blur"
              >
                <p className="text-sm font-semibold text-fg">{active.name}</p>
                <p className="text-xs text-muted">
                  <span className="font-bold text-swift-blue-light">{active.teams}</span> {unit}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend / total */}
        <div>
          <div className="mb-3 flex items-baseline gap-3">
            <span className="text-5xl font-bold leading-none text-swift-blue-light md:text-6xl">
              {total}
            </span>
            <span className="text-lg text-muted">{regions.totalLabel}</span>
          </div>
          <p className="mb-8 text-base text-muted">{regions.reach}</p>

          <ul className="grid grid-cols-3 gap-1.5">
            {ordered.map((r) => {
              const isHovered = hoveredId === r.id
              return (
                <li key={r.id}>
                  <div
                    onMouseEnter={() => setHoveredId(r.id as RegionId)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex h-full flex-col gap-1.5 rounded-xl border px-4 py-3 transition-colors ${
                      isHovered ? 'border-swift-blue-light bg-surface-2' : 'border-line bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 flex-none rounded-[5px]"
                        style={{ backgroundColor: shade(r.teams) }}
                      />
                      <span className="text-fg">{r.name}</span>
                    </div>
                    <span className="font-semibold text-fg">
                      {r.teams}
                      <span className="ml-1 text-sm font-normal text-muted">{unit}</span>
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>

          <p className="mt-6 text-sm text-muted">{regions.updatedAt}</p>
        </div>
      </div>
    </Section>
  )
}
