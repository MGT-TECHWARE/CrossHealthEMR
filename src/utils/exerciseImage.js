/**
 * Maps exercise names to local image paths in /exercises/
 * Falls back to exercise.image_url from the database if no local match
 */

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// All locally generated images
const LOCAL_IMAGES = new Set([
  'alphabet-ankle-rom',
  'ankle-pumps',
  'backward-walking',
  'baps-board-balance',
  'bicep-curls',
  'bird-dog',
  'cat-cow-stretch',
  'cervical-rotation-arom',
  'cervical-rotation-stretch',
  'child-pose-stretch',
  'chin-tucks',
  'clamshells',
  'cross-body-stretch',
  'dead-bug',
  'diaphragmatic-breathing',
  'door-frame-pec-stretch',
  'eccentric-wrist-extension',
  'empty-can-exercise',
  'external-rotation-with-band',
  'farmer-carries',
  'finger-tendon-glides',
  'fire-hydrants',
  'forearm-pronation-supination',
  'glute-bridges',
  'grip-strengthening',
  'hamstring-curls-standing',
  'heel-raises-calf-raises',
  'heel-slides',
  'heel-to-toe-standing',
  'hip-circles',
  'hip-flexor-stretch-half-kneeling',
  'internal-rotation-with-band',
  'isometric-neck-strengthening',
  'it-band-foam-roll',
  'knees-to-chest-stretch',
  'lateral-raises',
  'lateral-step-downs',
  'lateral-weight-shifts',
  'levator-scapulae-stretch',
  'mini-squats',
  'monster-walks',
  'neck-retraction-with-extension',
  'nerve-glide-median-nerve',
  'obstacle-walking',
  'pallof-press',
  'pelvic-tilts',
  'pendulum-swings',
  'piriformis-stretch-figure-4',
  'plank',
  'prone-i-y-t',
  'prone-press-up-mckenzie-extension',
  'quad-sets',
  'resistance-band-ankle-eversion',
  'resistance-band-ankle-inversion',
  'resisted-shoulder-extension',
  'romanian-deadlift',
  'scalene-stretch',
  'scapular-squeezes',
  'scm-stretch',
  'seated-ankle-dorsiflexion-stretch',
  'seated-knee-extension',
  'shoulder-flexion-aarom-wand',
  'shoulder-shrugs',
  'side-lying-hip-abduction',
  'side-plank',
  'single-leg-balance',
  'single-leg-deadlift',
  'sit-to-stand',
  'sleeper-stretch',
  'squat-to-overhead-press',
  'standing-hip-abduction',
  'static-single-leg-stance',
  'stationary-bike',
  'step-ups',
  'straight-leg-raises',
  'supine-hip-flexion-marching',
  'supine-trunk-rotation',
  'swiss-ball-marching',
  'tandem-walking',
  'terminal-knee-extensions',
  'thoracic-foam-roll-extension',
  'timed-up-and-go-practice',
  'towel-scrunches',
  'tricep-extension-overhead',
  'trx-row',
  'upper-trapezius-stretch',
  'wall-slides',
  'wall-squats',
  'wrist-curls',
  'wrist-extension-stretch',
  'wrist-flexion-stretch',
  'y-t-w-raises-prone',
])

/**
 * Get the image URL for an exercise.
 * Priority: database image_url > local generated image > null
 */
export function getExerciseImageUrl(exercise) {
  if (exercise.image_url) return exercise.image_url

  const slug = slugify(exercise.name)
  if (LOCAL_IMAGES.has(slug)) {
    return `/exercises/${slug}.png`
  }

  return null
}
