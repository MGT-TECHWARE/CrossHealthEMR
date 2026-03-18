import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AIErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 px-6 py-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>

      <div className="text-center">
        <h4 className="font-semibold text-red-800">AI Matching Failed</h4>
        <p className="mt-1 max-w-sm text-sm text-red-600">
          {error?.message || error || 'An unexpected error occurred while matching exercises.'}
        </p>
      </div>

      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
