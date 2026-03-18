import { useState, useEffect } from 'react'
import { Activity, FileCheck } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import AuthorizationDashboard from '@/components/tracking/AuthorizationDashboard'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { useAuthStore } from '@/stores/authStore'
import usePatients from '@/hooks/usePatients'
import { supabase } from '@/services/supabase'

export default function TrackingPage() {
  const user = useAuthStore((s) => s.user)
  const { patients, isLoading: patientsLoading } = usePatients()
  const [authorizations, setAuthorizations] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        // Get all active authorizations for this PT's patients
        const patientIds = patients?.map((p) => p.id) || []
        if (patientIds.length > 0) {
          const { data: auths } = await supabase
            .from('authorizations')
            .select('*')
            .in('patient_id', patientIds)
            .in('status', ['active', 'pending'])
            .order('end_date', { ascending: true })

          setAuthorizations(auths || [])

          const { data: rxs } = await supabase
            .from('prescriptions')
            .select('*, patient:patients(first_name, last_name)')
            .in('patient_id', patientIds)
            .eq('status', 'active')
            .order('expiration_date', { ascending: true })

          setPrescriptions(rxs || [])
        }
      } catch (err) {
        console.error('Failed to load tracking data:', err)
      } finally {
        setLoading(false)
      }
    }
    if (!patientsLoading && patients) load()
  }, [patients, patientsLoading])

  const isLoading = loading || patientsLoading

  return (
    <PageContainer title="Authorization & Rx Tracking">
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Authorizations */}
          <div>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold font-sans text-foreground">Authorizations</h2>
              </div>
              <AuthorizationDashboard
                authorizations={authorizations}
                patients={patients || []}
              />
            </Card>
          </div>

          {/* Active Prescriptions */}
          <div>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold font-sans text-foreground">Active Prescriptions</h2>
              </div>
              {prescriptions.length === 0 ? (
                <p className="text-sm font-sans text-muted-foreground text-center py-8">No active prescriptions.</p>
              ) : (
                <div className="space-y-2">
                  {prescriptions.map((rx) => {
                    const patientName = rx.patient ? `${rx.patient.first_name} ${rx.patient.last_name}` : 'Unknown'
                    const daysLeft = rx.expiration_date
                      ? Math.ceil((new Date(rx.expiration_date) - new Date()) / (1000 * 60 * 60 * 24))
                      : null

                    return (
                      <div key={rx.id} className="border border-border/60 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium font-sans text-foreground">{patientName}</p>
                            <p className="text-xs font-sans text-muted-foreground">
                              Dr. {rx.physician_name} | {rx.frequency || 'N/A'}
                              {rx.visits_authorized && ` | ${rx.visits_authorized} visits`}
                            </p>
                          </div>
                          {daysLeft !== null && (
                            <span className={`text-xs font-medium font-sans px-2 py-0.5 rounded-full ${
                              daysLeft < 0 ? 'bg-red-50 text-red-700' :
                              daysLeft <= 14 ? 'bg-amber-50 text-amber-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {daysLeft < 0 ? 'Expired' : `${daysLeft}d left`}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
