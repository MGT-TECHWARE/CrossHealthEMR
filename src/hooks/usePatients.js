import { useState, useEffect, useCallback } from 'react'
import {
  getPatientsByPT,
  createPatient as createPatientService,
  updatePatient as updatePatientService,
  searchPatients as searchPatientsService,
} from '../services/patients.service'
import { useAuthStore } from '../stores/authStore'

export function usePatients() {
  const user = useAuthStore((s) => s.user)
  const isAuthLoading = useAuthStore((s) => s.isLoading)
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPatients = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getPatientsByPT()
      setPatients(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthLoading) return
    if (user) {
      fetchPatients()
    } else {
      setPatients([])
      setIsLoading(false)
    }
  }, [fetchPatients, user, isAuthLoading])

  async function createPatient(patientData) {
    const data = await createPatientService({ ...patientData, created_by: user?.id })
    await fetchPatients()
    return data
  }

  async function updatePatient(patientId, updates) {
    const data = await updatePatientService(patientId, updates)
    await fetchPatients()
    return data
  }

  async function searchPatients(query) {
    const data = await searchPatientsService(query)
    return data
  }

  return {
    patients,
    isLoading,
    error,
    createPatient,
    updatePatient,
    searchPatients,
    refetch: fetchPatients,
  }
}

export default usePatients
