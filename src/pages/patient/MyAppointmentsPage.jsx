import PageContainer from '@/components/layout/PageContainer'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import Spinner from '@/components/ui/Spinner'
import useAppointments from '@/hooks/useAppointments'
import { useAuthStore } from '@/stores/authStore'

export default function MyAppointmentsPage() {
  const user = useAuthStore((s) => s.user)
  const { appointments, isLoading, updateStatus } = useAppointments({
    patientId: user?.id,
  })

  const handleCancel = async (id) => {
    await updateStatus(id, 'cancelled')
  }

  return (
    <PageContainer title="My Appointments">
      {isLoading ? (
        <Spinner size="lg" />
      ) : appointments?.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              viewerRole="patient"
              onCancel={() => handleCancel(appt.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No appointments found</p>
      )}
    </PageContainer>
  )
}
