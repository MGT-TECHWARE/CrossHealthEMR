import { useState, useEffect } from 'react'
import { Clock, Plus, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

// 8-minute rule for timed CPT codes
function calculateUnits(minutes) {
  if (minutes < 8) return 0
  if (minutes <= 22) return 1
  if (minutes <= 37) return 2
  if (minutes <= 52) return 3
  if (minutes <= 67) return 4
  return Math.ceil(minutes / 15)
}

export default function CPTTimeTracker({ cptCodes = [], timeIn, timeOut, data = [], onChange, onTimeChange }) {
  const [entries, setEntries] = useState(data.length > 0 ? data : [])

  useEffect(() => {
    onChange(entries)
  }, [entries])

  const addEntry = () => {
    setEntries((prev) => [...prev, { cpt_code: '', minutes: 15, notes: '' }])
  }

  const removeEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const updateEntry = (index, field, value) => {
    setEntries((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const timedEntries = entries.filter((e) => {
    const code = cptCodes.find((c) => c.code === e.cpt_code)
    return code?.is_timed
  })

  const totalTimedMinutes = timedEntries.reduce((sum, e) => sum + (e.minutes || 0), 0)
  const totalUnits = calculateUnits(totalTimedMinutes)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold font-sans text-foreground">CPT / Treatment Codes</h3>
        </div>
        <Button size="sm" variant="outline" className="gap-1" onClick={addEntry}>
          <Plus className="h-3.5 w-3.5" />
          Add Code
        </Button>
      </div>

      {/* Time In / Out */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">Time In</label>
          <input
            type="time"
            value={timeIn || ''}
            onChange={(e) => onTimeChange?.('time_in', e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">Time Out</label>
          <input
            type="time"
            value={timeOut || ''}
            onChange={(e) => onTimeChange?.('time_out', e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Entries */}
      {entries.map((entry, idx) => {
        const codeInfo = cptCodes.find((c) => c.code === entry.cpt_code)
        return (
          <div key={idx} className="flex items-start gap-2 p-2 rounded-lg border border-border/40 bg-secondary/10">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <select
                  value={entry.cpt_code}
                  onChange={(e) => updateEntry(idx, 'cpt_code', e.target.value)}
                  className="w-full rounded border border-border/50 bg-white px-2 py-1.5 text-xs font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="">Select CPT...</option>
                  {cptCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  value={entry.minutes || ''}
                  onChange={(e) => updateEntry(idx, 'minutes', Number(e.target.value))}
                  placeholder="Min"
                  min={0}
                  className="w-full rounded border border-border/50 bg-white px-2 py-1.5 text-xs font-sans text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                {codeInfo?.is_timed && entry.minutes > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {calculateUnits(entry.minutes)} unit(s)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={entry.notes || ''}
                  onChange={(e) => updateEntry(idx, 'notes', e.target.value)}
                  placeholder="Notes..."
                  className="w-full rounded border border-border/50 bg-white px-2 py-1.5 text-xs font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <button
                  onClick={() => removeEntry(idx)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Summary */}
      {entries.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
          <span className="text-xs font-medium font-sans text-primary">
            Total Timed: {totalTimedMinutes} min
          </span>
          <span className="text-xs font-bold font-sans text-primary">
            {totalUnits} billable unit(s)
          </span>
        </div>
      )}
    </div>
  )
}
