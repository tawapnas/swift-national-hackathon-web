import { useState } from 'react'
import { portal } from '../data/content'
import type { Advisor, Leader, Person, Team } from './types'
import { formatTimestamp, fullName } from './organizerUtils'
import { setQualifyingFinalRound } from './api'
import ConfirmDialog from './ConfirmDialog'
import { portalButtonClass } from './PortalButton'

/** Detail for a single team, shown in place of the list (the dashboard
 *  supplies the surrounding PortalShell). Read-only except the final-round
 *  qualification flag, which organizers set here. */
export default function OrganizerTeamDetail({
  team,
  onBack,
  onTeamUpdate,
}: {
  team: Team
  onBack: () => void
  onTeamUpdate: (team: Team) => void
}) {
  const d = portal.organizer.detail
  // The pending status change awaiting confirmation; undefined = no dialog
  // (null is a real target: "clear back to ยังไม่ประกาศผล").
  const [confirmTarget, setConfirmTarget] = useState<boolean | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const statusLabel = (v: boolean | null) =>
    v === true ? d.finalistYes : v === false ? d.finalistNo : d.finalistPending
  const finalist = statusLabel(team.isQualifyingFinalRound)

  const applyStatus = async () => {
    if (confirmTarget === undefined) return
    setSaving(true)
    setSaveError(false)
    try {
      await setQualifyingFinalRound(team.email, confirmTarget)
      onTeamUpdate({ ...team, isQualifyingFinalRound: confirmTarget })
      setConfirmTarget(undefined)
    } catch {
      setSaveError(true)
      setConfirmTarget(undefined)
    } finally {
      setSaving(false)
    }
  }

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
          {team.isQualifyingFinalRound === true && (
            <Field
              label={d.confirmedAtLabel}
              value={team.finalRound ? formatTimestamp(team.finalRound.confirmedAt) : d.notConfirmed}
            />
          )}
        </dl>

        {/* Final-round qualification — the one thing organizers can edit. */}
        <div className="mt-6">
          <p className="text-sm text-muted">{d.finalistLabel}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                team.isQualifyingFinalRound === true
                  ? 'border-swift-orange bg-swift-orange/15 text-swift-orange'
                  : team.isQualifyingFinalRound === false
                    ? 'border-line text-fg'
                    : 'border-line text-muted'
              }`}
            >
              {finalist}
            </span>
            {team.isQualifyingFinalRound !== true && (
              <FlagButton label={d.finalistSetYes} onClick={() => setConfirmTarget(true)} />
            )}
            {team.isQualifyingFinalRound !== false && (
              <FlagButton label={d.finalistSetNo} onClick={() => setConfirmTarget(false)} />
            )}
            {team.isQualifyingFinalRound !== null && (
              <FlagButton label={d.finalistClear} onClick={() => setConfirmTarget(null)} />
            )}
          </div>
          {saveError && <p className="mt-2 text-sm text-swift-orange">{d.finalistError}</p>}
        </div>
      </Section>

      <ConfirmDialog
        open={confirmTarget !== undefined}
        title={d.finalistConfirmTitle}
        body={d.finalistConfirmBody
          .replace('{team}', team.teamName)
          .replace('{status}', statusLabel(confirmTarget ?? null))}
        confirmLabel={d.finalistConfirm}
        cancelLabel={d.finalistCancel}
        onConfirm={applyStatus}
        onCancel={() => setConfirmTarget(undefined)}
        busy={saving}
      />

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
              className={portalButtonClass()}
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

/** Small pill action for changing the finalist status (dashboard-filter styling). */
function FlagButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-swift-orange hover:text-swift-orange"
    >
      {label}
    </button>
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
