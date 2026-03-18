import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import SOAPNoteEditor from '@/components/notes/SOAPNoteEditor'
import NoteHistoryList from '@/components/notes/NoteHistoryList'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import useSessionNotes from '@/hooks/useSessionNotes'
import { getAppointmentById } from '@/services/appointments.service'

export default function SessionNotesPage() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const { notes, isLoading: notesLoading } = useSessionNotes({ appointmentId })

  useEffect(() => {
    async function loadAppointment() {
      try {
        const data = await getAppointmentById(appointmentId)
        setAppointment(data)
      } catch (err) {
        console.error('Failed to load appointment:', err)
      } finally {
        setLoading(false)
      }
    }
    if (appointmentId) loadAppointment()
  }, [appointmentId])

  const handleRunAIMatch = () => {
    navigate(`/pt/exercise-match/${appointmentId}`)
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      </PageContainer>
    )
  }

  const patientName = appointment?.patient
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : 'Patient'

  return (
    <PageContainer title={`Session Notes — ${patientName}`}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SOAPNoteEditor
            appointmentId={appointmentId}
            patientId={appointment?.patient_id}
            onSaveSuccess={() => {}}
            onRunAIMatch={handleRunAIMatch}
          />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <h3 className="mb-4 font-semibold font-sans">Previous Notes</h3>
            {notesLoading ? (
              <Spinner />
            ) : (
              <NoteHistoryList notes={notes || []} />
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
