import { useState, useEffect, useCallback } from 'react'
import {
  getNotesByAppointment,
  getNotesByPatient,
  createNote,
  updateNote as updateNoteService,
} from '../services/notes.service'

export function useSessionNotes(filters = {}) {
  const { appointmentId, patientId } = filters
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNotes = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let data = []

      if (appointmentId) {
        data = await getNotesByAppointment(appointmentId)
      } else if (patientId) {
        data = await getNotesByPatient(patientId)
      }

      setNotes(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [appointmentId, patientId])

  useEffect(() => {
    if (appointmentId || patientId) {
      fetchNotes()
    } else {
      setNotes([])
      setIsLoading(false)
    }
  }, [fetchNotes, appointmentId, patientId])

  async function saveNote(noteData) {
    const data = await createNote(noteData)
    await fetchNotes()
    return data
  }

  async function updateNote(id, updates) {
    const data = await updateNoteService(id, updates)
    await fetchNotes()
    return data
  }

  return {
    notes,
    isLoading,
    error,
    saveNote,
    updateNote,
    refetch: fetchNotes,
  }
}

export default useSessionNotes
