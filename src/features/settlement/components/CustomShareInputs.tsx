import { useState } from 'react'
import type { Participant } from '../../../shared/types/participant'

type CustomShareInputsProps = {
  amount: number
  selectedIds: string[]
  participants: Participant[]
  onSubmit: (shares: { participantId: string; amount: number }[]) => void
}

export function CustomShareInputs({ amount, selectedIds, participants, onSubmit }: CustomShareInputsProps) {
  const [values, setValues] = useState<Record<string, string>>({})

  const total = selectedIds.reduce((sum, id) => sum + Number(values[id] || 0), 0)
  const isValid = total === amount

  return (
    <div className="mt-3.5 flex flex-col gap-2 rounded-xl bg-neutral-100 p-3">
      {selectedIds.map((id) => {
        const person = participants.find((p) => p.id === id)
        return (
          <div key={id} className="flex items-center justify-between gap-2 text-xs">
            <span>{person?.name}</span>
            <input
              type="number"
              value={values[id] ?? ''}
              onChange={(e) => setValues((prev) => ({ ...prev, [id]: e.target.value }))}
              className="w-24 rounded-md border border-neutral-200 px-2 py-1 text-right"
            />
          </div>
        )
      })}
      <div className="flex items-center justify-between text-[11px] text-neutral-500">
        <span>{isValid ? '합계 일치' : `${amount - total}원 남음`}</span>
        <button
          type="button"
          disabled={!isValid}
          onClick={() => onSubmit(selectedIds.map((id) => ({ participantId: id, amount: Number(values[id] || 0) })))}
          className="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-bold text-white disabled:opacity-30"
        >
          적용
        </button>
      </div>
    </div>
  )
}