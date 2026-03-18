import { useState, useRef, useEffect, useCallback } from 'react'

export function useSessionTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const intervalRef = useRef(null)
  const startTimestampRef = useRef(null)
  const accumulatedRef = useRef(0)

  const tick = useCallback(() => {
    if (startTimestampRef.current) {
      const now = Date.now()
      const diff = Math.floor((now - startTimestampRef.current) / 1000)
      setElapsedSeconds(accumulatedRef.current + diff)
    }
  }, [])

  const start = useCallback(() => {
    if (isRunning) return
    startTimestampRef.current = Date.now()
    setIsRunning(true)
    setIsPaused(false)
    intervalRef.current = setInterval(tick, 1000)
  }, [isRunning, tick])

  const pause = useCallback(() => {
    if (!isRunning) return
    clearInterval(intervalRef.current)
    accumulatedRef.current = elapsedSeconds
    startTimestampRef.current = null
    setIsRunning(false)
    setIsPaused(true)
  }, [isRunning, elapsedSeconds])

  const resume = useCallback(() => {
    if (isRunning || !isPaused) return
    start()
  }, [isRunning, isPaused, start])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    const total = elapsedSeconds
    setIsRunning(false)
    setIsPaused(false)
    return Math.ceil(total / 60)
  }, [elapsedSeconds])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const hours = Math.floor(elapsedSeconds / 3600)
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
  const secs = elapsedSeconds % 60
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const totalMinutes = Math.ceil(elapsedSeconds / 60)

  return {
    elapsedSeconds,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    formattedTime,
    totalMinutes,
  }
}

export default useSessionTimer
