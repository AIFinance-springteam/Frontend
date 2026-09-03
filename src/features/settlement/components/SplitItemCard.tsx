import { useMemo } from 'react'
import { formatWon } from '../../../shared/utils/formatCurrency'
import type { Participant } from '../../../shared/types/participant'
import type { SplitItem, SplitMode } from '../types/settlement'
import { ParticipantSelector } from './ParticipantSelector'
import { RemainderPayerBox } from './RemainderPayerBox'
import { SplitModeToggle } from './SplitModeToggle'

type SplitItemCardProps = {
  item: SplitItem
  participants: Participant[]
  isRemainderOpen: boolean
  onCloseRemainder: () => void
  onOpenRemainder: () => void
  onUpdate: (updater: (item: SplitItem) => SplitItem) => void
}

export function SplitItemCard({
  item,
  participants,
  isRemainderOpen,
  onCloseRemainder,
  onOpenRemainder,
  onUpdate,
}: SplitItemCardProps) {
  const selectedCount = item.selectedIds.length
  const perPersonAmount = selectedCount ? Math.floor(item.amount / selectedCount) : 0
  const remainder = selectedCount ? item.amount % selectedCount : 0
  const selectedPerson = participants.find((participant) => participant.id === item.selectedIds[0])

  const splitSummary = useMemo(() => {
    if (selectedCount === 0) return ''
    if (item.mode === 'personal') return `${selectedPerson?.name ?? ''} ${formatWon(item.amount)}`

    return `1인 ${formatWon(perPersonAmount)}`
  }, [item.amount, item.mode, perPersonAmount, selectedCount, selectedPerson?.name])

  const handleModeChange = (mode: SplitMode) => {
    onUpdate((current) => ({
      ...current,
      mode,
      selectedIds: mode === 'personal' ? current.selectedIds.slice(0, 1) : current.selectedIds,
      remainderPayerId: undefined,
    }))
  }

  const handleParticipantToggle = (participantId: string) => {
    onUpdate((current) => {
      if (current.mode === 'personal') {
        return { ...current, selectedIds: [participantId], remainderPayerId: undefined }
      }

      const selectedIds = current.selectedIds.includes(participantId)
        ? current.selectedIds.filter((id) => id !== participantId)
        : [...current.selectedIds, participantId]

      return {
        ...current,
        selectedIds,
        remainderPayerId: selectedIds.includes(current.remainderPayerId ?? '')
          ? current.remainderPayerId
          : selectedIds.at(-1),
      }
    })
  }

  return (
    <article className="relative rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h2 className="truncate text-[15px] font-bold">{item.name}</h2>
        <strong className="shrink-0 text-[15px] font-bold">{formatWon(item.amount)}</strong>
      </div>

      {selectedCount === 0 ? (
        <div className="flex min-h-16 items-end justify-between gap-3">
          <ParticipantSelector item={item} participants={participants} onToggle={handleParticipantToggle} />
          <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-bold text-white">미지정</span>
        </div>
      ) : (
        <>
          <SplitModeToggle value={item.mode} onChange={handleModeChange} />
          <div className="mt-3.5 flex items-center justify-between gap-3">
            <ParticipantSelector item={item} participants={participants} onToggle={handleParticipantToggle} />
            <strong className="shrink-0 text-[15px] font-bold">{splitSummary}</strong>
          </div>
        </>
      )}

      {item.mode === 'equal' && remainder > 0 && selectedCount > 0 ? (
        <RemainderPayerBox
          remainder={remainder}
          selectedIds={item.selectedIds}
          participants={participants}
          payerId={item.remainderPayerId}
          isOpen={isRemainderOpen}
          onOpen={onOpenRemainder}
          onClose={onCloseRemainder}
          onChange={(participantId) => onUpdate((current) => ({ ...current, remainderPayerId: participantId }))}
        />
      ) : null}
    </article>
  )
}
