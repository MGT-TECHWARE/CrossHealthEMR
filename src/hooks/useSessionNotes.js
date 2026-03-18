import { useState, useEffect, useCallback } from 'react'
import {
  getNotesByAppointment,
  getNotesByPatient,
  getNotesByPatientAndType,
  getLatestNoteForPatient,
  createNote,
  updateNote as updateNoteService,
  signNote as signNoteService,
} from '../services/notes.service'

export function useSessionNotes(filters = {}) {
  const { appointmentId, patientId, noteType } = filters
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
      } else if (patientId && noteType) {
        data = await getNotesByPatientAndType(patientId, noteType)
      } else if (patientId) {
        data = await getNotesByPatient(patientId)
      }

      setNotes(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [appointmentId, patientId, noteType])

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

  async function signNote(noteId, signatureData) {
    const data = await signNoteService(noteId, signatureData)
    await fetchNotes()
    return data
  }

  return {
    notes,
    isLoading,
    error,
    saveNote,
    updateNote,
    signNote,
    refetch: fetchNotes,
  }
}

export default useSessionNotes
