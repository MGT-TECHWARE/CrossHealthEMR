import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import ExercisePlanViewer from '@/components/exercises/ExercisePlanViewer'
import useAppointments from '@/hooks/useAppointments'
import useExercisePlan from '@/hooks/useExercisePlan'
import { useAuthStore } from '@/stores/authStore'
import { CalendarPlus, ClipboardList } from 'lucide-react'

export default function PatientDashboard() {
  const user = useAuthStore((s) => s.user)
  const { appointments, isLoading: apptLoading } = useAppointments({
    patientId: user?.id,
  })
  const { plans, isLoading: planLoading } = useExercisePlan({
    patientId: user?.id,
  })

  const upcoming = appointments
    ?.filter((a) => a.status !== 'cancelled' && new Date(a.scheduled_at) > new Date())
    ?.slice(0, 3)

  const latestPlan = plans?.[0]

  return (
    <PageContainer title="Dashboard">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <Link to="/patient/book">
              <Button size="sm">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Book New
              </Button>
            </Link>
          </div>
          {apptLoading ? (
            <Spinner />
          ) : upcoming?.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} viewerRole="patient" />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming appointments</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Latest Exercise Plan</h2>
            <Link to="/patient/exercises">
              <Button variant="outline" size="sm">
                <ClipboardList className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
          </div>
          {planLoading ? (
            <Spinner />
          ) : latestPlan ? (
            <ExercisePlanViewer plan={latestPlan} />
          ) : (
            <p className="text-muted-foreground">No exercise plans yet</p>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}
