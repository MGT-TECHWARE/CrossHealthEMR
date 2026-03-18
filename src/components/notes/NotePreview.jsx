import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'
import { NOTE_TYPE_LABELS, NOTE_STATUS_LABELS, COMPLEXITY_LABELS } from '@/constants/noteTypes'
import { BODY_REGIONS } from '@/constants/bodyRegionTemplates'

function Section({ title, children }) {
  if (!children) return null
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold font-sans text-foreground border-b border-border/40 pb-1 mb-2">{title}</h3>
      <div className="text-sm font-sans text-foreground/80 space-y-1">{children}</div>
    </div>
  )
}

function DataRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-2">
      <span className="text-xs font-medium text-muted-foreground sm:w-32 shrink-0">{label}:</span>
      <span className="text-xs text-foreground/80">{value}</span>
    </div>
  )
}

export default function NotePreview({ note }) {
  if (!note) return null

  const subj = note.subjective_data || {}
  const obj = note.objective_data || {}
  const assess = note.assessment_data || {}
  const planData = note.plan_data || {}
  const isSigned = note.status === 'signed'

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl border border-border/60 shadow-sm">
      {/* Header */}
      <div className="border-b border-border/60 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold font-sans text-foreground">
              {NOTE_TYPE_LABELS[note.note_type] || 'Session Note'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isSigned ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Signed
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {NOTE_STATUS_LABELS[note.status] || 'Draft'}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-sans text-muted-foreground">
          <span><Clock className="h-3 w-3 inline mr-1" />{formatDate(note.created_at)}</span>
          {note.complexity && <span>Complexity: {COMPLEXITY_LABELS[note.complexity]}</span>}
          {note.total_treatment_minutes && <span>Duration: {note.total_treatment_minutes} min</span>}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 py-4">
        {/* Subjective */}
        <Section title="SUBJECTIVE">
          <DataRow label="Chief Complaint" value={subj.chief_complaint} />
          <DataRow label="Pain Level" value={subj.pain_level != null ? `${subj.pain_level}/10` : null} />
          <DataRow label="Pain Quality" value={subj.pain_quality} />
          <DataRow label="Symptom Change" value={subj.symptom_change} />
          <DataRow label="PMH" value={subj.pmh} />
          <DataRow label="Medications" value={subj.medications} />
          {subj.free_text && <p className="text-xs mt-1">{subj.free_text}</p>}
          {/* Fallback to legacy text */}
          {!subj.chief_complaint && note.subjective && <p className="text-xs">{note.subjective}</p>}
        </Section>

        {/* Objective */}
        <Section title="OBJECTIVE">
          {obj.body_regions?.length > 0 && (
            <DataRow
              label="Body Regions"
              value={obj.body_regions.map((r) => BODY_REGIONS.find((br) => br.key === r)?.label || r).join(', ')}
            />
          )}
          <DataRow label="Observation" value={obj.observation} />
          <DataRow label="Palpation" value={obj.palpation} />
          <DataRow label="Sensation" value={obj.sensation} />
          <DataRow label="Functional Testing" value={obj.functional_testing} />
          <DataRow label="Balance/Gait" value={obj.balance_gait} />
          {obj.free_text && <p className="text-xs mt-1">{obj.free_text}</p>}
          {!obj.body_regions && note.objective && <p className="text-xs">{note.objective}</p>}
        </Section>

        {/* Assessment */}
        <Section title="ASSESSMENT">
          <DataRow label="Complexity" value={assess.complexity ? COMPLEXITY_LABELS[assess.complexity] : null} />
          <DataRow label="Primary Dx" value={assess.primary_diagnosis} />
          <DataRow label="Secondary Dx" value={assess.secondary_diagnoses} />
          <DataRow label="ST Goals" value={assess.short_term_goals} />
          <DataRow label="LT Goals" value={assess.long_term_goals} />
          {assess.free_text && <p className="text-xs mt-1">{assess.free_text}</p>}
          {!assess.primary_diagnosis && note.assessment && <p className="text-xs">{note.assessment}</p>}
        </Section>

        {/* Plan */}
        <Section title="PLAN">
          <DataRow label="Frequency" value={planData.frequency} />
          <DataRow label="Duration" value={planData.duration_weeks ? `${planData.duration_weeks} weeks` : null} />
          <DataRow label="Education" value={planData.patient_education} />
          <DataRow label="HEP Summary" value={planData.hep_summary} />
          <DataRow label="Next Visit" value={planData.next_visit_plan} />
          {planData.free_text && <p className="text-xs mt-1">{planData.free_text}</p>}
          {!planData.frequency && note.plan && <p className="text-xs">{note.plan}</p>}
        </Section>
      </div>

      {/* Signature Footer */}
      {isSigned && (
        <div className="border-t border-border/60 px-4 sm:px-6 py-4 bg-secondary/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <p className="text-sm font-semibold font-sans text-foreground">
                Electronically Signed
              </p>
              <p className="text-xs font-sans text-muted-foreground">
                {note.signed_by_name} — {note.signed_by_license}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-sans text-muted-foreground">
                {note.signed_at ? formatDate(note.signed_at) : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
