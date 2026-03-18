import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function Card({ children, className, ...rest }) {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-border/60 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md',
          className
        )
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
