import { Check, X, ArrowLeftRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import AIMatchReasonBadge from '@/components/ai/AIMatchReasonBadge'

const priorityVariant = {
  high: 'destructive',
  medium: 'warning',
  low: 'default',
}

export default function ExerciseMatchCard({
  exercise,
  matchData,
  onApprove,
  onReject,
  onSwap,
}) {
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
          {matchData.suggested_sets && matchData.suggested_reps && (
            <p className="text-sm text-gray-500">
              {matchData.suggested_sets} sets x {matchData.suggested_reps} reps
            </p>
          )}
        </div>
        {matchData.priority && (
          <Badge variant={priorityVariant[matchData.priority] || 'default'}>
            {matchData.priority} priority
          </Badge>
        )}
      </div>

      {matchData.reason && <AIMatchReasonBadge reason={matchData.reason} />}

      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
        <Button
          size="sm"
          variant="ghost"
          className="text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={() => onApprove?.(exercise)}
        >
          <Check className="mr-1 h-4 w-4" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onReject?.(exercise)}
        >
          <X className="mr-1 h-4 w-4" />
          Reject
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => onSwap?.(exercise)}
        >
          <ArrowLeftRight className="mr-1 h-4 w-4" />
          Swap
        </Button>
      </div>
    </Card>
  )
}
