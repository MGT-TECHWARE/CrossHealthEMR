import { supabase } from './supabase'

export async function getPrescriptionsByPatient(patientId) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*, document:patient_documents(*)')
    .eq('patient_id', patientId)
    .order('prescription_date', { ascending: false })

  if (error) throw error
  return data
}

export async function createPrescription(prescriptionData) {
  const { data, error } = await supabase
    .from('prescriptions')
    .insert(prescriptionData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePrescription(id, updates) {
  const { data, error } = await supabase
    .from('prescriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePrescription(id) {
  const { error } = await supabase
    .from('prescriptions')
    .delete()
    .eq('id', id)

  if (error) throw error
}
