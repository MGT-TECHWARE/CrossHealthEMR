import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientSchema } from '@/schemas/patient.schema'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const selectClassName =
  'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const textareaClassName =
  'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none'

function FieldLabel({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  )
}

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive font-sans">{message}</p>
}

function SelectField({ id, label, options, error, register, placeholder }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} className={selectClassName} {...register}>
        <option value="">{placeholder || `Select ${label.toLowerCase()}...`}</option>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  )
}

function TextareaField({ id, label, rows = 4, placeholder, error, register }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className={textareaClassName}
        {...register}
      />
      <FieldError message={error} />
    </div>
  )
}

function SectionHeading({ children }) {
  return <h3 className="text-base font-semibold font-sans text-foreground mb-4">{children}</h3>
}

export default function PatientIntakeForm({ onSubmit, defaultValues, mode = 'create' }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      preferred_language: 'English',
      photo_video_consent: false,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ── 1. Personal Information ── */}
      <div>
        <SectionHeading>Personal Information</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            placeholder="John"
            required
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            required
            error={errors.last_name?.message}
            {...register('last_name')}
          />
          <Input
            label="Date of Birth"
            type="date"
            error={errors.date_of_birth?.message}
            {...register('date_of_birth')}
          />
          <SelectField
            id="gender"
            label="Gender"
            options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
            error={errors.gender?.message}
            register={register('gender')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="(555) 123-4567"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Preferred Language"
            placeholder="English"
            error={errors.preferred_language?.message}
            {...register('preferred_language')}
          />
          <SelectField
            id="preferred_contact_method"
            label="Preferred Contact Method"
            options={[
              { value: 'phone', label: 'Phone' },
              { value: 'email', label: 'Email' },
              { value: 'text', label: 'Text' },
            ]}
            error={errors.preferred_contact_method?.message}
            register={register('preferred_contact_method')}
          />
          <div className="sm:col-span-2">
            <Input
              label="Occupation"
              placeholder="Software Engineer"
              error={errors.occupation?.message}
              {...register('occupation')}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Address Street"
              placeholder="123 Main St"
              error={errors.address_street?.message}
              {...register('address_street')}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
          <Input
            label="City"
            placeholder="Springfield"
            error={errors.address_city?.message}
            {...register('address_city')}
          />
          <Input
            label="State"
            placeholder="IL"
            error={errors.address_state?.message}
            {...register('address_state')}
          />
          <Input
            label="ZIP"
            placeholder="62701"
            error={errors.address_zip?.message}
            {...register('address_zip')}
          />
        </div>
      </div>

      {/* ── 2. Emergency Contact ── */}
      <div>
        <SectionHeading>Emergency Contact</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Contact Name"
            placeholder="Jane Doe"
            error={errors.emergency_contact_name?.message}
            {...register('emergency_contact_name')}
          />
          <SelectField
            id="emergency_contact_relationship"
            label="Relationship"
            options={['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other']}
            error={errors.emergency_contact_relationship?.message}
            register={register('emergency_contact_relationship')}
          />
          <div className="sm:col-span-2">
            <Input
              label="Contact Phone"
              type="tel"
              placeholder="(555) 987-6543"
              error={errors.emergency_contact_phone?.message}
              {...register('emergency_contact_phone')}
            />
          </div>
        </div>
      </div>

      {/* ── 3. Insurance Information ── */}
      <div>
        <SectionHeading>Insurance Information</SectionHeading>
        <p className="text-xs font-sans text-muted-foreground mb-3">Basic info. Detailed insurance management is available on the patient chart.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Insurance Provider"
            placeholder="Blue Cross Blue Shield"
            error={errors.insurance_provider?.message}
            {...register('insurance_provider')}
          />
        </div>
      </div>

      {/* ── 4. Referral Information ── */}
      <div>
        <SectionHeading>Referral Information</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Referring Physician Name"
            placeholder="Dr. Sarah Smith"
            error={errors.referring_physician_name?.message}
            {...register('referring_physician_name')}
          />
          <Input
            label="NPI"
            placeholder="1234567890"
            error={errors.referring_physician_npi?.message}
            {...register('referring_physician_npi')}
          />
          <Input
            label="Physician Phone"
            type="tel"
            placeholder="(555) 111-2222"
            error={errors.referring_physician_phone?.message}
            {...register('referring_physician_phone')}
          />
          <Input
            label="Physician Fax"
            type="tel"
            placeholder="(555) 111-3333"
            error={errors.referring_physician_fax?.message}
            {...register('referring_physician_fax')}
          />
          <Input
            label="Referral Date"
            type="date"
            error={errors.referral_date?.message}
            {...register('referral_date')}
          />
          <Input
            label="Referral Expiration Date"
            type="date"
            error={errors.referral_expiration_date?.message}
            {...register('referral_expiration_date')}
          />
          <Input
            label="Primary Diagnosis Code (ICD-10)"
            placeholder="M54.5"
            error={errors.primary_diagnosis_code?.message}
            {...register('primary_diagnosis_code')}
          />
          <Input
            label="Diagnosis Description"
            placeholder="Low back pain"
            error={errors.primary_diagnosis_description?.message}
            {...register('primary_diagnosis_description')}
          />
        </div>
      </div>

      {/* ── 5. Medical History ── */}
      <div>
        <SectionHeading>Medical History</SectionHeading>
        <div className="grid grid-cols-1 gap-4">
          <TextareaField
            id="past_medical_conditions"
            label="Past Medical Conditions"
            rows={3}
            placeholder="List conditions: hypertension, diabetes, heart disease, arthritis, osteoporosis, cancer, etc."
            error={errors.past_medical_conditions?.message}
            register={register('past_medical_conditions')}
          />
          <TextareaField
            id="surgical_history"
            label="Surgical History"
            rows={3}
            placeholder="List surgeries with approximate dates"
            error={errors.surgical_history?.message}
            register={register('surgical_history')}
          />
          <TextareaField
            id="current_medications"
            label="Current Medications"
            rows={3}
            placeholder="List medications, dosages, and frequency"
            error={errors.current_medications?.message}
            register={register('current_medications')}
          />
          <TextareaField
            id="allergies"
            label="Allergies"
            rows={3}
            placeholder="List all allergies including medications, latex, food, etc."
            error={errors.allergies?.message}
            register={register('allergies')}
          />
          <TextareaField
            id="social_history"
            label="Social History"
            rows={3}
            placeholder="Smoking, alcohol use, exercise habits, living situation"
            error={errors.social_history?.message}
            register={register('social_history')}
          />
        </div>
      </div>

      {/* ── 6. Pain Assessment ── */}
      <div>
        <SectionHeading>Pain Assessment</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Pain Location"
            placeholder="Lower back, right shoulder, etc."
            error={errors.pain_location?.message}
            {...register('pain_location')}
          />
          <Input
            label="Pain Intensity (0-10)"
            type="number"
            min={0}
            max={10}
            placeholder="0"
            error={errors.pain_intensity?.message}
            {...register('pain_intensity')}
          />
          <SelectField
            id="pain_quality"
            label="Pain Quality"
            options={['Sharp', 'Dull', 'Burning', 'Aching', 'Throbbing', 'Stabbing', 'Radiating']}
            error={errors.pain_quality?.message}
            register={register('pain_quality')}
          />
          <Input
            label="Aggravating Factors"
            placeholder="Prolonged sitting, bending, lifting"
            error={errors.pain_aggravating_factors?.message}
            {...register('pain_aggravating_factors')}
          />
          <Input
            label="Relieving Factors"
            placeholder="Rest, ice, stretching, medication"
            error={errors.pain_relieving_factors?.message}
            {...register('pain_relieving_factors')}
          />
        </div>
      </div>

      {/* ── 7. Functional Assessment ── */}
      <div>
        <SectionHeading>Functional Assessment</SectionHeading>
        <div className="grid grid-cols-1 gap-4">
          <TextareaField
            id="functional_limitations"
            label="Functional Limitations"
            rows={3}
            placeholder="Describe limitations: sitting, standing, walking, lifting, reaching, climbing stairs..."
            error={errors.functional_limitations?.message}
            register={register('functional_limitations')}
          />
          <TextareaField
            id="prior_therapy_history"
            label="Prior Therapy History"
            rows={3}
            placeholder="Previous PT/rehab treatment, when, for what condition, and outcomes"
            error={errors.prior_therapy_history?.message}
            register={register('prior_therapy_history')}
          />
          <TextareaField
            id="patient_goals"
            label="Patient Goals"
            rows={3}
            placeholder="What are your goals for physical therapy?"
            error={errors.patient_goals?.message}
            register={register('patient_goals')}
          />
        </div>
      </div>

      {/* ── 8. Consent & Acknowledgments ── */}
      <div>
        <SectionHeading>Consent &amp; Acknowledgments</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Consent to Treat Date"
            type="date"
            error={errors.consent_to_treat_date?.message}
            {...register('consent_to_treat_date')}
          />
          <Input
            label="HIPAA Privacy Notice Acknowledgment Date"
            type="date"
            error={errors.hipaa_acknowledgment_date?.message}
            {...register('hipaa_acknowledgment_date')}
          />
          <Input
            label="Financial Responsibility Agreement Date"
            type="date"
            error={errors.financial_responsibility_date?.message}
            {...register('financial_responsibility_date')}
          />
          <div className="flex items-center gap-3 self-end pb-1">
            <input
              id="photo_video_consent"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
              {...register('photo_video_consent')}
            />
            <label htmlFor="photo_video_consent" className="text-sm font-medium font-sans text-foreground/80">
              Photo / Video Consent
            </label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting
          ? mode === 'create' ? 'Adding Patient...' : 'Saving Changes...'
          : mode === 'create' ? 'Add Patient' : 'Save Changes'
        }
      </Button>
    </form>
  )
}
