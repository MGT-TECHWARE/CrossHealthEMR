import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import useICD10Search from '@/hooks/useICD10Search'
import Badge from '@/components/ui/Badge'

export default function ICD10Search({ selected = [], onChange, label = 'Diagnosis Codes (ICD-10)', max = 8 }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { results, isLoading } = useICD10Search(query)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code) => {
    if (selected.find((s) => s.code === code.code)) return
    if (selected.length >= max) return
    onChange([...selected, code])
    setQuery('')
    setIsOpen(false)
  }

  const handleRemove = (code) => {
    onChange(selected.filter((s) => s.code !== code))
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
        {label}
      </label>

      {/* Selected codes */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((dx, i) => (
            <Badge
              key={dx.code}
              variant={i === 0 ? 'default' : 'outline'}
              className="gap-1"
            >
              <span className="font-mono text-[10px]">{dx.code}</span>
              <span className="text-[10px]">{dx.description?.slice(0, 30)}</span>
              <button
                type="button"
                onClick={() => handleRemove(dx.code)}
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search by code or description..."
          className="w-full rounded-lg border border-border bg-white pl-8 pr-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-white shadow-lg">
          {isLoading ? (
            <div className="px-3 py-2 text-xs font-sans text-muted-foreground">Searching...</div>
          ) : (
            results.map((code) => {
              const isSelected = selected.find((s) => s.code === code.code)
              return (
                <button
                  key={code.code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  disabled={isSelected}
                  className={`w-full text-left px-3 py-1.5 text-xs font-sans hover:bg-secondary/50 transition-colors flex items-center gap-2 ${
                    isSelected ? 'opacity-40' : ''
                  }`}
                >
                  <span className="font-mono font-medium text-primary shrink-0">{code.code}</span>
                  <span className="text-foreground/80 truncate">{code.description}</span>
                  {code.is_common_pt && (
                    <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1 rounded shrink-0">PT</span>
                  )}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
