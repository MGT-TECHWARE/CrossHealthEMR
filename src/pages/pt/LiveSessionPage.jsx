import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Dumbbell, ClipboardList, GripVertical } from 'lucide-react'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import SessionHeader from '@/components/session/SessionHeader'
import LiveSOAPEditor from '@/components/session/LiveSOAPEditor'
import ExercisePicker from '@/components/session/ExercisePicker'
import HEPBuilder from '@/components/session/HEPBuilder'
import useSessionTimer from '@/hooks/useSessionTimer'
import { useNoteStore } from '@/stores/noteStore'
import { useSessionNotes } from '@/hooks/useSessionNotes'
import { useAuthStore } from '@/stores/authStore'
import { getAppointmentById, updateAppointmentStatus } from '@/services/appointments.service'
import { getLatestNoteForPatient } from '@/services/notes.service'
import { createPlan } from '@/services/exercisePlan.service'
import { getActiveAuthorization, incrementVisitsUsed } from '@/services/authorizations.service'
import { structuredToText } from '@/schemas/note.schema'
import useResizablePanels from '@/hooks/useResizablePanels'
import { NOTE_TYPE_LABELS } from '@/constants/noteTypes'

// Map appointment_type to note_type
function appointmentToNoteType(appointmentType) {
  const map = {
    initial_eval: 'initial_evaluation',
    follow_up: 'daily_note',
    re_eval: 're_evaluation',
    discharge: 'discharge',
    wellness: 'daily_note',
  }
  return map[appointmentType] || 'daily_note'
}

