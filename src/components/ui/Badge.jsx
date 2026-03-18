import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const variants = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  destructive: 'bg-red-50 text-red-700',
  outline: 'border border-border bg-transparent text-foreground/70',
  gold: 'bg-gold-light text-walnut',
}

export default function Badge({
  variant = 'default',
  children,
  className,
}) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-sans',
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  )
}
