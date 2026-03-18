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

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES patients(id);
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES patients(id);
ALTER TABLE exercise_plans ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES patients(id);

CREATE INDEX IF NOT EXISTS idx_patients_created_by ON patients(created_by);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_patient ON session_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_exercise_plans_patient ON exercise_plans(patient_id);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'PTs can view own patients') THEN
    CREATE POLICY "PTs can view own patients" ON patients FOR SELECT USING (auth.uid() = created_by);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'Admins can view all patients') THEN
    CREATE POLICY "Admins can view all patients" ON patients FOR SELECT USING (public.get_my_role() = 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'PTs can create patients') THEN
    CREATE POLICY "PTs can create patients" ON patients FOR INSERT WITH CHECK (auth.uid() = created_by);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'Admins can create patients') THEN
    CREATE POLICY "Admins can create patients" ON patients FOR INSERT WITH CHECK (public.get_my_role() = 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'PTs can update own patients') THEN
    CREATE POLICY "PTs can update own patients" ON patients FOR UPDATE USING (auth.uid() = created_by);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'Admins can update all patients') THEN
    CREATE POLICY "Admins can update all patients" ON patients FOR UPDATE USING (public.get_my_role() = 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'PTs can delete own patients') THEN
    CREATE POLICY "PTs can delete own patients" ON patients FOR DELETE USING (auth.uid() = created_by);
  END IF;
END $$;

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

ALTER TABLE patients ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'English';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS occupation text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS ssn_last4 text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'phone';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_street text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_city text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_state text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_zip text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact_relationship text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referring_physician_name text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referring_physician_npi text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referring_physician_phone text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referring_physician_fax text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referral_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referral_expiration_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS primary_diagnosis_code text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS primary_diagnosis_description text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS secondary_diagnosis_codes jsonb DEFAULT '[]';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS consent_to_treat_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS hipaa_acknowledgment_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS financial_responsibility_date date;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS photo_video_consent boolean DEFAULT false;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS past_medical_conditions text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS surgical_history text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS current_medications text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS social_history text;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'past_medical_conditions' AND data_type = 'jsonb') THEN
    ALTER TABLE patients ALTER COLUMN past_medical_conditions TYPE text USING past_medical_conditions::text;
    ALTER TABLE patients ALTER COLUMN past_medical_conditions SET DEFAULT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'surgical_history' AND data_type = 'jsonb') THEN
    ALTER TABLE patients ALTER COLUMN surgical_history TYPE text USING surgical_history::text;
    ALTER TABLE patients ALTER COLUMN surgical_history SET DEFAULT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'current_medications' AND data_type = 'jsonb') THEN
    ALTER TABLE patients ALTER COLUMN current_medications TYPE text USING current_medications::text;
    ALTER TABLE patients ALTER COLUMN current_medications SET DEFAULT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'allergies' AND data_type = 'jsonb') THEN
    ALTER TABLE patients ALTER COLUMN allergies TYPE text USING allergies::text;
    ALTER TABLE patients ALTER COLUMN allergies SET DEFAULT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'social_history' AND data_type = 'jsonb') THEN
    ALTER TABLE patients ALTER COLUMN social_history TYPE text USING social_history::text;
    ALTER TABLE patients ALTER COLUMN social_history SET DEFAULT NULL;
  END IF;
END $$;

ALTER TABLE patients ADD COLUMN IF NOT EXISTS functional_limitations text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS prior_therapy_history text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_location text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_intensity int;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_quality text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_aggravating_factors text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pain_relieving_factors text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_goals text;

CREATE TABLE IF NOT EXISTS patient_insurance (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id                uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  insurance_type            text NOT NULL DEFAULT 'primary' CHECK (insurance_type IN ('primary', 'secondary', 'tertiary', 'workers_comp', 'auto_accident')),
  payer_name                text NOT NULL,
  payer_id                  text,
  plan_name                 text,
  group_number              text,
  subscriber_id             text NOT NULL,
  subscriber_name           text,
  subscriber_dob            date,
  subscriber_relationship   text DEFAULT 'self' CHECK (subscriber_relationship IN ('self', 'spouse', 'child', 'other')),
  policy_effective_date     date,
  policy_end_date           date,
  copay_amount              numeric(10,2),
  coinsurance_percent       numeric(5,2),
  deductible_amount         numeric(10,2),
  deductible_met            numeric(10,2) DEFAULT 0,
  out_of_pocket_max         numeric(10,2),
  in_network                boolean DEFAULT true,
  requires_authorization    boolean DEFAULT false,
  requires_referral         boolean DEFAULT false,
  verification_status       text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'failed', 'expired')),
  verification_date         timestamptz,
  verified_by               uuid REFERENCES profiles(id),
  verification_notes        text,
  next_verification_date    date,
  claim_number              text,
  date_of_injury            date,
  adjuster_name             text,
  adjuster_phone            text,
  attorney_name             text,
  attorney_phone            text,
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patient_insurance_patient ON patient_insurance(patient_id);

