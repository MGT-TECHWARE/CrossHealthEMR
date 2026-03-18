import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarPlus } from 'lucide-react'
import { appointmentSchema } from '@/schemas/appointment.schema'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const APPOINTMENT_TYPES = [
  { value: 'initial_eval', label: 'Initial Evaluation' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 're_eval', label: 'Re-Evaluation' },
  { value: 'discharge', label: 'Discharge' },
  { value: 'wellness', label: 'Wellness' },
]

const PAYMENT_TYPES = [
  { value: 'cash', label: 'Cash Pay' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'telehealth', label: 'Telehealth' },
  { value: 'workers_comp', label: 'Workers Comp' },
  { value: 'auto', label: 'Auto Accident' },
]

export default function AppointmentForm({ onSubmit, patients = [], availablePTs = [], currentPTId }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      pt_id: currentPTId || '',
      duration_minutes: 60,
      appointment_type: 'follow_up',
      payment_type: 'cash',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <CalendarPlus className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold font-sans text-foreground">New Appointment</h2>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
          Patient
        </label>
        <select
          {...register('patient_id')}
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select a patient...</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>
        {errors.patient_id && (
          <p className="mt-1 text-sm font-sans text-destructive">{errors.patient_id.message}</p>
        )}
      </div>

      {availablePTs.length > 0 && (
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
            Physical Therapist
          </label>
          <select
            {...register('pt_id')}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select a PT...</option>
            {availablePTs.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.first_name} {pt.last_name}
              </option>
            ))}
          </select>
          {errors.pt_id && (
            <p className="mt-1 text-sm font-sans text-destructive">{errors.pt_id.message}</p>
          )}
        </div>
      )}

      <Input
        label="Date & Time"
        type="datetime-local"
        error={errors.scheduled_at?.message}
        {...register('scheduled_at')}
      />

      {/* Appointment Type & Payment Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
            Appointment Type
          </label>
          <select
            {...register('appointment_type')}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {APPOINTMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
            Payment Type
          </label>
          <select
            {...register('payment_type')}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {PAYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
          Reason for Visit
        </label>
        <textarea
          {...register('reason')}
          rows={3}
          placeholder="Describe the reason for the visit..."
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
        {errors.reason && (
          <p className="mt-1 text-sm font-sans text-destructive">{errors.reason.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
          Duration
        </label>
        <select
          {...register('duration_minutes')}
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
          <option value="90">90 minutes</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Booking...' : 'Book Appointment'}
      </Button>
    </form>
  )
}
