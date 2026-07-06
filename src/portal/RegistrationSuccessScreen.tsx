import { portal } from '../data/content'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'

/** Full-screen confirmation after a successful registration; the CTA takes
 *  the team into the portal. */
export default function RegistrationSuccessScreen({
  onContinue,
  onSignOut,
}: {
  onContinue: () => void
  onSignOut: () => void
}) {
  const s = portal.registrationSuccess

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
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold md:text-4xl">{s.heading}</h1>
        <p className="mt-3 max-w-md leading-relaxed text-muted">{s.body}</p>
        <div className="mt-8">
          <PortalButton onClick={onContinue}>{s.cta}</PortalButton>
        </div>
      </div>
    </PortalShell>
  )
}
