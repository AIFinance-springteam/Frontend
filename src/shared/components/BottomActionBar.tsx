import type { ReactNode } from 'react'

type BottomActionBarProps = {
  children: ReactNode
  helperText?: string
}

export function BottomActionBar({ children, helperText }: BottomActionBarProps) {
  return (
    <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-5 pb-5 pt-3">
      {helperText ? <p className="mb-3 h-4 text-center text-[11px] font-medium text-neutral-400">{helperText}</p> : null}
      {children}
    </footer>
  )
}
