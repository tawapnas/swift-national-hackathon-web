import { Link } from 'react-router-dom'
import { portal } from '../data/content'

interface PortalShellProps {
  children: React.ReactNode
  // The signed-in email to show in the top bar (Phase 2). Optional in preview.
  email?: string
  // Sign-out handler (Phase 2). When absent, the top bar shows a back-to-site link.
  onSignOut?: () => void
}

/**
 * Page chrome for all portal screens: a sticky top bar with the brand on the
 * left and account actions on the right, over the shared dark background.
 */
export default function PortalShell({ children, email, onSignOut }: PortalShellProps) {
  return (
    <div className="min-h-screen bg-ink text-fg">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/swift-logo.png" alt="" className="h-6 w-6" />
            <span>{portal.shell.brand}</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {email && <span className="hidden text-muted sm:inline">{email}</span>}
            {onSignOut ? (
              <button
                type="button"
                onClick={onSignOut}
                className="cursor-pointer text-muted transition-colors hover:text-swift-orange"
              >
                {portal.shell.signOut}
              </button>
            ) : (
              <Link
                to="/"
                className="text-muted transition-colors hover:text-swift-orange"
              >
                {portal.shell.backToSite}
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">{children}</main>
    </div>
  )
}
