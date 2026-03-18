import { useState } from 'react'
import { matchExercisesFromNotes } from '../services/ai.service'

export function useExerciseMatch() {
  const [matchedExercises, setMatchedExercises] = useState([])
  const [rawOutput, setRawOutput] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function runMatch(soapNoteText) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await matchExercisesFromNotes(soapNoteText)
      setMatchedExercises(result.exercises ?? [])
      setRawOutput(result.rawOutput ?? result)
    } catch (err) {
      setError(err)
      setMatchedExercises([])
      setRawOutput(null)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    matchedExercises,
    rawOutput,
    isLoading,
    error,
    runMatch,
  }
}

export default useExerciseMatch
