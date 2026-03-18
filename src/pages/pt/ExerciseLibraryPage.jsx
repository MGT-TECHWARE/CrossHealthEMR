import { useState } from 'react'
import { Plus, Sparkles, Loader2, ImagePlus } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import ExerciseGrid from '@/components/exercises/ExerciseGrid'
import ExerciseFilterBar from '@/components/exercises/ExerciseFilterBar'
import ExerciseDetailModal from '@/components/exercises/ExerciseDetailModal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import useExerciseLibrary from '@/hooks/useExerciseLibrary'
import { createExercise } from '@/services/exercises.service'
import { generateAndSaveExerciseImage } from '@/services/geminiImage.service'
import { getExerciseImageUrl } from '@/utils/exerciseImage'
import { BODY_PARTS } from '@/constants/bodyParts'

const selectClass = 'w-full rounded-xl border border-border/50 bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15'
const textareaClass = 'w-full rounded-xl border border-border/50 bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 resize-none'

const emptyForm = {
  name: '',
  description: '',
  instructions: '',
  body_part: [],
  difficulty: 'beginner',
  equipment: [],
  sets: '',
  reps: '',
  duration_seconds: '',
  video_url: '',
  image_url: '',
  tags: [],
}

function AddExerciseForm({ onSave, onClose }) {
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [bodyPartInput, setBodyPartInput] = useState('')
  const [equipmentInput, setEquipmentInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [generateImage, setGenerateImage] = useState(true)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const addToArray = (field, value, setInput) => {
    if (!value.trim()) return
    setForm((f) => ({ ...f, [field]: [...(f[field] || []), value.trim()] }))
    setInput('')
  }

  const removeFromArray = (field, index) => {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Exercise name is required')
      return
    }
    if (form.body_part.length === 0) {
      setError('At least one body part is required')
      return
    }

    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        sets: form.sets ? parseInt(form.sets) : null,
        reps: form.reps ? parseInt(form.reps) : null,
        duration_seconds: form.duration_seconds ? parseInt(form.duration_seconds) : null,
        is_active: true,
      }
      const created = await createExercise(payload)

      // Auto-generate image after creation
      if (generateImage && created?.id) {
        try {
          await generateAndSaveExerciseImage(created)
        } catch (imgErr) {
          console.error('Auto image generation failed:', imgErr)
        }
      }

      onSave()
    } catch (err) {
      setError(err.message || 'Failed to create exercise')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm font-sans text-destructive">{error}</div>
      )}

      <Input label="Exercise Name *" value={form.name} onChange={set('name')} placeholder="e.g., Quad Sets" />

      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/70">Description</label>
        <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Brief description of the exercise" className={textareaClass} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/70">Instructions</label>
        <textarea value={form.instructions} onChange={set('instructions')} rows={4} placeholder="Step-by-step instructions..." className={textareaClass} />
      </div>

      {/* Body Parts */}
      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/70">Body Parts *</label>
        <div className="flex gap-2">
          <select value={bodyPartInput} onChange={(e) => setBodyPartInput(e.target.value)} className={selectClass}>
            <option value="">Select body part...</option>
            {BODY_PARTS.map((bp) => (
              <option key={bp} value={bp}>{bp}</option>
            ))}
          </select>
          <Button type="button" size="sm" variant="outline" onClick={() => addToArray('body_part', bodyPartInput, setBodyPartInput)}>
            Add
          </Button>
        </div>
        {form.body_part.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.body_part.map((bp, i) => (
              <Badge key={i} variant="default" className="gap-1 cursor-pointer" onClick={() => removeFromArray('body_part', i)}>
                {bp} &times;
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/70">Difficulty</label>
          <select value={form.difficulty} onChange={set('difficulty')} className={selectClass}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <Input label="Video URL" value={form.video_url} onChange={set('video_url')} placeholder="https://..." />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Input label="Sets" type="number" min="1" value={form.sets} onChange={set('sets')} placeholder="3" />
        <Input label="Reps" type="number" min="1" value={form.reps} onChange={set('reps')} placeholder="10" />
        <Input label="Duration (sec)" type="number" min="1" value={form.duration_seconds} onChange={set('duration_seconds')} placeholder="30" />
      </div>

      {/* Equipment */}
      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/70">Equipment</label>
        <div className="flex gap-2">
          <Input value={equipmentInput} onChange={(e) => setEquipmentInput(e.target.value)} placeholder="e.g., Resistance band" className="flex-1" />
          <Button type="button" size="sm" variant="outline" onClick={() => addToArray('equipment', equipmentInput, setEquipmentInput)}>
            Add
          </Button>
        </div>
        {form.equipment.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.equipment.map((eq, i) => (
              <Badge key={i} variant="outline" className="gap-1 cursor-pointer" onClick={() => removeFromArray('equipment', i)}>
                {eq} &times;
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/70">Tags</label>
        <div className="flex gap-2">
          <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g., strengthening" className="flex-1" />
          <Button type="button" size="sm" variant="outline" onClick={() => addToArray('tags', tagInput, setTagInput)}>
            Add
          </Button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="gap-1 cursor-pointer" onClick={() => removeFromArray('tags', i)}>
                {tag} &times;
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Auto-generate image toggle */}
      <label className="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/30 p-3 cursor-pointer">
        <input
          type="checkbox"
          checked={generateImage}
          onChange={(e) => setGenerateImage(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <div>
          <p className="text-sm font-medium font-sans text-foreground">Auto-generate image</p>
          <p className="text-xs font-sans text-muted-foreground">AI will create an illustration after saving</p>
        </div>
      </label>

      <div className="flex gap-2 pt-2 border-t border-border/30">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {generateImage ? 'Creating & Generating...' : 'Adding...'}
            </>
          ) : (
            'Add Exercise'
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  )
}

export default function ExerciseLibraryPage() {
  const [filters, setFilters] = useState({})
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const { exercises, isLoading, refetch } = useExerciseLibrary(filters)
  const [batchStatus, setBatchStatus] = useState({ running: false, current: 0, total: 0, errors: 0 })

  const handleExerciseSaved = () => {
    setShowAddModal(false)
    refetch()
  }

  const exercisesWithoutImages = (exercises || []).filter((e) => !getExerciseImageUrl(e))

  const handleBatchGenerate = async () => {
    const toGenerate = exercisesWithoutImages
    if (toGenerate.length === 0) return

    setBatchStatus({ running: true, current: 0, total: toGenerate.length, errors: 0 })

    let errors = 0
    for (let i = 0; i < toGenerate.length; i++) {
      setBatchStatus((s) => ({ ...s, current: i + 1 }))
      try {
        await generateAndSaveExerciseImage(toGenerate[i])
      } catch (err) {
        console.error(`Failed to generate image for ${toGenerate[i].name}:`, err)
        errors++
      }
    }

    setBatchStatus({ running: false, current: 0, total: 0, errors })
    refetch()
  }

  return (
    <PageContainer title="Exercise Library">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground">
              Exercise Library
            </h1>
            <p className="mt-1 text-sm font-sans text-muted-foreground">
              {exercises?.length || 0} exercises{' '}
              {exercisesWithoutImages.length > 0 && (
                <span className="text-amber-600">
                  ({exercisesWithoutImages.length} without images)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {exercisesWithoutImages.length > 0 && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleBatchGenerate}
                disabled={batchStatus.running}
              >
                {batchStatus.running ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {batchStatus.current}/{batchStatus.total}
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" />
                    Generate All Images
                  </>
                )}
              </Button>
            )}
            <Button className="gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Add Exercise
            </Button>
          </div>
        </div>

        {/* Batch progress */}
        {batchStatus.running && (
          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium font-sans text-foreground">
                  Generating images...
                </span>
              </div>
              <span className="text-sm font-sans text-muted-foreground">
                {batchStatus.current} of {batchStatus.total}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-primary/10 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(batchStatus.current / batchStatus.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ExerciseFilterBar currentFilters={filters} onFilterChange={setFilters} />
      </div>

      {/* Grid */}
      <ExerciseGrid
        exercises={exercises || []}
        isLoading={isLoading}
        onExerciseClick={setSelectedExercise}
        onImageGenerated={() => refetch()}
      />

      <ExerciseDetailModal
        exercise={selectedExercise}
        open={!!selectedExercise}
        onOpenChange={(open) => !open && setSelectedExercise(null)}
      />

      <Modal open={showAddModal} onOpenChange={setShowAddModal} title="Add New Exercise">
        <AddExerciseForm onSave={handleExerciseSaved} onClose={() => setShowAddModal(false)} />
      </Modal>
    </PageContainer>
  )
}
