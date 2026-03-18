CREATE INDEX IF NOT EXISTS idx_patients_first_name ON patients(first_name);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_scheduled ON appointments(patient_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_pt_scheduled ON appointments(pt_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status_scheduled ON appointments(status, scheduled_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

CREATE INDEX IF NOT EXISTS idx_session_notes_created_at ON session_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_notes_pt ON session_notes(pt_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_patient_created ON session_notes(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_notes_patient_type ON session_notes(patient_id, note_type);
CREATE INDEX IF NOT EXISTS idx_session_notes_appointment_created ON session_notes(appointment_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exercise_plans_created_at ON exercise_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_plans_patient_created ON exercise_plans(patient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exercise_library_difficulty ON exercise_library(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercise_library_name ON exercise_library(name);
CREATE INDEX IF NOT EXISTS idx_exercise_library_body_part ON exercise_library USING gin(body_part);

CREATE INDEX IF NOT EXISTS idx_patient_documents_created_at ON patient_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patient_documents_patient_created ON patient_documents(patient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_date ON prescriptions(patient_id, prescription_date DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_expiration ON prescriptions(expiration_date);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_status ON prescriptions(patient_id, status);

CREATE INDEX IF NOT EXISTS idx_authorizations_patient_status ON authorizations(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_authorizations_end_date ON authorizations(end_date);
CREATE INDEX IF NOT EXISTS idx_authorizations_start_date ON authorizations(start_date DESC);

CREATE INDEX IF NOT EXISTS idx_patient_insurance_type ON patient_insurance(insurance_type);

CREATE INDEX IF NOT EXISTS idx_icd10_code ON icd10_codes(code);
CREATE INDEX IF NOT EXISTS idx_icd10_code_prefix ON icd10_codes(code text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_icd10_description ON icd10_codes USING gin(to_tsvector('english', description));

CREATE INDEX IF NOT EXISTS idx_patients_search ON patients USING gin(
  to_tsvector('english', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(email, ''))
);

ANALYZE patients;
ANALYZE appointments;
ANALYZE session_notes;
ANALYZE exercise_library;
ANALYZE exercise_plans;
ANALYZE profiles;
ANALYZE prescriptions;
ANALYZE authorizations;
ANALYZE patient_insurance;
ANALYZE patient_documents;
ANALYZE icd10_codes;
