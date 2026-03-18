import { CalendarDays } from 'lucide-react'
import AppointmentCard from './AppointmentCard'

function groupByDate(appointments) {
  const groups = {}
  appointments.forEach((appt) => {
    const dateKey = new Date(appt.scheduled_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(appt)
  })
  return groups
}

export default function AppointmentCalendar({
  appointments = [],
  onAppointmentClick,
}) {
  const grouped = groupByDate(appointments)
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a) - new Date(b)
  )

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <CalendarDays className="h-12 w-12 mb-3 text-border" />
        <p className="text-lg font-medium font-sans">No appointments scheduled</p>
        <p className="text-sm font-sans">Appointments will appear here once booked.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((dateLabel) => (
        <section key={dateLabel}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/60">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold font-sans text-foreground">
              {dateLabel}
            </h3>
            <span className="text-sm font-sans text-muted-foreground">
              ({grouped[dateLabel].length} appointment
              {grouped[dateLabel].length !== 1 ? 's' : ''})
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[dateLabel].map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onClick={onAppointmentClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
