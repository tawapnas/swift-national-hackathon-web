import { useEffect, useRef, useState } from 'react'
import LiquidGlass from 'liquid-glass-react'
import { nav, site } from '../data/content'
import RegisterButton from './RegisterButton'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  // The glass pill tracks the pointer for its elastic refraction; scope the
  // mouse-listening to the bar itself so the rest of the page is unaffected.
  const pillRef = useRef<HTMLDivElement>(null)

  // Close the mobile menu when the viewport grows to the desktop breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-[88px] justify-center">
      {/* Floating liquid-glass pill. position:absolute lets the component
          self-center (top/left:50% + translate(-50%,-50%)) within this fixed
          header band, sitting just below the top edge. */}
      <div ref={pillRef} className="pointer-events-auto">
        <LiquidGlass
          className="nav-liquid-glass"
          cornerRadius={999}
          padding="10px 18px"
          displacementScale={64}
          blurAmount={0.5}
          saturation={160}
          aberrationIntensity={2}
          elasticity={0.12}
          mouseContainer={pillRef}
          style={{ position: 'fixed', top: '40px', left: '50%' }}
        >
          <div className="flex w-[min(92vw,72rem)] items-center justify-between gap-6 font-sans">
            <a href="#top" className="flex items-center gap-3">
              <img src="/logo.svg" alt={site.org} className="h-5 w-auto md:h-6" />
            </a>

            {/* Desktop links */}
            <div className="hidden items-center gap-7 md:flex">
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-white/75 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <RegisterButton size="sm">สมัครเข้าร่วม</RegisterButton>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white md:hidden"
            >
              <div className="relative h-4 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                    open ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                    open ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </div>
            </button>
          </div>
        </LiquidGlass>
      </div>

      {/* Mobile menu — a separate frosted panel below the pill, so the
          centered glass bar keeps a constant height and never grows off-screen. */}
      <div
        className={`pointer-events-auto absolute left-1/2 top-[76px] w-[92vw] -translate-x-1/2 overflow-hidden rounded-3xl border border-white/15 bg-ink/70 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 md:hidden ${
          open
            ? 'max-h-96 opacity-100'
            : 'pointer-events-none max-h-0 border-transparent opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 p-4">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <RegisterButton size="md" className="mt-3 w-full">
            สมัครเข้าร่วม
          </RegisterButton>
        </div>
      </div>
    </header>
  )
}
