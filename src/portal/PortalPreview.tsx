import { useNavigate } from 'react-router-dom'
import { portal } from '../data/content'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'

/**
 * TEMPORARY (Phase 1 only). A dev landing at /portal that links to the
 * registration and team-portal screens without signing in. Phase 2 replaces this
 * with PortalPage (Google sign-in → Firestore lookup → register or portal), and
 * this file plus the /portal/register and /portal/team routes are removed.
 */
export default function PortalPreview() {
  const navigate = useNavigate()
  const p = portal.preview

  return (
    <PortalShell>
      <h1 className="text-3xl font-bold md:text-4xl">{p.heading}</h1>
      <p className="mt-2 leading-relaxed text-muted">{p.body}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PortalButton onClick={() => navigate('/portal/register')}>{p.toRegister}</PortalButton>
        <PortalButton variant="outline" onClick={() => navigate('/portal/team')}>
          {p.toTeam}
        </PortalButton>
      </div>
    </PortalShell>
  )
}
