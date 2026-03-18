import fs from 'fs'
import path from 'path'

const API_KEY = 'AIzaSyCxNVlPFWHEt7MEUiGb-QNwb1fHDspsvfo'
const MODEL = 'gemini-3.1-flash-image-preview'
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${API_KEY}`
const OUT_DIR = path.resolve('public/exercises')

// All exercises from seed files (unique names)
const exercises = [
  // CERVICAL SPINE
  { name: 'Chin Tucks', bodyParts: ['cervical spine'] },
  { name: 'Cervical Rotation AROM', bodyParts: ['cervical spine'] },
  { name: 'Upper Trapezius Stretch', bodyParts: ['cervical spine', 'shoulder'] },
  { name: 'Cervical Rotation Stretch', bodyParts: ['cervical spine'] },
  { name: 'Levator Scapulae Stretch', bodyParts: ['cervical spine', 'shoulder'] },
  { name: 'Isometric Neck Strengthening', bodyParts: ['cervical spine'] },
  { name: 'Neck Retraction with Extension', bodyParts: ['cervical spine'] },
  { name: 'Scalene Stretch', bodyParts: ['cervical spine'] },
  { name: 'SCM Stretch', bodyParts: ['cervical spine'] },

  // SHOULDER
  { name: 'Pendulum Swings', bodyParts: ['shoulder'] },
  { name: 'Wall Slides', bodyParts: ['shoulder'] },
  { name: 'External Rotation with Band', bodyParts: ['shoulder', 'rotator cuff'] },
  { name: 'Internal Rotation with Band', bodyParts: ['shoulder', 'rotator cuff'] },
  { name: 'Scapular Squeezes', bodyParts: ['shoulder', 'thoracic spine'] },
  { name: 'Y-T-W Raises Prone', bodyParts: ['shoulder', 'rotator cuff'] },
  { name: 'Shoulder Flexion AAROM Wand', bodyParts: ['shoulder'] },
  { name: 'Sleeper Stretch', bodyParts: ['shoulder', 'rotator cuff'] },
  { name: 'Cross-Body Stretch', bodyParts: ['shoulder'] },
  { name: 'Shoulder Shrugs', bodyParts: ['shoulder', 'cervical spine'] },
  { name: 'Lateral Raises', bodyParts: ['shoulder'] },
  { name: 'Prone I-Y-T', bodyParts: ['shoulder', 'rotator cuff'] },
  { name: 'Empty Can Exercise', bodyParts: ['shoulder', 'rotator cuff'] },
  { name: 'Door Frame Pec Stretch', bodyParts: ['shoulder'] },
  { name: 'Resisted Shoulder Extension', bodyParts: ['shoulder'] },

  // KNEE
  { name: 'Quad Sets', bodyParts: ['knee', 'quadriceps'] },
  { name: 'Straight Leg Raises', bodyParts: ['knee', 'quadriceps', 'hip'] },
  { name: 'Heel Slides', bodyParts: ['knee'] },
  { name: 'Terminal Knee Extensions', bodyParts: ['knee', 'quadriceps'] },
  { name: 'Wall Squats', bodyParts: ['knee', 'quadriceps', 'glutes'] },
  { name: 'Step-Ups', bodyParts: ['knee', 'quadriceps', 'glutes'] },
  { name: 'Hamstring Curls Standing', bodyParts: ['knee', 'hamstrings'] },
  { name: 'Single Leg Balance', bodyParts: ['knee', 'ankle'] },
  { name: 'Mini Squats', bodyParts: ['knee', 'quadriceps', 'glutes'] },
  { name: 'Lateral Step-Downs', bodyParts: ['knee', 'quadriceps'] },
  { name: 'Stationary Bike', bodyParts: ['knee'] },
  { name: 'Seated Knee Extension', bodyParts: ['knee', 'quadriceps'] },

  // HIP
  { name: 'Clamshells', bodyParts: ['hip', 'glutes'] },
  { name: 'Glute Bridges', bodyParts: ['hip', 'glutes', 'hamstrings'] },
  { name: 'Monster Walks', bodyParts: ['hip', 'glutes'] },
  { name: 'Hip Flexor Stretch Half-Kneeling', bodyParts: ['hip'] },
  { name: 'Side-Lying Hip Abduction', bodyParts: ['hip', 'glutes'] },
  { name: 'Standing Hip Abduction', bodyParts: ['hip', 'glutes'] },
  { name: 'Piriformis Stretch Figure 4', bodyParts: ['hip', 'glutes'] },
  { name: 'Fire Hydrants', bodyParts: ['hip', 'glutes'] },
  { name: 'Single Leg Deadlift', bodyParts: ['hip', 'hamstrings', 'glutes'] },
  { name: 'IT Band Foam Roll', bodyParts: ['hip', 'knee'] },
  { name: 'Hip Circles', bodyParts: ['hip'] },
  { name: 'Supine Hip Flexion Marching', bodyParts: ['hip'] },

  // LUMBAR SPINE
  { name: 'Cat-Cow Stretch', bodyParts: ['lumbar spine', 'thoracic spine'] },
  { name: 'Bird Dog', bodyParts: ['lumbar spine', 'core'] },
  { name: 'Dead Bug', bodyParts: ['lumbar spine', 'core'] },
  { name: 'Pelvic Tilts', bodyParts: ['lumbar spine', 'core'] },
  { name: 'Prone Press-Up McKenzie Extension', bodyParts: ['lumbar spine'] },
  { name: 'Plank', bodyParts: ['lumbar spine', 'core'] },
  { name: 'Side Plank', bodyParts: ['lumbar spine', 'core'] },
  { name: 'Knees-to-Chest Stretch', bodyParts: ['lumbar spine'] },
  { name: 'Supine Trunk Rotation', bodyParts: ['lumbar spine', 'thoracic spine'] },
  { name: 'Child Pose Stretch', bodyParts: ['lumbar spine', 'thoracic spine'] },

  // ANKLE & FOOT
  { name: 'Ankle Pumps', bodyParts: ['ankle', 'foot'] },
  { name: 'Heel Raises Calf Raises', bodyParts: ['ankle', 'calf'] },
  { name: 'Towel Scrunches', bodyParts: ['foot'] },
  { name: 'Alphabet Ankle ROM', bodyParts: ['ankle'] },
  { name: 'Resistance Band Ankle Eversion', bodyParts: ['ankle'] },
  { name: 'Resistance Band Ankle Inversion', bodyParts: ['ankle'] },
  { name: 'BAPS Board Balance', bodyParts: ['ankle', 'foot'] },
  { name: 'Seated Ankle Dorsiflexion Stretch', bodyParts: ['ankle', 'calf'] },

  // CORE & FULL BODY
  { name: 'Diaphragmatic Breathing', bodyParts: ['core', 'lumbar spine'] },
  { name: 'Pallof Press', bodyParts: ['core'] },
  { name: 'Sit-to-Stand', bodyParts: ['full body', 'quadriceps', 'glutes'] },
  { name: 'Tandem Walking', bodyParts: ['full body'] },
  { name: 'Romanian Deadlift', bodyParts: ['hamstrings', 'glutes', 'lumbar spine'] },
  { name: 'Swiss Ball Marching', bodyParts: ['core', 'lumbar spine'] },
  { name: 'Farmer Carries', bodyParts: ['full body', 'core'] },
  { name: 'Thoracic Foam Roll Extension', bodyParts: ['thoracic spine'] },
  { name: 'Squat to Overhead Press', bodyParts: ['full body', 'quadriceps', 'shoulder'] },
  { name: 'TRX Row', bodyParts: ['shoulder', 'thoracic spine'] },

  // WRIST & HAND
  { name: 'Wrist Flexion Stretch', bodyParts: ['wrist', 'hand'] },
  { name: 'Wrist Extension Stretch', bodyParts: ['wrist', 'hand'] },
  { name: 'Grip Strengthening', bodyParts: ['hand', 'wrist'] },
  { name: 'Wrist Curls', bodyParts: ['wrist', 'hand'] },
  { name: 'Finger Tendon Glides', bodyParts: ['hand'] },
  { name: 'Nerve Glide Median Nerve', bodyParts: ['wrist', 'hand'] },

  // ELBOW
  { name: 'Eccentric Wrist Extension', bodyParts: ['elbow', 'wrist'] },
  { name: 'Forearm Pronation Supination', bodyParts: ['elbow', 'wrist'] },
  { name: 'Bicep Curls', bodyParts: ['elbow'] },
  { name: 'Tricep Extension Overhead', bodyParts: ['elbow'] },

  // BALANCE & GAIT
  { name: 'Static Single Leg Stance', bodyParts: ['full body'] },
  { name: 'Heel-to-Toe Standing', bodyParts: ['full body'] },
  { name: 'Lateral Weight Shifts', bodyParts: ['full body', 'hip'] },
  { name: 'Backward Walking', bodyParts: ['full body'] },
  { name: 'Obstacle Walking', bodyParts: ['full body'] },
  { name: 'Timed Up and Go Practice', bodyParts: ['full body'] },
]

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function buildPrompt(name, bodyParts) {
  return `Generate a clean, professional medical illustration of a person performing the physical therapy exercise "${name}" (targets: ${bodyParts.join(', ')}).

