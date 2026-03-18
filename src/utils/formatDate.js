const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return dateFormatter.format(date)
}

export function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return timeFormatter.format(date)
}

export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return dateTimeFormatter.format(date)
}

export function getRelativeTime(dateStr) {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 0) {
    const absDiffMs = Math.abs(diffMs)
    const absDiffMinutes = Math.floor(absDiffMs / 1000 / 60)
    const absDiffHours = Math.floor(absDiffMinutes / 60)
    const absDiffDays = Math.floor(absDiffHours / 24)

    if (absDiffMinutes < 1) return 'in a few seconds'
    if (absDiffMinutes < 60) return `in ${absDiffMinutes} minute${absDiffMinutes === 1 ? '' : 's'}`
    if (absDiffHours < 24) return `in ${absDiffHours} hour${absDiffHours === 1 ? '' : 's'}`
    return `in ${absDiffDays} day${absDiffDays === 1 ? '' : 's'}`
  }

  if (diffSeconds < 60) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`
  return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`
}
