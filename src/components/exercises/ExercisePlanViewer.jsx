import { Dumbbell } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function ExercisePlanViewer({ plan }) {
  if (!plan || !plan.exercises || plan.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Dumbbell className="mb-3 h-10 w-10" />
        <p className="text-sm font-medium">No exercise plan available</p>
      </div>
    )
  }

  const sortedExercises = [...plan.exercises].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Your Exercise Plan
      </h3>

      <div className="space-y-3">
        {sortedExercises.map((exercise, index) => (
          <Card key={exercise.id || index} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {index + 1}
              </span>
              <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
            </div>

            <div className="ml-10 space-y-1">
              {(exercise.sets || exercise.reps) && (
                <div className="flex gap-3">
                  {exercise.sets && (
                    <Badge variant="outline">{exercise.sets} sets</Badge>
                  )}
                  {exercise.reps && (
                    <Badge variant="outline">{exercise.reps} reps</Badge>
                  )}
                </div>
              )}

              {exercise.notes && (
                <p className="text-sm text-gray-600">{exercise.notes}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
