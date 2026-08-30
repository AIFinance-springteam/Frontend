import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({ className, ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'h-13 w-full rounded-xl text-[15px] font-bold shadow-sm',
        'bg-neutral-950 text-white active:bg-neutral-800',
        'disabled:bg-neutral-100 disabled:text-neutral-300 disabled:shadow-none',
        className,
      )}
    />
  )
}
