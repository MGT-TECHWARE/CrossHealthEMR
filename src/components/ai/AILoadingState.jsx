import { Brain } from 'lucide-react'

export default function AILoadingState() {
  return (
    <div className="space-y-4 py-8">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
          <Brain className="h-6 w-6 animate-pulse text-purple-600" />
        </div>
        <p className="text-sm font-medium text-gray-600">
          AI is analyzing session notes...
        </p>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-3/4 rounded bg-gray-100" />
              <div className="flex gap-2 pt-1">
                <div className="h-7 w-20 rounded bg-gray-100" />
                <div className="h-7 w-20 rounded bg-gray-100" />
                <div className="h-7 w-16 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
