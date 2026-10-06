import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { hero, lessons, nav, site } from '../data/content'
import { LESSONS_IN_NAV } from '../lessons/lessons'
import RegisterButton from './RegisterButton'

const LESSONS_PATH = '/explore'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  // The bar also tops the daily-lessons page. There the section links
  // lead back to the home page (App scrolls to the hash when it mounts).
  const onHome = pathname === '/'
  const onLessons = pathname === LESSONS_PATH

  // Close the mobile menu when the viewport grows to the desktop breakpoint
  // (lg — the inline links no longer fit on one line below it).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4">
      {/* Pure-CSS liquid-glass pill. Critically, NO ancestor uses `transform`:
          Chrome disables backdrop-filter under a transformed ancestor, which is
          why liquid-glass-react's transform-centered pill never blurred there. */}
      <nav className="nav-glass pointer-events-auto mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full py-2.5 pl-5 pr-3">
        {onHome ? (
          <a href="#top" className="flex items-center gap-3">
            <img src="/logo.svg" alt={site.org} className="h-5 w-auto md:h-6" />
          </a>
        ) : (
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt={site.org} className="h-5 w-auto md:h-6" />
          </Link>
        )}

        {/* Desktop links */}
        <div className="hidden items-center gap-7 whitespace-nowrap lg:flex">
          {nav.map((item) =>
            onHome ? (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-white/75 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                className="text-sm text-white/75 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ),
          )}
          {LESSONS_IN_NAV && (
            <Link
              to={LESSONS_PATH}
              aria-current={onLessons ? 'page' : undefined}
              className={`text-sm transition-colors hover:text-white ${
                onLessons ? 'font-semibold text-white' : 'text-white/75'
              }`}
            >
              {lessons.navLabel}
            </Link>
          )}
          <RegisterButton size="sm">{hero.primaryCta}</RegisterButton>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
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

      {/* Mobile menu — full-width frosted panel, also transform-free so its blur
          composites in Chrome too. */}
      <div
        className={`nav-glass pointer-events-auto mx-4 mt-2 overflow-hidden rounded-3xl transition-all duration-300 lg:hidden ${
          open ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 p-4">
          {nav.map((item) =>
            onHome ? (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ),
          )}
          {LESSONS_IN_NAV && (
            <Link
              to={LESSONS_PATH}
              aria-current={onLessons ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-3 text-base transition-colors hover:bg-white/10 hover:text-white ${
                onLessons ? 'font-semibold text-white' : 'text-white/80'
              }`}
            >
              {lessons.navLabel}
            </Link>
          )}
          <RegisterButton size="md" className="mt-3 w-full">
            {hero.primaryCta}
          </RegisterButton>
        </div>
      </div>
    </header>
  )
}
