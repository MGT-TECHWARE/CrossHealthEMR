import { Search, SlidersHorizontal } from 'lucide-react'
import { BODY_PARTS } from '@/constants/bodyParts'

const selectClass =
  'appearance-none rounded-xl border border-border/60 bg-white px-4 py-2.5 text-sm font-sans text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15'

export default function ExerciseFilterBar({ onFilterChange, currentFilters }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...currentFilters, [key]: value })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={currentFilters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full rounded-xl border border-border/60 bg-white py-2.5 pl-10 pr-4 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground/50 hidden sm:block" />

        <select
          value={currentFilters.bodyPart || ''}
          onChange={(e) => handleChange('bodyPart', e.target.value)}
          className={selectClass}
        >
          <option value="">All Body Parts</option>
          {BODY_PARTS.map((part) => (
            <option key={part} value={part}>
              {part}
            </option>
          ))}
        </select>

        <select
          value={currentFilters.difficulty || ''}
          onChange={(e) => handleChange('difficulty', e.target.value)}
          className={selectClass}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
    </div>
  )
}
