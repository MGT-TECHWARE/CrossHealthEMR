import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Clock, Play, Eye, X, CheckCircle, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'
import { getAppointmentColor } from '@/constants/appointmentColors'
import { APPOINTMENT_STATUS_LABELS } from '@/constants/appointmentStatus'
import { useAuthStore } from '@/stores/authStore'

export default function AppointmentPopover({ appointment, onClose, onCheckIn, onStartSession, onNoShow }) {
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.role)
  const base = role === 'admin' ? '/admin' : '/pt'
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  if (!appointment) return null

  const patientName = appointment.patient
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : 'Patient'

  const color = getAppointmentColor(appointment.payment_type)
  const statusLabel = APPOINTMENT_STATUS_LABELS[appointment.status] || appointment.status

  const statusVariant =
    appointment.status === 'completed' ? 'success' :
    appointment.status === 'cancelled' || appointment.status === 'no_show' ? 'destructive' :
    appointment.status === 'checked_in' || appointment.status === 'in_progress' ? 'warning' :
    'default'

  return (
    <div
      ref={ref}
      className="absolute z-50 w-72 rounded-xl border border-border/60 bg-white p-4 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
          <span className="font-semibold font-sans text-sm text-foreground">{patientName}</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(appointment.scheduled_at)}</span>
          {appointment.duration_minutes && (
            <span>({appointment.duration_minutes} min)</span>
          )}
        </div>
        {appointment.reason && (
          <p className="text-xs font-sans text-muted-foreground line-clamp-2">{appointment.reason}</p>
        )}
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          <Badge variant="outline" className={color.text}>{color.label}</Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
        {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
          <Button
            size="sm"
            className="w-full gap-2 justify-center"
            onClick={() => onCheckIn?.(appointment.id)}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Check In
          </Button>
        )}
        {(appointment.status === 'checked_in' || appointment.status === 'confirmed' || appointment.status === 'pending') && (
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2 justify-center"
            onClick={() => {
              onClose()
              navigate(`${base}/session/${appointment.id}`)
            }}
          >
            <Play className="h-3.5 w-3.5" />
            Start Session
          </Button>
        )}
        {appointment.patient_id && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full gap-2 justify-center"
            onClick={() => {
              onClose()
              navigate(`${base}/patients/${appointment.patient_id}`)
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            View Chart
          </Button>
        )}
        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full gap-2 justify-center text-destructive hover:text-destructive"
            onClick={() => onNoShow?.(appointment.id)}
          >
            <XCircle className="h-3.5 w-3.5" />
            No Show
          </Button>
        )}
      </div>
    </div>
  )
}