Requirements:
- Show a single person in athletic wear demonstrating proper form
- Clean white background, no text, no labels, no watermarks
- Flat vector illustration style with soft muted teal and warm gray color palette
- Anatomically accurate positioning and form
- Simple minimal composition focused on the exercise
- Professional medical rehabilitation context`
}

async function generateImage(exercise) {
  const slug = slugify(exercise.name)
  const outPath = path.join(OUT_DIR, `${slug}.png`)

  if (fs.existsSync(outPath)) {
    console.log(`  SKIP ${exercise.name} (already exists)`)
    return true
  }

  const body = {
    contents: [
      { role: 'user', parts: [{ text: buildPrompt(exercise.name, exercise.bodyParts) }] },
    ],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      imageConfig: {
        aspectRatio: '1:1',
        imageSize: '1K',
      },
    },
  }

  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API ${res.status}: ${err.slice(0, 200)}`)
  }

  // streamGenerateContent returns an array of chunks
  const data = await res.json()
  const chunks = Array.isArray(data) ? data : [data]
  const parts = chunks.flatMap((c) => c?.candidates?.[0]?.content?.parts || [])
  const imagePart = parts.find((p) => p.inlineData)

  if (!imagePart) {
    throw new Error('No image in response')
  }

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64')
  fs.writeFileSync(outPath, buffer)
  return true
}

async function main() {
  console.log(`Generating images for ${exercises.length} exercises...`)
  console.log(`Output: ${OUT_DIR}\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i]
    const progress = `[${i + 1}/${exercises.length}]`
    process.stdout.write(`${progress} ${ex.name}... `)

    try {
      await generateImage(ex)
      success++
      console.log('OK')
    } catch (err) {
      failed++
      console.log(`FAILED: ${err.message}`)
    }

    // Small delay to avoid rate limits
    if (i < exercises.length - 1) {
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  console.log(`\nDone! ${success} succeeded, ${failed} failed.`)
}

main().catch(console.error)
