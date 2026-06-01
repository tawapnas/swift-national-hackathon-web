import { useEffect, useState } from 'react'
import { nav, site } from '../data/content'
import RegisterButton from './RegisterButton'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-line bg-ink/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2.5">
          <img src="/swift-mark.svg" alt="" className="h-8 w-8" />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight">{site.orgShort}</span>
            <span className="text-xs text-muted">{site.shortTitle}</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm text-muted transition-colors hover:text-fg"
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
