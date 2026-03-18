import ExerciseMatchCard from '@/components/exercises/ExerciseMatchCard'

export default function ExerciseMatchList({
  matches,
  onApprove,
  onReject,
  onSwap,
}) {
  if (!matches || matches.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No matched exercises to display.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <ExerciseMatchCard
          key={match.exercise.id}
          exercise={match.exercise}
          matchData={match.matchData}
          onApprove={onApprove}
          onReject={onReject}
          onSwap={onSwap}
        />
      ))}
    </div>
  )
}
