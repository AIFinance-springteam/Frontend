import type { SplitMode } from '../types/settlement'
import { cn } from '../../../shared/utils/cn'

type SplitModeToggleProps = {
  value: SplitMode
  onChange: (value: SplitMode) => void
}

export function SplitModeToggle({ value, onChange }: SplitModeToggleProps) {
  return (
    <div className="grid h-9 grid-cols-2 overflow-hidden rounded-lg bg-neutral-100 p-0.5">
      {(['equal', 'personal'] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={cn(
            'rounded-md text-xs font-bold transition-colors',
            value === mode && 'bg-neutral-950 text-white shadow-sm',
            value !== mode && 'text-neutral-400',
          )}
        >
          {mode === 'equal' ? '균등' : '개인'}
        </button>
      ))}
    </div>
  )
}
