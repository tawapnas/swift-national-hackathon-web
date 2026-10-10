import { useState } from 'react'
import { portal } from '../data/content'
import type { Person, Team, WifiIdCards } from './types'
import PortalSection from './PortalSection'
import PortalButton from './PortalButton'
import ConfirmDialog from './ConfirmDialog'
import { CheckIcon } from './ResultBanner'
import { formatSubmittedAt } from './FinalistInfoSummary'
import { fullName } from './organizerUtils'
import { TextField } from './fields'

const w = portal.finalistInfo.wifiId

// Thai national ID: 13 digits, the last a checksum of the first 12.
const isValidThaiId = (id: string) => {
  if (!/^\d{13}$/.test(id)) return false
  const sum = [...id.slice(0, 12)].reduce((acc, d, i) => acc + Number(d) * (13 - i), 0)
  return (11 - (sum % 11)) % 10 === Number(id[12])
}
const invalidId = (v: string) => (v && !isValidThaiId(v) ? w.invalid : undefined)
// Keep digits only, so typed or pasted spaces/dashes don't count.
const digitsOnly = (v: string) => v.replace(/\D/g, '').slice(0, 13)
const masked = (id: string) => `${'•'.repeat(9)}${id.slice(-4)}`

interface WifiIdSectionProps {
  team: Team
  // undefined = still loading; null = not sent yet.
  data: WifiIdCards | null | undefined
  loadError?: boolean
  closed?: boolean
  onSubmit: (idCards: string[]) => Promise<void>
}

/**
 * The students' national ID numbers for the venue's Wi-Fi — the section at the
 * top of the finalist-info screen. Sent once on its own (independent of the
 * form below, which most teams had already sent), then shown masked. There is
 * deliberately no localStorage draft: the numbers never stay in the browser.
 */
export default function WifiIdSection({
  team,
  data,
  loadError = false,
  closed = false,
  onSubmit,
}: WifiIdSectionProps) {
  const people: Person[] = [team.leader, ...team.members]
  const roleLabel = (i: number) =>
    i === 0 ? portal.finalistInfo.student.leaderHeading : `${portal.finalistInfo.student.memberHeading} ${i}`

  let body: React.ReactNode
  if (loadError) {
    body = <p className="text-sm text-swift-orange">{w.loadError}</p>
  } else if (data === undefined) {
    body = <p className="text-sm text-muted">{w.loading}</p>
  } else if (data) {
    body = (
      <div>
        <p className="flex items-start gap-2 rounded-xl border border-swift-orange/40 bg-swift-orange/10 px-4 py-3 text-sm text-fg">
          <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-swift-orange" />
          {w.sent}
        </p>
        <p className="mt-3 text-sm text-muted">
          {portal.finalistInfo.locked.submittedAtLabel} {formatSubmittedAt(data.submittedAt)}
        </p>
        <ul className="mt-4 divide-y divide-line">
          {people.map((p, i) => (
            <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
              <span>
                <span className="text-sm text-muted">{roleLabel(i)}</span>{' '}
                <span className="font-medium">{fullName(p)}</span>
              </span>
              <span className="font-mono text-muted">{masked(data.idCards[i] ?? '')}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  } else if (closed) {
    body = <p className="leading-relaxed text-muted">{w.closed}</p>
  } else {
    body = <IdForm people={people} roleLabel={roleLabel} onSubmit={onSubmit} />
  }

  return (
    <PortalSection heading={w.heading} first>
      <p className="leading-relaxed text-muted">{w.lead}</p>
      <p className="mt-4 rounded-xl border border-swift-orange/40 bg-swift-orange/10 px-4 py-3 text-sm text-fg">
        {w.privacy}
      </p>
      <div className="mt-6">{body}</div>
    </PortalSection>
  )
}

function IdForm({
  people,
  roleLabel,
  onSubmit,
}: {
  people: Person[]
  roleLabel: (i: number) => string
  onSubmit: WifiIdSectionProps['onSubmit']
}) {
  const [ids, setIds] = useState(['', '', ''])
  const [showErrors, setShowErrors] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const valid = ids.every(isValidThaiId)

  const fieldError = (i: number) => {
    const v = ids[i]
    if (!showErrors) return undefined
    return v ? invalidId(v) : portal.finalistInfo.requiredField
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await onSubmit(ids)
      setConfirmOpen(false)
    } catch {
      setError(w.submitError)
      setConfirmOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setShowErrors(true)
        if (!valid) return
        setError(null)
        setConfirmOpen(true)
      }}
    >
      <div className="space-y-5">
        {people.map((p, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface p-4">
            <p className="text-sm text-muted">{roleLabel(i)}</p>
            <p className="mt-1 font-medium">{fullName(p)}</p>
            <div className="mt-3">
              <TextField
                label={w.label}
                hint={w.hint}
                value={ids[i]}
                onChange={(v) => setIds((prev) => prev.map((x, j) => (j === i ? digitsOnly(v) : x)))}
                validate={invalidId}
                error={fieldError(i)}
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {error && <p className="mb-4 text-sm text-swift-orange">{error}</p>}
        <PortalButton type="submit" disabled={submitting}>
          {submitting ? w.submitting : w.submit}
        </PortalButton>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={w.confirm.title}
        body={w.confirm.body}
        confirmLabel={w.confirm.confirm}
        cancelLabel={w.confirm.cancel}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        busy={submitting}
      />
    </form>
  )
}
