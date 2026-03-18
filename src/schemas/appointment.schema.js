import { z } from 'zod'

export const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Please select a patient'),
  pt_id: z.string().min(1, 'Please select a therapist'),
  scheduled_at: z.string().min(1, 'Date and time is required'),
  duration_minutes: z.coerce.number().min(15).max(120).default(60),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
})
