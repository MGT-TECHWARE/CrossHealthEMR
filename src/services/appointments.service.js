import { supabase } from './supabase'

export async function getAppointmentsByPT(ptId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, patient:patients(*)')
    .eq('pt_id', ptId)
    .order('scheduled_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getAppointmentsByPatient(patientId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, pt:profiles!appointments_pt_id_fkey(first_name, last_name)')
    .eq('patient_id', patientId)
    .order('scheduled_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getAppointmentById(appointmentId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, patient:patients(*), pt:profiles!appointments_pt_id_fkey(first_name, last_name)')
    .eq('id', appointmentId)
    .single()

  if (error) throw error
  return data
}

export async function createAppointment({ patient_id, pt_id, scheduled_at, duration_minutes, reason }) {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id,
      pt_id,
      scheduled_at,
      duration_minutes: duration_minutes || 60,
      reason,
      patient_name: '',
    })
    .select('*, patient:patients(*)')
    .single()

  if (error) throw error
  return data
}

export async function updateAppointmentStatus(id, status) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAvailablePTs() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'pt')

  if (error) throw error
  return data
}
