-- Migration: Documents section and prescription tracking
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. Patient Documents table
-- ============================================================
CREATE TABLE IF NOT EXISTS patient_documents (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_type     text NOT NULL CHECK (document_type IN (
    'prescription', 'intake_form', 'imaging', 'lab_results',
    'referral', 'insurance_card', 'id_card', 'consent_form',
    'medical_records', 'other'
  )),
  file_name         text NOT NULL,
  file_path         text NOT NULL,
  file_size         int,
  mime_type         text,
  description       text,
  effective_date    date,
  expiration_date   date,
  uploaded_by       uuid REFERENCES profiles(id),
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patient_documents_patient ON patient_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_documents_type ON patient_documents(document_type);

ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view patient documents" ON patient_documents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage patient documents" ON patient_documents
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 2. Prescriptions table
-- ============================================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  physician_name      text NOT NULL,
  physician_npi       text,
  physician_phone     text,
  prescription_date   date NOT NULL,
  expiration_date     date,
  visits_authorized   int,
  frequency           text,
  diagnosis_codes     jsonb DEFAULT '[]',
  notes               text,
  status              text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'completed', 'cancelled')),
  document_id         uuid REFERENCES patient_documents(id),
  created_by          uuid REFERENCES profiles(id),
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view prescriptions" ON prescriptions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage prescriptions" ON prescriptions
  FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update timestamps
DROP TRIGGER IF EXISTS prescriptions_updated_at ON prescriptions;
CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. Storage bucket for patient documents
-- ============================================================
-- Note: Run this via Supabase Dashboard or API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('patient-documents', 'patient-documents', false);
