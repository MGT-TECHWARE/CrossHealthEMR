import { Play, Pause, Square, ArrowLeft, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/ui/Button'

export default function SessionHeader({
  patientName,
  appointmentReason,
  timer,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onEndSession,
}) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const role = useAuthStore((s) => s.role)
  const base = role === 'admin' ? '/admin' : '/pt'
  const timerColor = timer.isRunning
    ? 'text-primary'
    : timer.isPaused
      ? 'text-amber-600'
      : 'text-muted-foreground'

  const hasStarted = timer.elapsedSeconds > 0 || timer.isRunning

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border/60 bg-white px-6 py-3 shadow-sm">
      {/* Back + Patient info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => navigate(`${base}/dashboard`)}
          className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">{patientName}</h1>
          {appointmentReason && (
            <p className="text-sm font-sans text-muted-foreground truncate">{appointmentReason}</p>
          )}
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-4">
        <div className={`font-mono text-2xl font-bold ${timerColor} tabular-nums`}>
          {timer.formattedTime}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!hasStarted && (
            <Button onClick={onStartTimer} className="gap-2">
              <Play className="h-4 w-4" />
              Start Session
            </Button>
          )}

          {timer.isRunning && (
            <Button variant="outline" onClick={onPauseTimer} className="gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}

          {timer.isPaused && (
            <Button variant="gold" onClick={onResumeTimer} className="gap-2">
              <Play className="h-4 w-4" />
              Resume
            </Button>
          )}

          {hasStarted && (
            <Button variant="destructive" size="sm" onClick={onEndSession} className="gap-2">
              <Square className="h-3 w-3" />
              End
            </Button>
          )}

          <div className="w-px h-6 bg-border/60 mx-1" />

          <button
            onClick={logout}
            className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
