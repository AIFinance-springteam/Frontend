type NeedActionBoxProps = {
  unassignedCount: number
  duplicateCount: number
  onUnassignedClick: () => void
}

export function NeedActionBox({ unassignedCount, duplicateCount, onUnassignedClick }: NeedActionBoxProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-sm">
      <p className="mb-2.5 text-[15px] font-bold">처리가 필요합니다</p>
      <button type="button" onClick={onUnassignedClick} className="flex w-full items-center justify-between rounded-lg py-1.5 text-[13px] active:bg-neutral-50">
        <span>부담자 미지정</span>
        <span className="font-medium text-neutral-500">{unassignedCount}건 ›</span>
      </button>
      <div className="flex items-center justify-between py-1.5 text-[13px]">
        <span>중복 의심</span>
        <span className="font-medium text-neutral-500">{duplicateCount}건 ›</span>
      </div>
    </section>
  )
}