export default function LiveSessionPage() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role)
  const base = role === 'admin' ? '/admin' : '/pt'
  const timer = useSessionTimer()
  const { draft, clearDraft, updateDraft } = useNoteStore()
  const { saveNote } = useSessionNotes()

  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hepExercises, setHepExercises] = useState([])
  const [saveStatus, setSaveStatus] = useState('idle')
  const [noteType, setNoteType] = useState('daily_note')
  const { sizes, containerRef, handleMouseDown } = useResizablePanels(3, 15)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAppointmentById(appointmentId)
        setAppointment(data)
        // Set note type from appointment type
        const nt = appointmentToNoteType(data.appointment_type)
        setNoteType(nt)
        updateDraft('note_type', nt)

        // Load carried exercises from previous note
        if (data.patient_id) {
          try {
            const prevNote = await getLatestNoteForPatient(data.patient_id)
            if (prevNote?.carried_exercises?.length > 0) {
              updateDraft('carried_exercises', prevNote.carried_exercises)
            }
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load appointment:', err)
      } finally {
        setLoading(false)
      }
    }
    if (appointmentId) load()
    clearDraft()
    return () => clearDraft()
  }, [appointmentId])

  // HEP management
  const selectedExerciseIds = new Set(hepExercises.map((e) => e.id))

  const handleToggleExercise = (exercise) => {
    if (selectedExerciseIds.has(exercise.id)) {
      setHepExercises((prev) => prev.filter((e) => e.id !== exercise.id))
    } else {
      setHepExercises((prev) => [
        ...prev,
        {
          ...exercise,
          sets: exercise.sets || 3,
          reps: exercise.reps || 10,
          hold_seconds: 0,
          frequency: '1x daily',
          exerciseNotes: '',
          rationale: '',
        },
      ])
    }
  }

  const handleRemoveExercise = (exerciseId) => {
    setHepExercises((prev) => prev.filter((e) => e.id !== exerciseId))
  }

  const handleReorderExercises = (newList) => {
    setHepExercises(newList)
  }

  const handleUpdateExercise = (index, updates) => {
    setHepExercises((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...updates }
      return next
    })
  }

  const buildNotePayload = (status = 'draft') => {
    const textFields = structuredToText(draft)
    return {
      appointment_id: appointmentId,
      patient_id: appointment?.patient_id,
      pt_id: user?.id,
      ...textFields,
      subjective_data: draft.subjective_data || {},
      objective_data: draft.objective_data || {},
      assessment_data: draft.assessment_data || {},
      plan_data: draft.plan_data || {},
      note_type: noteType,
      status,
      complexity: draft.assessment_data?.complexity || null,
      total_treatment_minutes: timer.totalMinutes,
      time_in: timer.startTime ? new Date(timer.startTime).toISOString() : null,
      time_out: status === 'completed' ? new Date().toISOString() : null,
      carried_exercises: hepExercises.map((e) => ({
        exercise_id: e.id,
        name: e.name,
        sets: e.sets,
        reps: e.reps,
      })),
      treatment_plan: draft.plan_data || {},
    }
  }

  const handleSaveDraft = async () => {
    setSaveStatus('saving')
    try {
      await saveNote(buildNotePayload('draft'))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      console.error('Save draft failed:', err)
      setSaveStatus('error')
    }
  }

  const handleSaveAndComplete = async () => {
    setSaveStatus('saving')
    try {
      const note = await saveNote(buildNotePayload('completed'))

      if (hepExercises.length > 0) {
        await createPlan({
          session_note_id: note?.id || null,
          patient_id: appointment?.patient_id,
          pt_id: user?.id,
          exercises: hepExercises.map((e) => ({
            exercise_id: e.id,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            hold_seconds: e.hold_seconds || 0,
            frequency: e.frequency || '1x daily',
            notes: e.exerciseNotes,
            special_instructions: e.exerciseNotes,
            difficulty: e.difficulty,
            body_part: e.body_part,
            rationale: e.rationale,
          })),
          ai_raw_output: null,
          status: 'sent',
        })
      }

      await updateAppointmentStatus(appointmentId, 'completed')

      try {
        const auth = await getActiveAuthorization(appointment?.patient_id)
        if (auth) await incrementVisitsUsed(auth.id)
      } catch {}

      timer.stop()
      setSaveStatus('saved')
      clearDraft()
      setTimeout(() => navigate(`${base}/dashboard`), 1000)
    } catch (err) {
      console.error('Save and complete failed:', err)
      setSaveStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="max-w-md text-center p-8">
          <p className="text-foreground font-sans font-semibold mb-2">Appointment not found</p>
          <button onClick={() => navigate(`${base}/dashboard`)} className="text-primary font-sans text-sm hover:underline">
            Return to Dashboard
          </button>
        </Card>
      </div>
    )
  }

  const patientName = appointment.patient
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : 'Patient'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SessionHeader
        patientName={patientName}
        appointmentReason={appointment.reason}
        timer={timer}
        onStartTimer={timer.start}
        onPauseTimer={timer.pause}
        onResumeTimer={timer.resume}
        onEndSession={handleSaveAndComplete}
      />

      <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row gap-0 p-3">
        {/* Panel 1: SOAP Notes */}
        <div style={{ width: `${sizes[0]}%` }} className="min-w-0">
          <Card className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold font-sans text-foreground">SOAP Notes</h3>
            </div>
            <div className="flex-1">
              <LiveSOAPEditor
                noteType={noteType}
                patient={appointment.patient}
              />
            </div>
          </Card>
        </div>

        {/* Divider 1 */}
        <div
          onMouseDown={(e) => handleMouseDown(0, e)}
          className="hidden lg:flex items-center justify-center w-2 cursor-col-resize group hover:bg-primary/10 rounded transition-colors mx-0.5 shrink-0"
        >
          <GripVertical className="h-5 w-5 text-border group-hover:text-primary transition-colors" />
        </div>

        {/* Panel 2: Exercise Library */}
        <div style={{ width: `${sizes[1]}%` }} className="min-w-0 mt-3 lg:mt-0">
          <Card className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold font-sans text-foreground">Exercise Library</h3>
            </div>
            <ExercisePicker
              selectedExerciseIds={selectedExerciseIds}
              onAddExercise={handleToggleExercise}
            />
          </Card>
        </div>

        {/* Divider 2 */}
        <div
          onMouseDown={(e) => handleMouseDown(1, e)}
          className="hidden lg:flex items-center justify-center w-2 cursor-col-resize group hover:bg-primary/10 rounded transition-colors mx-0.5 shrink-0"
        >
          <GripVertical className="h-5 w-5 text-border group-hover:text-primary transition-colors" />
        </div>

        {/* Panel 3: Home Exercise Plan */}
        <div style={{ width: `${sizes[2]}%` }} className="min-w-0 mt-3 lg:mt-0">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold font-sans text-foreground">
                  Home Exercise Plan
                  {hepExercises.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary text-white text-[10px] font-bold px-1">
                      {hepExercises.length}
                    </span>
                  )}
                </h3>
              </div>
              <span className={`font-mono text-base font-bold tabular-nums ${timer.isRunning ? 'text-primary' : timer.isPaused ? 'text-amber-600' : 'text-muted-foreground'}`}>
                {timer.formattedTime}
              </span>
            </div>
            <HEPBuilder
              exercises={hepExercises}
              onReorder={handleReorderExercises}
              onUpdateExercise={handleUpdateExercise}
              onRemoveExercise={handleRemoveExercise}
              onSaveAndComplete={handleSaveAndComplete}
              onSaveDraft={handleSaveDraft}
              saveStatus={saveStatus}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
