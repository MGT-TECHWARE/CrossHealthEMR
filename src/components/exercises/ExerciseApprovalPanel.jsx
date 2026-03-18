import { useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import Button from '@/components/ui/Button'
import ExerciseMatchList from '@/components/exercises/ExerciseMatchList'

export default function ExerciseApprovalPanel({ matches, onComplete }) {
  const [decisions, setDecisions] = useState({})

  const handleApprove = (exercise) => {
    setDecisions((prev) => ({ ...prev, [exercise.id]: 'approved' }))
  }

  const handleReject = (exercise) => {
    setDecisions((prev) => ({ ...prev, [exercise.id]: 'rejected' }))
  }

  const handleSwap = (exercise) => {
    setDecisions((prev) => ({ ...prev, [exercise.id]: 'swapped' }))
  }

  const totalMatches = matches?.length || 0
  const totalDecisions = Object.keys(decisions).length
  const allDecided = totalMatches > 0 && totalDecisions >= totalMatches

  const approvedExercises = matches
    ?.filter((match) => decisions[match.exercise.id] === 'approved')
    .map((match) => ({
      ...match.exercise,
      matchData: match.matchData,
    })) || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Review AI Matches
        </h3>
        <span className="text-sm text-gray-500">
          {totalDecisions} / {totalMatches} reviewed
        </span>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: totalMatches > 0
              ? `${(totalDecisions / totalMatches) * 100}%`
              : '0%',
          }}
        />
      </div>

      <ExerciseMatchList
        matches={matches}
        onApprove={handleApprove}
        onReject={handleReject}
        onSwap={handleSwap}
      />

      {allDecided && (
        <div className="pt-2">
          <Button onClick={() => onComplete?.(approvedExercises)}>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Build Plan ({approvedExercises.length} exercises)
          </Button>
        </div>
      )}
    </div>
  )
}
