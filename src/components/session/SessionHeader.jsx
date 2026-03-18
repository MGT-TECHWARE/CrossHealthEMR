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
    <header className="sticky top-0 z-20 border-b border-border/60 bg-white px-3 sm:px-6 py-2 sm:py-3 shadow-sm">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Back + Patient info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate(`${base}/dashboard`)}
            className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">{patientName}</h1>
            {appointmentReason && (
              <p className="text-xs sm:text-sm font-sans text-muted-foreground truncate hidden sm:block">{appointmentReason}</p>
            )}
          </div>
        </div>

        {/* Timer + Controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className={`font-mono text-lg sm:text-2xl font-bold ${timerColor} tabular-nums`}>
            {timer.formattedTime}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!hasStarted && (
              <Button size="sm" onClick={onStartTimer} className="gap-1.5">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Start Session</span>
                <span className="sm:hidden">Start</span>
              </Button>
            )}

            {timer.isRunning && (
              <Button variant="outline" size="sm" onClick={onPauseTimer} className="gap-1.5">
                <Pause className="h-4 w-4" />
                <span className="hidden sm:inline">Pause</span>
              </Button>
            )}

            {timer.isPaused && (
              <Button variant="gold" size="sm" onClick={onResumeTimer} className="gap-1.5">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Resume</span>
              </Button>
            )}

            {hasStarted && (
              <Button variant="destructive" size="sm" onClick={onEndSession} className="gap-1.5">
                <Square className="h-3 w-3" />
                <span className="hidden sm:inline">End</span>
              </Button>
            )}

            <div className="hidden sm:block w-px h-6 bg-border/60 mx-1" />

            <button
              onClick={logout}
              className="hidden sm:flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
