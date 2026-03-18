import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PatientInfoPanel from '@/components/patients/PatientInfoPanel'
import PatientChartTabs from '@/components/patients/PatientChartTabs'
import PatientHistoryTimeline from '@/components/patients/PatientHistoryTimeline'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import NoteHistoryList from '@/components/notes/NoteHistoryList'
import DocumentUpload from '@/components/documents/DocumentUpload'
import DocumentList from '@/components/documents/DocumentList'
import PrescriptionTracker from '@/components/documents/PrescriptionTracker'
import AuthorizationDashboard from '@/components/tracking/AuthorizationDashboard'
import InsurancePanel from '@/components/patients/InsurancePanel'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { getPatientById } from '@/services/patients.service'
import { getDocumentUrl } from '@/services/documents.service'
import useSessionNotes from '@/hooks/useSessionNotes'
import useAppointments from '@/hooks/useAppointments'
import useDocuments from '@/hooks/useDocuments'
import usePrescriptions from '@/hooks/usePrescriptions'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/services/supabase'

export default function PatientChartPage() {
  const { patientId } = useParams()
  const user = useAuthStore((s) => s.user)
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [authorizations, setAuthorizations] = useState([])
  const [exercisePlans, setExercisePlans] = useState([])

  const { notes, isLoading: notesLoading, signNote } = useSessionNotes({ patientId })
  const { appointments, isLoading: apptsLoading } = useAppointments({ patientId })
  const { documents, isLoading: docsLoading, uploadDocument, deleteDocument } = useDocuments(patientId)
  const { prescriptions, isLoading: rxLoading, createPrescription } = usePrescriptions(patientId)

  useEffect(() => {
    async function load() {
      try {
        const data = await getPatientById(patientId)
        setPatient(data)

        // Load authorizations
        const { data: auths } = await supabase
          .from('authorizations')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false })
        setAuthorizations(auths || [])

        // Load exercise plans
        const { data: plans } = await supabase
          .from('exercise_plans')
          .select('*, session_note:session_notes(created_at)')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false })
        setExercisePlans(plans || [])
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

  const handleDocDownload = async (doc) => {
    try {
      const url = await getDocumentUrl(doc.file_path)
      window.open(url, '_blank')
    } catch (err) {
      console.error('Failed to get document URL:', err)
    }
  }

  const handleDocDelete = async (doc) => {
    if (confirm(`Delete ${doc.file_name}?`)) {
      await deleteDocument(doc.id, doc.file_path)
    }
  }

  const handleDocUpload = async ({ file, documentType, description }) => {
    await uploadDocument({
      file,
      documentType,
      description,
      uploadedBy: user?.id,
    })
  }

  return (
    <PageContainer title={fullName}>
      {/* Tabs */}
      <PatientChartTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
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
                <h3 className="text-base font-semibold font-sans text-foreground mb-4">Session History</h3>
                {notesLoading ? (
                  <Spinner />
                ) : (
                  <PatientHistoryTimeline notes={notes || []} />
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <Card>
            <h3 className="text-base font-semibold font-sans text-foreground mb-4">Session Notes</h3>
            {notesLoading ? (
              <Spinner />
            ) : (
              <NoteHistoryList
                notes={notes || []}
                onSignNote={signNote}
                ptProfile={{ first_name: user?.user_metadata?.first_name, last_name: user?.user_metadata?.last_name }}
              />
            )}
          </Card>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-base font-semibold font-sans text-foreground mb-4">Upload Document</h3>
              <DocumentUpload onUpload={handleDocUpload} />
            </Card>
            <Card>
              <h3 className="text-base font-semibold font-sans text-foreground mb-4">Documents</h3>
              {docsLoading ? (
                <Spinner />
              ) : (
                <DocumentList
                  documents={documents || []}
                  onDownload={handleDocDownload}
                  onDelete={handleDocDelete}
                />
              )}
            </Card>
            <Card>
              <PrescriptionTracker
                prescriptions={prescriptions || []}
                onCreate={createPrescription}
                isLoading={rxLoading}
              />
            </Card>
          </div>
        )}

        {/* Insurance Tab */}
        {activeTab === 'insurance' && (
          <Card>
            <InsurancePanel patientId={patientId} />
          </Card>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-base font-semibold font-sans text-foreground mb-4">Authorization Status</h3>
              <AuthorizationDashboard
                authorizations={authorizations}
                patients={patient ? [patient] : []}
              />
            </Card>
            <Card>
              <PrescriptionTracker
                prescriptions={prescriptions || []}
                onCreate={createPrescription}
                isLoading={rxLoading}
              />
            </Card>
          </div>
        )}

        {/* HEP Tab */}
        {activeTab === 'hep' && (
          <Card>
            <h3 className="text-base font-semibold font-sans text-foreground mb-4">Exercise Plans</h3>
            {exercisePlans.length === 0 ? (
              <p className="text-sm font-sans text-muted-foreground text-center py-8">No exercise plans yet.</p>
            ) : (
              <div className="space-y-3">
                {exercisePlans.map((plan) => (
                  <div key={plan.id} className="border border-border/60 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-sans text-muted-foreground">
                        {plan.session_note?.created_at
                          ? new Date(plan.session_note.created_at).toLocaleDateString()
                          : new Date(plan.created_at).toLocaleDateString()}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        plan.status === 'sent' ? 'bg-emerald-50 text-emerald-700' :
                        plan.status === 'approved' ? 'bg-blue-50 text-blue-700' :
                        'bg-secondary text-foreground/60'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(plan.exercises || []).map((ex, i) => (
                        <span key={i} className="text-xs font-sans bg-secondary rounded px-2 py-1">
                          {ex.name} — {ex.sets}x{ex.reps}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </PageContainer>
  )
}
