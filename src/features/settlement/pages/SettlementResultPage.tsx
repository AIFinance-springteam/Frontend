import { useMemo, useState } from 'react'
import { BottomActionBar } from '../../../shared/components/BottomActionBar'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import { formatWon } from '../../../shared/utils/formatCurrency'
import type { SettlementSummary, SettlementTransfer, TransferStatus } from '../types/settlement'
import { SettlementActionDialog } from '../components/SettlementActionDialog'

type SettlementResultPageProps = {
  summary: SettlementSummary
  onComplete: () => void
}

const statusLabel: Record<TransferStatus, string> = {
  PENDING: '송금 전',
  SENT: '확인 필요',
  CONFIRMED: '완료',
}

type PendingAction = {
  transferId: string
  nextStatus: TransferStatus
  title: string
  description: string
  confirmLabel: string
}

export function SettlementResultPage({ summary, onComplete }: SettlementResultPageProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [transfers, setTransfers] = useState<SettlementTransfer[]>(summary.transfers)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const completedCount = useMemo(
    () => transfers.filter((transfer) => transfer.status === 'CONFIRMED').length,
    [transfers],
  )
  const allTransfersConfirmed = completedCount === transfers.length

  const updateTransferStatus = (transferId: string, status: TransferStatus) => {
    setTransfers((current) => current.map((transfer) => (
      transfer.id === transferId ? { ...transfer, status } : transfer
    )))
  }

  const confirmTransferAction = () => {
    if (!pendingAction) return
    updateTransferStatus(pendingAction.transferId, pendingAction.nextStatus)
    setPendingAction(null)
  }

  const renderTransferAction = (transfer: SettlementTransfer) => {
    const isSender = transfer.senderMemberId === summary.currentUserId
    const isReceiver = transfer.receiverMemberId === summary.currentUserId

    if (transfer.status === 'PENDING' && isSender) {
      return (
        <button
          type="button"
          onClick={() => setPendingAction({
            transferId: transfer.id,
            nextStatus: 'SENT',
            title: '송금을 완료했나요?',
            description: `${transfer.receiverName}님에게 ${formatWon(transfer.amount)}을 송금했는지 확인해 주세요.`,
            confirmLabel: '송금 완료',
          })}
          className="h-8 rounded-lg bg-neutral-950 px-3 !text-[11px] font-bold text-white active:bg-neutral-800"
        >
          송금 완료
        </button>
      )
    }

    if (transfer.status === 'SENT' && isReceiver) {
      return (
        <button
          type="button"
          onClick={() => setPendingAction({
            transferId: transfer.id,
            nextStatus: 'CONFIRMED',
            title: '입금을 확인했나요?',
            description: `${transfer.senderName}님에게서 ${formatWon(transfer.amount)}이 입금됐는지 확인해 주세요.`,
            confirmLabel: '입금 확인',
          })}
          className="h-8 rounded-lg border border-neutral-900 bg-white px-3 !text-[11px] font-bold text-neutral-900 active:bg-neutral-50"
        >
          입금 확인
        </button>
      )
    }

    if (transfer.status === 'SENT' && isSender) {
      return <span className="text-[10px] font-medium text-neutral-400">입금 확인 대기</span>
    }

    if (transfer.status === 'PENDING' && isReceiver) {
      return <span className="text-[10px] font-medium text-neutral-400">송금 대기</span>
    }

    if (transfer.status === 'CONFIRMED') {
      return <span className="text-[10px] font-semibold text-emerald-700">확인 완료</span>
    }

    return <span className="text-[10px] font-medium text-neutral-400">진행 중</span>
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-neutral-50">
      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-neutral-400">총 정산 금액</p>
          <strong className="mt-2 block text-[30px] font-black tracking-tight">
            {formatWon(summary.totalAmount)} · {summary.transferCount}건
          </strong>
          <p className="mt-2 text-xs text-neutral-400">
            송금 {completedCount}/{transfers.length}건 완료
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between px-0.5">
            <h2 className="text-xs font-semibold text-neutral-400">송금 내역</h2>
            <span className="text-[11px] font-medium text-neutral-400">상태를 확인해 주세요</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {transfers.map((transfer) => (
              <article
                key={transfer.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold">
                    {transfer.senderName} → {transfer.receiverName}
                  </p>
                  <span className="mt-1 block text-[11px] text-neutral-400">송금 요청</span>
                </div>
                <div className="shrink-0 text-right">
                  <strong className="block text-[14px]">{formatWon(transfer.amount)}</strong>
                </div>
                <div className="flex w-full items-center justify-between border-t border-neutral-100 pt-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                      transfer.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : transfer.status === 'SENT'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {statusLabel[transfer.status]}
                  </span>
                  {renderTransferAction(transfer)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-4 text-left"
            onClick={() => setShowBreakdown((current) => !current)}
            aria-expanded={showBreakdown}
          >
            <span>
              <strong className="block text-[14px]">참여자별 정산 내역</strong>
              <small className="mt-1 block text-[11px] text-neutral-400">결제액과 최종 부담액</small>
            </span>
            <span className="text-sm text-neutral-400" aria-hidden="true">{showBreakdown ? '⌃' : '⌄'}</span>
          </button>

          {showBreakdown ? (
            <div className="border-t border-neutral-100">
              <div className="grid grid-cols-[1fr_repeat(3,minmax(0,1fr))] gap-2 bg-neutral-50 px-4 py-2 text-right text-[9px] font-semibold text-neutral-400">
                <span className="text-left">참여자</span><span>결제</span><span>부담</span><span>차액</span>
              </div>
              {summary.members.map((member) => (
                <div key={member.id} className="grid grid-cols-[1fr_repeat(3,minmax(0,1fr))] gap-2 border-t border-neutral-100 px-4 py-3 text-right text-[10px]">
                  <strong className="text-left text-[11px]">{member.name}</strong>
                  <span>{formatWon(member.paidAmount)}</span>
                  <span>{formatWon(member.shareAmount)}</span>
                  <strong className={member.balance >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                    {member.balance >= 0 ? '+' : '-'}{formatWon(Math.abs(member.balance))}
                  </strong>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      {summary.currentUserIsOwner ? (
        <BottomActionBar helperText={allTransfersConfirmed ? '모든 입금 확인이 완료되었습니다' : '모든 입금 확인 후 정산을 종료할 수 있습니다'}>
          <PrimaryButton
            type="button"
            disabled={!allTransfersConfirmed}
            onClick={() => setIsCompleteDialogOpen(true)}
          >
            정산 종료
          </PrimaryButton>
        </BottomActionBar>
      ) : null}

      {pendingAction ? (
        <SettlementActionDialog
          title={pendingAction.title}
          description={pendingAction.description}
          confirmLabel={pendingAction.confirmLabel}
          onCancel={() => setPendingAction(null)}
          onConfirm={confirmTransferAction}
        />
      ) : null}

      {isCompleteDialogOpen ? (
        <SettlementActionDialog
          title="정산을 종료할까요?"
          description="모든 송금과 입금 확인이 완료되었습니다. 종료한 정산은 다시 진행 상태로 되돌릴 수 없습니다."
          confirmLabel="정산 종료"
          isDangerous
          onCancel={() => setIsCompleteDialogOpen(false)}
          onConfirm={onComplete}
        />
      ) : null}
    </div>
  )
}
