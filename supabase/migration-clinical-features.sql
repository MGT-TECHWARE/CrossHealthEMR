-- Migration: Clinical features — insurance, medical history, authorization, CPT tracking
-- Run this in Supabase SQL Editor AFTER migration-add-patients.sql

-- ============================================================
-- 1. Expand patients table with clinical fields
-- ============================================================
ALTER TABLE patients ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'English';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS occupation text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS ssn_last4 text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'phone';

-- Structured address fields
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_street text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_city text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_state text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_zip text;

-- Emergency contact relationship
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact_relationship text;

-- Referral info
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referring_physician_name text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referring_physician_npi text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referring_physician_phone text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referring_physician_fax text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referral_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referral_expiration_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS primary_diagnosis_code text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS primary_diagnosis_description text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS secondary_diagnosis_codes jsonb DEFAULT '[]';

-- Consent tracking
ALTER TABLE patients ADD COLUMN IF NOT EXISTS consent_to_treat_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS hipaa_acknowledgment_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS financial_responsibility_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS photo_video_consent boolean DEFAULT false;

-- Structured medical history (JSONB for flexibility)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS past_medical_conditions jsonb DEFAULT '[]';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS surgical_history jsonb DEFAULT '[]';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS current_medications jsonb DEFAULT '[]';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies jsonb DEFAULT '[]';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS social_history jsonb DEFAULT '{}';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS functional_limitations text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS prior_therapy_history text;

-- Pain assessment baseline
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_location text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_intensity int;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_quality text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_aggravating_factors text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_relieving_factors text;

-- Patient goals
ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_goals text;

-- ============================================================
-- 2. Patient Insurance table (supports primary + secondary)
-- ============================================================
CREATE TABLE IF NOT EXISTS patient_insurance (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  insurance_type        text NOT NULL DEFAULT 'primary' CHECK (insurance_type IN ('primary', 'secondary', 'tertiary', 'workers_comp', 'auto_accident')),
  payer_name            text NOT NULL,
  payer_id              text,
  plan_name             text,
  group_number          text,
  subscriber_id         text NOT NULL,
  subscriber_name       text,
  subscriber_dob        date,
  subscriber_relationship text DEFAULT 'self' CHECK (subscriber_relationship IN ('self', 'spouse', 'child', 'other')),
  policy_effective_date date,
  policy_end_date       date,
  copay_amount          numeric(10,2),
  coinsurance_pct       numeric(5,2),
  deductible_amount     numeric(10,2),
  deductible_met        numeric(10,2) DEFAULT 0,
  out_of_pocket_max     numeric(10,2),
  in_network            boolean DEFAULT true,
  requires_auth         boolean DEFAULT false,
  requires_referral     boolean DEFAULT false,

  -- Verification
  verification_status   text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'failed', 'expired')),
  verification_date     timestamptz,
  verified_by           uuid REFERENCES profiles(id),
  verification_notes    text,
  next_verification_date date,

  -- Workers comp / auto specific
  claim_number          text,
  date_of_injury        date,
  adjuster_name         text,
  adjuster_phone        text,
  attorney_name         text,
  attorney_phone        text,

  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patient_insurance_patient ON patient_insurance(patient_id);

ALTER TABLE patient_insurance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view patient insurance" ON patient_insurance
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage patient insurance" ON patient_insurance
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 3. Authorizations table
-- ============================================================
CREATE TABLE IF NOT EXISTS authorizations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  insurance_id          uuid REFERENCES patient_insurance(id),
  auth_number           text NOT NULL,
  authorized_visits     int NOT NULL,
  visits_used           int DEFAULT 0,
  start_date            date NOT NULL,
  end_date              date NOT NULL,
  status                text DEFAULT 'active' CHECK (status IN ('pending', 'active', 'expired', 'denied', 'exhausted')),
  diagnosis_codes       jsonb DEFAULT '[]',
  notes                 text,
  alert_at_remaining    int DEFAULT 3,
  created_by            uuid REFERENCES profiles(id),
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_authorizations_patient ON authorizations(patient_id);
CREATE INDEX IF NOT EXISTS idx_authorizations_status ON authorizations(status);

ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view authorizations" ON authorizations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage authorizations" ON authorizations
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 4. Expand appointments with clinical fields
-- ============================================================
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS appointment_type text DEFAULT 'follow_up' CHECK (appointment_type IN ('initial_eval', 'follow_up', 're_eval', 'discharge', 'wellness'));
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS visit_number int;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS authorization_id uuid REFERENCES authorizations(id);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS copay_amount numeric(10,2);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS copay_collected boolean DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS copay_collected_amount numeric(10,2);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_reason text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_no_show boolean DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_late_cancel boolean DEFAULT false;

