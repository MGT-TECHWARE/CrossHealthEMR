import { supabase } from './supabase'

export async function getNotesByAppointment(appointmentId) {
  const { data, error } = await supabase
    .from('session_notes')
    .select('*')
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getNotesByPatient(patientId) {
  const { data, error } = await supabase
    .from('session_notes')
    .select('*, appointment:appointments(*)')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getNotesByPatientAndType(patientId, noteType) {
  const { data, error } = await supabase
    .from('session_notes')
    .select('*, appointment:appointments(*)')
    .eq('patient_id', patientId)
    .eq('note_type', noteType)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getLatestNoteForPatient(patientId) {
  const { data, error } = await supabase
    .from('session_notes')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createNote({
  appointment_id, pt_id, patient_id,
  subjective, objective, assessment, plan,
  subjective_data, objective_data, assessment_data, plan_data,
  note_type, status, complexity,
  total_treatment_minutes, time_in, time_out,
  carried_exercises, treatment_plan,
}) {
  const { data, error } = await supabase
    .from('session_notes')
    .insert({
      appointment_id,
      pt_id,
      patient_id,
      subjective: subjective || '',
      objective: objective || '',
      assessment: assessment || '',
      plan: plan || '',
      subjective_data: subjective_data || {},
      objective_data: objective_data || {},
      assessment_data: assessment_data || {},
      plan_data: plan_data || {},
      note_type: note_type || 'daily_note',
      status: status || 'draft',
      complexity: complexity || null,
      total_treatment_minutes: total_treatment_minutes || null,
      time_in: time_in || null,
      time_out: time_out || null,
      carried_exercises: carried_exercises || [],
      treatment_plan: treatment_plan || {},
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNote(id, updates) {
  const { data, error } = await supabase
    .from('session_notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function signNote(noteId, { signed_by_name, signed_by_license, signature_data }) {
  const { data, error } = await supabase
    .from('session_notes')
    .update({
      status: 'signed',
      signed_at: new Date().toISOString(),
      signed_by_name,
      signed_by_license,
      signature_data,
    })
    .eq('id', noteId)
    .select()
    .single()

  if (error) throw error
  return data
}
