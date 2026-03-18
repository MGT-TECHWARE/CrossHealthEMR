import { useState, useEffect, useCallback } from 'react'
import {
  getPlansByPatient,
  getPlanBySessionNote,
  createPlan as createPlanService,
  updatePlanStatus as updatePlanStatusService,
} from '../services/exercisePlan.service'

export function useExercisePlan(filters = {}) {
  const { patientId, sessionNoteId } = filters
  const [plans, setPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPlans = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let data = []

      if (sessionNoteId) {
        const plan = await getPlanBySessionNote(sessionNoteId)
        data = plan ? [plan] : []
      } else if (patientId) {
        data = await getPlansByPatient(patientId)
      }

      setPlans(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [patientId, sessionNoteId])

  useEffect(() => {
    if (patientId || sessionNoteId) {
      fetchPlans()
    } else {
      setPlans([])
      setIsLoading(false)
    }
  }, [fetchPlans, patientId, sessionNoteId])

  async function createPlan(planData) {
    const data = await createPlanService(planData)
    await fetchPlans()
    return data
  }

  async function updatePlanStatus(id, status) {
    const data = await updatePlanStatusService(id, status)
    await fetchPlans()
    return data
  }

  return {
    plans,
    isLoading,
    error,
    createPlan,
    updatePlanStatus,
    refetch: fetchPlans,
  }
}

export default useExercisePlan
