import { useState } from 'react'
import { portal } from '../data/content'
import type { ParentFormKind, StudentConsent, Team } from './types'
import PortalShell from './PortalShell'
import PortalSection from './PortalSection'
import PortalButton, { portalButtonClass } from './PortalButton'
import ConfirmDialog from './ConfirmDialog'
import { withBold } from './HackathonDetailSection'
import { formatTimestamp, fullName } from './organizerUtils'
import { CheckIcon, DownloadIcon } from './ResultBanner'

const f = portal.finalRound

interface FinalRoundScreenProps {
  team: Team
  // Persists the confirmation; the caller stamps confirmedAt/locked and
  // updates team.finalRound, which flips this screen to the locked view.
  onConfirm: () => Promise<void>
  // Opens the finalist-info form (/portal/final-round/info).
  onOpenInfo: () => void
  // FINALIST_INFO_CLOSED — the form no longer takes submissions.
  infoClosed?: boolean
  // FINALIST_INFO_STAFF_ONLY — false hides the finalist-info section entirely.
  infoAvailable?: boolean
  onBack: () => void
  onSignOut: () => void
}

/**
 * National-round page for finalist teams (/portal/final-round): the key
 * facts, what to prepare, LINE Open Chat, per-team and shared documents, the
 * one-time participation confirmation (locked once confirmed), and — once
 * confirmed — the entry to the finalist-info form.
 */
export default function FinalRoundScreen({
  team,
  onConfirm,
  onOpenInfo,
  infoClosed = false,
  infoAvailable = true,
  onBack,
  onSignOut,
}: FinalRoundScreenProps) {
  return (
    <PortalShell onSignOut={onSignOut}>
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm text-muted transition-colors hover:text-fg"
      >
        {f.back}
      </button>

      <header className="mt-4">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {f.heading.replace('{teamName}', team.teamName)}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted [word-break:auto-phrase]">
          {f.lead}
        </p>
      </header>

      <div className="mt-10">
        {/* Key facts */}
        <PortalSection heading={f.info.heading} first>
          <dl className="grid gap-5 sm:grid-cols-2">
            <Field label={f.info.dateLabel} value={f.info.date} note={f.info.dateNote} wide />
            <Field label={f.info.venueLabel} value={f.info.venue} wide />
            <Field label={f.info.topicLabel} value={f.info.topic} wide />
          </dl>
        </PortalSection>

        {/* What to know */}
        <PortalSection heading={f.notes.heading}>
          <ul className="list-disc space-y-2 pl-5 text-lg leading-relaxed text-muted marker:text-swift-orange">
            {f.notes.items.map((item, i) => (
              <li key={i}>{withBold(item)}</li>
            ))}
          </ul>
        </PortalSection>

        {/* LINE Open Chat */}
        <PortalSection heading={f.lineChat.heading}>
          <p className="text-lg leading-relaxed text-muted">
            {f.lineChat.body} {f.lineChat.example}
          </p>
          <div className="mt-5 inline-block rounded-xl border border-line bg-surface-2 px-4 py-3 font-mono text-base text-fg">
            {f.lineChat.format}
          </div>
          <div className="mt-6">
            <a
              href={f.lineOpenChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={portalButtonClass('outline')}
            >
              {f.lineChat.cta}
            </a>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <img
              src={f.lineChat.qr}
              alt={f.lineChat.qrCaption}
              className="h-28 w-28 rounded-lg bg-white p-1"
            />
            <span className="text-sm text-muted">{f.lineChat.qrCaption}</span>
          </div>
        </PortalSection>

        {/* Documents */}
        <PortalSection heading={f.documents.heading}>
          <ul className="divide-y divide-line border-y border-line">
            <DocumentRow
              title={f.documents.certificate.title}
              note={f.documents.certificate.note}
              url={team.certificateUrl}
            />
            <DocumentRow
              title={f.documents.invitation.title}
              note={f.documents.invitation.note}
              url={team.invitationLetterUrl}
            />
            <DocumentRow
              title={f.documents.thankYou.title}
              note={f.documents.thankYou.note}
              url={team.thankYouLetterUrl}
            />
            <DocumentRow
              title={f.documents.agenda.title}
              note={f.documents.agenda.note}
              url={f.agendaUrl}
            />
            <DocumentRow
              title={f.documents.codeOfConduct.title}
              note={f.documents.codeOfConduct.note}
              url={f.codeOfConductUrl || undefined}
            />
            <ConsentRows team={team} />
          </ul>
          <p className="mt-5 rounded-xl border border-swift-orange/40 bg-swift-orange/10 px-4 py-3 text-sm text-fg">
            {withBold(f.documents.signNotice)}
          </p>
        </PortalSection>

        {/* Confirmation — only until the team has confirmed. */}
        {!team.finalRound && (
          <PortalSection heading={f.form.heading}>
            <ConfirmationForm onConfirm={onConfirm} />
          </PortalSection>
        )}

        {/* Finalist info */}
        {infoAvailable && (
          <PortalSection heading={f.infoCard.heading}>
            <InfoCard team={team} onOpen={onOpenInfo} closed={infoClosed} />
          </PortalSection>
        )}
      </div>
    </PortalShell>
  )
}

/* ---------- confirmation ---------- */

function ConfirmationForm({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const s = f.form
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await onConfirm()
      setConfirmOpen(false)
    } catch {
      setError(s.submitError)
      setConfirmOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <p className="rounded-xl border border-swift-orange/40 bg-swift-orange/10 px-4 py-3 text-sm text-fg">
        {withBold(s.deadlineNotice.replace('{deadline}', f.confirmDeadline))}
      </p>
      <p className="mt-5 leading-relaxed text-muted">{s.lead}</p>

      <div className="mt-8">
        {error && <p className="mb-4 text-sm text-swift-orange">{error}</p>}
        <PortalButton
          onClick={() => {
            setError(null)
            setConfirmOpen(true)
          }}
          disabled={submitting}
        >
          {submitting ? s.submitting : s.submit}
        </PortalButton>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={s.confirm.title}
        body={s.confirm.body}
        confirmLabel={s.confirm.confirm}
        cancelLabel={s.confirm.cancel}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        busy={submitting}
      />
    </div>
  )
}

/* ---------- personalised consent forms ---------- */

// The team's guardian answer picks the parent-form version; null = not
// answered yet (the finalist-info form isn't sent), so offer both.
const guardianKind = (team: Team): ParentFormKind | null =>
  team.finalistInfo ? (team.finalistInfo.guardian.attending ? 'normal' : 'liability') : null

/** The advisor's form + one parent form per student, all pre-generated
 *  (team.consentDocs, scripts/generate-consents.mjs). */
function ConsentRows({ team }: { team: Team }) {
  const c = f.documents.consent
  const advisor = team.consentDocs?.advisor
  return (
    <>
      <DocumentRow
        // The generated doc carries the cleaned name (title stripped).
        title={c.advisorTitle.replace('{name}', advisor?.name ?? team.advisor.nameTh)}
        note={c.advisorNote}
        url={advisor?.url}
      />
      <ParentConsentRows team={team} kind={guardianKind(team)} />
    </>
  )
}

/** One row per student with that student's parent form: the `kind` version
 *  only, or both versions (two buttons) when kind is null. Also used by the
 *  finalist-info form, driven by the guardian option being chosen there. */
export function ParentConsentRows({ team, kind }: { team: Team; kind: ParentFormKind | null }) {
  const c = f.documents.consent
  const students = [team.leader, ...team.members]
  return (
    <>
      {students.map((p, i) => {
        const doc = team.consentDocs?.students?.[i] ?? null
        const base = kind === 'liability' ? c.liabilityNote : kind === 'normal' ? c.normalNote : c.chooseNote
        return (
          <ParentConsentRow
            key={i}
            title={c.studentTitle.replace('{name}', doc?.name ?? fullName(p))}
            note={base}
            doc={doc}
            kind={kind}
          />
        )
      })}
    </>
  )
}

function ParentConsentRow({
  title,
  note,
  doc,
  kind,
}: {
  title: string
  note: string
  doc: StudentConsent | null
  kind: ParentFormKind | null
}) {
  const c = f.documents.consent
  const links: { label: string; url: string }[] = !doc
    ? []
    : kind === 'normal'
      ? [{ label: f.documents.download, url: doc.normalUrl }]
      : kind === 'liability'
        ? [{ label: f.documents.download, url: doc.liabilityUrl }]
        : [
            { label: c.normalButton, url: doc.normalUrl },
            { label: c.liabilityButton, url: doc.liabilityUrl },
          ]
  return (
    <li className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted">{note}</p>
      </div>
      {links.length ? (
        <div className="flex flex-none flex-wrap gap-2">
          {links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className={`${portalButtonClass('outline', 'sm')} flex-none`}
            >
              <DownloadIcon />
              {l.label}
            </a>
          ))}
        </div>
      ) : (
        <span className="flex-none self-start rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted sm:self-auto">
          {f.documents.preparing}
        </span>
      )}
    </li>
  )
}

