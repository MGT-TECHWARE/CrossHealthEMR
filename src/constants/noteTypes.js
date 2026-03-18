export const NOTE_TYPES = {
  INITIAL_EVALUATION: 'initial_evaluation',
  DAILY_NOTE: 'daily_note',
  PROGRESS_NOTE: 'progress_note',
  RE_EVALUATION: 're_evaluation',
  DISCHARGE: 'discharge',
}

export const NOTE_TYPE_LABELS = {
  initial_evaluation: 'Initial Evaluation',
  daily_note: 'Daily Note',
  progress_note: 'Progress Note',
  re_evaluation: 'Re-Evaluation',
  discharge: 'Discharge Summary',
}

export const NOTE_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SIGNED: 'signed',
  AMENDED: 'amended',
}

export const NOTE_STATUS_LABELS = {
  draft: 'Draft',
  in_progress: 'In Progress',
  completed: 'Completed',
  signed: 'Signed',
  amended: 'Amended',
}

export const COMPLEXITY_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
}

export const COMPLEXITY_LABELS = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
}

// Which sections are required/optional per note type
export const NOTE_TYPE_SECTIONS = {
  initial_evaluation: {
    subjective: { required: true, label: 'History & Subjective' },
    objective: { required: true, label: 'Examination & Objective' },
    assessment: { required: true, label: 'Assessment & Diagnosis' },
    plan: { required: true, label: 'Plan of Care' },
  },
  daily_note: {
    subjective: { required: true, label: 'Subjective' },
    objective: { required: true, label: 'Objective' },
    assessment: { required: false, label: 'Assessment' },
    plan: { required: false, label: 'Plan' },
  },
  progress_note: {
    subjective: { required: true, label: 'Subjective' },
    objective: { required: true, label: 'Objective' },
    assessment: { required: true, label: 'Assessment & Progress' },
    plan: { required: true, label: 'Updated Plan' },
  },
  re_evaluation: {
    subjective: { required: true, label: 'Subjective Update' },
    objective: { required: true, label: 'Re-Examination' },
    assessment: { required: true, label: 'Reassessment' },
    plan: { required: true, label: 'Revised Plan' },
  },
  discharge: {
    subjective: { required: true, label: 'Patient Report' },
    objective: { required: true, label: 'Final Measurements' },
    assessment: { required: true, label: 'Discharge Summary' },
    plan: { required: false, label: 'Home Program' },
  },
}

export const PAIN_LEVELS = Array.from({ length: 11 }, (_, i) => i)

export const PAIN_QUALITIES = [
  'Sharp',
  'Dull',
  'Aching',
  'Burning',
  'Throbbing',
  'Stabbing',
  'Shooting',
  'Tingling',
  'Numbness',
  'Pressure',
  'Cramping',
  'Radiating',
]
