import { useState, type FormEvent, type ReactNode } from 'react'

type AdditionalCostPanelProps = {
  onAdd: (name: string, amount: number) => void
  children?: ReactNode
}

export function AdditionalCostPanel({ onAdd, children }: AdditionalCostPanelProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedAmount = Number(amount)
    if (!name.trim() || parsedAmount <= 0) return

    onAdd(name.trim(), parsedAmount)
    setName('')
    setAmount('')
    setIsAdding(false)
  }

  return (
    <section className="rounded-2xl border border-neutral-300 bg-neutral-100 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[13px] font-bold text-neutral-500">배달비·봉사료</h2>
          <p className="mt-1 text-[10px] leading-4 text-neutral-400">
            별도 항목으로 추가한 뒤 부담자를 지정해 주세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding((current) => !current)}
          className="shrink-0 rounded-full border border-neutral-700 bg-white px-3 py-1 text-[10px] font-bold text-neutral-800"
        >
          {isAdding ? '닫기' : '추가'}
        </button>
      </div>

      {children ? <div className="mt-3 flex flex-col gap-2.5">{children}</div> : null}

      {isAdding ? (
        <form className="mt-3 rounded-xl border border-neutral-200 bg-white p-3" onSubmit={handleAdd}>
          <div className="grid grid-cols-[minmax(0,1fr)_110px] gap-2">
            <label>
              <span className="sr-only">추가 비용 이름</span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="예: 배달비"
                className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-[12px] outline-none focus:border-neutral-500"
              />
            </label>
            <label className="relative">
              <span className="sr-only">추가 비용 금액</span>
              <input
                required
                min="1"
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="금액"
                className="h-10 w-full rounded-lg border border-neutral-200 px-3 pr-7 text-right text-[12px] outline-none focus:border-neutral-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">원</span>
            </label>
          </div>
          <button type="submit" className="mt-2 h-9 w-full rounded-lg bg-neutral-900 text-[11px] font-bold text-white">
            추가하기
          </button>
        </form>
      ) : null}
    </section>
  )
}
