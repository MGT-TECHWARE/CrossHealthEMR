import { supabase } from './supabase'

const BUCKET = 'patient-documents'

export async function uploadDocument({ patientId, file, documentType, description, effectiveDate, expirationDate, uploadedBy }) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${patientId}/${Date.now()}_${file.name}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file)

  if (uploadError) throw uploadError

  // Create document record
  const { data, error } = await supabase
    .from('patient_documents')
    .insert({
      patient_id: patientId,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      description,
      effective_date: effectiveDate || null,
      expiration_date: expirationDate || null,
      uploaded_by: uploadedBy,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDocumentsByPatient(patientId) {
  const { data, error } = await supabase
    .from('patient_documents')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getDocumentUrl(filePath) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 3600) // 1 hour expiry

  if (error) throw error
  return data.signedUrl
}

export async function deleteDocument(documentId, filePath) {
  // Delete from storage
  await supabase.storage.from(BUCKET).remove([filePath])

  // Delete record
  const { error } = await supabase
    .from('patient_documents')
    .delete()
    .eq('id', documentId)

  if (error) throw error
}
