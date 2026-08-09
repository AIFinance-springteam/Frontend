import { formatWon } from '../../../shared/utils/formatCurrency'

type TotalTripCostCardProps = {
  totalAmount: number
}

export function TotalTripCostCard({ totalAmount }: TotalTripCostCardProps) {
  return (
    <section className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
      <span className="text-xs font-semibold text-neutral-400">총 여행비</span>
      <strong className="text-base font-bold">{formatWon(totalAmount)}</strong>
    </section>
  )
}
