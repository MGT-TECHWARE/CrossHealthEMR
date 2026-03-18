export function parseAIExerciseResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Invalid AI response: empty or non-string input')
  }

  const trimmed = rawText.trim()

  // Try direct JSON.parse first
  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) {
      return parsed
    }
    throw new Error('Parsed JSON is not an array')
  } catch {
    // Direct parse failed, try to extract JSON array from text
  }

  // Try to find a JSON array in the text using regex
  const arrayMatch = trimmed.match(/\[[\s\S]*\]/)

  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0])
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      // Extraction failed as well
    }
  }

  throw new Error(
    'Failed to parse AI response: could not extract a valid JSON array from the response text'
  )
}
