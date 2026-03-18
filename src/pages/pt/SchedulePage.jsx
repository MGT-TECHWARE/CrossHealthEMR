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
import AppointmentPopover from '@/components/appointments/AppointmentPopover'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import useAppointments from '@/hooks/useAppointments'
import usePatients from '@/hooks/usePatients'
import { useAuthStore } from '@/stores/authStore'
import { getAppointmentColor, PAYMENT_TYPE_COLORS } from '@/constants/appointmentColors'

function useBase() {
  const role = useAuthStore((s) => s.role)
  return role === 'admin' ? '/admin' : '/pt'
}

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
                  const color = getAppointmentColor(appt.payment_type)
                  return (
                    <div key={appt.id} className={`flex items-center gap-1 px-1 py-0.5 rounded text-[10px] font-sans truncate ${color.bg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${color.dot}`} />
                      <span className={`truncate ${color.text}`}>{time} {name}</span>
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

function WeekView({ weekDays, appointments, today, onAppointmentClick, onAppointmentDoubleClick }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
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
                      const color = getAppointmentColor(appt.payment_type)
                      return (
                        <div
                          key={appt.id}
                          onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt) }}
                          onDoubleClick={(e) => { e.stopPropagation(); onAppointmentDoubleClick(appt) }}
                          className={`absolute inset-x-0.5 top-0.5 rounded ${color.bg} border ${color.border} px-1.5 py-0.5 cursor-pointer hover:opacity-80 transition-opacity text-[11px] font-sans truncate`}
                        >
                          <span className={`font-medium ${color.text}`}>{time}</span>{' '}
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

function DayView({ date, appointments, onAppointmentClick, onAppointmentDoubleClick }) {
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
                      <div
                        key={appt.id}
                        onDoubleClick={() => onAppointmentDoubleClick(appt)}
                      >
                        <AppointmentCard
                          appointment={appt}
                          viewerRole="pt"
                          onClick={onAppointmentClick}
                        />
                      </div>
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

// Color Legend
function ColorLegend() {
  return (
    <div className="flex flex-wrap gap-3 px-1">
      {Object.entries(PAYMENT_TYPE_COLORS).map(([key, color]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
          <span className="text-[11px] font-sans text-muted-foreground">{color.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function SchedulePage() {
  const user = useAuthStore((s) => s.user)
  const base = useBase()
  const navigate = useNavigate()
  const { appointments, isLoading, createAppointment, updateStatus, checkIn } = useAppointments({ ptId: user?.id })
  const { patients } = usePatients(user?.id)
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [popoverAppt, setPopoverAppt] = useState(null)

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
    setPopoverAppt(appointment)
  }

  const handleAppointmentDoubleClick = (appointment) => {
    if (appointment.patient_id) {
      navigate(`${base}/patients/${appointment.patient_id}`)
    }
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

      {/* Color Legend */}
      <div className="mb-3">
        <ColorLegend />
      </div>

      {/* Calendar view */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="relative">
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
                onAppointmentDoubleClick={handleAppointmentDoubleClick}
              />
            )}
            {view === 'day' && (
              <DayView
                date={currentDate}
                appointments={appointments || []}
                onAppointmentClick={handleAppointmentClick}
                onAppointmentDoubleClick={handleAppointmentDoubleClick}
              />
            )}
          </Card>

          {/* Popover */}
          {popoverAppt && (
            <div className="fixed inset-0 z-40" onClick={() => setPopoverAppt(null)}>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2" onClick={(e) => e.stopPropagation()}>
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
