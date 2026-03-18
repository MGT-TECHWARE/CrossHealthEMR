import { MapPin } from 'lucide-react'
import { BODY_REGIONS } from '@/constants/bodyRegionTemplates'

export default function BodyRegionSelector({ selected = [], onChange }) {
  const handleToggle = (regionKey) => {
    if (selected.includes(regionKey)) {
      onChange(selected.filter((r) => r !== regionKey))
    } else {
      onChange([...selected, regionKey])
    }
  }

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium font-sans text-foreground/80">
        <MapPin className="h-4 w-4" />
        Body Regions
      </label>
      <div className="flex flex-wrap gap-2">
        {BODY_REGIONS.map((region) => {
          const isSelected = selected.includes(region.key)
          return (
            <button
              key={region.key}
              type="button"
              onClick={() => handleToggle(region.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium font-sans transition-colors ${
                isSelected
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-secondary text-foreground/70 hover:bg-secondary/80'
              }`}
            >
              {region.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
