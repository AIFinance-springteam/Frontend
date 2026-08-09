import { cn } from '../utils/cn'
import type { Participant } from '../types/participant'

type ParticipantAvatarProps = {
  participant: Participant
  isSelected: boolean
  isMuted?: boolean
  size?: 'sm' | 'md'
}

export function ParticipantAvatar({
  participant,
  isSelected,
  isMuted = false,
  size = 'md',
}: ParticipantAvatarProps) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full border font-bold transition-colors',
        size === 'sm' ? 'size-5 text-[10px]' : 'size-8 text-xs',
        isSelected && 'border-neutral-950 bg-neutral-950 text-white',
        !isSelected && isMuted && 'border-dashed border-neutral-200 bg-white text-neutral-300',
        !isSelected && !isMuted && 'border-dashed border-neutral-300 bg-white text-neutral-400',
      )}
    >
      {participant.avatar}
    </span>
  )
}
