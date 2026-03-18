const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`

/**
 * Takes session notes + the already-loaded exercise list,
 * asks Gemini to pick 5-8 exercises, returns matched exercises.
 */
export async function matchExercisesFromNotes(sessionNotes, exercises) {
  if (!exercises?.length) {
    throw new Error('No exercises loaded. Wait for the exercise library to load.')
  }

  // Build compact catalog with short IDs
  const idMap = {}
  const catalog = exercises.map((e, i) => {
    const shortId = String(i + 1)
    idMap[shortId] = e
    return `${shortId}|${e.name}|${(e.body_part || []).join(',')}`
  }).join('\n')

  const prompt = `PT: pick 5-8 exercises for this patient's HEP.

NOTES: ${sessionNotes}

EXERCISES (Num|Name|BodyParts):
${catalog}

JSON only: [{"id":"1","name":"Name","sets":3,"reps":10,"hold_seconds":0,"frequency":"1x daily","rationale":"why"}]`

  // Call Gemini
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Gemini API error ${response.status}: ${errText.slice(0, 150)}`)
    }

    const data = await response.json()
    const parts = data?.candidates?.[0]?.content?.parts || []
    const rawText = parts.map((p) => p.text || '').join('\n')

    if (!rawText) throw new Error('Empty response from AI')

    // Parse JSON from response
    let parsed
    try { parsed = JSON.parse(rawText) } catch {
      const m = rawText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (m) try { parsed = JSON.parse(m[1].trim()) } catch {}
      if (!parsed) {
        const a = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/)
        if (a) try { parsed = JSON.parse(a[0]) } catch {}
      }
      if (!parsed) throw new Error('Could not parse AI response')
    }

    if (!Array.isArray(parsed)) throw new Error('Response is not an array')

    // Map short IDs back to real exercises
    const matched = parsed
      .map((item) => {
        const shortId = item.id || item.exercise_id
        const full = idMap[String(shortId)]
        if (!full) return null
        return {
          ...full,
          sets: item.sets || full.sets || 3,
          reps: item.reps || full.reps || 10,
          hold_seconds: item.hold_seconds || 0,
          frequency: item.frequency || '1x daily',
          special_instructions: item.special_instructions || '',
          rationale: item.rationale || '',
          exerciseNotes: item.special_instructions || '',
        }
      })
      .filter(Boolean)

    if (!matched.length) throw new Error('No exercises matched. Try again.')

    return { exercises: matched, rawOutput: rawText }
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') throw new Error('Timed out after 20s. Try again.')
    throw err
  }
}
