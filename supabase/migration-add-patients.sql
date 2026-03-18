-- Migration: Add patients table and wire up patient_id FKs
-- Run this in Supabase SQL Editor

-- 1. Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name                text NOT NULL,
  last_name                 text NOT NULL,
  date_of_birth             date,
  email                     text,
  phone                     text,
  insurance_provider        text,
  insurance_id              text,
  address                   text,
  emergency_contact_name    text,
  emergency_contact_phone   text,
  medical_notes             text,
  created_by                uuid NOT NULL REFERENCES profiles(id),
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now()
);

-- 2. Add patient_id FK to existing tables
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES patients(id);
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES patients(id);
ALTER TABLE exercise_plans ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES patients(id);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_patients_created_by ON patients(created_by);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_patient ON session_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_exercise_plans_patient ON exercise_plans(patient_id);

-- 4. RLS on patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PTs can view own patients" ON patients
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all patients" ON patients
  FOR SELECT USING (public.get_my_role() = 'admin');

CREATE POLICY "PTs can create patients" ON patients
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can create patients" ON patients
  FOR INSERT WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "PTs can update own patients" ON patients
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update all patients" ON patients
  FOR UPDATE USING (public.get_my_role() = 'admin');

CREATE POLICY "PTs can delete own patients" ON patients
  FOR DELETE USING (auth.uid() = created_by);

-- 5. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS patients_updated_at ON patients;
CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
