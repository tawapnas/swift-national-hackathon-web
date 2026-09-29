import { useEffect, useState } from 'react'
import { portal } from '../data/content'
import type { FinalistInfoInput, MemojiMode, Person, Team } from './types'
import PortalShell from './PortalShell'
import PortalSection from './PortalSection'
import PortalButton from './PortalButton'
import ConfirmDialog from './ConfirmDialog'
import { withBold } from './HackathonDetailSection'
import { CheckIcon } from './ResultBanner'
import { DocumentRow, ParentConsentRows } from './FinalRoundScreen'
import FinalistInfoSummary, { formatDateTime } from './FinalistInfoSummary'
import { toWhiteBackgroundPng } from './memojiImage'
import { formatTimestamp, fullName } from './organizerUtils'
import {
  ImageUploadField,
  isValidEmail,
  isValidPhone,
  RadioGroup,
  SelectField,
  TextField,
} from './fields'

const fi = portal.finalistInfo
const o = fi.options
const [MEDICAL_NONE, MEDICAL_YES] = o.medical
const [GUARDIAN_YES, GUARDIAN_NO] = o.guardian
const STAY_HOME = o.stayTypes[0]

const invalidEmail = (v: string) => (v.trim() && !isValidEmail(v) ? fi.invalidEmail : undefined)
const invalidPhone = (v: string) => (v.trim() && !isValidPhone(v) ? fi.invalidPhone : undefined)

// DIY Memoji: flatten onto white before the file is accepted; the thrown
// message is what the upload field shows.
const processMemoji = async (file: File) => {
  try {
    return await toWhiteBackgroundPng(file)
  } catch {
    throw new Error(fi.upload.unreadable)
  }
}

/* ---------- form state (strings so radios can start unset) ---------- */

interface StudentDraft {
  nickname: string
  dob: string
  memojiMode: MemojiMode | ''
  medical: string
  medicalDetail: string
  dietary: string
  shirtSize: string
  emergencyName: string
  emergencyRelationship: string
  emergencyPhone: string
}

interface Draft {
  travelMode: string
  travelDetail: string
  stayType: string
  stayDetail: string
  arrivalAt: string
  departureAt: string
  students: StudentDraft[]
  advisor: {
    lineId: string
    position: string
    shirtSize: string
    dietary: string
    directorName: string
    directorEmail: string
  }
  guardian: {
    attending: string
    name: string
    phone: string
    email: string
    lineId: string
    dietary: string
  }
  conduct: boolean
}

const emptyStudent = (): StudentDraft => ({
  nickname: '',
  dob: '',
  memojiMode: '',
  medical: '',
  medicalDetail: '',
  dietary: '',
  shirtSize: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
})

const emptyDraft = (): Draft => ({
  travelMode: '',
  travelDetail: '',
  stayType: '',
  stayDetail: '',
  arrivalAt: '',
  departureAt: '',
  students: [emptyStudent(), emptyStudent(), emptyStudent()],
  advisor: {
    lineId: '',
    position: '',
    shirtSize: '',
    dietary: '',
    directorName: '',
    directorEmail: '',
  },
  guardian: {
    attending: '',
    name: '',
    phone: '',
    email: '',
    lineId: '',
    dietary: '',
  },
  conduct: false,
})

// Text-only draft autosave (a long form shouldn't be lost to a refresh).
// Images can't be serialized and are re-picked. Storage may be unavailable
// (private mode), so every access is guarded.
const draftKey = (email: string) => `finalistInfoDraft:${email}`

function loadDraft(email: string): Draft {
  const base = emptyDraft()
  try {
    const raw = localStorage.getItem(draftKey(email))
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<Draft>
    // Merge over the defaults so a draft saved by an older form shape still loads.
    return {
      ...base,
      ...saved,
      students: base.students.map((s, i) => ({ ...s, ...saved.students?.[i] })),
      advisor: { ...base.advisor, ...saved.advisor },
      guardian: { ...base.guardian, ...saved.guardian },
    }
  } catch {
    return base
  }
}

interface FinalistInfoScreenProps {
  team: Team
  // Uploads the images (files[i] belongs to students[i]) and persists the
  // form; the caller then updates team.finalistInfo, flipping this screen to
  // the locked summary.
  onSubmit: (info: FinalistInfoInput, files: File[]) => Promise<void>
  onBack: () => void
  onSignOut: () => void
  closed?: boolean
}

/**
 * Finalist-info form (/portal/final-round/info): trip logistics, one section
 * per student, the advisor, the accompanying guardian, and the Code of
 * Conduct — filled once by the leader, then locked to a read-only summary.
 */
