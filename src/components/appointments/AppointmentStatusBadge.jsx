import Badge from '@/components/ui/Badge';
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus';

const statusStyles = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border-green-300',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels = {
  [APPOINTMENT_STATUS.PENDING]: 'Pending',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmed',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled',
};

export default function AppointmentStatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  const label = statusLabels[status] || status;

  return (
    <Badge className={`${style} border text-xs font-medium px-2 py-0.5 rounded-full`}>
      {label}
    </Badge>
  );
}
