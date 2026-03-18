import { Dumbbell } from 'lucide-react'
import Spinner from '@/components/ui/Spinner'
import ExerciseCard from '@/components/exercises/ExerciseCard'

export default function ExerciseGrid({ exercises, onExerciseClick, isLoading, onImageGenerated }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-sm font-sans text-muted-foreground">Loading exercises...</p>
      </div>
    )
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <div className="rounded-2xl bg-secondary p-5 mb-4">
          <Dumbbell className="h-10 w-10 text-border" />
        </div>
        <p className="text-sm font-sans font-medium text-foreground/60">No exercises found</p>
        <p className="mt-1 text-xs font-sans text-muted-foreground">
          Try adjusting your filters or search query
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onClick={onExerciseClick}
          onImageGenerated={onImageGenerated}
        />
      ))}
    </div>
  )
}
