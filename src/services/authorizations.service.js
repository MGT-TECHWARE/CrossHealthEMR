import { supabase } from './supabase'

export async function getAuthorizationsByPatient(patientId) {
  const { data, error } = await supabase
    .from('authorizations')
    .select('*')
    .eq('patient_id', patientId)
    .order('start_date', { ascending: false })

  if (error) throw error
  return data
}

export async function getActiveAuthorization(patientId) {
  const { data, error } = await supabase
    .from('authorizations')
    .select('*')
    .eq('patient_id', patientId)
    .eq('status', 'active')
    .order('end_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createAuthorization(data) {
  const { data: authorization, error } = await supabase
    .from('authorizations')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return authorization
}

export async function updateAuthorization(authId, updates) {
  const { data, error } = await supabase
    .from('authorizations')
    .update(updates)
    .eq('id', authId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function incrementVisitsUsed(authId) {
  const { data: current, error: fetchError } = await supabase
    .from('authorizations')
    .select('*')
    .eq('id', authId)
    .single()

  if (fetchError) throw fetchError

  const newVisitsUsed = (current.visits_used || 0) + 1
  const updates = { visits_used: newVisitsUsed }

  if (newVisitsUsed >= current.authorized_visits) {
    updates.status = 'exhausted'
  }

  const { data, error } = await supabase
    .from('authorizations')
    .update(updates)
    .eq('id', authId)
    .select()
    .single()

  if (error) throw error
  return data
}
