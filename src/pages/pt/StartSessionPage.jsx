import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Stethoscope, CalendarCheck, UserPlus, Plus, Users } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import usePatients from '@/hooks/usePatients'
import useAppointments from '@/hooks/useAppointments'
import { useAuthStore } from '@/stores/authStore'
import { createAppointment } from '@/services/appointments.service'
import { formatDate } from '@/utils/formatDate'

export default function StartSessionPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.role)
  const base = role === 'admin' ? '/admin' : '/pt'
  const { patients, isLoading: patientsLoading } = usePatients()
  const { appointments, isLoading: apptsLoading } = useAppointments()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('appointments')
  const [showQuickAppt, setShowQuickAppt] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [quickReason, setQuickReason] = useState('')
  const [creating, setCreating] = useState(false)

  // Filter today's and upcoming appointments that aren't completed/cancelled
  const activeAppointments = appointments
    ?.filter((a) => {
      const isActive = a.status === 'pending' || a.status === 'confirmed'
      return isActive
    })
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)) || []

  const todayAppointments = activeAppointments.filter((a) => {
    return new Date(a.scheduled_at).toDateString() === new Date().toDateString()
  })

  const upcomingAppointments = activeAppointments.filter((a) => {
    return new Date(a.scheduled_at).toDateString() !== new Date().toDateString()
  })

  // Filter patients by search
  const filteredPatients = patients?.filter((p) => {
    if (!searchQuery.trim()) return true
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) || p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  }) || []

  // Start session from existing appointment
  const handleStartFromAppointment = (appointmentId) => {
    navigate(`${base}/session/${appointmentId}`)
  }

  // Quick-create appointment and start session
  const handleQuickStart = async () => {
    if (!selectedPatient) return
    setCreating(true)
    try {
      const appt = await createAppointment({
        patient_id: selectedPatient.id,
        pt_id: user?.id,
        scheduled_at: new Date().toISOString(),
        duration_minutes: 60,
        reason: quickReason || 'Walk-in session',
      })
      setShowQuickAppt(false)
      navigate(`${base}/session/${appt.id}`)
    } catch (err) {
      console.error('Failed to create appointment:', err)
    } finally {
      setCreating(false)
    }
  }

  // Start from patient (opens quick appointment modal)
  const handleStartFromPatient = (patient) => {
    setSelectedPatient(patient)
    setQuickReason('')
    setShowQuickAppt(true)
  }

  const isLoading = patientsLoading || apptsLoading

  return (
    <PageContainer title="Start Live Session">
      {/* Tab toggle */}
      <div className="flex items-center gap-1 mb-6 border-b border-border/60">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 pb-3 text-sm font-medium font-sans border-b-2 transition-colors ${
            activeTab === 'appointments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CalendarCheck className="inline h-4 w-4 mr-1.5 -mt-0.5" />
          From Appointment
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`px-4 pb-3 text-sm font-medium font-sans border-b-2 transition-colors ${
            activeTab === 'patients'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserPlus className="inline h-4 w-4 mr-1.5 -mt-0.5" />
          From Patient (Walk-in)
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : activeTab === 'appointments' ? (
        <div className="space-y-6">
          {/* Today's appointments */}
          {todayAppointments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold font-sans text-foreground mb-3 uppercase tracking-wide">
                Today&apos;s Appointments
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {todayAppointments.map((appt) => {
                  const patientName = appt.patient
                    ? `${appt.patient.first_name} ${appt.patient.last_name}`
                    : 'Unknown Patient'
                  return (
                    <Card
                      key={appt.id}
                      className="cursor-pointer hover:border-primary/30 transition-all"
                      onClick={() => handleStartFromAppointment(appt.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold font-sans text-foreground">{patientName}</p>
                        <Badge variant="default">Today</Badge>
                      </div>
                      <p className="text-sm font-sans text-muted-foreground">
                        {new Date(appt.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        {' — '}{appt.duration_minutes} min
                      </p>
                      {appt.reason && (
                        <p className="text-sm font-sans text-muted-foreground mt-1 line-clamp-1">{appt.reason}</p>
                      )}
                      <Button size="sm" className="w-full mt-3 gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Start Session
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold font-sans text-foreground mb-3 uppercase tracking-wide">
                Upcoming
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingAppointments.slice(0, 9).map((appt) => {
                  const patientName = appt.patient
                    ? `${appt.patient.first_name} ${appt.patient.last_name}`
                    : 'Unknown Patient'
                  return (
                    <Card
                      key={appt.id}
                      className="cursor-pointer hover:border-primary/30 transition-all"
                      onClick={() => handleStartFromAppointment(appt.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold font-sans text-foreground">{patientName}</p>
                        <Badge variant="outline">{formatDate(appt.scheduled_at)}</Badge>
                      </div>
                      <p className="text-sm font-sans text-muted-foreground">
                        {new Date(appt.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        {' — '}{appt.duration_minutes} min
                      </p>
                      {appt.reason && (
                        <p className="text-sm font-sans text-muted-foreground mt-1 line-clamp-1">{appt.reason}</p>
                      )}
                      <Button size="sm" variant="outline" className="w-full mt-3 gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Start Session
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {activeAppointments.length === 0 && (
            <Card className="text-center py-12">
              <CalendarCheck className="h-10 w-10 text-border mx-auto mb-3" />
              <p className="font-sans text-muted-foreground mb-2">No active appointments</p>
              <p className="text-sm font-sans text-muted-foreground mb-4">
                Switch to the &quot;From Patient&quot; tab to start a walk-in session
              </p>
              <Button variant="outline" onClick={() => setActiveTab('patients')}>
                Start Walk-in Session
              </Button>
            </Card>
          )}
        </div>
      ) : (
        /* Patients tab */
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-white pl-10 pr-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {filteredPatients.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient) => {
                const initials = (patient.first_name?.[0] || '') + (patient.last_name?.[0] || '')
                return (
                  <Card
                    key={patient.id}
                    className="cursor-pointer hover:border-primary/30 transition-all"
                    onClick={() => handleStartFromPatient(patient)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm font-sans shrink-0">
                        {initials.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold font-sans text-foreground truncate">
                          {patient.first_name} {patient.last_name}
                        </p>
                        {patient.phone && (
                          <p className="text-xs font-sans text-muted-foreground">{patient.phone}</p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Quick Session
                    </Button>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <Users className="h-10 w-10 text-border mx-auto mb-3" />
              <p className="font-sans text-muted-foreground">
                {searchQuery ? 'No patients found' : 'No patients yet'}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Quick appointment modal */}
      <Modal open={showQuickAppt} onOpenChange={setShowQuickAppt} title="Quick Session">
        {selectedPatient && (
          <div className="space-y-4">
            <p className="text-sm font-sans text-muted-foreground">
              Starting a walk-in session for{' '}
              <span className="font-medium text-foreground">
                {selectedPatient.first_name} {selectedPatient.last_name}
              </span>
            </p>
            <div>
              <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
                Reason for Visit
              </label>
              <textarea
                value={quickReason}
                onChange={(e) => setQuickReason(e.target.value)}
                placeholder="Brief description (optional)..."
                rows={3}
                className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleQuickStart} disabled={creating} className="flex-1 gap-2">
                {creating ? (
                  <><Spinner size="sm" className="text-white" /> Creating...</>
                ) : (
                  <><Stethoscope className="h-4 w-4" /> Start Session</>
                )}
              </Button>
              <Button variant="ghost" onClick={() => setShowQuickAppt(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}