/* ---------- finalist info entry ---------- */

function InfoCard({ team, onOpen, closed }: { team: Team; onOpen: () => void; closed: boolean }) {
  const c = f.infoCard
  if (!team.finalRound) return <p className="leading-relaxed text-muted">{c.needConfirm}</p>
  if (team.finalistInfo) {
    return (
      <div>
        <p className="flex items-start gap-2 rounded-xl border border-swift-orange/40 bg-swift-orange/10 px-4 py-3 text-sm text-fg">
          <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-swift-orange" />
          {c.sent}
        </p>
        <p className="mt-3 text-sm text-muted">
          {c.sentAtLabel} {formatConfirmedAt(team.finalistInfo.submittedAt)}
        </p>
        <div className="mt-6">
          <PortalButton variant="outline" onClick={onOpen}>
            {c.viewCta}
          </PortalButton>
        </div>
      </div>
    )
  }
  if (closed) return <p className="leading-relaxed text-muted">{c.closed}</p>
  return (
    <div>
      <p className="leading-relaxed text-muted">{c.body}</p>
      <div className="mt-8">
        <PortalButton onClick={onOpen}>{c.cta}</PortalButton>
      </div>
    </div>
  )
}

// Phase 1 stores an ISO string; Firestore reads yield a Timestamp.
function formatConfirmedAt(value: unknown): string {
  if (typeof value === 'string') {
    return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    )
  }
  return formatTimestamp(value)
}

/* ---------- building blocks ---------- */

export function DocumentRow({ title, note, url }: { title: string; note: string; url?: string }) {
  const d = f.documents
  return (
    <li className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted">{note}</p>
      </div>
      {url ? (
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className={`${portalButtonClass('outline', 'sm')} flex-none`}
        >
          <DownloadIcon />
          {d.download}
        </a>
      ) : (
        <span className="flex-none self-start rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted sm:self-auto">
          {d.preparing}
        </span>
      )}
    </li>
  )
}

// Same look as TeamInfoSection's Field (label over value).
function Field({
  label,
  value,
  note,
  wide = false,
}: {
  label: string
  value: string
  note?: string
  wide?: boolean
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-medium">{value}</dd>
      {note && <dd className="mt-1 text-sm text-swift-gold">{note}</dd>}
    </div>
  )
}
