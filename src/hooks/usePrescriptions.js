import { useState, useEffect, useCallback } from 'react'
import {
  getPrescriptionsByPatient,
  createPrescription as createService,
  updatePrescription as updateService,
  deletePrescription as deleteService,
} from '@/services/prescriptions.service'

export default function usePrescriptions(patientId) {
  const [prescriptions, setPrescriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!patientId) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPrescriptionsByPatient(patientId)
      setPrescriptions(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    fetch()
  }, [fetch])

  async function createPrescription(data) {
    const result = await createService({ ...data, patient_id: patientId })
    await fetch()
    return result
  }

  async function updatePrescription(id, updates) {
    const result = await updateService(id, updates)
    await fetch()
    return result
  }

  async function deletePrescription(id) {
    await deleteService(id)
    await fetch()
  }

  return { prescriptions, isLoading, error, createPrescription, updatePrescription, deletePrescription, refetch: fetch }
}
