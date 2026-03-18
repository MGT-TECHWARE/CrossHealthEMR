import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PatientInfoPanel from '@/components/patients/PatientInfoPanel'
import PatientHistoryTimeline from '@/components/patients/PatientHistoryTimeline'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import InsurancePanel from '@/components/patients/InsurancePanel'
import { getPatientById } from '@/services/patients.service'
import useSessionNotes from '@/hooks/useSessionNotes'
import useAppointments from '@/hooks/useAppointments'

export default function PatientChartPage() {
  const { patientId } = useParams()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const { notes, isLoading: notesLoading } = useSessionNotes({ patientId })
  const { appointments, isLoading: apptsLoading } = useAppointments({ patientId })

  useEffect(() => {
    async function load() {
      try {
        const data = await getPatientById(patientId)
        setPatient(data)
      } catch (err) {
        console.error('Failed to load patient:', err)
      } finally {
        setLoading(false)
      }
    }
    if (patientId) load()
  }, [patientId])

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      </PageContainer>
    )
  }

  if (!patient) {
    return (
      <PageContainer title="Patient Not Found">
        <p className="text-muted-foreground font-sans">This patient could not be found.</p>
      </PageContainer>
    )
  }

  const fullName = `${patient.first_name} ${patient.last_name}`

  return (
    <PageContainer title={fullName}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PatientInfoPanel patient={patient} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-base font-semibold font-sans text-foreground mb-4">Upcoming Appointments</h3>
            {apptsLoading ? (
              <Spinner />
            ) : appointments?.length > 0 ? (
              <div className="space-y-3">
                {appointments
                  .filter((a) => a.status !== 'cancelled' && new Date(a.scheduled_at) >= new Date())
                  .slice(0, 5)
                  .map((appt) => (
                    <AppointmentCard key={appt.id} appointment={appt} />
                  ))}
                {appointments.filter((a) => a.status !== 'cancelled' && new Date(a.scheduled_at) >= new Date()).length === 0 && (
                  <p className="text-sm font-sans text-muted-foreground">No upcoming appointments.</p>
                )}
              </div>
            ) : (
              <p className="text-sm font-sans text-muted-foreground">No appointments found.</p>
            )}
          </Card>

          <Card>
            <InsurancePanel patientId={patientId} />
          </Card>

          <Card>
            <h3 className="text-base font-semibold font-sans text-foreground mb-4">Session History</h3>
            {notesLoading ? (
              <Spinner />
            ) : (
              <PatientHistoryTimeline notes={notes || []} />
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
