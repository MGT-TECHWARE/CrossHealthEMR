import { supabase } from './supabase'

export async function getInsuranceByPatient(patientId) {
  const { data, error } = await supabase
    .from('patient_insurance')
    .select('*')
    .eq('patient_id', patientId)
    .order('insurance_type')

  if (error) throw error
  return data
}

export async function getInsuranceById(insuranceId) {
  const { data, error } = await supabase
    .from('patient_insurance')
    .select('*')
    .eq('id', insuranceId)
    .single()

  if (error) throw error
  return data
}

export async function createInsurance(data) {
  const { data: insurance, error } = await supabase
    .from('patient_insurance')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return insurance
}

export async function updateInsurance(insuranceId, updates) {
  const { data, error } = await supabase
    .from('patient_insurance')
    .update(updates)
    .eq('id', insuranceId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteInsurance(insuranceId) {
  const { error } = await supabase
    .from('patient_insurance')
    .delete()
    .eq('id', insuranceId)

  if (error) throw error
}

export async function verifyInsurance(insuranceId, { verified_by, verification_notes, verification_status }) {
  const { data, error } = await supabase
    .from('patient_insurance')
    .update({
      verified_by,
      verification_notes,
      verification_status,
      verification_date: new Date().toISOString(),
    })
    .eq('id', insuranceId)
    .select()
    .single()

  if (error) throw error
  return data
}
