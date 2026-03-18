import { Clock, User, FileText } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatDate } from '@/utils/formatDate'
import AppointmentStatusBadge from './AppointmentStatusBadge'
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus'

export default function AppointmentCard({
  appointment,
  viewerRole,
  onConfirm,
  onCancel,
  onClick,
}) {
  const patientName = appointment.patient
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : appointment.patient_name || 'Unknown Patient'

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick?.(appointment)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold font-sans text-foreground">
            {patientName}
          </span>
        </div>
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground mb-1">
        <Clock className="h-3.5 w-3.5" />
        <span>{formatDate(appointment.scheduled_at)}</span>
        {appointment.duration_minutes && (
          <span className="text-muted-foreground/60">({appointment.duration_minutes} min)</span>
        )}
      </div>

      {appointment.reason && (
        <div className="flex items-start gap-2 text-sm font-sans text-muted-foreground mt-2">
          <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <p className="line-clamp-2">{appointment.reason}</p>
        </div>
      )}

      {viewerRole === 'pt' && appointment.status === APPOINTMENT_STATUS.PENDING && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border/40">
          <Button
            size="sm"
            onClick={(e) => { e.stopPropagation(); onConfirm?.(appointment.id) }}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => { e.stopPropagation(); onCancel?.(appointment.id) }}
          >
            Cancel
          </Button>
        </div>
      )}
    </Card>
  )
}
