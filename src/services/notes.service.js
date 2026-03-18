import { supabase } from './supabase'

export async function getNotesByAppointment(appointmentId) {
  const { data, error } = await supabase
    .from('session_notes')
    .select('*')
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function getNotesByPatient(patientId) {
  const { data, error } = await supabase
    .from('session_notes')
    .select('*, appointment:appointments(*)')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function createNote({ appointment_id, pt_id, patient_id, subjective, objective, assessment, plan }) {
  const { data, error } = await supabase
    .from('session_notes')
    .insert({
      appointment_id,
      pt_id,
      patient_id,
      subjective,
      objective,
      assessment,
      plan,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateNote(id, updates) {
  const { data, error } = await supabase
    .from('session_notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
