import PortalButton from './PortalButton'

interface ConfirmDialogProps {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  // Disables the confirm button and shows the busy state while a submit is in flight.
  busy?: boolean
}

/**
 * Styled confirmation modal (replaces window.confirm). Renders nothing when
 * closed. The overlay click and Cancel both dismiss; Confirm fires onConfirm.
 */
export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-6 backdrop-blur"
      role="dialog"
      aria-modal="true"
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-3 leading-relaxed text-muted">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <PortalButton variant="outline" size="sm" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </PortalButton>
          <PortalButton variant="solid" size="sm" onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </PortalButton>
        </div>
      </div>
    </div>
  )
}
