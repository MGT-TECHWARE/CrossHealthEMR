import { supabase } from './supabase'

export async function createPlan({ session_note_id, patient_id, pt_id, exercises, ai_raw_output, status }) {
  const { data, error } = await supabase
    .from('exercise_plans')
    .insert({
      session_note_id,
      patient_id,
      pt_id,
      exercises,
      ai_raw_output,
      status: status || 'draft',
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getPlansByPatient(patientId) {
  const { data, error } = await supabase
    .from('exercise_plans')
    .select('*, session_note:session_notes(*)')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function getPlanBySessionNote(sessionNoteId) {
  const { data, error } = await supabase
    .from('exercise_plans')
    .select('*')
    .eq('session_note_id', sessionNoteId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updatePlanStatus(id, status) {
  const { data, error } = await supabase
    .from('exercise_plans')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