export default function FinalistInfoScreen({
  team,
  onSubmit,
  onBack,
  onSignOut,
  closed = false,
}: FinalistInfoScreenProps) {
  return (
    <PortalShell onSignOut={onSignOut}>
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm text-muted transition-colors hover:text-fg"
      >
        {fi.back}
      </button>

      <header className="mt-4">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">{fi.heading}</h1>
        {!team.finalistInfo && (
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted [word-break:auto-phrase]">
            {fi.lead}
          </p>
        )}
      </header>

      {team.finalistInfo ? (
        <div className="mt-8">
          <p className="flex items-start gap-2 rounded-xl border border-swift-orange/40 bg-swift-orange/10 px-4 py-3 text-sm text-fg">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-swift-orange" />
            {fi.locked.notice}
          </p>
          <p className="mt-3 text-sm text-muted">
            {fi.locked.submittedAtLabel} {formatSubmittedAt(team.finalistInfo.submittedAt)}
          </p>
          <div className="mt-10">
            <FinalistInfoSummary team={team} info={team.finalistInfo} />
          </div>
        </div>
      ) : closed ? (
        <p className="mt-8 leading-relaxed text-muted">{portal.finalRound.infoCard.closed}</p>
      ) : (
        <InfoForm team={team} onSubmit={onSubmit} />
      )}
    </PortalShell>
  )
}

/* ---------- the form ---------- */

