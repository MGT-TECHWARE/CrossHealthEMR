import { z } from 'zod'

// Legacy simple schema (still used for backward compatibility)
export const noteSchema = z.object({
  subjective: z.string().min(1, 'Subjective section is required'),
  objective: z.string().min(1, 'Objective section is required'),
  assessment: z.string().min(1, 'Assessment section is required'),
  plan: z.string().min(1, 'Plan section is required'),
})

// Structured note schema
export const structuredNoteSchema = z.object({
  note_type: z.enum(['initial_evaluation', 'daily_note', 'progress_note', 're_evaluation', 'discharge']).default('daily_note'),
  status: z.enum(['draft', 'in_progress', 'completed', 'signed', 'amended']).default('draft'),
  subjective_data: z.record(z.any()).default({}),
  objective_data: z.record(z.any()).default({}),
  assessment_data: z.record(z.any()).default({}),
  plan_data: z.record(z.any()).default({}),
  complexity: z.enum(['low', 'moderate', 'high']).nullable().optional(),
})

// Convert structured data to flat text for the legacy text columns
export function structuredToText(data) {
  const subj = data.subjective_data || {}
  const obj = data.objective_data || {}
  const assess = data.assessment_data || {}
  const planData = data.plan_data || {}

  const subjParts = []
  if (subj.chief_complaint) subjParts.push(`CC: ${subj.chief_complaint}`)
  if (subj.pain_level != null) subjParts.push(`Pain: ${subj.pain_level}/10`)
  if (subj.pain_quality) subjParts.push(`Quality: ${subj.pain_quality}`)
  if (subj.symptom_change) subjParts.push(`Symptoms: ${subj.symptom_change}`)
  if (subj.free_text) subjParts.push(subj.free_text)

  const objParts = []
  if (obj.observation) objParts.push(`Observation: ${obj.observation}`)
  if (obj.palpation) objParts.push(`Palpation: ${obj.palpation}`)
  if (obj.free_text) objParts.push(obj.free_text)

  const assessParts = []
  if (assess.complexity) assessParts.push(`Complexity: ${assess.complexity}`)
  if (assess.primary_diagnosis) assessParts.push(`Dx: ${assess.primary_diagnosis}`)
  if (assess.free_text) assessParts.push(assess.free_text)

  const planParts = []
  if (planData.frequency) planParts.push(`Frequency: ${planData.frequency}`)
  if (planData.duration_weeks) planParts.push(`Duration: ${planData.duration_weeks} weeks`)
  if (planData.next_visit_plan) planParts.push(`Next: ${planData.next_visit_plan}`)
  if (planData.free_text) planParts.push(planData.free_text)

  return {
    subjective: subjParts.join('\n') || '',
    objective: objParts.join('\n') || '',
    assessment: assessParts.join('\n') || '',
    plan: planParts.join('\n') || '',
  }
}
