import { useState, useMemo } from 'react'
import {
  ChevronUp,
  ChevronDown,
  X,
  Dumbbell,
  ArrowLeft,
  Save,
  CheckCircle,
  Clock,
  Calendar,
  AlertTriangle,
  List,
  LayoutGrid,
  Repeat,
  Maximize2,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'

// ─── Frequency helpers ───
const FREQUENCY_MAP = {
  '1x daily': { perWeek: 7, label: 'Daily' },
  '2x daily': { perWeek: 14, label: '2x Daily' },
  '3x daily': { perWeek: 21, label: '3x Daily' },
  '3x per week': { perWeek: 3, label: 'MWF' },
  '5x per week': { perWeek: 5, label: 'Weekdays' },
  'every other day': { perWeek: 4, label: 'Alt Days' },
  'as tolerated': { perWeek: 7, label: 'PRN' },
}

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function getScheduleDays(frequency) {
  switch (frequency) {
    case '3x per week': return [1, 3, 5] // Mon, Wed, Fri
    case '5x per week': return [1, 2, 3, 4, 5] // Weekdays
    case 'every other day': return [0, 2, 4, 6] // Sun, Tue, Thu, Sat
    default: return [0, 1, 2, 3, 4, 5, 6] // Daily
  }
}

// ─── Exercise Card ───
function ExerciseCard({ exercise, index, total, onMoveUp, onMoveDown, onRemove, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const freqInfo = FREQUENCY_MAP[exercise.frequency] || FREQUENCY_MAP['1x daily']

  return (
    <div className="border border-border/60 rounded-lg bg-white overflow-hidden">
      <div className="flex items-center gap-2 p-3">
        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-white text-xs font-bold font-sans shrink-0">
          {index + 1}
        </span>

        <button type="button" onClick={() => setExpanded(!expanded)} className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold font-sans text-foreground">{exercise.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-sans text-foreground/70">
              <Dumbbell className="h-3 w-3" />
              {exercise.sets}x{exercise.reps}
            </span>
            {exercise.hold_seconds > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-sans text-foreground/70">
                <Clock className="h-3 w-3" />{exercise.hold_seconds}s
              </span>
            )}
            <Badge variant="default" className="text-[10px] px-1.5 py-0 gap-0.5">
              <Repeat className="h-2.5 w-2.5" />{freqInfo.label}
            </Badge>
          </div>
        </button>

        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" disabled={index === 0} onClick={() => onMoveUp(index)} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
          <button type="button" disabled={index === total - 1} onClick={() => onMoveDown(index)} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
          <button type="button" onClick={() => onRemove(exercise.id)} className="p-1 text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
        </div>
      </div>

      {exercise.rationale && !expanded && (
        <div className="px-3 pb-2">
          <p className="text-[11px] font-sans text-muted-foreground italic line-clamp-1">{exercise.rationale}</p>
        </div>
      )}

      {expanded && (
        <div className="border-t border-border/40 px-3 py-3 space-y-3 bg-secondary/20">
          {exercise.rationale && (
            <div className="rounded-md bg-primary/5 px-3 py-2">
              <p className="text-xs font-sans text-primary/80 italic">{exercise.rationale}</p>
            </div>
          )}
          {exercise.description && <p className="text-xs font-sans text-muted-foreground">{exercise.description}</p>}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-sans text-muted-foreground uppercase tracking-wide">Sets</label>
              <input type="number" min="1" max="20" value={exercise.sets} onChange={(e) => onUpdate(index, { sets: parseInt(e.target.value) || 1 })} className="w-full rounded border border-border bg-white px-2 py-1 text-sm font-sans focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-sans text-muted-foreground uppercase tracking-wide">Reps</label>
              <input type="number" min="1" max="100" value={exercise.reps} onChange={(e) => onUpdate(index, { reps: parseInt(e.target.value) || 1 })} className="w-full rounded border border-border bg-white px-2 py-1 text-sm font-sans focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-sans text-muted-foreground uppercase tracking-wide">Hold (sec)</label>
              <input type="number" min="0" max="120" value={exercise.hold_seconds || 0} onChange={(e) => onUpdate(index, { hold_seconds: parseInt(e.target.value) || 0 })} className="w-full rounded border border-border bg-white px-2 py-1 text-sm font-sans focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-sans text-muted-foreground uppercase tracking-wide">Frequency</label>
            <select value={exercise.frequency || '1x daily'} onChange={(e) => onUpdate(index, { frequency: e.target.value })} className="w-full rounded border border-border bg-white px-2 py-1 text-sm font-sans focus:border-primary focus:outline-none">
              <option value="1x daily">1x daily</option>
              <option value="2x daily">2x daily</option>
              <option value="3x daily">3x daily</option>
              <option value="3x per week">3x per week</option>
              <option value="5x per week">5x per week</option>
              <option value="every other day">Every other day</option>
              <option value="as tolerated">As tolerated</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-sans text-muted-foreground uppercase tracking-wide">Special Instructions</label>
            <input type="text" placeholder="e.g., use red band, pain-free range only" value={exercise.exerciseNotes || ''} onChange={(e) => onUpdate(index, { exerciseNotes: e.target.value })} className="w-full rounded border border-border bg-white px-2 py-1 text-sm font-sans placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Calendar View ───
function CalendarView({ exercises }) {
  const today = new Date()
  const weeks = 4

  // Build 4 weeks of dates starting from today
  const dates = useMemo(() => {
    const start = new Date(today)
    start.setDate(start.getDate() - start.getDay()) // Start from Sunday
    const days = []
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }, [])

  // Group exercises by their schedule pattern
  const exercisesByDay = useMemo(() => {
    const map = {}
    dates.forEach((date) => {
      const dow = date.getDay()
      const key = date.toISOString().split('T')[0]
      map[key] = exercises.filter((ex) => {
        const scheduleDays = getScheduleDays(ex.frequency)
        return scheduleDays.includes(dow)
      })
    })
    return map
  }, [exercises, dates])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold font-sans text-foreground uppercase tracking-wide">
          4-Week Plan Overview
        </p>
        <p className="text-[10px] font-sans text-muted-foreground">
          {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {dates[dates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px">
        {DAY_NAMES_LETTER.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold font-sans text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid — 4 weeks */}
      {Array.from({ length: weeks }).map((_, weekIdx) => {
        const weekDates = dates.slice(weekIdx * 7, (weekIdx + 1) * 7)
        return (
          <div key={weekIdx} className="grid grid-cols-7 gap-px">
            {weekDates.map((date) => {
              const key = date.toISOString().split('T')[0]
              const dayExercises = exercisesByDay[key] || []
              const isToday = date.toDateString() === today.toDateString()
              const isPast = date < today && !isToday
              const hasExercises = dayExercises.length > 0

              return (
                <div
                  key={key}
                  className={`relative rounded-md p-1 min-h-[52px] border transition-colors ${
                    isToday
                      ? 'border-primary bg-primary/5'
                      : hasExercises
                        ? 'border-border/40 bg-white'
                        : 'border-border/20 bg-secondary/30'
                  } ${isPast ? 'opacity-50' : ''}`}
                >
                  <span className={`text-[10px] font-bold font-sans ${isToday ? 'text-primary' : 'text-foreground/60'}`}>
                    {date.getDate()}
                  </span>
                  {hasExercises && (
                    <div className="mt-0.5 space-y-px">
                      {dayExercises.slice(0, 3).map((ex, i) => (
                        <div key={i} className="rounded-sm bg-primary/10 px-0.5 py-px">
                          <p className="text-[7px] font-sans text-primary font-medium truncate leading-tight">{ex.name}</p>
                        </div>
                      ))}
                      {dayExercises.length > 3 && (
                        <p className="text-[7px] font-sans text-muted-foreground">+{dayExercises.length - 3}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-border/40">
        {exercises.map((ex, i) => {
          const freq = FREQUENCY_MAP[ex.frequency] || FREQUENCY_MAP['1x daily']
          return (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              <span className="text-[10px] font-sans text-foreground/70 truncate max-w-[100px]">{ex.name}</span>
              <span className="text-[9px] font-sans text-muted-foreground">({freq.label})</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main HEP Builder ───
export default function HEPBuilder({
  exercises,
  onReorder,
  onUpdateExercise,
  onRemoveExercise,
  onSaveAndComplete,
  onSaveDraft,
  saveStatus,
}) {
  const [view, setView] = useState('list') // 'list' | 'calendar'
  const [showFullCalendar, setShowFullCalendar] = useState(false)

  const handleMoveUp = (index) => {
    if (index === 0) return
    const newList = [...exercises]
    ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
    onReorder(newList)
  }

  const handleMoveDown = (index) => {
    if (index === exercises.length - 1) return
    const newList = [...exercises]
    ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
    onReorder(newList)
  }

  return (
    <div className="space-y-4">
      {/* View toggle */}
      {exercises.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-sans font-medium transition-colors ${
                view === 'list' ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-secondary'
              }`}
            >
              <List className="h-3 w-3" />
              Exercises
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-sans font-medium transition-colors ${
                view === 'calendar' ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-secondary'
              }`}
            >
              <LayoutGrid className="h-3 w-3" />
              Schedule
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-muted-foreground">{exercises.length} exercises</span>
            <button
              onClick={() => setShowFullCalendar(true)}
              title="Expand schedule view"
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Precautions */}
      {exercises.length > 0 && view === 'list' && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-primary" />
            <p className="text-[10px] font-semibold font-sans text-primary uppercase tracking-wide">Precautions</p>
          </div>
          <p className="text-[11px] font-sans text-foreground/70 leading-relaxed">
            Stop any exercise that causes sharp or increasing pain. Mild muscle soreness is normal.
            Apply ice 15-20 min after exercises if swelling occurs. Contact your therapist if symptoms worsen.
          </p>
        </div>
      )}

      {/* Content */}
      {exercises.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center">
          <Dumbbell className="h-10 w-10 text-border mx-auto mb-3" />
          <p className="text-sm font-semibold font-sans text-foreground mb-1">No exercises yet</p>
          <div className="flex items-center justify-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-sans text-muted-foreground">
              Check exercises in the library or use AI Suggest
            </p>
          </div>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-500px)] pr-1">
          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              total={exercises.length}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onRemove={onRemoveExercise}
              onUpdate={onUpdateExercise}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100vh-500px)] pr-1">
          <CalendarView exercises={exercises} />
        </div>
      )}

      {/* Summary */}
      {exercises.length > 0 && (
        <div className="flex items-center gap-4 text-[11px] font-sans text-muted-foreground border-t border-border/40 pt-2">
          <span>{exercises.reduce((a, e) => a + (e.sets || 0), 0)} total sets</span>
          <span>~{Math.round(exercises.length * 2.5)} min/session</span>
          <span>4 week plan</span>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 border-t border-border/40 pt-3">
        <Button className="w-full gap-2" onClick={onSaveAndComplete} disabled={saveStatus === 'saving'}>
          {saveStatus === 'saving' ? (
            <><Spinner size="sm" className="text-white" /> Completing...</>
          ) : saveStatus === 'saved' ? (
            <><CheckCircle className="h-4 w-4" /> Session Completed</>
          ) : (
            <><CheckCircle className="h-4 w-4" /> Save &amp; Complete Session</>
          )}
        </Button>
        <Button variant="outline" className="w-full gap-2" onClick={onSaveDraft} disabled={saveStatus === 'saving'}>
          <Save className="h-4 w-4" />
          Save Draft
        </Button>
      </div>

      {/* Full-screen calendar modal */}
      {showFullCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4" onClick={() => setShowFullCalendar(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Home Exercise Plan Schedule</h2>
                <p className="text-sm font-sans text-muted-foreground mt-1">{exercises.length} exercises over 4 weeks</p>
              </div>
              <button onClick={() => setShowFullCalendar(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Expanded calendar */}
            <FullCalendarView exercises={exercises} />

            {/* Exercise legend */}
            <div className="mt-6 pt-4 border-t border-border/40">
              <p className="text-xs font-semibold font-sans text-foreground uppercase tracking-wide mb-3">Exercises</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {exercises.map((ex, i) => {
                  const freq = FREQUENCY_MAP[ex.frequency] || FREQUENCY_MAP['1x daily']
                  return (
                    <div key={i} className="flex items-start gap-2 rounded-lg border border-border/40 p-2.5">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold font-sans text-foreground truncate">{ex.name}</p>
                        <p className="text-[10px] font-sans text-muted-foreground">{ex.sets}x{ex.reps} &middot; {freq.label}</p>
                        {ex.hold_seconds > 0 && <p className="text-[10px] font-sans text-muted-foreground">Hold {ex.hold_seconds}s</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Full Calendar View (for the modal) ───
function FullCalendarView({ exercises }) {
  const today = new Date()
  const weeks = 4

  const dates = useMemo(() => {
    const start = new Date(today)
    start.setDate(start.getDate() - start.getDay())
    const days = []
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }, [])

  const exercisesByDay = useMemo(() => {
    const map = {}
    dates.forEach((date) => {
      const dow = date.getDay()
      const key = date.toISOString().split('T')[0]
      map[key] = exercises.filter((ex) => {
        const scheduleDays = getScheduleDays(ex.frequency)
        return scheduleDays.includes(dow)
      })
    })
    return map
  }, [exercises, dates])

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
          <div key={d} className="text-center text-xs font-bold font-sans text-muted-foreground py-2">{d}</div>
        ))}
      </div>

      {/* Weeks */}
      {Array.from({ length: weeks }).map((_, weekIdx) => {
        const weekDates = dates.slice(weekIdx * 7, (weekIdx + 1) * 7)
        return (
          <div key={weekIdx} className="grid grid-cols-7 gap-1 mb-1">
            {weekDates.map((date) => {
              const key = date.toISOString().split('T')[0]
              const dayExercises = exercisesByDay[key] || []
              const isToday = date.toDateString() === today.toDateString()
              const isPast = date < today && !isToday

              return (
                <div
                  key={key}
                  className={`rounded-lg p-2 min-h-[90px] border transition-colors ${
                    isToday ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border/30 bg-white'
                  } ${isPast ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold font-sans ${isToday ? 'text-primary' : 'text-foreground/60'}`}>
                      {date.getDate()}
                    </span>
                    {isToday && <span className="text-[8px] font-bold font-sans text-primary uppercase">Today</span>}
                  </div>
                  <div className="space-y-0.5">
                    {dayExercises.map((ex, i) => {
                      const exIndex = exercises.findIndex((e) => e.id === ex.id)
                      return (
                        <div key={i} className="flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5">
                          <span className="flex items-center justify-center h-3.5 w-3.5 rounded-full bg-primary text-white text-[7px] font-bold shrink-0">{exIndex + 1}</span>
                          <p className="text-[9px] font-sans text-primary font-medium truncate">{ex.name}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
