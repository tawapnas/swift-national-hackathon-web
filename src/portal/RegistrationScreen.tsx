import { useState } from 'react'
import { portal } from '../data/content'
import type { Advisor, Leader, Person, Team } from './types'
import { createTeam } from './api'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'
import PortalSection from './PortalSection'

const r = portal.registration
const o = r.options

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
// 10 digits, allowing typed spaces/dashes (e.g. 089-070-0279).
const isValidPhone = (s: string) => /^\d{10}$/.test(s.replace(/[\s-]/g, ''))

// Inline field errors — only shown once the field has content.
const emailError = (v: string) => (v.trim() && !isValidEmail(v) ? r.invalidEmail : undefined)
const phoneError = (v: string) => (v.trim() && !isValidPhone(v) ? r.invalidPhone : undefined)

interface RegistrationScreenProps {
  // The signed-in google email (locked, becomes the leader email and doc id).
  email: string
  // Called with the created team so PortalPage can switch to the portal view.
  onRegistered: (team: Team) => void
  onSignOut: () => void
}

const emptyMember = (): Person => ({
  prefix: '',
  nameTh: '',
  nameEn: '',
  level: '',
  email: '',
  phone: '',
})

interface SurveyState {
  hasProgrammed: string
  programmingLanguages: string
  heardOfSwift: string
  knowsSwiftPlaygrounds: string
  referral: string
  referralOther: string
}

/**
 * Team registration form: team info + leader + 2 members + a team-overall survey.
 * The leader email is locked to the signed-in account. Submit persists the team
 * to Firestore (api.createTeam), mapping the survey เคย/ไม่เคย + รู้จัก/ไม่รู้จัก
 * values to the booleans in TeamSurvey.
 */
