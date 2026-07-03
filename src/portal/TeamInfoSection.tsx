import { portal } from '../data/content'
import type { Advisor, Leader, Person, Team } from './types'
import PortalSection from './PortalSection'

const fullName = (p: Person | Leader | Advisor) => `${p.prefix} ${p.nameTh}`.trim()

/** Section 1 — read-only team information from Firestore (mock in preview). */
export default function TeamInfoSection({ team, first }: { team: Team; first?: boolean }) {
  const t = portal.teamInfo

  return (
    <PortalSection heading={t.heading} first={first}>
      <dl className="grid gap-4 sm:grid-cols-2">
        <Field label={t.teamNameLabel} value={team.teamName} />
        <Field label={t.schoolLabel} value={team.schoolName} />
        <Field label={t.provinceLabel} value={team.province} />
      </dl>

      <Eyebrow>{t.membersHeading}</Eyebrow>
      <ul className="space-y-2 text-lg font-medium">
        <li>
          {fullName(team.leader)}{' '}
          <span className="font-normal text-muted">({t.leaderTag})</span>
        </li>
        {team.members.map((m, i) => (
          <li key={i}>{fullName(m)}</li>
        ))}
      </ul>

      <Eyebrow>{t.advisorHeading}</Eyebrow>
      <p className="text-lg font-medium">{fullName(team.advisor)}</p>
    </PortalSection>
  )
}

// Same style as the Field labels (ชื่อทีม / สถานศึกษา / จังหวัด) above.
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 mb-1 text-sm font-normal text-muted">{children}</h3>
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-medium">{value}</dd>
    </div>
  )
}
