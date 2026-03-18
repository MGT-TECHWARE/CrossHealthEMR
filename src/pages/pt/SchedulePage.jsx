import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  LayoutGrid,
  Columns3,
  Clock,
  List,
  Plus,
  User,
  MapPin,
} from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import AppointmentForm from '@/components/appointments/AppointmentForm'
import AppointmentPopover from '@/components/appointments/AppointmentPopover'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import useAppointments from '@/hooks/useAppointments'
import usePatients from '@/hooks/usePatients'
import { useAuthStore } from '@/stores/authStore'
import { getAppointmentColor, PAYMENT_TYPE_COLORS } from '@/constants/appointmentColors'
import { APPOINTMENT_STATUS_LABELS } from '@/constants/appointmentStatus'

// ─── Utilities ───────────────────────────────────────────────

function useBase() {
  const role = useAuthStore((s) => s.role)
  return role === 'admin' ? '/admin' : '/pt'
}

const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_MIN = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 6) // 6am–6pm

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

function formatHour(hour) {
  if (hour === 0 || hour === 24) return '12 AM'
  if (hour === 12) return '12 PM'
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days = []
  for (let i = startPad - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), isCurrentMonth: true })
  }
  while (days.length < 42) {
    const next = days.length - startPad - lastDay.getDate() + 1
    days.push({ date: new Date(year, month + 1, next), isCurrentMonth: false })
  }
  return days
}

function getWeekDays(date) {
  const start = new Date(date)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}

function getStatusColor(status) {
  const map = {
    pending: 'bg-yellow-400',
    confirmed: 'bg-blue-400',
    checked_in: 'bg-emerald-400',
    in_progress: 'bg-purple-400',
    completed: 'bg-gray-400',
    cancelled: 'bg-red-400',
    no_show: 'bg-gray-300',
  }
  return map[status] || 'bg-gray-400'
}

// ─── Month View ──────────────────────────────────────────────

