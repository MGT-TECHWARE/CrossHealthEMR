import { Loader2, Check, AlertCircle } from 'lucide-react'

const statusConfig = {
  saving: {
    icon: Loader2,
    text: 'Saving...',
    className: 'text-blue-600',
    animate: true,
  },
  saved: {
    icon: Check,
    text: 'Saved',
    className: 'text-green-600',
    animate: false,
  },
  error: {
    icon: AlertCircle,
    text: 'Error saving',
    className: 'text-red-600',
    animate: false,
  },
  idle: {
    icon: null,
    text: '',
    className: 'text-gray-400',
    animate: false,
  },
}

export default function NoteStatusBar({ status = 'idle' }) {
  const config = statusConfig[status]

  if (status === 'idle' || !config) return null

  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 text-sm ${config.className}`}>
      {Icon && (
        <Icon
          className={`h-4 w-4 ${config.animate ? 'animate-spin' : ''}`}
        />
      )}
      <span>{config.text}</span>
    </div>
  )
}
