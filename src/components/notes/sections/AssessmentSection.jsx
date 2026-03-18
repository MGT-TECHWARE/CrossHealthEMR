import { COMPLEXITY_LABELS } from '@/constants/noteTypes'
import ICD10Search from '@/components/notes/ICD10Search'

export default function AssessmentSection({ data = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      {/* Complexity */}
      <div>
        <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
          Complexity
        </label>
        <div className="flex gap-2">
          {Object.entries(COMPLEXITY_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => update('complexity', key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium font-sans transition-colors ${
                data.complexity === key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-secondary text-foreground/60 hover:bg-secondary/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ICD-10 Search */}
      <ICD10Search
        selected={data.diagnosis_codes || []}
        onChange={(codes) => update('diagnosis_codes', codes)}
        label="Diagnosis Codes (ICD-10)"
      />

      {/* Legacy text inputs as fallback */}
      {(!data.diagnosis_codes || data.diagnosis_codes.length === 0) && (
        <>
          <div>
            <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
              Primary Diagnosis (manual)
            </label>
            <input
              type="text"
              value={data.primary_diagnosis || ''}
              onChange={(e) => update('primary_diagnosis', e.target.value)}
              placeholder="e.g. M54.5 — Low back pain"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
              Secondary Diagnoses
            </label>
            <input
              type="text"
              value={data.secondary_diagnoses || ''}
              onChange={(e) => update('secondary_diagnoses', e.target.value)}
              placeholder="Additional ICD-10 codes, comma separated"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </>
      )}

      {/* Goals */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
            Short-Term Goals
          </label>
          <textarea
            value={data.short_term_goals || ''}
            onChange={(e) => update('short_term_goals', e.target.value)}
            rows={3}
            placeholder="STG 1: Patient will...&#10;STG 2: Patient will..."
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
            Long-Term Goals
          </label>
          <textarea
            value={data.long_term_goals || ''}
            onChange={(e) => update('long_term_goals', e.target.value)}
            rows={3}
            placeholder="LTG 1: Patient will...&#10;LTG 2: Patient will..."
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      </div>

      {/* Free text assessment */}
      <div>
        <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
          Clinical Assessment
        </label>
        <textarea
          value={data.free_text || ''}
          onChange={(e) => update('free_text', e.target.value)}
          rows={4}
          placeholder="Clinical reasoning, prognosis, response to treatment, barriers to progress..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>
    </div>
  )
}
