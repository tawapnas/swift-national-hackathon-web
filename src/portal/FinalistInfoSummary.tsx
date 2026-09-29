import { portal } from '../data/content'
import type { Advisor, FinalistInfo, Person, StudentInfo, Team } from './types'
import { fullName } from './organizerUtils'

const fi = portal.finalistInfo
const sm = fi.summary

/**
 * Read-only rendering of a submitted finalist-info form: trip, guardian,
 * one card per student, and the advisor. Shared by the team's locked view
 * (FinalistInfoScreen) and the organizer team detail; only organizers
 * (`organizerView`) see the Memoji / selfie — they need it to make the badges
 * — each student's age, and the consent document numbers.
 */
export default function FinalistInfoSummary({
  team,
  info,
  organizerView = false,
}: {
  team: Team
  info: FinalistInfo
  organizerView?: boolean
}) {
  const people: Person[] = [team.leader, ...team.members]
  const g = info.guardian
  return (
    <div className="space-y-10">
      {/* Trip */}
      <div>
        <SubHeading>{fi.trip.heading}</SubHeading>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label={fi.trip.travelMode} value={info.travel.mode} note={info.travel.detail} />
          <Field label={fi.trip.stayType} value={info.stay.type} note={info.stay.detail} />
          <Field label={fi.trip.arrivalAt} value={formatDateTime(info.arrivalAt)} />
          <Field label={fi.trip.departureAt} value={formatDateTime(info.departureAt)} />
        </dl>
      </div>

      {/* Students */}
      {info.students.map((s, i) => (
        <StudentCard
          key={i}
          person={people[i]}
          heading={i === 0 ? fi.student.leaderHeading : `${fi.student.memberHeading} ${i}`}
          info={s}
          consent={studentConsentLink(team, info, i)}
          organizerView={organizerView}
        />
      ))}

      {/* Advisor */}
      <AdvisorCard
        advisor={team.advisor}
        info={info}
        consent={team.consentDocs?.advisor}
        organizerView={organizerView}
      />

      {/* Guardian */}
      <div>
        <SubHeading>{fi.guardian.heading}</SubHeading>
        {g.attending ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <Field label={fi.guardian.name} value={g.name} />
            <Field label={fi.guardian.phone} value={g.phone} />
            <Field label={fi.guardian.email} value={g.email} />
            <Field label={fi.guardian.lineId} value={g.lineId} />
            <Field label={fi.student.dietary} value={g.dietary || sm.none} />
          </dl>
        ) : (
          <p className="rounded-xl border border-swift-gold/40 bg-swift-gold/10 px-4 py-3 text-sm text-fg">
            {sm.noGuardian}
          </p>
        )}
      </div>
    </div>
  )
}

