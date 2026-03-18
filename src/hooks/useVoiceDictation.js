import { useState, useRef, useCallback, useEffect } from 'react'

export function useVoiceDictation() {
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')

  const recognitionRef = useRef(null)
  const onFinalResultRef = useRef(null)
  const shouldRestartRef = useRef(false)

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null

  const isSupported = !!SpeechRecognition

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false
    setIsListening(false)
    setInterimTranscript('')
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
  }, [])

  const startListening = useCallback(
    (onFinalResult) => {
      if (!SpeechRecognition) return
      if (recognitionRef.current) {
        stopListening()
      }

      onFinalResultRef.current = onFinalResult

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript
          } else {
            interim += transcript
          }
        }

        setInterimTranscript(interim)

        if (final && onFinalResultRef.current) {
          onFinalResultRef.current(final)
          setInterimTranscript('')
        }
      }

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          console.error('Microphone access denied')
          stopListening()
        } else if (event.error !== 'aborted') {
          console.error('Speech recognition error:', event.error)
        }
      }

      recognition.onend = () => {
        if (shouldRestartRef.current) {
          try {
            recognition.start()
          } catch {
            stopListening()
          }
        } else {
          setIsListening(false)
          setInterimTranscript('')
        }
      }

      recognitionRef.current = recognition
      shouldRestartRef.current = true
      setIsListening(true)

      try {
        recognition.start()
      } catch {
        stopListening()
      }
    },
    [SpeechRecognition, stopListening]
  )

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return {
    isSupported,
    isListening,
    interimTranscript,
    startListening,
    stopListening,
  }
}

export default useVoiceDictation
