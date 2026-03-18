import { useNavigate } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/ui/Card'
import PatientIntakeForm from '@/components/patients/PatientIntakeForm'
import usePatients from '@/hooks/usePatients'
import { useAuthStore } from '@/stores/authStore'

export default function AddPatientPage() {
  const role = useAuthStore((s) => s.role)
  const base = role === 'admin' ? '/admin' : '/pt'
  const { createPatient } = usePatients()
  const navigate = useNavigate()

  async function handleSubmit(values) {
    try {
      const patient = await createPatient(values)
      navigate(`${base}/patients/${patient.id}`)
    } catch (err) {
      console.error('Failed to create patient:', err)
    }
  }

  return (
    <PageContainer title="Add Patient">
      <Card className="max-w-3xl">
        <PatientIntakeForm onSubmit={handleSubmit} mode="create" />
      </Card>
    </PageContainer>
  )
}
