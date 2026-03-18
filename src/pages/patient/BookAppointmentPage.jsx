import { useNavigate } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import AppointmentForm from '@/components/appointments/AppointmentForm'
import useAppointments from '@/hooks/useAppointments'
import { useAuthStore } from '@/stores/authStore'

export default function BookAppointmentPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { createAppointment } = useAppointments({ patientId: user?.id })

  const handleSubmit = async (data) => {
    await createAppointment({
      ...data,
      patient_id: user.id,
      status: 'pending',
    })
    navigate('/patient/appointments')
  }

  return (
    <PageContainer title="Book Appointment">
      <div className="max-w-2xl">
        <AppointmentForm onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  )
}
