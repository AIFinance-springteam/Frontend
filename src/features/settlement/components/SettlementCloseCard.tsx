import { useState } from 'react'

type SettlementCloseCardProps = {
  unassignedCount: number
  isOwner: boolean
  onConfirm: () => void
}

export function SettlementCloseCard({
  unassignedCount,
  isOwner,
  onConfirm,
}: SettlementCloseCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const canClose = unassignedCount === 0

  if (!isOwner) return null

  return (
    <>
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-bold">정산 마감</h2>
            <p className="mt-1 text-[11px] leading-4 text-neutral-400">
              모든 비용의 부담자를 확인한 뒤 정산을 확정해 주세요.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[9px] font-bold text-neutral-500">
            방장
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-4 h-10 w-full rounded-xl border border-neutral-900 bg-white !text-[12px] font-bold text-neutral-900 active:bg-neutral-50"
        >
          정산 마감 점검
        </button>
      </section>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-4 sm:items-center"
          role="presentation"
          onMouseDown={() => setIsOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="settlement-close-title"
            className="mb-3 w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:mb-0"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="settlement-close-title" className="text-[17px] font-bold">
                  {canClose ? '정산을 마감할까요?' : '아직 정산을 마감할 수 없어요'}
                </h2>
                <p className="mt-2 text-[12px] leading-5 text-neutral-500">
                  {canClose
                    ? '확정하면 현재 비용 분담을 기준으로 송금 내역이 생성됩니다.'
                    : '마감 전에 아래 항목을 먼저 처리해 주세요.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-100 !text-[16px] text-neutral-500"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            {canClose ? (
              <div className="mt-4 rounded-xl bg-neutral-50 p-4">
                <strong className="block text-[12px]">확정 전 확인</strong>
                <ul className="mt-2 space-y-1.5 pl-4 text-[11px] leading-4 text-neutral-500">
                  <li className="list-disc">모든 상품의 부담자 지정이 완료되었습니다.</li>
                  <li className="list-disc">확정 후에는 비용 분담을 수정할 수 없습니다.</li>
                </ul>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                <span className="text-[12px] font-semibold text-rose-700">부담자 미지정</span>
                <strong className="text-[12px] text-rose-700">{unassignedCount}건</strong>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-11 flex-1 rounded-xl border border-neutral-200 bg-white !text-[12px] font-bold text-neutral-600"
              >
                {canClose ? '취소' : '확인'}
              </button>
              {canClose ? (
                <button
                  type="button"
                  onClick={onConfirm}
                  className="h-11 flex-1 rounded-xl bg-neutral-950 !text-[12px] font-bold text-white active:bg-neutral-800"
                >
                  정산 확정
                </button>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
