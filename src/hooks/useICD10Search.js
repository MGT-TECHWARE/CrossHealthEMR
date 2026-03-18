import { useState, useEffect, useRef } from 'react'
import { searchICD10 } from '@/services/icd10.service'

export default function useICD10Search(query, options = {}) {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await searchICD10(query, options)
        setResults(data || [])
      } catch (err) {
        setError(err)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  return { results, isLoading, error }
}
