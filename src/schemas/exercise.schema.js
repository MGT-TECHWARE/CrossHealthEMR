import { z } from 'zod'

export const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  description: z.string().optional(),
  body_part: z.array(z.string()).min(1, 'At least one body part is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  sets: z.number().optional(),
  reps: z.number().optional(),
})