function MonthView({ days, appointments, today, onDayClick, onAppointmentClick }) {
  return (
    <div className="select-none">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border/40">
        {DAY_NAMES_SHORT.map((d, i) => (
          <div key={d + i} className="py-2.5 text-center text-[11px] font-semibold font-sans text-muted-foreground/70 uppercase tracking-widest">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{DAY_NAMES_MIN[i]}</span>
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7">
        {days.map(({ date, isCurrentMonth }, i) => {
          const dayAppts = appointments.filter((a) => isSameDay(new Date(a.scheduled_at), date))
          const isToday = isSameDay(date, today)
          const hasAppts = dayAppts.length > 0

          return (
            <div
              key={i}
              onClick={() => onDayClick(date)}
              role="gridcell"
              aria-label={`${DAY_NAMES_FULL[date.getDay()]}, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${hasAppts ? `, ${dayAppts.length} appointment${dayAppts.length > 1 ? 's' : ''}` : ''}`}
              className={`
                min-h-[90px] sm:min-h-[110px] border-b border-r border-border/20 p-1 sm:p-1.5 cursor-pointer
                transition-all duration-150 group
                ${!isCurrentMonth ? 'bg-muted/30' : 'hover:bg-primary/[0.03]'}
              `}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`
                    inline-flex items-center justify-center text-[13px] font-sans w-7 h-7 rounded-full transition-colors
                    ${isToday
                      ? 'bg-primary text-white font-bold shadow-sm'
                      : isCurrentMonth
                        ? 'text-foreground group-hover:bg-secondary'
                        : 'text-muted-foreground/30'
                    }
                  `}
                >
                  {date.getDate()}
                </span>
                {/* Mobile: dot indicators */}
                {hasAppts && (
                  <div className="flex gap-0.5 sm:hidden">
                    {dayAppts.slice(0, 3).map((a) => {
                      const color = getAppointmentColor(a.payment_type)
                      return <span key={a.id} className={`h-1.5 w-1.5 rounded-full ${color.dot}`} />
                    })}
                  </div>
                )}
              </div>

              {/* Desktop: appointment chips */}
              <div className="hidden sm:flex flex-col gap-[3px]">
                {dayAppts.slice(0, 3).map((appt) => {
                  const name = appt.patient
                    ? `${appt.patient.first_name} ${appt.patient.last_name?.[0]}.`
                    : 'Patient'
                  const time = formatTime(new Date(appt.scheduled_at))
                  const color = getAppointmentColor(appt.payment_type)
                  return (
                    <button
                      key={appt.id}
                      onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt) }}
                      className={`
                        flex items-center gap-1 px-1.5 py-[3px] rounded-md text-[11px] font-sans
                        ${color.bg} hover:ring-1 hover:ring-inset hover:${color.border}
                        transition-all truncate text-left w-full
                      `}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${color.dot}`} />
                      <span className={`font-medium ${color.text} truncate`}>
                        {time}
                      </span>
                      <span className="text-foreground/50 truncate hidden lg:inline">{name}</span>
                    </button>
                  )
                })}
                {dayAppts.length > 3 && (
                  <span className="text-[10px] font-medium font-sans text-primary px-1.5 hover:underline cursor-pointer">
                    +{dayAppts.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Week View ───────────────────────────────────────────────

function WeekView({ weekDays, appointments, today, onAppointmentClick, onAppointmentDoubleClick }) {
  const scrollRef = useRef(null)

  // Scroll to 8am on mount
  useEffect(() => {
    if (scrollRef.current) {
      const hourHeight = 64
      scrollRef.current.scrollTop = (8 - 6) * hourHeight // scroll to 8am
    }
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-260px)] min-h-[500px]">
      {/* Sticky day headers */}
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/40 bg-white sticky top-0 z-10">
        <div className="border-r border-border/20" />
        {weekDays.map((d, i) => {
          const isToday = isSameDay(d, today)
          const dayApptCount = appointments.filter((a) => isSameDay(new Date(a.scheduled_at), d)).length
          return (
            <div
              key={i}
              className={`py-2.5 text-center border-r border-border/20 transition-colors ${isToday ? 'bg-primary/[0.04]' : ''}`}
            >
              <p className="text-[11px] font-sans text-muted-foreground/60 uppercase tracking-wider">
                {DAY_NAMES_SHORT[d.getDay()]}
              </p>
              <p className={`text-xl font-semibold font-sans leading-tight mt-0.5 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                {isToday ? (
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white">
                    {d.getDate()}
                  </span>
                ) : (
                  d.getDate()
                )}
              </p>
              {dayApptCount > 0 && (
                <p className="text-[10px] font-sans text-muted-foreground mt-0.5">{dayApptCount} appt{dayApptCount > 1 ? 's' : ''}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-[56px_repeat(7,1fr)] relative">
          {/* Hour rows */}
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div className="h-16 border-r border-border/20 pr-2 relative">
                <span className="absolute -top-2.5 right-2 text-[11px] font-sans text-muted-foreground/50 tabular-nums">
                  {formatHour(hour)}
                </span>
              </div>
              {/* Day columns */}
              {weekDays.map((d, di) => {
                const isToday = isSameDay(d, today)
                const hourAppts = appointments.filter((a) => {
                  const ad = new Date(a.scheduled_at)
                  return isSameDay(ad, d) && ad.getHours() === hour
                })

                return (
                  <div
                    key={di}
                    className={`h-16 border-r border-b border-border/[0.12] relative ${isToday ? 'bg-primary/[0.02]' : ''}`}
                  >
                    {hourAppts.map((appt, ai) => {
                      const name = appt.patient
                        ? `${appt.patient.first_name} ${appt.patient.last_name?.[0]}.`
                        : 'Patient'
                      const time = formatTime(new Date(appt.scheduled_at))
                      const color = getAppointmentColor(appt.payment_type)
                      const mins = appt.duration_minutes || 60
                      const heightPx = Math.max((mins / 60) * 64, 28)
                      const startMin = new Date(appt.scheduled_at).getMinutes()
                      const topPx = (startMin / 60) * 64

                      return (
                        <div
                          key={appt.id}
                          onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt) }}
                          onDoubleClick={(e) => { e.stopPropagation(); onAppointmentDoubleClick(appt) }}
                          style={{ top: `${topPx + 1}px`, height: `${heightPx - 2}px` }}
                          className={`
                            absolute inset-x-[2px] rounded-md ${color.bg} border-l-[3px] ${color.border}
                            cursor-pointer hover:shadow-md hover:z-10
                            transition-shadow overflow-hidden px-1.5 py-0.5
                          `}
                        >
                          <p className={`text-[11px] font-semibold font-sans ${color.text} truncate leading-tight`}>
                            {time}
                          </p>
                          <p className="text-[10px] font-sans text-foreground/60 truncate leading-tight">
                            {name}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Day View ────────────────────────────────────────────────

function DayView({ date, appointments, today, onAppointmentClick, onAppointmentDoubleClick, base }) {
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = (8 - 6) * 72
    }
  }, [])

  const dayAppts = appointments
    .filter((a) => isSameDay(new Date(a.scheduled_at), date))
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))

  const isToday = isSameDay(date, today)

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-260px)] min-h-[500px]">
      {/* Timeline */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="relative">
          {HOURS.map((hour) => {
            const hourAppts = dayAppts.filter((a) => new Date(a.scheduled_at).getHours() === hour)
            return (
              <div key={hour} className="flex h-[72px]">
                {/* Time gutter */}
                <div className="w-16 shrink-0 pr-3 relative">
                  <span className="absolute -top-2.5 right-3 text-[11px] font-sans text-muted-foreground/50 tabular-nums">
                    {formatHour(hour)}
                  </span>
                </div>
                {/* Content area */}
                <div className="flex-1 border-t border-border/[0.15] relative">
                  {hourAppts.map((appt) => {
                    const name = appt.patient
                      ? `${appt.patient.first_name} ${appt.patient.last_name}`
                      : 'Patient'
                    const time = formatTime(new Date(appt.scheduled_at))
                    const color = getAppointmentColor(appt.payment_type)
                    const mins = appt.duration_minutes || 60
                    const heightPx = Math.max((mins / 60) * 72, 36)
                    const startMin = new Date(appt.scheduled_at).getMinutes()
                    const topPx = (startMin / 60) * 72
                    const statusLabel = APPOINTMENT_STATUS_LABELS[appt.status] || appt.status

                    return (
                      <div
                        key={appt.id}
                        onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt) }}
                        onDoubleClick={(e) => { e.stopPropagation(); onAppointmentDoubleClick(appt) }}
                        style={{ top: `${topPx + 1}px`, height: `${heightPx - 2}px` }}
                        className={`
                          absolute left-0 right-4 rounded-lg ${color.bg} border-l-4 ${color.border}
                          cursor-pointer hover:shadow-lg hover:z-10
                          transition-all overflow-hidden px-3 py-1.5
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold font-sans ${color.text} truncate`}>
                            {time} — {name}
                          </p>
                          <span className={`shrink-0 h-2 w-2 rounded-full ${getStatusColor(appt.status)}`} title={statusLabel} />
                        </div>
                        {heightPx > 40 && appt.reason && (
                          <p className="text-xs font-sans text-foreground/50 truncate mt-0.5">{appt.reason}</p>
                        )}
                        {heightPx > 56 && (
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-medium ${color.text}`}>{mins} min</span>
                            <span className={`text-[10px] px-1.5 py-0 rounded-full ${color.bg} ${color.text} border ${color.border}`}>
                              {color.label}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Side panel: agenda list */}
      <div className="hidden lg:flex flex-col w-72 border-l border-border/30 bg-muted/20">
        <div className="p-4 border-b border-border/30">
          <h3 className="text-sm font-semibold font-sans text-foreground">
            {isToday ? "Today's Agenda" : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </h3>
          <p className="text-xs font-sans text-muted-foreground mt-0.5">
            {dayAppts.length} appointment{dayAppts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {dayAppts.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-border mx-auto mb-2" />
              <p className="text-sm font-sans text-muted-foreground">No appointments</p>
            </div>
          ) : (
            dayAppts.map((appt) => {
              const name = appt.patient
                ? `${appt.patient.first_name} ${appt.patient.last_name}`
                : 'Patient'
              const time = formatTime(new Date(appt.scheduled_at))
              const color = getAppointmentColor(appt.payment_type)
              const statusLabel = APPOINTMENT_STATUS_LABELS[appt.status] || appt.status

              return (
                <button
                  key={appt.id}
                  onClick={() => onAppointmentClick(appt)}
                  className="w-full text-left rounded-lg border border-border/40 bg-white p-3 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${color.dot}`} />
                    <span className="text-sm font-semibold font-sans text-foreground truncate">{name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{time}</span>
                    <span className="text-muted-foreground/40">|</span>
                    <span>{appt.duration_minutes || 60} min</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                      {color.label}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-foreground/60`}>
                      {statusLabel}
                    </span>
                  </div>
                  {appt.reason && (
                    <p className="text-[11px] font-sans text-muted-foreground/70 mt-1.5 line-clamp-1">{appt.reason}</p>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Agenda View (Mobile) ────────────────────────────────────

function AgendaView({ appointments, today, onAppointmentClick }) {
  // Group by date
  const grouped = useMemo(() => {
    const upcoming = appointments
      .filter((a) => a.status !== 'cancelled')
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))

    const groups = {}
    upcoming.forEach((appt) => {
      const key = new Date(appt.scheduled_at).toDateString()
      if (!groups[key]) groups[key] = { date: new Date(appt.scheduled_at), appointments: [] }
      groups[key].appointments.push(appt)
    })
    return Object.values(groups)
  }, [appointments])

  if (grouped.length === 0) {
    return (
      <div className="text-center py-16">
        <Clock className="h-10 w-10 text-border mx-auto mb-3" />
        <p className="font-sans text-muted-foreground">No upcoming appointments</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {grouped.map((group) => {
        const isToday = isSameDay(group.date, today)
        const isTomorrow = isSameDay(group.date, new Date(today.getTime() + 86400000))
        const label = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : group.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

        return (
          <div key={group.date.toDateString()}>
            {/* Date header */}
            <div className={`sticky top-0 z-[5] px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider ${isToday ? 'bg-primary/5 text-primary' : 'bg-muted/50 text-muted-foreground/70'}`}>
              {label}
            </div>
            {/* Appointments */}
            <div className="divide-y divide-border/20">
              {group.appointments.map((appt) => {
                const name = appt.patient
                  ? `${appt.patient.first_name} ${appt.patient.last_name}`
                  : 'Patient'
                const time = formatTime(new Date(appt.scheduled_at))
                const color = getAppointmentColor(appt.payment_type)
                const statusLabel = APPOINTMENT_STATUS_LABELS[appt.status] || appt.status

                return (
                  <button
                    key={appt.id}
                    onClick={() => onAppointmentClick(appt)}
                    className="w-full flex items-start gap-3 p-4 hover:bg-secondary/50 transition-colors text-left"
                  >
                    {/* Time column */}
                    <div className="w-14 shrink-0 pt-0.5">
                      <p className="text-sm font-semibold font-sans text-foreground tabular-nums">{time}</p>
                      <p className="text-[10px] font-sans text-muted-foreground">{appt.duration_minutes || 60}m</p>
                    </div>
                    {/* Color bar + content */}
                    <div className={`flex-1 border-l-[3px] ${color.border} pl-3 min-w-0`}>
                      <p className="text-sm font-semibold font-sans text-foreground truncate">{name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                          {color.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-sans text-muted-foreground`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(appt.status)}`} />
                          {statusLabel}
                        </span>
                      </div>
                      {appt.reason && (
                        <p className="text-xs font-sans text-muted-foreground/60 mt-1 line-clamp-1">{appt.reason}</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Color Legend ─────────────────────────────────────────────

function ColorLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {Object.entries(PAYMENT_TYPE_COLORS).map(([key, color]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${color.dot}`} />
          <span className="text-[11px] font-sans text-muted-foreground/60">{color.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Mini Calendar ───────────────────────────────────────────

function MiniCalendar({ currentDate, onDateSelect, appointments, today }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const days = getMonthDays(year, month)

  return (
    <div className="select-none">
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES_MIN.map((d, i) => (
          <div key={d + i} className="text-center text-[10px] font-sans text-muted-foreground/50 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map(({ date, isCurrentMonth }, i) => {
          const isToday = isSameDay(date, today)
          const isSelected = isSameDay(date, currentDate)
          const hasAppts = appointments.some((a) => isSameDay(new Date(a.scheduled_at), date))

          return (
            <button
              key={i}
              onClick={() => onDateSelect(date)}
              className={`
                h-7 w-7 mx-auto rounded-full text-[11px] font-sans transition-all relative
                flex items-center justify-center
                ${!isCurrentMonth ? 'text-muted-foreground/20' : ''}
                ${isToday && !isSelected ? 'text-primary font-bold' : ''}
                ${isSelected ? 'bg-primary text-white font-bold shadow-sm' : 'hover:bg-secondary'}
                ${isCurrentMonth && !isToday && !isSelected ? 'text-foreground/80' : ''}
              `}
            >
              {date.getDate()}
              {hasAppts && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary/60" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Schedule Page ──────────────────────────────────────

const VIEWS = [
  { key: 'month', label: 'Month', icon: LayoutGrid, mobileLabel: 'Month' },
  { key: 'week', label: 'Week', icon: Columns3, mobileLabel: 'Week' },
  { key: 'day', label: 'Day', icon: Clock, mobileLabel: 'Day' },
  { key: 'agenda', label: 'Agenda', icon: List, mobileLabel: 'List' },
]

export default function SchedulePage() {
  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role)
  const base = useBase()
  const navigate = useNavigate()
  const { appointments, isLoading, createAppointment, updateStatus, checkIn } = useAppointments()
  const { patients } = usePatients()
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [popoverAppt, setPopoverAppt] = useState(null)

  const today = useMemo(() => new Date(), [])

  const monthDays = useMemo(
    () => getMonthDays(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  )

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

  const handlePrev = () => {
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() - 1)
    else if (view === 'week') d.setDate(d.getDate() - 7)
    else d.setDate(d.getDate() - 1)
    setCurrentDate(d)
  }

  const handleNext = () => {
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() + 1)
    else if (view === 'week') d.setDate(d.getDate() + 7)
    else d.setDate(d.getDate() + 1)
    setCurrentDate(d)
  }

  const handleToday = () => setCurrentDate(new Date())

  const handleDayClick = (date) => {
    setCurrentDate(date)
    setView('day')
  }

  const handleAppointmentClick = (appointment) => setPopoverAppt(appointment)

  const handleAppointmentDoubleClick = (appointment) => {
    if (appointment.patient_id) navigate(`${base}/patients/${appointment.patient_id}`)
  }

  const handleCheckIn = async (appointmentId) => {
    await checkIn(appointmentId, user?.id)
    setPopoverAppt(null)
  }

  const handleNoShow = async (appointmentId) => {
    await updateStatus(appointmentId, 'no_show')
    setPopoverAppt(null)
  }

  const handleCreateAppointment = async (values) => {
    await createAppointment(values)
    setShowModal(false)
  }

  // Header label
  const headerLabel = view === 'month'
    ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : view === 'week'
      ? `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <PageContainer>
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Top row: title + new button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold font-sans text-foreground">Schedule</h1>
          <Button className="gap-2 shadow-sm" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Appointment</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Navigation + view switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: nav controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Previous ${view}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Next ${view}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleToday}
              className="ml-1 px-3 py-1 rounded-full text-sm font-medium font-sans border border-border/60 hover:bg-secondary text-foreground transition-colors"
            >
              Today
            </button>
            <h2 className="ml-3 text-lg font-semibold font-sans text-foreground whitespace-nowrap">
              {headerLabel}
            </h2>
          </div>

          {/* Right: view switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5 bg-muted/30">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-sans font-medium transition-all
                  ${view === v.key
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                aria-label={`${v.label} view`}
              >
                <v.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{v.label}</span>
                <span className="sm:hidden">{v.mobileLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <ColorLegend />
      </div>

      {/* ─── Calendar Content ─── */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="relative">
          <div className="rounded-xl border border-border/40 bg-white shadow-sm overflow-hidden">
            {view === 'month' && (
              <MonthView
                days={monthDays}
                appointments={appointments || []}
                today={today}
                onDayClick={handleDayClick}
                onAppointmentClick={handleAppointmentClick}
              />
            )}
            {view === 'week' && (
              <WeekView
                weekDays={weekDays}
                appointments={appointments || []}
                today={today}
                onAppointmentClick={handleAppointmentClick}
                onAppointmentDoubleClick={handleAppointmentDoubleClick}
              />
            )}
            {view === 'day' && (
              <DayView
                date={currentDate}
                appointments={appointments || []}
                today={today}
                onAppointmentClick={handleAppointmentClick}
                onAppointmentDoubleClick={handleAppointmentDoubleClick}
                base={base}
              />
            )}
            {view === 'agenda' && (
              <AgendaView
                appointments={appointments || []}
                today={today}
                onAppointmentClick={handleAppointmentClick}
              />
            )}
          </div>

          {/* ─── Popover overlay ─── */}
          {popoverAppt && (
            <div className="fixed inset-0 z-40" onClick={() => setPopoverAppt(null)}>
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-1/3 sm:translate-y-0"
                onClick={(e) => e.stopPropagation()}
              >
                <AppointmentPopover
                  appointment={popoverAppt}
                  onClose={() => setPopoverAppt(null)}
                  onCheckIn={handleCheckIn}
                  onNoShow={handleNoShow}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── New Appointment Modal ─── */}
      <Modal open={showModal} onOpenChange={setShowModal} title="New Appointment">
        <AppointmentForm
          onSubmit={handleCreateAppointment}
          patients={patients || []}
          currentPTId={user?.id}
        />
      </Modal>
    </PageContainer>
  )
}
