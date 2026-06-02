import { useEffect, useState } from 'react'
import { nav, site } from '../data/content'
import RegisterButton from './RegisterButton'
import { SlideTabs } from './ui/slide-tabs'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // Close the mobile menu when the viewport grows to the desktop breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const tabs = nav.map((item) => ({ label: item.label, href: `#${item.id}` }))

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.svg" alt={site.org} className="h-5 w-auto md:h-6" />
          <span className="hidden border-l border-line pl-3 text-xs text-muted lg:inline">
            {site.shortTitle}
          </span>
        </a>

        {/* Center slide-tabs (desktop) — absolutely centered so the logo and
            CTA stay pinned to the edges. */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <SlideTabs tabs={tabs} />
        </div>

        {/* Register CTA (desktop) */}
        <div className="hidden md:block">
          <RegisterButton size="sm">สมัครเข้าร่วม</RegisterButton>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-fg md:hidden"
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
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-line bg-ink/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden ${
          open ? 'max-h-96' : 'max-h-0 border-transparent'
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-base text-muted transition-colors hover:bg-surface hover:text-fg"
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