ALTER TABLE patient_insurance ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_insurance' AND policyname = 'Staff can view patient insurance') THEN
    CREATE POLICY "Staff can view patient insurance" ON patient_insurance FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_insurance' AND policyname = 'Staff can manage patient insurance') THEN
    CREATE POLICY "Staff can manage patient insurance" ON patient_insurance FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_insurance' AND column_name = 'coinsurance_pct') THEN
    ALTER TABLE patient_insurance RENAME COLUMN coinsurance_pct TO coinsurance_percent;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_insurance' AND column_name = 'requires_auth') THEN
    ALTER TABLE patient_insurance RENAME COLUMN requires_auth TO requires_authorization;
  END IF;
END $$;

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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'authorizations' AND policyname = 'Staff can view authorizations') THEN
    CREATE POLICY "Staff can view authorizations" ON authorizations FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'authorizations' AND policyname = 'Staff can manage authorizations') THEN
    CREATE POLICY "Staff can manage authorizations" ON authorizations FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS appointment_type text DEFAULT 'follow_up';
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'appointments_appointment_type_check' AND table_name = 'appointments') THEN
    BEGIN
      ALTER TABLE appointments ADD CONSTRAINT appointments_appointment_type_check CHECK (appointment_type IN ('initial_eval', 'follow_up', 're_eval', 'discharge', 'wellness'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS visit_number int;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS authorization_id uuid;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS copay_amount numeric(10,2);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS copay_collected boolean DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS copay_collected_amount numeric(10,2);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_reason text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_no_show boolean DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_late_cancel boolean DEFAULT false;

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

CREATE TABLE IF NOT EXISTS cpt_codes (
  code        text PRIMARY KEY,
  description text NOT NULL,
  category    text NOT NULL CHECK (category IN ('evaluation', 'therapeutic_timed', 'therapeutic_untimed', 'modality_timed', 'modality_untimed', 'testing')),
  is_timed    boolean DEFAULT false,
  default_minutes int,
  default_rate numeric(10,2),
  is_active   boolean DEFAULT true
);

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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cpt_codes' AND policyname = 'Authenticated users view CPT codes') THEN
    CREATE POLICY "Authenticated users view CPT codes" ON cpt_codes FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_library' AND policyname = 'Authenticated users can insert exercises') THEN
    CREATE POLICY "Authenticated users can insert exercises" ON exercise_library FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_library' AND policyname = 'Authenticated users can update exercises') THEN
    CREATE POLICY "Authenticated users can update exercises" ON exercise_library FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_documents') THEN
    ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_documents' AND policyname = 'Staff can view patient documents') THEN
      CREATE POLICY "Staff can view patient documents" ON patient_documents FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_documents' AND policyname = 'Staff can manage patient documents') THEN
      CREATE POLICY "Staff can manage patient documents" ON patient_documents FOR ALL USING (auth.role() = 'authenticated');
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'prescriptions') THEN
    ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prescriptions' AND policyname = 'Staff can view prescriptions') THEN
      CREATE POLICY "Staff can view prescriptions" ON prescriptions FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prescriptions' AND policyname = 'Staff can manage prescriptions') THEN
      CREATE POLICY "Staff can manage prescriptions" ON prescriptions FOR ALL USING (auth.role() = 'authenticated');
    END IF;
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-images', 'exercise-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-documents', 'patient-documents', false)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can upload exercise images') THEN
    CREATE POLICY "Authenticated users can upload exercise images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'exercise-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can update exercise images') THEN
    CREATE POLICY "Authenticated users can update exercise images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'exercise-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can view exercise images') THEN
    CREATE POLICY "Anyone can view exercise images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'exercise-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can upload patient documents') THEN
    CREATE POLICY "Authenticated users can upload patient documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'patient-documents');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can view patient documents') THEN
    CREATE POLICY "Authenticated users can view patient documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'patient-documents');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can delete patient documents') THEN
    CREATE POLICY "Authenticated users can delete patient documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'patient-documents');
  END IF;
END $$;

DROP TRIGGER IF EXISTS patient_insurance_updated_at ON patient_insurance;
CREATE TRIGGER patient_insurance_updated_at
  BEFORE UPDATE ON patient_insurance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS authorizations_updated_at ON authorizations;
CREATE TRIGGER authorizations_updated_at
  BEFORE UPDATE ON authorizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_state text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS npi text;
