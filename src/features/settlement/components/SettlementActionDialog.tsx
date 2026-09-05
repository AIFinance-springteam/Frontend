type SettlementActionDialogProps = {
  title: string
  description: string
  confirmLabel: string
  isDangerous?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function SettlementActionDialog({
  title,
  description,
  confirmLabel,
  isDangerous = false,
  onCancel,
  onConfirm,
}: SettlementActionDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-4 sm:items-center"
      role="presentation"
      onMouseDown={onCancel}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="settlement-action-title"
        aria-describedby="settlement-action-description"
        className="mb-3 w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:mb-0"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="settlement-action-title" className="text-[17px] font-bold">
          {title}
        </h2>
        <p id="settlement-action-description" className="mt-2 text-[12px] leading-5 text-neutral-500">
          {description}
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl border border-neutral-200 bg-white !text-[12px] font-bold text-neutral-600"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-11 flex-1 rounded-xl !text-[12px] font-bold text-white ${
              isDangerous ? 'bg-rose-600 active:bg-rose-700' : 'bg-neutral-950 active:bg-neutral-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
