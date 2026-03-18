import { supabase } from './supabase'

export async function getAppointmentsByPT() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, patient:patients(*)')
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

export async function createAppointment({ patient_id, pt_id, scheduled_at, duration_minutes, reason, appointment_type, payment_type }) {
  // Resolve patient name for the denormalized field
  let patientName = ''
  if (patient_id) {
    const { data: patient } = await supabase
      .from('patients')
      .select('first_name, last_name')
      .eq('id', patient_id)
      .single()
    if (patient) {
      patientName = `${patient.first_name} ${patient.last_name}`
    }
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id,
      pt_id,
      scheduled_at,
      duration_minutes: duration_minutes || 60,
      reason,
      patient_name: patientName,
      appointment_type: appointment_type || 'follow_up',
      payment_type: payment_type || 'cash',
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

export async function checkInAppointment(id, checkedInBy) {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'checked_in',
      checked_in_at: new Date().toISOString(),
      checked_in_by: checkedInBy,
    })
    .eq('id', id)
    .select('*, patient:patients(*)')
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
