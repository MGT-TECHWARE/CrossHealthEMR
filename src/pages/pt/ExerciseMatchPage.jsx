import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import AIMatchPanel from '@/components/ai/AIMatchPanel'
import Spinner from '@/components/ui/Spinner'
import useSessionNotes from '@/hooks/useSessionNotes'
import { getAppointmentById } from '@/services/appointments.service'

export default function ExerciseMatchPage() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { notes, isLoading } = useSessionNotes({ appointmentId })
  const [appointment, setAppointment] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAppointmentById(appointmentId)
        setAppointment(data)
      } catch (err) {
        console.error('Failed to load appointment:', err)
      }
    }
    if (appointmentId) load()
  }, [appointmentId])

  const latestNote = notes?.[0]
  const soapText = latestNote
    ? `Subjective: ${latestNote.subjective}\nObjective: ${latestNote.objective}\nAssessment: ${latestNote.assessment}\nPlan: ${latestNote.plan}`
    : ''

  const handlePlanCreated = () => {
    navigate('/pt/dashboard')
  }

  if (isLoading) return <Spinner size="lg" />

  if (!latestNote) {
    return (
      <PageContainer title="AI Exercise Match">
        <p className="text-muted-foreground font-sans">
          No session notes found. Please write SOAP notes first.
        </p>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="AI Exercise Match">
      <AIMatchPanel
        soapNoteText={soapText}
        appointmentId={appointmentId}
        patientId={appointment?.patient_id}
        onPlanCreated={handlePlanCreated}
      />
    </PageContainer>
  )
}
