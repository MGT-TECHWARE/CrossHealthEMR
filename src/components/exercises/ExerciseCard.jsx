import { useState } from 'react'
import { Dumbbell, Loader2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { getExerciseImageUrl } from '@/utils/exerciseImage'
import { generateAndSaveExerciseImage } from '@/services/geminiImage.service'

const difficultyVariant = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
}

const difficultyLabel = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export default function ExerciseCard({ exercise, onClick, onImageGenerated }) {
  const [generating, setGenerating] = useState(false)
  const [localImageUrl, setLocalImageUrl] = useState(null)

  const imageUrl = localImageUrl || getExerciseImageUrl(exercise)

  const handleGenerateImage = async (e) => {
    e.stopPropagation()
    setGenerating(true)
    try {
      const url = await generateAndSaveExerciseImage(exercise)
      setLocalImageUrl(url)
      onImageGenerated?.(exercise.id, url)
    } catch (err) {
      console.error('Image generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div
      className="group cursor-pointer rounded-2xl border border-border/50 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
      onClick={() => onClick?.(exercise)}
    >
      {/* Image area */}
      <div className="relative aspect-square bg-gradient-to-br from-secondary to-background overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={exercise.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <div className="rounded-2xl bg-primary/5 p-4">
              <Dumbbell className="h-10 w-10 text-primary/30" />
            </div>
            {!generating && (
              <button
                onClick={handleGenerateImage}
                className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium font-sans text-primary hover:bg-primary/20 transition-colors"
              >
                Generate Image
              </button>
            )}
          </div>
        )}

        {generating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="mt-2 text-xs font-sans font-medium text-primary">Generating...</p>
          </div>
        )}

        {/* Difficulty badge overlay */}
        {exercise.difficulty && (
          <div className="absolute top-3 right-3">
            <Badge variant={difficultyVariant[exercise.difficulty] || 'default'} className="shadow-sm backdrop-blur-sm text-[11px] font-semibold">
              {difficultyLabel[exercise.difficulty] || exercise.difficulty}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="text-[15px] font-semibold font-sans text-foreground tracking-tight leading-snug line-clamp-2">
          {exercise.name}
        </h4>

        {exercise.body_part && exercise.body_part.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {exercise.body_part.map((part) => (
              <span key={part} className="text-[11px] font-medium font-sans text-muted-foreground bg-secondary/80 rounded-md px-2 py-0.5">
                {part}
              </span>
            ))}
          </div>
        )}

        {(exercise.sets || exercise.reps) && (
          <p className="mt-2.5 text-xs font-sans text-muted-foreground tracking-wide">
            {exercise.sets && <span className="font-semibold text-foreground/70">{exercise.sets}</span>}
            {exercise.sets && <span> sets</span>}
            {exercise.sets && exercise.reps && <span className="text-border mx-1.5">/</span>}
            {exercise.reps && <span className="font-semibold text-foreground/70">{exercise.reps}</span>}
            {exercise.reps && <span> reps</span>}
          </p>
        )}
      </div>
    </div>
  )
}
