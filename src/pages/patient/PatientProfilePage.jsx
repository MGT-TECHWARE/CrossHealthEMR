import { useState } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import PatientIntakeForm from '@/components/patients/PatientIntakeForm'
import Card from '@/components/ui/Card'
import { useAuthStore } from '@/stores/authStore'
import { updatePatientProfile } from '@/services/patients.service'

export default function PatientProfilePage() {
  const user = useAuthStore((s) => s.user)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (data) => {
    await updatePatientProfile(user.id, data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <PageContainer title="My Profile">
      <Card className="max-w-2xl">
        <PatientIntakeForm
          onSubmit={handleSubmit}
          defaultValues={{
            first_name: user?.user_metadata?.first_name || '',
            last_name: user?.user_metadata?.last_name || '',
            date_of_birth: '',
            phone: '',
          }}
        />
        {saved && (
          <p className="mt-4 text-sm text-green-600">Profile updated successfully!</p>
        )}
      </Card>
    </PageContainer>
  )
}
