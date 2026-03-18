import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Input = forwardRef(function Input(
  { label, error, className, id, ...rest },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium font-sans text-foreground/80"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={twMerge(
          clsx(
            'w-full rounded-lg border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/30'
              : 'border-border focus:border-primary focus:ring-primary/20',
            className
          )
        )}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm font-sans text-destructive">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
