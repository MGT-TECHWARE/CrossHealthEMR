import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Play, Eye, X, CheckCircle, XCircle, Stethoscope, FileText } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'
import { getAppointmentColor } from '@/constants/appointmentColors'
import { APPOINTMENT_STATUS_LABELS } from '@/constants/appointmentStatus'
import { useAuthStore } from '@/stores/authStore'

export default function AppointmentPopover({ appointment, onClose, onCheckIn, onNoShow }) {
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.role)
  const base = role === 'admin' ? '/admin' : '/pt'
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function handleEscape(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (!appointment) return null

  const patientName = appointment.patient
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : 'Patient'

  const color = getAppointmentColor(appointment.payment_type)
  const statusLabel = APPOINTMENT_STATUS_LABELS[appointment.status] || appointment.status
  const time = new Date(appointment.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const dateStr = new Date(appointment.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const statusVariant =
    appointment.status === 'completed' ? 'success' :
    appointment.status === 'cancelled' || appointment.status === 'no_show' ? 'destructive' :
    appointment.status === 'checked_in' || appointment.status === 'in_progress' ? 'warning' :
    'default'

  const isPending = appointment.status === 'pending' || appointment.status === 'confirmed'
  const canStart = appointment.status === 'checked_in' || isPending

  return (
    <div
      ref={ref}
      className="z-50 w-[300px] rounded-xl border border-border/50 bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
    >
      {/* Color bar header */}
      <div className={`h-1.5 rounded-t-xl ${color.dot.replace('bg-', 'bg-')}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold font-sans text-foreground truncate">{patientName}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge variant={statusVariant} className="text-[10px]">{statusLabel}</Badge>
              <Badge variant="outline" className={`text-[10px] ${color.text}`}>{color.label}</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground/50 hover:bg-secondary hover:text-foreground transition-colors -mt-0.5 -mr-0.5 shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2.5 text-sm font-sans text-muted-foreground">
            <Clock className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            <span>{dateStr} at {time}</span>
            {appointment.duration_minutes && (
              <span className="text-muted-foreground/40">({appointment.duration_minutes} min)</span>
            )}
          </div>
          {appointment.reason && (
            <div className="flex items-start gap-2.5 text-sm font-sans text-muted-foreground">
              <FileText className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
              <p className="line-clamp-2">{appointment.reason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 pt-3 border-t border-border/30">
          {isPending && (
            <Button
              size="sm"
              className="w-full gap-2 justify-center"
              onClick={() => onCheckIn?.(appointment.id)}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Check In
            </Button>
          )}
          {canStart && (
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2 justify-center"
              onClick={() => { onClose(); navigate(`${base}/session/${appointment.id}`) }}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              Start Session
            </Button>
          )}
          {appointment.patient_id && (
            <Button
              size="sm"
              variant="ghost"
              className="w-full gap-2 justify-center"
              onClick={() => { onClose(); navigate(`${base}/patients/${appointment.patient_id}`) }}
            >
              <Eye className="h-3.5 w-3.5" />
              View Chart
            </Button>
          )}
          {isPending && (
            <Button
              size="sm"
              variant="ghost"
              className="w-full gap-2 justify-center text-destructive hover:text-destructive hover:bg-destructive/5"
              onClick={() => onNoShow?.(appointment.id)}
            >
              <XCircle className="h-3.5 w-3.5" />
              No Show
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
