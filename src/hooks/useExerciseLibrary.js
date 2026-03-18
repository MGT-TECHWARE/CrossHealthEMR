import { useState, useEffect, useCallback } from 'react'
import { getAllExercises } from '../services/exercises.service'

export function useExerciseLibrary(filters = {}) {
  const { bodyPart, difficulty, search } = filters
  const [exercises, setExercises] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchExercises = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const serviceFilters = {}

      if (bodyPart) serviceFilters.body_part = bodyPart
      if (difficulty) serviceFilters.difficulty = difficulty
      if (search) serviceFilters.search = search

      const data = await getAllExercises(serviceFilters)
      setExercises(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [bodyPart, difficulty, search])

  useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  return {
    exercises,
    isLoading,
    error,
    refetch: fetchExercises,
  }
}

export default useExerciseLibrary
