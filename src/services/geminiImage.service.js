import { supabase } from './supabase'
import { updateExercise } from './exercises.service'

const GEMINI_IMAGE_API_KEY = import.meta.env.VITE_GEMINI_IMAGE_API_KEY
const MODEL = 'gemini-3.1-flash-image-preview'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${GEMINI_IMAGE_API_KEY}`

const IMAGE_PROMPT_TEMPLATE = (name, bodyParts) =>
  `Generate a clean, professional medical illustration of a person performing the physical therapy exercise "${name}"${bodyParts?.length ? ` (targets: ${bodyParts.join(', ')})` : ''}.

Requirements:
- Show a single person in athletic wear demonstrating proper form
- Clean white/light gray background with no text, labels, or watermarks
- Flat vector illustration style with soft, muted teal and warm gray color palette
- Anatomically accurate positioning and form
- Simple, minimal composition focused on the exercise movement
- Professional medical/rehabilitation context
- Consistent lighting from top-left`

/**
 * Generate an exercise illustration using Gemini image generation
 * Returns base64 image data
 */
export async function generateExerciseImage(exerciseName, bodyParts = []) {
  if (!GEMINI_IMAGE_API_KEY) {
    throw new Error('VITE_GEMINI_IMAGE_API_KEY not configured')
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: IMAGE_PROMPT_TEMPLATE(exerciseName, bodyParts) }],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '1K',
        },
      },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini image API error ${response.status}: ${errText.slice(0, 200)}`)
  }

  // streamGenerateContent returns an array of chunks
  const data = await response.json()
  const chunks = Array.isArray(data) ? data : [data]
  const parts = chunks.flatMap((c) => c?.candidates?.[0]?.content?.parts || [])

  // Find the image part
  const imagePart = parts.find((p) => p.inlineData)
  if (!imagePart) {
    throw new Error('No image returned from Gemini')
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || 'image/png',
  }
}

/**
 * Upload a base64 image to Supabase Storage and return the public URL
 */
export async function uploadExerciseImage(exerciseId, base64Data, mimeType = 'image/png') {
  const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png'
  const filePath = `exercises/${exerciseId}.${ext}`

  // Convert base64 to blob
  const byteChars = atob(base64Data)
  const byteArray = new Uint8Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i)
  }
  const blob = new Blob([byteArray], { type: mimeType })

  // Upload to Supabase Storage (upsert to overwrite if exists)
  const { error: uploadError } = await supabase.storage
    .from('exercise-images')
    .upload(filePath, blob, {
      contentType: mimeType,
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('exercise-images')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

/**
 * Generate an image for an exercise and save it
 * Returns the public URL of the uploaded image
 */
export async function generateAndSaveExerciseImage(exercise) {
  const { base64, mimeType } = await generateExerciseImage(exercise.name, exercise.body_part)
  const imageUrl = await uploadExerciseImage(exercise.id, base64, mimeType)
  await updateExercise(exercise.id, { image_url: imageUrl })
  return imageUrl
}
