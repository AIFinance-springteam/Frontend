import { formatWon } from '../../../shared/utils/formatCurrency'

type SettlementDeltaCardProps = {
  balanceDelta: number
  paidAmount: number
  owedAmount: number
}

export function SettlementDeltaCard({ balanceDelta, paidAmount, owedAmount }: SettlementDeltaCardProps) {
  const isReceivable = balanceDelta >= 0

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold text-neutral-400">내 예상 정산 차액</p>
        <strong className="mt-2 block text-[31px] leading-tight font-black tracking-normal">
          {isReceivable ? '+' : '-'}
          {formatWon(Math.abs(balanceDelta))}
        </strong>
        <p className="mt-1.5 text-[13px] font-medium text-neutral-400">
          {isReceivable ? '받을 예정입니다' : '보낼 예정입니다'}
        </p>
      </div>
      <div className="my-4 h-px bg-neutral-100" />
      <DashboardLine label="내 결제액" amount={paidAmount} />
      <DashboardLine label="내 부담액" amount={owedAmount} />
    </section>
  )
}

function DashboardLine({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="mt-2.5 flex items-center justify-between text-[13px]">
      <span className="font-medium text-neutral-400">{label}</span>
      <strong className="font-bold">{formatWon(amount)}</strong>
    </div>
  )
}