-- ============================================================
-- 5. Expand session_notes with CPT & treatment tracking
-- ============================================================
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS treatment_codes jsonb DEFAULT '[]';
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS total_treatment_minutes int;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS total_billable_units int;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS pain_level_pre int;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS pain_level_post int;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS modifiers text[];
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS diagnosis_codes jsonb DEFAULT '[]';
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS short_term_goals jsonb DEFAULT '[]';
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS long_term_goals jsonb DEFAULT '[]';
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS home_exercise_program text;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS patient_education text;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS next_visit_plan text;

-- ============================================================
-- 6. CPT codes reference table
-- ============================================================
CREATE TABLE IF NOT EXISTS cpt_codes (
  code        text PRIMARY KEY,
  description text NOT NULL,
  category    text NOT NULL CHECK (category IN ('evaluation', 'therapeutic_timed', 'therapeutic_untimed', 'modality_timed', 'modality_untimed', 'testing')),
  is_timed    boolean DEFAULT false,
  default_minutes int,
  default_rate numeric(10,2),
  is_active   boolean DEFAULT true
);

-- Seed common PT CPT codes
INSERT INTO cpt_codes (code, description, category, is_timed, default_minutes) VALUES
  ('97161', 'PT Evaluation — Low Complexity', 'evaluation', false, 30),
  ('97162', 'PT Evaluation — Moderate Complexity', 'evaluation', false, 45),
  ('97163', 'PT Evaluation — High Complexity', 'evaluation', false, 60),
  ('97164', 'PT Re-evaluation', 'evaluation', false, 30),
  ('97110', 'Therapeutic Exercise', 'therapeutic_timed', true, 15),
  ('97112', 'Neuromuscular Re-education', 'therapeutic_timed', true, 15),
  ('97113', 'Aquatic Therapy', 'therapeutic_timed', true, 15),
  ('97116', 'Gait Training', 'therapeutic_timed', true, 15),
  ('97140', 'Manual Therapy', 'therapeutic_timed', true, 15),
  ('97530', 'Therapeutic Activities', 'therapeutic_timed', true, 15),
  ('97535', 'Self-care/Home Management Training', 'therapeutic_timed', true, 15),
  ('97542', 'Wheelchair Management Training', 'therapeutic_timed', true, 15),
  ('97750', 'Physical Performance Test', 'testing', true, 15),
  ('97010', 'Hot/Cold Pack', 'modality_untimed', false, null),
  ('97012', 'Mechanical Traction', 'modality_untimed', false, null),
  ('97014', 'Electrical Stimulation (unattended)', 'modality_untimed', false, null),
  ('97032', 'Electrical Stimulation (attended)', 'modality_timed', true, 15),
  ('97033', 'Iontophoresis', 'modality_timed', true, 15),
  ('97035', 'Ultrasound', 'modality_timed', true, 15),
  ('97036', 'Hubbard Tank', 'modality_timed', true, 15)
ON CONFLICT (code) DO NOTHING;

ALTER TABLE cpt_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users view CPT codes" ON cpt_codes
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- 7. Auto-update timestamps
-- ============================================================
DROP TRIGGER IF EXISTS patient_insurance_updated_at ON patient_insurance;
CREATE TRIGGER patient_insurance_updated_at
  BEFORE UPDATE ON patient_insurance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS authorizations_updated_at ON authorizations;
CREATE TRIGGER authorizations_updated_at
  BEFORE UPDATE ON authorizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
