import { supabase } from './supabase'

export async function getPatientsByPT(ptId) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('created_by', ptId)
    .order('last_name')

  if (error) throw error
  return data
}

export async function getAllPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('last_name')

  if (error) throw error
  return data
}

export async function getPatientById(patientId) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single()

  if (error) throw error
  return data
}

export async function createPatient(patientData) {
  const { data, error } = await supabase
    .from('patients')
    .insert(patientData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePatient(patientId, updates) {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', patientId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function searchPatients(query, ptId) {
  let q = supabase
    .from('patients')
    .select('*')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('last_name')

  if (ptId) {
    q = q.eq('created_by', ptId)
  }

  const { data, error } = await q
  if (error) throw error
  return data
}
