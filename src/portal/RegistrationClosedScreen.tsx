import { portal } from '../data/content'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'

/** Shown to a signed-in visitor with no team while registration is closed.
 *  The CTA signs out so someone on the wrong Google account can switch. */
export default function RegistrationClosedScreen({ onSignOut }: { onSignOut: () => void }) {
  const s = portal.registrationClosed

  return (
    <PortalShell onSignOut={onSignOut}>
      <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-swift-orange/15">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-swift-orange"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold md:text-4xl">{s.heading}</h1>
        <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted">{s.body}</p>
        <div className="mt-8">
          <PortalButton variant="outline" onClick={onSignOut}>
            {s.signInOther}
          </PortalButton>
        </div>
      </div>
    </PortalShell>
  )
}
