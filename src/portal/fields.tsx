// Generic form primitives shared by the registration form and the national-
// round confirmation form. Styling is the portal's: rounded-xl fields on
// surface-2, white focus border, orange pill toggles.

import { portal } from '../data/content'

export const inputClass =
  'mt-2 w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-white disabled:opacity-60'

export function TextField({
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

export function SelectField({
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
          {portal.registration.selectPlaceholder}
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
