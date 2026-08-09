import type { ReactNode } from 'react'

type MobileShellProps = {
  children: ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <div className="mx-auto min-h-screen w-full max-w-md bg-white">{children}</div>
    </main>
  )
}
