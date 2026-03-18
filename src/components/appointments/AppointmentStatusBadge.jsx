import Badge from '@/components/ui/Badge'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from '@/constants/appointmentStatus'

const statusStyles = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
  [APPOINTMENT_STATUS.CHECKED_IN]: 'bg-amber-100 text-amber-800 border-amber-300',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'bg-purple-100 text-purple-800 border-purple-300',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border-green-300',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
  [APPOINTMENT_STATUS.NO_SHOW]: 'bg-gray-100 text-gray-800 border-gray-300',
}

export default function AppointmentStatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  const label = APPOINTMENT_STATUS_LABELS[status] || status

  return (
    <Badge className={`${style} border text-xs font-medium px-2 py-0.5 rounded-full`}>
      {label}
    </Badge>
  )
}
