import { X } from 'lucide-react'
import { clsx } from 'clsx'

const typeStyles = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
}

export default function Toast({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg',
            typeStyles[toast.type] || typeStyles.info
          )}
        >
          <span>{toast.message}</span>
          {onDismiss && (
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded p-0.5 transition-colors hover:bg-white/20"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