function InfoForm({
  team,
  onSubmit,
}: {
  team: Team
  onSubmit: FinalistInfoScreenProps['onSubmit']
}) {
  const [draft, setDraft] = useState<Draft>(() => loadDraft(team.email))
  const [files, setFiles] = useState<(File | null)[]>([null, null, null])
  const [showErrors, setShowErrors] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(draftKey(team.email), JSON.stringify(draft))
    } catch {
      /* storage unavailable — autosave is a convenience only */
    }
  }, [draft, team.email])

  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }))
  const patchStudent = (i: number, p: Partial<StudentDraft>) =>
    setDraft((d) => ({ ...d, students: d.students.map((s, idx) => (idx === i ? { ...s, ...p } : s)) }))
  const patchAdvisor = (p: Partial<Draft['advisor']>) =>
    setDraft((d) => ({ ...d, advisor: { ...d.advisor, ...p } }))
  const patchGuardian = (p: Partial<Draft['guardian']>) =>
    setDraft((d) => ({ ...d, guardian: { ...d.guardian, ...p } }))

  const departureBeforeArrival =
    draft.arrivalAt !== '' && draft.departureAt !== '' && draft.departureAt <= draft.arrivalAt

  const studentComplete = (s: StudentDraft, i: number) =>
    s.nickname.trim() &&
    s.dob &&
    s.memojiMode &&
    files[i] &&
    s.medical &&
    (s.medical === MEDICAL_NONE || s.medicalDetail.trim()) &&
    s.shirtSize &&
    s.emergencyName.trim() &&
    s.emergencyRelationship.trim() &&
    isValidPhone(s.emergencyPhone)

  const a = draft.advisor
  const g = draft.guardian
  const valid = Boolean(
    draft.travelMode &&
      draft.stayType &&
      (draft.stayType === STAY_HOME || draft.stayDetail.trim()) &&
      draft.arrivalAt &&
      draft.departureAt &&
      !departureBeforeArrival &&
      draft.students.every(studentComplete) &&
      a.lineId.trim() &&
      a.position.trim() &&
      a.shirtSize &&
      a.directorName.trim() &&
      isValidEmail(a.directorEmail) &&
      g.attending &&
      (g.attending === GUARDIAN_NO ||
        (g.name.trim() &&
          isValidPhone(g.phone) &&
          isValidEmail(g.email) &&
          g.lineId.trim())) &&
      draft.conduct,
  )

  const toInput = (): FinalistInfoInput => {
    const guardianAttending = g.attending === GUARDIAN_YES
    return {
      travel: { mode: draft.travelMode, detail: draft.travelDetail.trim() },
      stay: {
        type: draft.stayType,
        detail: draft.stayType === STAY_HOME ? '' : draft.stayDetail.trim(),
      },
      arrivalAt: draft.arrivalAt,
      departureAt: draft.departureAt,
      guardian: guardianAttending
        ? {
            attending: true,
            name: g.name.trim(),
            phone: g.phone.trim(),
            email: g.email.trim(),
            lineId: g.lineId.trim(),
            dietary: g.dietary.trim(),
          }
        : {
            attending: false,
            name: '',
            phone: '',
            email: '',
            lineId: '',
            dietary: '',
          },
      students: draft.students.map((s) => ({
        nickname: s.nickname.trim(),
        dob: s.dob,
        memojiMode: s.memojiMode as MemojiMode,
        memojiUrl: '',
        medical: {
          hasCondition: s.medical === MEDICAL_YES,
          detail: s.medical === MEDICAL_YES ? s.medicalDetail.trim() : '',
        },
        dietary: s.dietary.trim(),
        shirtSize: s.shirtSize,
        emergency: {
          name: s.emergencyName.trim(),
          relationship: s.emergencyRelationship.trim(),
          phone: s.emergencyPhone.trim(),
        },
      })),
      advisor: {
        lineId: a.lineId.trim(),
        position: a.position.trim(),
        shirtSize: a.shirtSize,
        dietary: a.dietary.trim(),
        director: {
          name: a.directorName.trim(),
          email: a.directorEmail.trim(),
        },
      },
      codeOfConductAccepted: true,
    }
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await onSubmit(toInput(), files as File[])
      try {
        localStorage.removeItem(draftKey(team.email))
      } catch {
        /* ignore */
      }
      setConfirmOpen(false)
    } catch {
      setError(fi.submitError)
      setConfirmOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const people: Person[] = [team.leader, ...team.members]
  const st = fi.student
  const memojiOptions = [o.memoji.diy, o.memoji.staff]

  return (
    <form
      className="mt-6"
      onSubmit={(e) => {
        e.preventDefault()
        setShowErrors(true)
        if (!valid) {
          setError(fi.requiredNote)
          return
        }
        setError(null)
        setConfirmOpen(true)
      }}
    >
      {/* Trip */}
      <PortalSection heading={fi.trip.heading}>
        <div className="space-y-5">
          <SelectField
            label={fi.trip.travelMode}
            options={o.travelModes}
            value={draft.travelMode}
            onChange={(v) => patch({ travelMode: v })}
          />
          <TextField
            label={fi.trip.travelDetail}
            hint={fi.trip.travelDetailHint}
            value={draft.travelDetail}
            onChange={(v) => patch({ travelDetail: v })}
          />
          <RadioGroup
            label={fi.trip.stayType}
            options={o.stayTypes}
            value={draft.stayType}
            onChange={(v) => patch({ stayType: v })}
          />
          {draft.stayType && draft.stayType !== STAY_HOME && (
            <TextField
              label={fi.trip.stayDetail}
              value={draft.stayDetail}
              onChange={(v) => patch({ stayDetail: v })}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              type="datetime-local"
              label={fi.trip.arrivalAt}
              value={draft.arrivalAt}
              onChange={(v) => patch({ arrivalAt: v })}
            />
            <TextField
              type="datetime-local"
              label={fi.trip.departureAt}
              value={draft.departureAt}
              onChange={(v) => patch({ departureAt: v })}
              error={departureBeforeArrival ? fi.trip.departureError : undefined}
            />
          </div>
        </div>
      </PortalSection>

      {/* Students */}
      {draft.students.map((s, i) => {
        const person = people[i]
        const mode = s.memojiMode
        return (
          <PortalSection
            key={i}
            heading={i === 0 ? st.leaderHeading : `${st.memberHeading} ${i}`}
          >
            <div className="space-y-5">
              <RegisteredName name={person ? fullName(person) : '—'} nameEn={person?.nameEn} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label={st.nickname}
                  value={s.nickname}
                  onChange={(v) => patchStudent(i, { nickname: v })}
                />
                <TextField
                  type="date"
                  label={st.dob}
                  value={s.dob}
                  onChange={(v) => patchStudent(i, { dob: v })}
                />
              </div>

              {/* Memoji */}
              <div className="rounded-xl border border-line bg-surface p-4">
                <RadioGroup
                  label={st.memoji}
                  options={memojiOptions}
                  value={mode === 'diy' ? o.memoji.diy : mode === 'staff' ? o.memoji.staff : ''}
                  onChange={(v) => {
                    const next: MemojiMode = v === o.memoji.diy ? 'diy' : 'staff'
                    if (next === mode) return
                    patchStudent(i, { memojiMode: next })
                    // A selfie isn't a Memoji (and vice versa) — re-pick.
                    setFiles((prev) => prev.map((x, idx) => (idx === i ? null : x)))
                  }}
                />
                <p className="mt-2 text-sm text-muted">{st.memojiLead}</p>
                {mode === 'diy' && (
                  <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted marker:text-swift-orange">
                    {st.diySteps.map((step, n) => (
                      <li key={n}>{step}</li>
                    ))}
                  </ol>
                )}
                {mode === 'staff' && (
                  <p className="mt-4 text-sm leading-relaxed text-muted">{st.staffNote}</p>
                )}
                {mode && (
                  <div className="mt-4">
                    <ImageUploadField
                      key={mode}
                      label={mode === 'diy' ? st.memojiUpload : st.selfieUpload}
                      hint={mode === 'diy' ? st.memojiHint : undefined}
                      allowHeic={mode !== 'diy'}
                      process={mode === 'diy' ? processMemoji : undefined}
                      file={files[i]}
                      error={showErrors && !files[i] ? fi.upload.required : undefined}
                      onChange={(f) => setFiles((prev) => prev.map((x, idx) => (idx === i ? f : x)))}
                    />
                  </div>
                )}
              </div>

              <RadioGroup
                label={st.medical}
                options={o.medical}
                value={s.medical}
                onChange={(v) => patchStudent(i, { medical: v })}
              />
              {s.medical === MEDICAL_YES && (
                <TextField
                  label={st.medicalDetail}
                  hint={st.medicalDetailHint}
                  value={s.medicalDetail}
                  onChange={(v) => patchStudent(i, { medicalDetail: v })}
                />
              )}
              <TextField
                label={`${st.dietary} ${st.optional}`}
                value={s.dietary}
                onChange={(v) => patchStudent(i, { dietary: v })}
              />
              <ShirtSizeField
                value={s.shirtSize}
                onChange={(v) => patchStudent(i, { shirtSize: v })}
              />

              <div>
                <p className="font-medium">{st.emergencyHeading}</p>
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  <TextField
                    label={st.emergencyName}
                    value={s.emergencyName}
                    onChange={(v) => patchStudent(i, { emergencyName: v })}
                  />
                  <TextField
                    label={st.emergencyRelationship}
                    value={s.emergencyRelationship}
                    onChange={(v) => patchStudent(i, { emergencyRelationship: v })}
                  />
                  <TextField
                    type="tel"
                    label={st.emergencyPhone}
                    value={s.emergencyPhone}
                    onChange={(v) => patchStudent(i, { emergencyPhone: v })}
                    error={showErrors ? invalidPhone(s.emergencyPhone) : undefined}
                  />
                </div>
              </div>
            </div>
          </PortalSection>
        )
      })}

      {/* Advisor */}
      <PortalSection heading={fi.advisor.heading}>
        <div className="space-y-5">
          <RegisteredName name={fullName(team.advisor)} nameEn={team.advisor.nameEn} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label={fi.advisor.lineId}
              value={a.lineId}
              onChange={(v) => patchAdvisor({ lineId: v })}
            />
            <TextField
              label={fi.advisor.position}
              value={a.position}
              onChange={(v) => patchAdvisor({ position: v })}
            />
          </div>
          <TextField
            label={`${st.dietary} ${st.optional}`}
            value={a.dietary}
            onChange={(v) => patchAdvisor({ dietary: v })}
          />
          <ShirtSizeField value={a.shirtSize} onChange={(v) => patchAdvisor({ shirtSize: v })} />

          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="font-medium">{fi.advisor.directorHeading}</p>
            <p className="mt-1 text-sm text-muted">{fi.advisor.directorLead}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField
                label={fi.advisor.directorName}
                value={a.directorName}
                onChange={(v) => patchAdvisor({ directorName: v })}
              />
              <TextField
                type="email"
                label={fi.advisor.directorEmail}
                value={a.directorEmail}
                onChange={(v) => patchAdvisor({ directorEmail: v })}
                error={showErrors ? invalidEmail(a.directorEmail) : undefined}
              />
            </div>
          </div>
        </div>
      </PortalSection>

      {/* Guardian */}
      <PortalSection heading={fi.guardian.heading}>
        <div className="space-y-5">
          <RadioGroup
            label={fi.guardian.attending}
            options={o.guardian}
            value={g.attending}
            onChange={(v) => patchGuardian({ attending: v })}
          />
          {g.attending === GUARDIAN_YES && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField
                    label={fi.guardian.name}
                    value={g.name}
                    onChange={(v) => patchGuardian({ name: v })}
                  />
                </div>
                <TextField
                  type="tel"
                  label={fi.guardian.phone}
                  value={g.phone}
                  onChange={(v) => patchGuardian({ phone: v })}
                  error={showErrors ? invalidPhone(g.phone) : undefined}
                />
                <TextField
                  type="email"
                  label={fi.guardian.email}
                  value={g.email}
                  onChange={(v) => patchGuardian({ email: v })}
                  error={showErrors ? invalidEmail(g.email) : undefined}
                />
                <TextField
                  label={fi.guardian.lineId}
                  value={g.lineId}
                  onChange={(v) => patchGuardian({ lineId: v })}
                />
                <TextField
                  label={`${st.dietary} ${st.optional}`}
                  value={g.dietary}
                  onChange={(v) => patchGuardian({ dietary: v })}
                />
              </div>
            </>
          )}
          {/* Each student's parent form, in the version matching this choice. */}
          {g.attending && (
            <div>
              <p className="rounded-xl border border-swift-orange/40 bg-swift-orange/10 px-4 py-3 text-sm text-fg">
                {g.attending === GUARDIAN_NO
                  ? withBold(fi.guardian.noGuardianNotice)
                  : fi.guardian.guardianFormsNote}
              </p>
              <ul className="mt-2 divide-y divide-line">
                <ParentConsentRows
                  team={team}
                  kind={g.attending === GUARDIAN_NO ? 'liability' : 'normal'}
                />
              </ul>
            </div>
          )}
        </div>
      </PortalSection>

      {/* Code of Conduct */}
      <PortalSection heading={fi.conduct.heading}>
        <ConductAgreement accepted={draft.conduct} onChange={(v) => patch({ conduct: v })} />
      </PortalSection>

      <div className="mt-12">
        {error && <p className="mb-4 text-sm text-swift-orange">{error}</p>}
        <PortalButton type="submit" disabled={submitting}>
          {submitting ? fi.submitting : fi.submit}
        </PortalButton>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={fi.confirm.title}
        body={fi.confirm.body}
        confirmLabel={fi.confirm.confirm}
        cancelLabel={fi.confirm.cancel}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        busy={submitting}
      />
    </form>
  )
}

/* ---------- building blocks ---------- */

/** The registered name, read-only, with a reminder to double-check it — a
 *  wrong name is fixed by staff (it's printed on certificates), not here. */
function RegisteredName({ name, nameEn }: { name: string; nameEn?: string }) {
  const st = fi.student
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-sm text-muted">{st.nameLabel}</p>
      <p className="mt-1 text-lg font-medium">{name}</p>
      {nameEn && <p className="text-sm text-muted">{nameEn}</p>}
      <p className="mt-3 text-sm text-swift-gold">{st.nameRemark}</p>
    </div>
  )
}

