import { ChevronUp, ChevronDown, Send } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function ExercisePlanBuilder({
  approvedExercises,
  onReorder,
  onSendToPatient,
}) {
  const handleMoveUp = (index) => {
    if (index === 0) return
    const updated = [...approvedExercises]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onReorder?.(updated)
  }

  const handleMoveDown = (index) => {
    if (index === approvedExercises.length - 1) return
    const updated = [...approvedExercises]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onReorder?.(updated)
  }

  if (!approvedExercises || approvedExercises.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No exercises in the plan yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Exercise Plan</h3>

      <div className="space-y-2">
        {approvedExercises.map((exercise, index) => (
          <Card key={exercise.id} className="flex items-center gap-3 py-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {index + 1}
            </span>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{exercise.name}</p>
              {(exercise.sets || exercise.reps) && (
                <p className="text-sm text-gray-500">
                  {exercise.sets && `${exercise.sets} sets`}
                  {exercise.sets && exercise.reps && ' x '}
                  {exercise.reps && `${exercise.reps} reps`}
                </p>
              )}
            </div>

            {exercise.difficulty && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {exercise.difficulty}
              </Badge>
            )}

            <div className="flex flex-col">
              <button
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleMoveDown(index)}
                disabled={index === approvedExercises.length - 1}
                className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-2">
        <Button onClick={onSendToPatient}>
          <Send className="mr-2 h-4 w-4" />
          Send to Patient
        </Button>
      </div>
    </div>
  )
}
