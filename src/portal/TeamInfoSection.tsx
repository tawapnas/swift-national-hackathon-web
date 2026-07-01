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
        <Field label={t.schoolLabel} value={team.schoolName} />
        <Field label={t.provinceLabel} value={team.province} />
      </dl>

      <Eyebrow>{t.leaderHeading}</Eyebrow>
      <div className="grid gap-3 sm:grid-cols-2">
        <NameCard name={fullName(team.leader)} />
      </div>

      <Eyebrow>{t.membersHeading}</Eyebrow>
      <div className="grid gap-3 sm:grid-cols-2">
        {team.members.map((m, i) => (
          <NameCard key={i} name={fullName(m)} />
        ))}
      </div>

      <Eyebrow>{t.advisorHeading}</Eyebrow>
      <div className="grid gap-3 sm:grid-cols-2">
        <NameCard name={fullName(team.advisor)} />
      </div>
    </PortalSection>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-swift-orange">
      {children}
    </h3>
  )
}

function NameCard({ name }: { name: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-5 py-4 font-medium">{name}</div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