export default function RegistrationScreen({
  email,
  onRegistered,
  onSignOut,
}: RegistrationScreenProps) {
  const [teamName, setTeamName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [province, setProvince] = useState('')
  const [leader, setLeader] = useState<Leader>({
    prefix: '',
    nameTh: '',
    nameEn: '',
    level: '',
    email,
    phone: '',
    lineId: '',
    devices: [],
  })
  const [members, setMembers] = useState<Person[]>([emptyMember(), emptyMember()])
  const [advisor, setAdvisor] = useState<Advisor>({
    prefix: '',
    nameTh: '',
    nameEn: '',
    email: '',
    phone: '',
  })
  const [survey, setSurvey] = useState<SurveyState>({
    hasProgrammed: '',
    programmingLanguages: '',
    heardOfSwift: '',
    knowsSwiftPlaygrounds: '',
    referral: '',
    referralOther: '',
  })
  const [pdpaConsent, setPdpaConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  // Inline email/phone errors stay hidden until the first ลงทะเบียน tap.
  const [showFieldErrors, setShowFieldErrors] = useState(false)

  const patchLeader = (patch: Partial<Leader>) => setLeader((l) => ({ ...l, ...patch }))
  const patchMember = (i: number, patch: Partial<Person>) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)))
  const patchAdvisor = (patch: Partial<Advisor>) => setAdvisor((a) => ({ ...a, ...patch }))
  const patchSurvey = (patch: Partial<SurveyState>) => setSurvey((s) => ({ ...s, ...patch }))

  // "ไม่มี" is exclusive with the actual devices.
  const toggleDevice = (device: string) => {
    const none = o.devices[o.devices.length - 1] // 'ไม่มี'
    setLeader((l) => {
      if (device === none) return { ...l, devices: l.devices.includes(none) ? [] : [none] }
      const next = l.devices.filter((d) => d !== none)
      return {
        ...l,
        devices: next.includes(device)
          ? next.filter((d) => d !== device)
          : [...next, device],
      }
    })
  }

  const personComplete = (p: Person) =>
    p.prefix &&
    p.nameTh.trim() &&
    p.nameEn.trim() &&
    p.level &&
    isValidEmail(p.email) &&
    isValidPhone(p.phone)

  const advisorComplete = (a: Advisor) =>
    a.prefix && a.nameTh.trim() && a.nameEn.trim() && isValidEmail(a.email) && isValidPhone(a.phone)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowFieldErrors(true)
    const valid =
      teamName.trim() &&
      schoolName.trim() &&
      province.trim() &&
      personComplete(leader) &&
      leader.lineId.trim() &&
      leader.devices.length > 0 &&
      members.every(personComplete) &&
      advisorComplete(advisor) &&
      survey.hasProgrammed &&
      (survey.hasProgrammed !== o.yesNo[0] || survey.programmingLanguages.trim()) &&
      survey.heardOfSwift &&
      survey.knowsSwiftPlaygrounds &&
      survey.referral &&
      (survey.referral !== o.referralOther || survey.referralOther.trim()) &&
      pdpaConsent
    if (!valid) {
      setError(r.requiredNote)
      return
    }
    setError(null)
    setSubmitting(true)
    const team: Omit<Team, 'createdAt' | 'submission' | 'isQualifyingFinalRound'> = {
      email,
      teamName: teamName.trim(),
      schoolName: schoolName.trim(),
      province: province.trim(),
      leader,
      members,
      advisor,
      survey: {
        hasProgrammed: survey.hasProgrammed === o.yesNo[0],
        programmingLanguages:
          survey.hasProgrammed === o.yesNo[0] ? survey.programmingLanguages.trim() : '',
        heardOfSwift: survey.heardOfSwift === o.yesNo[0],
        knowsSwiftPlaygrounds: survey.knowsSwiftPlaygrounds === o.playgrounds[0],
        referral:
          survey.referral === o.referralOther ? survey.referralOther.trim() : survey.referral,
      },
      pdpaConsent: true,
    }
    try {
      await createTeam(team)
      onRegistered({ ...team, isQualifyingFinalRound: null, createdAt: new Date().toISOString() })
    } catch {
      setError(r.submitError)
      setSubmitting(false)
    }
  }

  return (
    <PortalShell onSignOut={onSignOut}>
      <h1 className="text-3xl font-bold md:text-4xl">{r.heading}</h1>
      <p className="mt-2 leading-relaxed text-muted">{r.lead}</p>

      <form onSubmit={handleSubmit} className="mt-10">
        {/* Team info */}
        <PortalSection heading={r.team.heading} first>
          <div className="space-y-5">
            <TextField label={r.team.teamName} value={teamName} onChange={setTeamName} />
            <TextField label={r.team.schoolName} value={schoolName} onChange={setSchoolName} />
            <SelectField
              label={r.team.province}
              value={province}
              options={o.provinces}
              onChange={setProvince}
            />
          </div>
        </PortalSection>

        {/* Leader */}
        <PortalSection heading={r.leaderHeading}>
          <PersonFields
            person={leader}
            onPatch={patchLeader}
            emailLocked
            showErrors={showFieldErrors}
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField
              label={r.person.lineId}
              value={leader.lineId}
              onChange={(v) => patchLeader({ lineId: v })}
            />
          </div>
          <CheckboxGroup
            label={r.person.devices}
            options={o.devices}
            selected={leader.devices}
            onToggle={toggleDevice}
          />
        </PortalSection>

        {/* Members */}
        {members.map((m, i) => (
          <PortalSection key={i} heading={`${r.memberHeading} ${i + 1}`}>
            <PersonFields
              person={m}
              onPatch={(patch) => patchMember(i, patch)}
              showErrors={showFieldErrors}
            />
          </PortalSection>
        ))}

        {/* Advisor */}
        <PortalSection heading={r.advisorHeading}>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label={r.person.prefix}
              value={advisor.prefix}
              options={o.prefix}
              onChange={(v) => patchAdvisor({ prefix: v })}
            />
            <div className="hidden sm:block" />
            <TextField
              label={r.person.nameTh}
              value={advisor.nameTh}
              onChange={(v) => patchAdvisor({ nameTh: v })}
            />
            <TextField
              label={r.person.nameEn}
              value={advisor.nameEn}
              onChange={(v) => patchAdvisor({ nameEn: v })}
            />
            <TextField
              label={r.person.email}
              value={advisor.email}
              onChange={(v) => patchAdvisor({ email: v })}
              error={showFieldErrors ? emailError(advisor.email) : undefined}
            />
            <TextField
              label={r.person.phone}
              value={advisor.phone}
              onChange={(v) => patchAdvisor({ phone: v })}
              error={showFieldErrors ? phoneError(advisor.phone) : undefined}
            />
          </div>
        </PortalSection>

        {/* Team-overall survey */}
        <PortalSection heading={r.survey.heading}>
          <p className="-mt-3 mb-5 text-sm text-muted">{r.survey.note}</p>
          <div className="space-y-6">
            <RadioGroup
              label={r.survey.hasProgrammed}
              options={o.yesNo}
              value={survey.hasProgrammed}
              onChange={(v) => patchSurvey({ hasProgrammed: v })}
            />
            {survey.hasProgrammed === o.yesNo[0] && (
              <TextField
                label={r.survey.programmingLanguages}
                value={survey.programmingLanguages}
                onChange={(v) => patchSurvey({ programmingLanguages: v })}
              />
            )}
            <RadioGroup
              label={r.survey.heardOfSwift}
              options={o.yesNo}
              value={survey.heardOfSwift}
              onChange={(v) => patchSurvey({ heardOfSwift: v })}
            />
            <RadioGroup
              label={r.survey.knowsSwiftPlaygrounds}
              options={o.playgrounds}
              value={survey.knowsSwiftPlaygrounds}
              onChange={(v) => patchSurvey({ knowsSwiftPlaygrounds: v })}
            />
            <RadioGroup
              label={r.survey.referral}
              options={o.referral}
              value={survey.referral}
              onChange={(v) => patchSurvey({ referral: v })}
            />
            {survey.referral === o.referralOther && (
              <TextField
                label={r.survey.referralOtherLabel}
                value={survey.referralOther}
                onChange={(v) => patchSurvey({ referralOther: v })}
              />
            )}
          </div>
        </PortalSection>

        {/* PDPA consent */}
        <PortalSection heading={r.pdpa.heading}>
          {/* text-pretty rebalances line breaks so the last line never ends up
              as a single orphan word. */}
          <div className="space-y-3 text-pretty leading-relaxed text-muted">
            {r.pdpa.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={pdpaConsent}
              onChange={(e) => setPdpaConsent(e.target.checked)}
              className="mt-1 h-5 w-5 flex-none accent-swift-orange"
            />
            <span className="font-medium">{r.pdpa.consent}</span>
          </label>
        </PortalSection>

        <div className="mt-12">
          {error && <p className="mb-4 text-sm text-swift-orange">{error}</p>}
          <PortalButton type="submit" disabled={submitting}>
            {submitting ? r.submitting : r.submit}
          </PortalButton>
        </div>
      </form>
    </PortalShell>
  )
}

