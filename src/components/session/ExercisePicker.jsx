import { useState, useMemo } from 'react'
import { Search, Dumbbell, Check } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import useExerciseLibrary from '@/hooks/useExerciseLibrary'
import { getExerciseImageUrl } from '@/utils/exerciseImage'
import { BODY_PARTS } from '@/constants/bodyParts'

const selectClass = 'w-full rounded-xl border border-border/50 bg-white px-3 py-2 text-sm font-sans shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15'

const difficultyVariant = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
}

export default function ExercisePicker({ selectedExerciseIds, onAddExercise }) {
  const [filters, setFilters] = useState({ search: '', bodyPart: '', difficulty: '' })
  const { exercises, isLoading } = useExerciseLibrary({
    search: filters.search,
    bodyPart: filters.bodyPart,
    difficulty: filters.difficulty,
  })

  // Sort: checked exercises first, then unchecked
  const sorted = useMemo(() => {
    if (!exercises) return []
    return [...exercises].sort((a, b) => {
      const aSelected = selectedExerciseIds.has(a.id) ? 0 : 1
      const bSelected = selectedExerciseIds.has(b.id) ? 0 : 1
      if (aSelected !== bSelected) return aSelected - bSelected
      return a.name.localeCompare(b.name)
    })
  }, [exercises, selectedExerciseIds])

  const selectedCount = exercises?.filter((e) => selectedExerciseIds.has(e.id)).length || 0

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="w-full rounded-xl border border-border/50 bg-white pl-10 pr-4 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={filters.bodyPart}
          onChange={(e) => setFilters((f) => ({ ...f, bodyPart: e.target.value }))}
          className={selectClass}
        >
          <option value="">All Body Parts</option>
          {BODY_PARTS.map((bp) => (
            <option key={bp} value={bp}>{bp}</option>
          ))}
        </select>
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
          className={selectClass}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Selected count */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 px-1">
          <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary text-white text-[10px] font-bold font-sans px-1">{selectedCount}</span>
          <span className="text-xs font-sans text-muted-foreground">selected</span>
        </div>
      )}

      {/* Exercise list */}
      <div className="overflow-y-auto max-h-[calc(100vh-380px)] space-y-1.5 pr-1">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : sorted.length > 0 ? (
          sorted.map((exercise) => {
            const isSelected = selectedExerciseIds.has(exercise.id)
            return (
              <button
                key={exercise.id}
                type="button"
                onClick={() => onAddExercise(exercise)}
                className={`w-full flex items-center gap-3 rounded-xl border p-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border/40 bg-white hover:border-border hover:shadow-sm'
                }`}
              >
                {/* Checkbox */}
                <div className={`flex items-center justify-center h-5 w-5 rounded-md border-2 shrink-0 transition-colors ${
                  isSelected ? 'bg-primary border-primary' : 'border-border/60 bg-white'
                }`}>
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>

                {/* Thumbnail */}
                <div className="h-10 w-10 rounded-lg bg-secondary/60 overflow-hidden shrink-0">
                  {getExerciseImageUrl(exercise) ? (
                    <img
                      src={getExerciseImageUrl(exercise)}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Dumbbell className="h-4 w-4 text-primary/25" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium font-sans truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {exercise.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <Badge variant={difficultyVariant[exercise.difficulty] || 'default'} className="text-[10px] px-1.5 py-0">
                      {exercise.difficulty}
                    </Badge>
                    {exercise.body_part?.slice(0, 2).map((bp) => (
                      <Badge key={bp} variant="outline" className="text-[10px] px-1.5 py-0">
                        {bp}
                      </Badge>
                    ))}
                  </div>
                </div>
              </button>
            )
          })
        ) : (
          <div className="flex flex-col items-center py-8 text-muted-foreground">
            <Dumbbell className="h-8 w-8 text-border mb-2" />
            <p className="text-sm font-sans">No exercises found</p>
          </div>
        )}
      </div>
    </div>
  )
}
