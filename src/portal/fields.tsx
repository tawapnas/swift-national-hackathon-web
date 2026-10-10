// Generic form primitives shared by the registration form and the finalist-
// info form. Styling is the portal's: rounded-xl fields on surface-2, white
// focus border, orange pill toggles.

import { useEffect, useState } from 'react'
import { portal } from '../data/content'

export const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
// 10 digits, allowing typed spaces/dashes (e.g. 089-070-0279).
export const isValidPhone = (s: string) => /^\d{10}$/.test(s.replace(/[\s-]/g, ''))

export const inputClass =
  'mt-2 w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-white disabled:opacity-60'

export function TextField({
  label,
  value,
  onChange,
  hint,
  disabled = false,
  error,
  validate,
  type = 'text',
  inputMode,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  disabled?: boolean
  // Inline validation message; also tints the border while present.
  error?: string
  // Format check run while filling in: shown once the field has been left
  // (blurred), then kept live as the value changes. `error` takes precedence.
  validate?: (value: string) => string | undefined
  type?: 'text' | 'tel' | 'email' | 'date' | 'datetime-local'
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
}) {
  const [touched, setTouched] = useState(false)
  const message = error ?? (touched && validate ? validate(value) : undefined)
  return (
    <label className="block">
      <span className="block font-medium">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`${inputClass} ${message ? 'border-swift-orange' : ''}`}
      />
      {message ? (
        <span className="mt-1 block text-xs text-swift-orange">{message}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-muted">{hint}</span>
      )}
    </label>
  )
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <label className="block">
      <span className="block font-medium">{label}</span>
      {/* appearance-none: the native select control ignores padding/line-height
          and renders at a different height than the text inputs; the chevron
          replaces the native arrow. */}
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} appearance-none pr-10 ${value ? '' : 'text-muted'} ${error ? 'border-swift-orange' : ''}`}
        >
          <option value="" disabled>
            {portal.registration.selectPlaceholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-fg">
              {opt}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute right-4 top-[calc(50%+0.25rem)] h-4 w-4 -translate-y-1/2 text-muted"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      {error && <span className="mt-1 block text-xs text-swift-orange">{error}</span>}
    </label>
  )
}

export function CheckboxGroup({
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

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label?: string // omitted when the section heading already asks the question
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  // Shown under the pills (e.g. "nothing chosen" after a submit attempt).
  error?: string
}) {
  return (
    <div>
      {label && <span className="mb-2 block font-medium">{label}</span>}
      <div className="flex flex-wrap gap-2">
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
                  : error
                    ? 'border-swift-orange/70 text-muted hover:border-swift-orange'
                    : 'border-line text-muted hover:border-swift-orange'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {error && <span className="mt-1 block text-xs text-swift-orange">{error}</span>}
    </div>
  )
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
// Some browsers leave HEIC's MIME type empty, so fall back to the extension.
const isAcceptedImage = (f: File, allowHeic: boolean) =>
  f.size <= MAX_IMAGE_BYTES &&
  (['image/png', 'image/jpeg', ...(allowHeic ? ['image/heic', 'image/heif'] : [])].includes(f.type) ||
    (allowHeic ? /\.(png|jpe?g|heic|heif)$/i : /\.(png|jpe?g)$/i).test(f.name))

/** Single-image picker with a local preview. Rejected files (type/size, or a
 *  `process` step that throws — its Error message is shown) are not passed up;
 *  the field shows its own error instead. `process` may also transform the
 *  file (e.g. flatten a Memoji onto white), and the preview shows the result. */
export function ImageUploadField({
  label,
  file,
  onChange,
  error,
  hint,
  allowHeic = true,
  process,
}: {
  label: string
  file: File | null
  onChange: (file: File | null) => void
  error?: string
  hint?: string
  allowHeic?: boolean
  process?: (file: File) => Promise<File>
}) {
  const u = portal.finalistInfo.upload
  const [rejected, setRejected] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const pick = async (picked: File) => {
    if (!isAcceptedImage(picked, allowHeic)) {
      setRejected(u.invalid)
      return
    }
    setRejected(null)
    if (!process) {
      onChange(picked)
      return
    }
    setBusy(true)
    try {
      onChange(await process(picked))
    } catch (e) {
      setRejected(e instanceof Error ? e.message : u.unreadable)
    } finally {
      setBusy(false)
    }
  }

  const message = rejected ?? error
  return (
    <div>
      <span className="block font-medium">{label}</span>
      <div className="mt-2 flex items-center gap-4">
        {preview && (
          // HEIC won't decode outside Safari — hide the broken image there.
          <img
            src={preview}
            alt=""
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="h-20 w-20 flex-none rounded-xl border border-line bg-surface-2 object-contain"
          />
        )}
        <label
          className={`inline-flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border bg-surface-2 px-4 py-3 transition-colors hover:border-swift-orange ${
            message ? 'border-swift-orange' : 'border-line'
          }`}
        >
          <span className="flex-none rounded-full bg-swift-orange/15 px-3 py-1 text-sm font-medium text-swift-orange">
            {file ? u.change : u.choose}
          </span>
          <span className="truncate text-sm text-muted">
            {busy ? u.processing : file ? file.name : u.none}
          </span>
          <input
            type="file"
            accept={
              allowHeic
                ? 'image/png,image/jpeg,image/heic,image/heif,.heic,.heif'
                : 'image/png,image/jpeg'
            }
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const picked = e.target.files?.[0] ?? null
              e.target.value = ''
              if (picked) void pick(picked)
            }}
          />
        </label>
      </div>
      {message ? (
        <span className="mt-1 block text-xs text-swift-orange">{message}</span>
      ) : (
        <span className="mt-1 block text-xs text-muted">{hint ?? u.hint}</span>
      )}
    </div>
  )
}
