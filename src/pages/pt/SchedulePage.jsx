import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
} from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import AppointmentForm from '@/components/appointments/AppointmentForm'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import useAppointments from '@/hooks/useAppointments'
import usePatients from '@/hooks/usePatients'
import { useAuthStore } from '@/stores/authStore'

const VIEWS = [
  { key: 'month', label: 'Month', icon: LayoutGrid },
  { key: 'week', label: 'Week', icon: CalendarIcon },
  { key: 'day', label: 'Day', icon: List },
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7) // 7am - 6pm

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days = []

  // Pad from previous month
  for (let i = startPad - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
  }
  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), isCurrentMonth: true })
  }
  // Pad to fill grid (6 rows)
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

function MonthView({ days, appointments, today, onDayClick }) {
  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border/60">
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold font-sans text-muted-foreground uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map(({ date, isCurrentMonth }, i) => {
          const dayAppts = appointments.filter((a) => isSameDay(new Date(a.scheduled_at), date))
          const isToday = isSameDay(date, today)
          return (
            <div
              key={i}
              onClick={() => onDayClick(date)}
              className={`min-h-[100px] border-b border-r border-border/30 p-1.5 cursor-pointer transition-colors hover:bg-secondary/50 ${
                !isCurrentMonth ? 'bg-secondary/20' : ''
              }`}
            >
              <span className={`inline-flex items-center justify-center text-sm font-sans w-7 h-7 rounded-full ${
                isToday ? 'bg-primary text-white font-bold' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/40'
              }`}>
                {date.getDate()}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayAppts.slice(0, 3).map((appt) => {
                  const name = appt.patient ? `${appt.patient.first_name} ${appt.patient.last_name?.[0]}.` : 'Patient'
                  const time = new Date(appt.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                  const statusColor = appt.status === 'confirmed' ? 'bg-primary' : appt.status === 'pending' ? 'bg-amber-500' : 'bg-muted-foreground/40'
                  return (
                    <div key={appt.id} className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] font-sans truncate bg-primary/5">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusColor}`} />
                      <span className="truncate">{time} {name}</span>
                    </div>
                  )
                })}
                {dayAppts.length > 3 && (
                  <p className="text-[10px] font-sans text-muted-foreground px-1">+{dayAppts.length - 3} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ weekDays, appointments, today, onAppointmentClick }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/60">
          <div />
          {weekDays.map((d, i) => {
            const isToday = isSameDay(d, today)
            return (
              <div key={i} className={`py-2 text-center border-l border-border/30 ${isToday ? 'bg-primary/5' : ''}`}>
                <p className="text-xs font-sans text-muted-foreground">{DAY_NAMES[d.getDay()]}</p>
                <p className={`text-lg font-semibold font-sans ${isToday ? 'text-primary' : 'text-foreground'}`}>{d.getDate()}</p>
              </div>
            )
          })}
        </div>
        {/* Time grid */}
        <div className="relative">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/20 h-16">
              <div className="text-xs font-sans text-muted-foreground pr-2 text-right pt-1">
                {hour > 12 ? `${hour - 12}pm` : hour === 12 ? '12pm' : `${hour}am`}
              </div>
              {weekDays.map((d, di) => {
                const dayAppts = appointments.filter((a) => {
                  const ad = new Date(a.scheduled_at)
                  return isSameDay(ad, d) && ad.getHours() === hour
                })
                return (
                  <div key={di} className="border-l border-border/20 px-0.5 relative">
                    {dayAppts.map((appt) => {
                      const name = appt.patient ? `${appt.patient.first_name} ${appt.patient.last_name?.[0]}.` : 'Patient'
                      const time = new Date(appt.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                      return (
                        <div
                          key={appt.id}
                          onClick={() => onAppointmentClick(appt)}
                          className="absolute inset-x-0.5 top-0.5 rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 cursor-pointer hover:bg-primary/20 transition-colors text-[11px] font-sans truncate"
                        >
                          <span className="font-medium text-primary">{time}</span>{' '}
                          <span className="text-foreground/70">{name}</span>
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

function DayView({ date, appointments, onAppointmentClick }) {
  const dayAppts = appointments
    .filter((a) => isSameDay(new Date(a.scheduled_at), date))
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))

  return (
    <div>
      <div className="space-y-3">
        {HOURS.map((hour) => {
          const hourAppts = dayAppts.filter((a) => new Date(a.scheduled_at).getHours() === hour)
          return (
            <div key={hour} className="flex gap-3 min-h-[48px]">
              <div className="w-16 text-right text-sm font-sans text-muted-foreground pt-1 shrink-0">
                {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
              </div>
              <div className="flex-1 border-t border-border/20 pt-1">
                {hourAppts.length > 0 ? (
                  <div className="space-y-2">
                    {hourAppts.map((appt) => (
                      <AppointmentCard
                        key={appt.id}
                        appointment={appt}
                        viewerRole="pt"
                        onClick={onAppointmentClick}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
        {dayAppts.length === 0 && (
          <div className="text-center py-12">
            <p className="font-sans text-muted-foreground">No appointments on this day</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SchedulePage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { appointments, isLoading, createAppointment, updateStatus } = useAppointments({ ptId: user?.id })
  const { patients } = usePatients(user?.id)
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()

  const monthDays = useMemo(() => {
    return getMonthDays(currentDate.getFullYear(), currentDate.getMonth())
  }, [currentDate])

  const weekDays = useMemo(() => {
    return getWeekDays(currentDate)
  }, [currentDate])

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

  const handleAppointmentClick = (appointment) => {
    navigate(`/pt/session/${appointment.id}`)
  }

  const handleCreateAppointment = async (values) => {
    await createAppointment(values)
    setShowModal(false)
  }

  const headerLabel = view === 'month'
    ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : view === 'week'
      ? `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <PageContainer title="Schedule">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToday} className="font-sans">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold font-sans text-foreground ml-2">{headerLabel}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans transition-colors ${
                  view === v.key ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-secondary'
                }`}
              >
                <v.icon className="h-3.5 w-3.5" />
                {v.label}
              </button>
            ))}
          </div>

          <Button className="gap-2" onClick={() => setShowModal(true)}>
            <CalendarPlus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar view */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <Card className="p-0 overflow-hidden">
          {view === 'month' && (
            <MonthView
              days={monthDays}
              appointments={appointments || []}
              today={today}
              onDayClick={handleDayClick}
            />
          )}
          {view === 'week' && (
            <WeekView
              weekDays={weekDays}
              appointments={appointments || []}
              today={today}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
          {view === 'day' && (
            <DayView
              date={currentDate}
              appointments={appointments || []}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
        </Card>
      )}

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