function StudentCard({
  person,
  heading,
  info,
  consent,
  organizerView,
}: {
  person: Person | undefined
  heading: string
  info: StudentInfo
  consent?: ConsentLink | null
  organizerView: boolean
}) {
  const st = fi.student
  const age = ageFrom(info.dob)
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-start gap-4">
        {organizerView && info.memojiUrl && (
          <a href={info.memojiUrl} target="_blank" rel="noopener noreferrer" className="flex-none">
            <img
              src={info.memojiUrl}
              alt=""
              className="h-20 w-20 rounded-xl border border-line bg-surface-2 object-contain"
            />
          </a>
        )}
        <div className="min-w-0">
          <p className="text-sm text-muted">{heading}</p>
          <p className="text-lg font-medium">
            {person ? fullName(person) : '—'}
            {info.nickname && <span className="font-normal text-muted"> ({info.nickname})</span>}
          </p>
          {person?.nameEn && <p className="text-sm text-muted">{person.nameEn}</p>}
          {organizerView && (
            <p className="mt-1 text-sm text-muted">
              {st.memoji}: {info.memojiMode === 'diy' ? sm.memojiDiy : sm.memojiStaff}
              {info.memojiUrl && (
                <>
                  {' · '}
                  <a
                    href={info.memojiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-swift-orange hover:underline"
                  >
                    {sm.memojiOpen}
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field
          label={st.dob}
          value={formatDate(info.dob)}
          note={organizerView && age !== null ? `${sm.age} ${age} ${sm.years}` : undefined}
          small
        />
        <Field label={st.shirtSize} value={info.shirtSize} small />
        <Field label={st.dietary} value={info.dietary || sm.none} small />
        <Field
          label={st.medical}
          value={info.medical.hasCondition ? info.medical.detail : sm.none}
          highlight={info.medical.hasCondition}
          small
        />
        <Field
          label={st.emergencyHeading}
          value={`${info.emergency.name} (${info.emergency.relationship})`}
          note={info.emergency.phone}
          small
        />
        {organizerView && <ConsentField doc={consent} />}
      </dl>
    </div>
  )
}

function AdvisorCard({
  advisor,
  info,
  consent,
  organizerView,
}: {
  advisor: Advisor
  info: FinalistInfo
  consent?: ConsentLink | null
  organizerView: boolean
}) {
  const a = info.advisor
  const ad = fi.advisor
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-sm text-muted">{ad.heading}</p>
      <p className="text-lg font-medium">{fullName(advisor)}</p>
      {advisor.nameEn && <p className="text-sm text-muted">{advisor.nameEn}</p>}
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label={ad.lineId} value={a.lineId} small />
        <Field label={ad.position} value={a.position} small />
        <Field label={fi.student.shirtSize} value={a.shirtSize} small />
        <Field label={fi.student.dietary} value={a.dietary || sm.none} small />
        <Field
          label={ad.directorHeading}
          value={a.director.name}
          note={a.director.email}
          small
        />
        {organizerView && <ConsentField doc={consent} />}
      </dl>
    </div>
  )
}

// A consent PDF to show: its number + the one relevant link.
interface ConsentLink {
  docNo: string
  url: string
}

/** The student's parent form in the version matching the team's guardian
 *  answer (both versions are pre-generated). */
function studentConsentLink(team: Team, info: FinalistInfo, i: number): ConsentLink | null {
  const doc = team.consentDocs?.students?.[i]
  if (!doc) return null
  return { docNo: doc.docNo, url: info.guardian.attending ? doc.normalUrl : doc.liabilityUrl }
}

/** Consent PDF number + link, organizer view only (generated offline; absent
 *  until then). */
function ConsentField({ doc }: { doc?: ConsentLink | null }) {
  return (
    <div>
      <dt className="text-sm text-muted">{sm.consent}</dt>
      <dd className="mt-0.5 font-medium">
        {doc ? (
          <>
            {doc.docNo}{' '}
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-normal text-swift-orange hover:underline"
            >
              {sm.consentOpen}
            </a>
          </>
        ) : (
          <span className="font-normal text-muted">{sm.consentPending}</span>
        )}
      </dd>
    </div>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-lg font-semibold">{children}</h3>
}

function Field({
  label,
  value,
  note,
  small = false,
  highlight = false,
}: {
  label: string
  value: string
  note?: string
  small?: boolean
  highlight?: boolean
}) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd
        className={`${small ? 'mt-0.5 font-medium' : 'mt-1 text-lg font-medium'} ${
          highlight ? 'text-swift-gold' : ''
        } whitespace-pre-wrap`}
      >
        {value || '—'}
      </dd>
      {note && <dd className="mt-0.5 text-sm text-muted">{note}</dd>}
    </div>
  )
}

/* ---------- formatting ---------- */

// datetime-local / date strings carry no timezone, so they parse as local time.
export function formatDateTime(value: string): string {
  const d = new Date(value)
  if (!value || Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
}

export function formatDate(value: string): string {
  const d = new Date(`${value}T00:00`)
  if (!value || Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(d)
}

function ageFrom(dob: string): number | null {
  const d = new Date(`${dob}T00:00`)
  if (!dob || Number.isNaN(d.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate()))
    age--
  return age
}
