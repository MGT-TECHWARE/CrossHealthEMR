import { supabase } from './supabase'
import { parseAIExerciseResponse } from '../utils/parseAIResponse'

export async function matchExercisesFromNotes(soapNoteText) {
  const { data: exerciseLibrary, error: fetchError } = await supabase
    .from('exercise_library')
    .select('id, name, description, body_part, tags, difficulty')

  if (fetchError) {
    throw fetchError
  }

  const exerciseListText = exerciseLibrary
    .map(
      (ex) =>
        `- ID: ${ex.id} | Name: ${ex.name} | Body Part: ${ex.body_part} | Difficulty: ${ex.difficulty} | Tags: ${(ex.tags || []).join(', ')} | Description: ${ex.description}`
    )
    .join('\n')

  const prompt = `You are a physical therapy exercise matching assistant. Given the following SOAP note from a PT session, recommend exercises from the provided exercise library that would be appropriate for this patient.

SOAP Note:
${soapNoteText}

Available Exercise Library:
${exerciseListText}

Instructions:
- Analyze the SOAP note to identify the patient's condition, limitations, and treatment goals.
- Select exercises from the library that are appropriate for the patient's current status.
- For each recommended exercise, provide:
  - The exercise ID from the library
  - The exercise name
  - Sets and reps recommendation
  - Any modifications or special instructions
  - Brief rationale for why this exercise is appropriate

Respond with a JSON array of objects with the following structure:
[
  {
    "exercise_id": "<id from library>",
    "name": "<exercise name>",
    "sets": <number>,
    "reps": <number>,
    "hold_seconds": <number or null>,
    "modifications": "<any modifications>",
    "rationale": "<why this exercise is appropriate>"
  }
]

Return ONLY the JSON array, no additional text.`

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`AI API request failed (${response.status}): ${errorBody}`)
  }

  const result = await response.json()

  const rawText =
    result.content && result.content.length > 0
      ? result.content[0].text
      : ''

  const exercises = parseAIExerciseResponse(rawText)

  return {
    rawText,
    exercises,
  }
}
