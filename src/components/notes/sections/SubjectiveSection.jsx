import { PAIN_LEVELS, PAIN_QUALITIES } from '@/constants/noteTypes'

export default function SubjectiveSection({ data = {}, onChange, patient }) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      {/* Chief Complaint */}
      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
          Chief Complaint
        </label>
        <textarea
          value={data.chief_complaint || ''}
          onChange={(e) => update('chief_complaint', e.target.value)}
          placeholder="Patient's primary complaint in their own words..."
          rows={2}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Pain Level & Quality */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
            Pain Level (0-10)
          </label>
          <select
            value={data.pain_level ?? ''}
            onChange={(e) => update('pain_level', e.target.value === '' ? null : Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select...</option>
            {PAIN_LEVELS.map((level) => (
              <option key={level} value={level}>{level}/10</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
            Pain Quality
          </label>
          <select
            value={data.pain_quality || ''}
            onChange={(e) => update('pain_quality', e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select...</option>
            {PAIN_QUALITIES.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Symptom Changes */}
      <div>
        <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
          Symptom Changes Since Last Visit
        </label>
        <div className="flex gap-2 mb-2">
          {['better', 'same', 'worse'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => update('symptom_change', opt)}
              className={`rounded-full px-3 py-1 text-xs font-medium font-sans transition-colors ${
                data.symptom_change === opt
                  ? opt === 'better' ? 'bg-emerald-100 text-emerald-700' : opt === 'worse' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  : 'bg-secondary text-foreground/60 hover:bg-secondary/80'
              }`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* PMH / Surgical History - prepopulated from patient */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
            Past Medical History
          </label>
          <textarea
            value={data.pmh || patient?.past_medical_conditions || ''}
            onChange={(e) => update('pmh', e.target.value)}
            rows={2}
            placeholder="Relevant PMH..."
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
            Medications
          </label>
          <textarea
            value={data.medications || patient?.current_medications || ''}
            onChange={(e) => update('medications', e.target.value)}
            rows={2}
            placeholder="Current medications..."
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      </div>

      {/* Free text */}
      <div>
        <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
          Additional Subjective Notes
        </label>
        <textarea
          value={data.free_text || ''}
          onChange={(e) => update('free_text', e.target.value)}
          rows={3}
          placeholder="Any additional subjective findings, patient-reported outcomes, functional status changes..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>
    </div>
  )
}
