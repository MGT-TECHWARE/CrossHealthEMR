import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

function getAuthStatus(auth) {
  const remaining = auth.authorized_visits - auth.visits_used
  const pct = (auth.visits_used / auth.authorized_visits) * 100
  const isExpired = auth.end_date && new Date(auth.end_date) < new Date()

  if (isExpired || auth.status === 'expired') return { variant: 'destructive', label: 'Expired', icon: XCircle, color: 'bg-red-500' }
  if (auth.status === 'exhausted' || remaining <= 0) return { variant: 'destructive', label: 'Exhausted', icon: XCircle, color: 'bg-red-500' }
  if (remaining <= (auth.alert_at_remaining || 3)) return { variant: 'warning', label: `${remaining} left`, icon: AlertTriangle, color: 'bg-amber-500' }
  return { variant: 'success', label: `${remaining} left`, icon: CheckCircle, color: 'bg-emerald-500' }
}

export default function AuthorizationDashboard({ authorizations = [], patients = [] }) {
  if (authorizations.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
        <p className="text-sm font-sans text-muted-foreground">No active authorizations to track.</p>
      </div>
    )
  }

  const sorted = [...authorizations].sort((a, b) => {
    const aRemaining = a.authorized_visits - a.visits_used
    const bRemaining = b.authorized_visits - b.visits_used
    return aRemaining - bRemaining
  })

  return (
    <div className="space-y-3">
      {sorted.map((auth) => {
        const status = getAuthStatus(auth)
        const StatusIcon = status.icon
        const pct = Math.min(100, (auth.visits_used / auth.authorized_visits) * 100)
        const patient = patients.find((p) => p.id === auth.patient_id)
        const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown'

        return (
          <Card key={auth.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold font-sans text-foreground">{patientName}</p>
                <p className="text-xs font-sans text-muted-foreground">
                  Auth #{auth.auth_number} | {auth.start_date} — {auth.end_date}
                </p>
              </div>
              <Badge variant={status.variant} className="gap-1 text-[10px]">
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${status.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-foreground tabular-nums">
                {auth.visits_used}/{auth.authorized_visits}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
