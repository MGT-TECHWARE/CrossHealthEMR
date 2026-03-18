import { useState, useCallback, useRef, useEffect } from 'react'

export function useResizablePanels(panelCount = 3, minPercent = 15) {
  const initial = Array(panelCount).fill(100 / panelCount)
  const [sizes, setSizes] = useState(initial)
  const containerRef = useRef(null)
  const draggingRef = useRef(null)

  const handleMouseDown = useCallback((dividerIndex, e) => {
    e.preventDefault()
    draggingRef.current = { dividerIndex, startX: e.clientX, startSizes: [...sizes] }

    const handleMouseMove = (e) => {
      if (!draggingRef.current || !containerRef.current) return
      const { dividerIndex, startX, startSizes } = draggingRef.current
      const containerWidth = containerRef.current.offsetWidth
      const deltaPercent = ((e.clientX - startX) / containerWidth) * 100

      const newSizes = [...startSizes]
      const leftNew = startSizes[dividerIndex] + deltaPercent
      const rightNew = startSizes[dividerIndex + 1] - deltaPercent

      if (leftNew >= minPercent && rightNew >= minPercent) {
        newSizes[dividerIndex] = leftNew
        newSizes[dividerIndex + 1] = rightNew
        setSizes(newSizes)
      }
    }

    const handleMouseUp = () => {
      draggingRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [sizes, minPercent])

  const resetSizes = useCallback(() => {
    setSizes(initial)
  }, [panelCount])

  return { sizes, containerRef, handleMouseDown, resetSizes }
}

export default useResizablePanels
