import { z } from 'zod'

export const noteSchema = z.object({
  subjective: z.string().min(1, 'Subjective section is required'),
  objective: z.string().min(1, 'Objective section is required'),
  assessment: z.string().min(1, 'Assessment section is required'),
  plan: z.string().min(1, 'Plan section is required'),
})
