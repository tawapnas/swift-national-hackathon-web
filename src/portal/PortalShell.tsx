import { Link } from 'react-router-dom'
import { portal, site } from '../data/content'

interface PortalShellProps {
  children: React.ReactNode
  // Sign-out handler. When absent, only the home link shows.
  onSignOut?: () => void
}

/**
 * Page chrome for all portal screens: the same floating liquid-glass pill bar
 * as the marketing page (brand left, account action right), over the shared
 * dark background with the royal-blue → navy cover glow.
 */
export default function PortalShell({ children, onSignOut }: PortalShellProps) {
  return (
    <div className="relative min-h-screen bg-ink text-fg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-60"
        style={{
          background:
            'radial-gradient(125% 95% at 50% 12%, var(--color-cover-blue) 0%, var(--color-cover-navy) 42%, transparent 78%)',
        }}
      />
      {/* Transform-free like Navbar — Chrome disables backdrop-filter under a
          transformed ancestor. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="nav-glass pointer-events-auto mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full py-2.5 pl-5 pr-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt={site.org} className="h-5 w-auto md:h-6" />
          </Link>
          {/* h-9 matches the main navbar's sm RegisterButton height so both
              pills render at the same overall height. */}
          <div className="flex h-9 items-center gap-5 text-sm">
            <Link to="/" className="text-white/75 transition-colors hover:text-white">
              {portal.shell.home}
            </Link>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="cursor-pointer text-white/75 transition-colors hover:text-white"
              >
                {portal.shell.signOut}
              </button>
            )}
          </div>
        </nav>
      </header>
      <main className="relative mx-auto max-w-3xl px-6 pt-28 pb-12 md:pt-32 md:pb-16">
        {children}
      </main>
    </div>
  )
}
