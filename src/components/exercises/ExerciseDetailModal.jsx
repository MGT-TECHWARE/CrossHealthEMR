import { useState } from 'react'
import { ExternalLink, Dumbbell, Loader2, ImagePlus } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { getExerciseImageUrl } from '@/utils/exerciseImage'
import { generateAndSaveExerciseImage } from '@/services/geminiImage.service'

const difficultyVariant = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
}

export default function ExerciseDetailModal({ exercise, open, onOpenChange }) {
  const [generating, setGenerating] = useState(false)
  const [localImageUrl, setLocalImageUrl] = useState(null)

  if (!exercise) return null

  const imageUrl = localImageUrl || getExerciseImageUrl(exercise)

  const handleGenerateImage = async () => {
    setGenerating(true)
    try {
      const url = await generateAndSaveExerciseImage(exercise)
      setLocalImageUrl(url)
    } catch (err) {
      console.error('Image generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={(o) => { if (!o) setLocalImageUrl(null); onOpenChange(o) }} title={exercise.name}>
      <div className="space-y-5">
        {/* Image */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-secondary to-background">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={exercise.name}
              className="w-full aspect-[4/3] object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center aspect-[4/3]">
              <Dumbbell className="h-12 w-12 text-primary/20 mb-3" />
              <button
                onClick={handleGenerateImage}
                disabled={generating}
                className="flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-sans font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          )}
          {generating && imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {exercise.difficulty && (
            <Badge variant={difficultyVariant[exercise.difficulty] || 'default'}>
              {exercise.difficulty}
            </Badge>
          )}
          {exercise.body_part?.map((part) => (
            <Badge key={part} variant="outline">
              {part}
            </Badge>
          ))}
        </div>

        {/* Description */}
        {exercise.description && (
          <div>
            <h4 className="mb-1.5 text-xs font-semibold font-sans uppercase tracking-wider text-muted-foreground">
              Description
            </h4>
            <p className="text-sm font-sans text-foreground/80 leading-relaxed">{exercise.description}</p>
          </div>
        )}

        {/* Instructions */}
        {exercise.instructions && (
          <div>
            <h4 className="mb-1.5 text-xs font-semibold font-sans uppercase tracking-wider text-muted-foreground">
              Instructions
            </h4>
            <p className="whitespace-pre-line text-sm font-sans text-foreground/80 leading-relaxed">
              {exercise.instructions}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {exercise.sets && (
            <div className="rounded-xl bg-secondary/60 p-3 text-center">
              <p className="text-[11px] font-medium font-sans uppercase tracking-wider text-muted-foreground">Sets</p>
              <p className="text-lg font-bold font-sans text-foreground mt-0.5">{exercise.sets}</p>
            </div>
          )}
          {exercise.reps && (
            <div className="rounded-xl bg-secondary/60 p-3 text-center">
              <p className="text-[11px] font-medium font-sans uppercase tracking-wider text-muted-foreground">Reps</p>
              <p className="text-lg font-bold font-sans text-foreground mt-0.5">{exercise.reps}</p>
            </div>
          )}
          {exercise.equipment?.length > 0 && (
            <div className="rounded-xl bg-secondary/60 p-3 text-center">
              <p className="text-[11px] font-medium font-sans uppercase tracking-wider text-muted-foreground">Equipment</p>
              <p className="text-sm font-semibold font-sans text-foreground mt-0.5 truncate">
                {Array.isArray(exercise.equipment) ? exercise.equipment.join(', ') : exercise.equipment}
              </p>
            </div>
          )}
        </div>

        {/* Video link */}
        {exercise.video_url && (
          <a
            href={exercise.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2.5 text-sm font-medium font-sans text-primary hover:bg-primary/10 transition-colors"
          >
            <Dumbbell className="h-4 w-4" />
            Watch Video
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </Modal>
  )
}
