import { useState } from 'react'
import { portal } from '../data/content'
import type { Submission } from './types'
import PortalButton from './PortalButton'
import ConfirmDialog from './ConfirmDialog'
import PortalSection from './PortalSection'

const MAX_FILE_BYTES = 25 * 1024 * 1024

interface SubmissionSectionProps {
  // When present, the team has already submitted — render the locked summary.
  submission?: Submission
  // Performs the actual submit (Storage upload + Firestore).
  onSubmit: (data: {
    essays: Record<string, string>
    runEnvironment: string
    file: File
  }) => Promise<void>
}

/** Section 3 — single, final, confirmed submission. Locks after submitting. */
export default function SubmissionSection({ submission, onSubmit }: SubmissionSectionProps) {
  const s = portal.submission

  // Form state (one entry per essay question + run environment + the attached file).
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [runEnvironment, setRunEnvironment] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (submission) {
    return <LockedSummary submission={submission} />
  }

  const setAnswer = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }))

  const validate = (): string | null => {
    for (const q of s.questions) {
      if ('optional' in q && q.optional) continue
      if (!(answers[q.id] ?? '').trim()) return 'กรุณาตอบคำถามให้ครบทุกข้อ'
    }
    if (!runEnvironment) return 'กรุณาตอบคำถามให้ครบทุกข้อ'
    if (!file) return 'กรุณาแนบไฟล์โปรเจกต์'
    if (!file.name.toLowerCase().endsWith('.zip')) return 'รองรับเฉพาะไฟล์ .zip เท่านั้น'
    if (file.size > MAX_FILE_BYTES) return 'ไฟล์มีขนาดเกิน 25 MB'
    if (!termsAccepted) return s.termsRequired
    return null
  }

  // Drives the submit button: disabled until every required field passes.
  const formReady = validate() === null

  const handleSubmitClick = () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!file) return
    setSubmitting(true)
    try {
      const essays: Record<string, string> = {}
      for (const q of s.questions) essays[q.id] = (answers[q.id] ?? '').trim()
      await onSubmit({ essays, runEnvironment, file })
      setConfirmOpen(false)
    } catch {
      setError('ส่งผลงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
      setConfirmOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PortalSection heading={s.heading}>
      <div className="space-y-6">
        {s.questions.map((q) => (
          <div key={q.id}>
            <label className="block font-medium" htmlFor={`essay-${q.id}`}>
              {q.label}{' '}
              {'optional' in q && q.optional && (
                <span className="font-normal text-muted">{s.optionalTag}</span>
              )}
            </label>
            <textarea
              id={`essay-${q.id}`}
              value={answers[q.id] ?? ''}
              maxLength={q.maxLength}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              rows={5}
              placeholder={q.placeholder}
              className="mt-2 w-full resize-y rounded-xl border border-line bg-surface-2 px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-white"
            />
            <div className="mt-1 text-right text-xs text-muted">
              {(answers[q.id] ?? '').length}/{q.maxLength}
            </div>
          </div>
        ))}

        <div>
          <span className="block font-medium">{s.runEnvironment.label}</span>
          <div className="mt-3 space-y-2">
            {s.runEnvironment.options.map((opt) => {
              const active = runEnvironment === opt
              return (
                // Checkbox visuals, single-select semantics: picking one
                // clears the other; re-clicking unticks it.
                <label key={opt} className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => setRunEnvironment(active ? '' : opt)}
                    className="mt-1 h-5 w-5 flex-none accent-swift-orange"
                  />
                  <span className={active ? 'text-fg' : 'text-muted'}>{opt}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block font-medium">{s.fileLabel}</label>
          <p className="mt-1 text-sm text-swift-gold">⚠︎ {s.fileWarning}</p>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3 transition-colors hover:border-swift-orange">
            <span className="rounded-full bg-swift-orange/15 px-3 py-1 text-sm font-medium text-swift-orange">
              {s.fileChoose}
            </span>
            <span className="text-sm text-muted">{file ? file.name : s.fileNone}</span>
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null)
                setError(null)
              }}
            />
          </label>
        </div>

        {/* Same 3rem/3rem divider rhythm as between PortalSections. */}
        <div className="!mt-12 border-t border-line pt-12">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-5 w-5 flex-none accent-swift-orange"
            />
            <span className="text-pretty font-medium">{s.terms}</span>
          </label>
        </div>

        {error && <p className="text-sm text-swift-orange">{error}</p>}

        <PortalButton type="button" onClick={handleSubmitClick} disabled={submitting || !formReady}>
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
    </PortalSection>
  )
}

function LockedSummary({ submission }: { submission: Submission }) {
  const s = portal.submission

  return (
    <PortalSection heading={s.heading}>
      <p className="rounded-xl border border-swift-orange/40 bg-swift-orange/10 px-4 py-3 text-sm text-fg">
        {s.locked.notice}
      </p>

      <h3 className="mt-8 mb-2 text-sm font-semibold uppercase tracking-wide text-swift-orange">
        {s.locked.answersHeading}
      </h3>
      <div className="divide-y divide-line border-y border-line">
        {s.questions.map((q) => (
          <div key={q.id} className="py-4">
            <p className="font-medium">{q.label}</p>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-muted">
              {submission.essays[q.id]}
            </p>
          </div>
        ))}
        {submission.runEnvironment && (
          <div className="py-4">
            <p className="font-medium">{s.runEnvironment.label}</p>
            <p className="mt-2 leading-relaxed text-muted">{submission.runEnvironment}</p>
          </div>
        )}
      </div>

      <h3 className="mt-8 mb-2 text-sm font-semibold uppercase tracking-wide text-swift-orange">
        {s.locked.submittedFileLabel}
      </h3>
      <a
        href={submission.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-swift-orange underline-offset-4 hover:underline"
      >
        {submission.fileName}
      </a>
    </PortalSection>
  )
}
