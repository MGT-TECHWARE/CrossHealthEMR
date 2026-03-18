import { useState, useEffect, useCallback } from 'react'
import {
  getDocumentsByPatient,
  uploadDocument as uploadService,
  deleteDocument as deleteService,
} from '@/services/documents.service'

export default function useDocuments(patientId) {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!patientId) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getDocumentsByPatient(patientId)
      setDocuments(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    fetch()
  }, [fetch])

  async function uploadDocument(params) {
    const data = await uploadService({ ...params, patientId })
    await fetch()
    return data
  }

  async function deleteDocument(docId, filePath) {
    await deleteService(docId, filePath)
    await fetch()
  }

  return { documents, isLoading, error, uploadDocument, deleteDocument, refetch: fetch }
}
