import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import AppointmentForm from '@/components/appointments/AppointmentForm'
import PatientCard from '@/components/patients/PatientCard'
import useAppointments from '@/hooks/useAppointments'
import usePatients from '@/hooks/usePatients'
import { useAuthStore } from '@/stores/authStore'
import { Calendar, Users, Dumbbell, UserPlus, CalendarPlus } from 'lucide-react'

export default function PTDashboard() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { appointments, isLoading, updateStatus, createAppointment } = useAppointments({ ptId: user?.id })
  const { patients, isLoading: patientsLoading } = usePatients(user?.id)
  const [showApptModal, setShowApptModal] = useState(false)

  const todayAppts = appointments?.filter((a) => {
    const apptDate = new Date(a.scheduled_at).toDateString()
    return apptDate === new Date().toDateString() && a.status !== 'cancelled'
  })

  const pendingCount = appointments?.filter((a) => a.status === 'pending').length || 0

  const handleCreateAppointment = async (values) => {
    await createAppointment(values)
    setShowApptModal(false)
  }

  return (
    <PageContainer title="Dashboard">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-sans">{todayAppts?.length || 0}</p>
              <p className="text-sm font-sans text-muted-foreground">Today&apos;s Sessions</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-accent/10 p-3">
              <CalendarPlus className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold font-sans">{pendingCount}</p>
              <p className="text-sm font-sans text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-sans">{patients?.length || 0}</p>
              <p className="text-sm font-sans text-muted-foreground">Total Patients</p>
            </div>
          </div>
        </Card>
        <Card>
          <Link to="/pt/exercises" className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-50 p-3">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold font-sans">Exercise Library</p>
              <p className="text-sm font-sans text-muted-foreground">Browse & manage</p>
            </div>
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/pt/patients/new">
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Button>
        </Link>
        <Button variant="outline" className="gap-2" onClick={() => setShowApptModal(true)}>
          <CalendarPlus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-lg font-semibold font-sans">Today&apos;s Schedule</h2>
            {isLoading ? (
              <Spinner />
            ) : todayAppts?.length > 0 ? (
              <div className="space-y-3">
                {todayAppts.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    viewerRole="pt"
                    onConfirm={() => updateStatus(appt.id, 'confirmed')}
                    onCancel={() => updateStatus(appt.id, 'cancelled')}
                    onClick={(a) => navigate(`/pt/session/${a.id}`)}
                  />
                ))}
              </div>
            ) : (
              <p className="font-sans text-muted-foreground">No sessions scheduled today</p>
            )}
          </Card>
        </div>

        {/* Recent Patients */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-sans">Recent Patients</h2>
              <Link to="/pt/patients" className="text-sm font-sans text-primary hover:underline">
                View all
              </Link>
            </div>
            {patientsLoading ? (
              <Spinner />
            ) : patients?.length > 0 ? (
              <div className="space-y-2">
                {patients.slice(0, 5).map((p) => (
                  <PatientCard
                    key={p.id}
                    patient={p}
                    onClick={() => navigate(`/pt/patients/${p.id}`)}
                  />
                ))}
              </div>
            ) : (
              <p className="font-sans text-muted-foreground text-sm">No patients yet.</p>
            )}
          </Card>
        </div>
      </div>

      {/* New Appointment Modal */}
      <Modal
        open={showApptModal}
        onOpenChange={setShowApptModal}
        title="New Appointment"
      >
        <AppointmentForm
          onSubmit={handleCreateAppointment}
          patients={patients || []}
          currentPTId={user?.id}
        />
      </Modal>
    </PageContainer>
  )
}
