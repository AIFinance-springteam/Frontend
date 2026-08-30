import { ParticipantAvatar } from '../../../shared/components/ParticipantAvatar'
import type { Participant } from '../../../shared/types/participant'
import { formatWon } from '../../../shared/utils/formatCurrency'

type RemainderPayerBoxProps = {
  remainder: number
  selectedIds: string[]
  participants: Participant[]
  payerId?: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onChange: (participantId: string) => void
}

export function RemainderPayerBox({
  remainder,
  selectedIds,
  participants,
  payerId,
  isOpen,
  onOpen,
  onClose,
  onChange,
}: RemainderPayerBoxProps) {
  const payer = participants.find((participant) => participant.id === payerId)
  const availableParticipants = participants.filter((participant) => selectedIds.includes(participant.id))

  return (
    <div className="relative mt-3.5 flex items-center justify-between gap-3 rounded-xl bg-neutral-100 px-3.5 py-3 text-[11px] text-neutral-600">
      <span className="min-w-0 truncate">
        잔액 {formatWon(remainder)} 부담자 <b className="text-neutral-950">{payer?.name ?? '선택 필요'}</b>
      </span>
      <button type="button" onClick={onOpen} className="shrink-0 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-neutral-500">
        변경
      </button>
      {isOpen ? (
        <div className="absolute right-2 top-12 z-10 w-36 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
          {availableParticipants.map((participant) => (
            <button
              key={participant.id}
              type="button"
              onClick={() => {
                onChange(participant.id)
                onClose()
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium hover:bg-neutral-100"
            >
              <ParticipantAvatar participant={participant} isSelected size="sm" />
              {participant.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
