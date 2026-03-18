import { useState, useEffect, useCallback } from 'react'
import {
  getAppointmentsByPatient,
  getAppointmentsByPT,
  createAppointment as createAppointmentService,
  updateAppointmentStatus,
  checkInAppointment as checkInService,
} from '../services/appointments.service'

export function useAppointments(filters = {}) {
  const { patientId, ptId } = filters
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let data = []

      if (patientId) {
        data = await getAppointmentsByPatient(patientId)
      } else if (ptId) {
        data = await getAppointmentsByPT(ptId)
      }

      setAppointments(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [patientId, ptId])

  useEffect(() => {
    if (patientId || ptId) {
      fetchAppointments()
    } else {
      setAppointments([])
      setIsLoading(false)
    }
  }, [fetchAppointments, patientId, ptId])

  async function createAppointment(appointmentData) {
    const data = await createAppointmentService(appointmentData)
    await fetchAppointments()
    return data
  }

  async function updateStatus(id, status) {
    const data = await updateAppointmentStatus(id, status)
    await fetchAppointments()
    return data
  }

  async function checkIn(id, userId) {
    const data = await checkInService(id, userId)
    await fetchAppointments()
    return data
  }

  return {
    appointments,
    isLoading,
    error,
    createAppointment,
    updateStatus,
    checkIn,
    refetch: fetchAppointments,
  }
}

export default useAppointments
