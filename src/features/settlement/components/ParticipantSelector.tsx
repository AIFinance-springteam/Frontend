import { ParticipantAvatar } from '../../../shared/components/ParticipantAvatar'
import type { Participant } from '../../../shared/types/participant'
import type { SplitItem } from '../types/settlement'

type ParticipantSelectorProps = {
  item: SplitItem
  participants: Participant[]
  onToggle: (participantId: string) => void
}

export function ParticipantSelector({ item, participants, onToggle }: ParticipantSelectorProps) {
  return (
    <div className="flex items-center gap-2.5">
      {participants.map((participant) => (
        <button
          key={participant.id}
          type="button"
          onClick={() => onToggle(participant.id)}
          className="rounded-full active:scale-95"
          aria-label={`${participant.name} 선택`}
        >
          <ParticipantAvatar
            participant={participant}
            isSelected={item.selectedIds.includes(participant.id)}
            isMuted={item.selectedIds.length === 0}
          />
        </button>
      ))}
    </div>
  )
}
