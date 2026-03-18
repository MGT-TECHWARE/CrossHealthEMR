import { useState, useEffect } from 'react'
import AILoadingState from '@/components/ai/AILoadingState'
import AIErrorState from '@/components/ai/AIErrorState'
import ExerciseApprovalPanel from '@/components/exercises/ExerciseApprovalPanel'
import { useExerciseMatch } from '@/hooks/useExerciseMatch'
import { useExercisePlan } from '@/hooks/useExercisePlan'
import { useAuthStore } from '@/stores/authStore'

export default function AIMatchPanel({ soapNoteText, onPlanCreated, appointmentId, patientId }) {
  const { runMatch } = useExerciseMatch()
  const { createPlan } = useExercisePlan()
  const user = useAuthStore((s) => s.user)
  const [status, setStatus] = useState('idle')
  const [matches, setMatches] = useState(null)
  const [rawOutput, setRawOutput] = useState('')
  const [error, setError] = useState(null)

  const executeMatch = async () => {
    setStatus('loading')
    setError(null)
    try {
      const result = await runMatch(soapNoteText)
      setMatches(result.matchedExercises || result)
      setRawOutput(result.rawOutput || '')
      setStatus('success')
    } catch (err) {
      setError(err)
      setStatus('error')
    }
  }

  useEffect(() => {
    if (soapNoteText) {
      executeMatch()
    }
  }, [soapNoteText])

  const handleRetry = () => {
    executeMatch()
  }

  const handleComplete = async (approvedExercises) => {
    try {
      await createPlan({
        session_note_id: null,
        patient_id: patientId,
        pt_id: user?.id,
        exercises: approvedExercises,
        ai_raw_output: rawOutput,
        status: 'draft',
      })
      onPlanCreated?.(approvedExercises)
    } catch (err) {
      console.error('Failed to save exercise plan:', err)
    }
  }

  if (status === 'loading') {
    return <AILoadingState />
  }

  if (status === 'error') {
    return <AIErrorState error={error} onRetry={handleRetry} />
  }

  if (status === 'success' && matches) {
    return (
      <ExerciseApprovalPanel
        matches={matches}
        onComplete={handleComplete}
      />
    )
  }

  return null
}
