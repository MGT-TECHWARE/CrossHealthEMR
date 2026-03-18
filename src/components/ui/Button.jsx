import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const variants = {
  default: 'bg-primary text-white hover:bg-primary-light focus-visible:ring-primary shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-[#ebe5dd] focus-visible:ring-primary/30',
  destructive: 'bg-destructive text-white hover:bg-[#9e3535] focus-visible:ring-destructive',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-secondary focus-visible:ring-primary/30',
  ghost: 'bg-transparent text-foreground hover:bg-secondary focus-visible:ring-primary/30',
  gold: 'bg-accent text-white hover:bg-[#b89559] focus-visible:ring-accent shadow-sm',
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

const Button = forwardRef(function Button(
  { variant = 'default', size = 'md', children, className, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-lg font-medium font-sans tracking-wide transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...rest}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