/** The Code of Conduct shown in full in a scroll box, with a download link
 *  and the (required) accept checkbox. */
function ConductAgreement({
  accepted,
  onChange,
}: {
  accepted: boolean
  onChange: (v: boolean) => void
}) {
  const c = fi.conduct

  return (
    <div>
      <p className="leading-relaxed text-muted">{c.body}</p>
      <div
        className="mt-5 max-h-80 overflow-y-auto rounded-xl border border-line bg-surface p-5"
      >
        <p className="text-center font-semibold">{c.title}</p>
        <p className="mt-1 text-center text-sm text-muted">{c.subtitle}</p>
        <p className="mt-5 text-sm leading-relaxed text-muted">{c.intro}</p>
        <ol className="mt-5 space-y-4 text-sm leading-relaxed">
          {c.items.map((item, n) => (
            <li key={n}>
              <span className="font-semibold text-fg">
                {n + 1}. {item.title}
              </span>{' '}
              <span className="text-muted">{item.body}</span>
            </li>
          ))}
        </ol>
      </div>
      <ul className="mt-3 divide-y divide-line border-b border-line">
        <DocumentRow
          title={portal.finalRound.documents.codeOfConduct.title}
          note={portal.finalRound.documents.codeOfConduct.note}
          url={portal.finalRound.codeOfConductUrl || undefined}
        />
      </ul>
      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-5 w-5 flex-none accent-swift-orange"
        />
        <span className="font-medium">{c.accept}</span>
      </label>
    </div>
  )
}

function ShirtSizeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const c = fi.sizeChart
  return (
    <div>
      <SelectField
        label={fi.student.shirtSize}
        value={value}
        options={o.shirtSizes}
        onChange={onChange}
      />
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-swift-orange">{c.toggle}</summary>
        <table className="mt-3 w-full max-w-sm border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-muted">
              {c.headers.map((h) => (
                <th key={h} className="py-2 pr-4 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((row) => (
              <tr key={row[0]} className="border-b border-line/60">
                {row.map((cell, n) => (
                  <td key={n} className={`py-1.5 pr-4 ${n === 0 ? 'font-medium' : 'text-muted'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-muted">{c.note}</p>
      </details>
    </div>
  )
}

// Firestore reads yield a Timestamp; previews store an ISO string.
const formatSubmittedAt = (value: unknown) =>
  typeof value === 'string' ? formatDateTime(value) : formatTimestamp(value)