/* ---------- field building blocks ---------- */

/** The six fields every person has (leader + members). */
function PersonFields({
  person,
  onPatch,
  emailLocked = false,
  showErrors = false,
}: {
  person: Person
  onPatch: (patch: Partial<Person>) => void
  emailLocked?: boolean
  // Inline validation is deferred until the first submit attempt.
  showErrors?: boolean
}) {
  const p = r.person
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        label={p.prefix}
        value={person.prefix}
        options={o.prefix}
        onChange={(v) => onPatch({ prefix: v })}
      />
      <SelectField
        label={p.level}
        value={person.level}
        options={o.level}
        onChange={(v) => onPatch({ level: v })}
      />
      <TextField label={p.nameTh} value={person.nameTh} onChange={(v) => onPatch({ nameTh: v })} />
      <TextField label={p.nameEn} value={person.nameEn} onChange={(v) => onPatch({ nameEn: v })} />
      <TextField
        label={p.email}
        value={person.email}
        onChange={(v) => onPatch({ email: v })}
        disabled={emailLocked}
        error={emailLocked || !showErrors ? undefined : emailError(person.email)}
      />
      <TextField
        label={p.phone}
        value={person.phone}
        onChange={(v) => onPatch({ phone: v })}
        error={showErrors ? phoneError(person.phone) : undefined}
      />
    </div>
  )
}

const inputClass =
  'mt-2 w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-white disabled:opacity-60'

function TextField({
  label,
  value,
  onChange,
  hint,
  disabled = false,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  disabled?: boolean
  // Inline validation message; also tints the border while present.
  error?: string
}) {
  return (
    <label className="block">
      <span className="block font-medium">{label}</span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} ${error ? 'border-swift-orange' : ''}`}
      />
      {error ? (
        <span className="mt-1 block text-xs text-swift-orange">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-muted">{hint}</span>
      )}
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="block font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} ${value ? '' : 'text-muted'}`}
      >
        <option value="" disabled>
          {r.selectPlaceholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-fg">
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="mt-5">
      <span className="block font-medium">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? 'border-swift-orange bg-swift-orange/15 text-swift-orange'
                  : 'border-line text-muted hover:border-swift-orange'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <span className="block font-medium">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? 'border-swift-orange bg-swift-orange/15 text-swift-orange'
                  : 'border-line text-muted hover:border-swift-orange'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
