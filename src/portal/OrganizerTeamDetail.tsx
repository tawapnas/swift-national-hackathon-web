import { portal } from '../data/content'
import type { Advisor, Leader, Person, Team } from './types'
import { formatTimestamp, fullName } from './organizerUtils'

/** Read-only detail for a single team, shown in place of the list (the
 *  dashboard supplies the surrounding PortalShell). */
export default function OrganizerTeamDetail({
  team,
  onBack,
}: {
  team: Team
  onBack: () => void
}) {
  const d = portal.organizer.detail
  const finalist =
    team.isQualifyingFinalRound === true
      ? d.finalistYes
      : team.isQualifyingFinalRound === false
        ? d.finalistNo
        : d.finalistPending

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm text-muted transition-colors hover:text-fg"
      >
        {d.back}
      </button>

      <h1 className="mt-4 text-3xl font-bold md:text-4xl">{team.teamName}</h1>
      <p className="mt-2 text-muted">
        {team.schoolName} · {team.province}
      </p>

      {/* Team meta */}
      <Section heading={d.teamHeading} first>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label={d.createdAtLabel} value={formatTimestamp(team.createdAt)} />
          <Field label={d.lastLoginLabel} value={formatTimestamp(team.lastLogin)} />
          <Field label={d.finalistLabel} value={finalist} />
        </dl>
      </Section>

      {/* People */}
      <Section heading={d.peopleHeading}>
        <div className="space-y-6">
          <PersonCard person={team.leader} tag={d.leaderTag} />
          {team.members.map((m, i) => (
            <PersonCard key={i} person={m} />
          ))}
          <PersonCard person={team.advisor} tag={d.advisorLabel} advisor />
        </div>
      </Section>

      {/* Survey */}
      <Section heading={d.surveyHeading}>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label={d.surveyProgrammed} value={yn(team.survey.hasProgrammed)} />
          {team.survey.hasProgrammed && (
            <Field label={d.surveyLanguages} value={team.survey.programmingLanguages || '—'} />
          )}
          <Field label={d.surveyHeardSwift} value={yn(team.survey.heardOfSwift)} />
          <Field label={d.surveyPlaygrounds} value={yn(team.survey.knowsSwiftPlaygrounds)} />
          <Field label={d.surveyReferral} value={team.survey.referral || '—'} />
        </dl>
      </Section>

      {/* Submission */}
      <Section heading={d.submissionHeading}>
        {team.submission ? (
          <div className="space-y-6">
            <div className="divide-y divide-line border-y border-line">
              {portal.submission.questions.map((q) => (
                <div key={q.id} className="py-4">
                  <p className="font-medium">{q.label}</p>
                  <p className="mt-2 whitespace-pre-wrap leading-relaxed text-muted">
                    {team.submission?.essays[q.id] || '—'}
                  </p>
                </div>
              ))}
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label={d.runEnvironmentLabel} value={team.submission.runEnvironment || '—'} />
              <Field label={d.submittedAtLabel} value={formatTimestamp(team.submission.submittedAt)} />
            </dl>

            <a
              href={team.submission.fileUrl}
              download={team.submission.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-swift-orange px-6 py-2.5 font-semibold text-white shadow-lg shadow-swift-orange/25 transition-all duration-200 hover:brightness-110 hover:shadow-swift-orange/40 active:scale-[0.98]"
            >
              ⬇ {d.downloadLabel}
              <span className="text-sm font-normal text-white/80">({team.submission.fileName})</span>
            </a>
          </div>
        ) : (
          <p className="text-muted">{d.noSubmission}</p>
        )}
      </Section>
    </div>
  )
}

function yn(v: boolean) {
  const d = portal.organizer.detail
  return v ? d.yes : d.no
}

function Section({
  heading,
  first = false,
  children,
}: {
  heading: string
  first?: boolean
  children: React.ReactNode
}) {
  return (
    <section className={first ? 'mt-10' : 'mt-12 border-t border-line pt-12'}>
      <h2 className="text-2xl font-bold md:text-3xl">{heading}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function PersonCard({
  person,
  tag,
  advisor = false,
}: {
  person: Person | Leader | Advisor
  tag?: string
  advisor?: boolean
}) {
  const d = portal.organizer.detail
  const leader = person as Leader
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-lg font-medium">
        {fullName(person)}{' '}
        {tag && <span className="text-sm font-normal text-muted">({tag})</span>}
      </p>
      {person.nameEn && <p className="text-sm text-muted">{person.nameEn}</p>}
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {!advisor && 'level' in person && person.level && (
          <Field label={d.levelLabel} value={person.level} small />
        )}
        <Field label={d.emailLabel} value={person.email} small />
        <Field label={d.phoneLabel} value={person.phone} small />
        {'lineId' in leader && leader.lineId && (
          <Field label={d.lineIdLabel} value={leader.lineId} small />
        )}
        {'devices' in leader && Array.isArray(leader.devices) && leader.devices.length > 0 && (
          <Field label={d.devicesLabel} value={leader.devices.join(', ')} small />
        )}
      </dl>
    </div>
  )
}

function Field({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={small ? 'mt-0.5 font-medium' : 'mt-1 text-lg font-medium'}>{value}</dd>
    </div>
  )
}
