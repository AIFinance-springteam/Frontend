import { formatWon } from '../../../shared/utils/formatCurrency'
import { cn } from '../../../shared/utils/cn'

export type ReceiptStatus = 'done' | 'unassigned'

export type Receipt = {
  id: string
  place: string
  memo: string
  amount: number
  status: ReceiptStatus
}

type ReceiptListProps = {
  receipts: Receipt[]
  onUnassignedReceiptClick: (receiptId: string) => void
}

export function ReceiptList({ receipts, onUnassignedReceiptClick }: ReceiptListProps) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2 px-0.5 text-xs font-semibold text-neutral-400">
        <span>영수증</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {receipts.map((receipt) => (
          <button
            key={receipt.id}
            type="button"
            onClick={receipt.status === 'unassigned' ? () => onUnassignedReceiptClick(receipt.id) : undefined}
            className="flex w-full items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 text-left last:border-b-0 active:bg-neutral-50"
          >
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold">{receipt.place}</p>
              <p className="mt-1 text-xs font-medium text-neutral-400">{receipt.memo}</p>
            </div>
            <div className="shrink-0 text-right">
              <strong className="text-[15px] font-bold">{formatWon(receipt.amount)}</strong>
              <span
                className={cn(
                  'mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold',
                  receipt.status === 'done' && 'bg-neutral-100 text-neutral-500',
                  receipt.status === 'unassigned' && 'bg-neutral-950 text-white',
                )}
              >
                {receipt.status === 'done' ? '완료' : '미지정'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
