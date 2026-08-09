type MobileHeaderProps = {
  title: string
  subtitle?: string
  onBack?: () => void
}

export function MobileHeader({ title, subtitle, onBack }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-neutral-100 bg-white/95 px-4 backdrop-blur">
      <button
        type="button"
        onClick={onBack}
        className="grid size-9 place-items-center rounded-full text-xl text-neutral-500 active:bg-neutral-100"
        aria-label="뒤로가기"
      >
        ←
      </button>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <h1 className="truncate text-[17px] font-bold tracking-normal">{title}</h1>
        {subtitle ? <span className="shrink-0 text-xs font-medium text-neutral-400">{subtitle}</span> : null}
      </div>
      <button type="button" className="grid size-9 place-items-center rounded-full text-neutral-400 active:bg-neutral-100" aria-label="메뉴">
        ⋯
      </button>
    </header>
  )
}
