import { useNavigate } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/ui/Card'
import PatientIntakeForm from '@/components/patients/PatientIntakeForm'
import usePatients from '@/hooks/usePatients'
import { useAuthStore } from '@/stores/authStore'

export default function AddPatientPage() {
  const user = useAuthStore((s) => s.user)
  const { createPatient } = usePatients(user?.id)
  const navigate = useNavigate()

  async function handleSubmit(values) {
    const patient = await createPatient(values)
    navigate(`/pt/patients/${patient.id}`)
  }

  return (
    <PageContainer title="Add Patient">
      <Card className="max-w-3xl">
        <PatientIntakeForm onSubmit={handleSubmit} mode="create" />
      </Card>
    </PageContainer>
  )
}
