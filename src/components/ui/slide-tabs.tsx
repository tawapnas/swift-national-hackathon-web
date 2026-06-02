import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export interface SlideTab {
  label: string
  href?: string
}

interface Position {
  left: number
  width: number
  opacity: number
}

// Standalone default so the component renders on its own (matches the original
// demo); the navbar passes real section tabs via the `tabs` prop.
const DEFAULT_TABS: SlideTab[] = [
  { label: 'Home' },
  { label: 'Pricing' },
  { label: 'Features' },
  { label: 'Docs' },
  { label: 'Blog' },
]

interface SlideTabsProps {
  tabs?: SlideTab[]
  /** Index of the tab the cursor parks on at rest. */
  defaultSelected?: number
  onSelect?: (index: number, tab: SlideTab) => void
}

export const SlideTabs = ({
  tabs = DEFAULT_TABS,
  defaultSelected = 0,
  onSelect,
}: SlideTabsProps) => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  })
  const [selected, setSelected] = useState(defaultSelected)
  const tabsRef = useRef<Array<HTMLLIElement | null>>([])

  const parkOnSelected = () => {
    const el = tabsRef.current[selected]
    if (!el) return
    setPosition({
      left: el.offsetLeft,
      width: el.getBoundingClientRect().width,
      opacity: 1,
    })
  }

  // Park the cursor under the selected tab on mount and whenever selection or
  // the tab set changes.
  useEffect(parkOnSelected, [selected, tabs])

  return (
    <ul
      onMouseLeave={parkOnSelected}
      className="relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1 dark:border-white dark:bg-neutral-800"
    >
      {tabs.map((tab, i) => (
        <Tab
          key={tab.label}
          ref={(el) => {
            tabsRef.current[i] = el
          }}
          href={tab.href}
          setPosition={setPosition}
          onClick={() => {
            setSelected(i)
            onSelect?.(i, tab)
          }}
        >
          {tab.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  )
}

interface TabProps {
  children: React.ReactNode
  href?: string
  setPosition: React.Dispatch<React.SetStateAction<Position>>
  onClick?: () => void
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, href, setPosition, onClick }, ref) => {
    return (
      <li
        ref={ref}
        // Measure the hovered element directly (e.currentTarget) so the cursor
        // slides regardless of how the forwarded ref is wired — the original
        // read `ref.current`, which is undefined for a callback ref.
        onMouseEnter={(e) => {
          const el = e.currentTarget
          setPosition({
            left: el.offsetLeft,
            width: el.getBoundingClientRect().width,
            opacity: 1,
          })
        }}
        // mix-blend-difference must live on this <li> (the element that forms
        // the z-10 stacking context) so the label inverts against the cursor
        // beneath it; on an inner child it would be isolated and stay white.
        className="relative z-10 block text-white mix-blend-difference"
      >
        <a
          href={href ?? '#'}
          onClick={onClick}
          className="block cursor-pointer px-3 py-1.5 text-xs uppercase md:px-5 md:py-3 md:text-base"
        >
          {children}
        </a>
      </li>
    )
  },
)
Tab.displayName = 'Tab'

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{ ...position }}
      className="absolute z-0 h-7 rounded-full bg-black dark:bg-white md:h-12"
    />
  )
}
