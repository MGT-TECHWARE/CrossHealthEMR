import { useState } from 'react'
import { Brain } from 'lucide-react'

export default function AIMatchReasonBadge({ reason }) {
  const [showFull, setShowFull] = useState(false)

  if (!reason) return null

  const isLong = reason.length > 80
  const displayText = isLong && !showFull ? reason.slice(0, 80) + '...' : reason

  return (
    <div className="relative">
      <div
        className="inline-flex cursor-default items-start gap-1.5 rounded-md bg-purple-50 px-2.5 py-1.5 text-xs text-purple-700"
        onMouseEnter={() => setShowFull(true)}
        onMouseLeave={() => setShowFull(false)}
      >
        <Brain className="mt-0.5 h-3 w-3 shrink-0" />
        <span>{displayText}</span>
      </div>

      {isLong && showFull && (
        <div className="absolute left-0 top-full z-10 mt-1 max-w-sm rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg">
          <div className="mb-1 flex items-center gap-1 font-semibold text-purple-700">
            <Brain className="h-3 w-3" />
            AI Clinical Rationale
          </div>
          {reason}
        </div>
      )}
    </div>
  )
}
