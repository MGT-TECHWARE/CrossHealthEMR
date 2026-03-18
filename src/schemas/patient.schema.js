import { z } from 'zod'

export const patientSchema = z.object({
  // Personal Information
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  preferred_language: z.string().optional(),
  preferred_contact_method: z.string().optional(),
  occupation: z.string().optional(),
  address_street: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_zip: z.string().optional(),

  // Emergency Contact
  emergency_contact_name: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  emergency_contact_phone: z.string().optional(),

  // Insurance (basic — detailed insurance in InsurancePanel)
  insurance_provider: z.string().optional(),

  // Referral Information
  referring_physician_name: z.string().optional(),
  referring_physician_npi: z.string().optional(),
  referring_physician_phone: z.string().optional(),
  referring_physician_fax: z.string().optional(),
  referral_date: z.string().optional(),
  referral_expiration_date: z.string().optional(),
  primary_diagnosis_code: z.string().optional(),
  primary_diagnosis_description: z.string().optional(),

  // Medical History
  past_medical_conditions: z.string().optional(),
  surgical_history: z.string().optional(),
  current_medications: z.string().optional(),
  allergies: z.string().optional(),
  social_history: z.string().optional(),

  // Pain Assessment
  pain_location: z.string().optional(),
  pain_intensity: z.coerce.number().min(0).max(10).optional().or(z.literal('')),
  pain_quality: z.string().optional(),
  pain_aggravating_factors: z.string().optional(),
  pain_relieving_factors: z.string().optional(),

  // Functional Assessment
  functional_limitations: z.string().optional(),
  prior_therapy_history: z.string().optional(),
  patient_goals: z.string().optional(),

  // Consent & Acknowledgments
  consent_to_treat_date: z.string().optional(),
  hipaa_acknowledgment_date: z.string().optional(),
  financial_responsibility_date: z.string().optional(),
  photo_video_consent: z.boolean().optional(),
})
