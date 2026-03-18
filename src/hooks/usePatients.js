import { useState, useEffect, useCallback } from 'react'
import {
  getPatientsByPT,
  createPatient as createPatientService,
  updatePatient as updatePatientService,
  searchPatients as searchPatientsService,
} from '../services/patients.service'

export function usePatients(ptId) {
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPatients = useCallback(async () => {
    if (!ptId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getPatientsByPT(ptId)
      setPatients(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [ptId])

  useEffect(() => {
    if (ptId) {
      fetchPatients()
    } else {
      setPatients([])
      setIsLoading(false)
    }
  }, [fetchPatients, ptId])

  async function createPatient(patientData) {
    const data = await createPatientService({ ...patientData, created_by: ptId })
    await fetchPatients()
    return data
  }

  async function updatePatient(patientId, updates) {
    const data = await updatePatientService(patientId, updates)
    await fetchPatients()
    return data
  }

  async function searchPatients(query) {
    const data = await searchPatientsService(query, ptId)
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
