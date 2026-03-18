DROP POLICY IF EXISTS "PTs can view own patients" ON patients;
DROP POLICY IF EXISTS "Admins can view all patients" ON patients;
DROP POLICY IF EXISTS "PTs can create patients" ON patients;
DROP POLICY IF EXISTS "Admins can create patients" ON patients;
DROP POLICY IF EXISTS "PTs can update own patients" ON patients;
DROP POLICY IF EXISTS "Admins can update all patients" ON patients;
DROP POLICY IF EXISTS "PTs can delete own patients" ON patients;

CREATE POLICY "Authenticated users can view all patients" ON patients FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create patients" ON patients FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update patients" ON patients FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete patients" ON patients FOR DELETE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "PTs can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON appointments;
DROP POLICY IF EXISTS "PTs can create appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can create appointments" ON appointments;
DROP POLICY IF EXISTS "PTs can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can update all appointments" ON appointments;

CREATE POLICY "Authenticated users can view all appointments" ON appointments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update appointments" ON appointments FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "PTs can view own notes" ON session_notes;
DROP POLICY IF EXISTS "Admins can view all notes" ON session_notes;
DROP POLICY IF EXISTS "PTs can create notes" ON session_notes;
DROP POLICY IF EXISTS "Admins can create notes" ON session_notes;
DROP POLICY IF EXISTS "PTs can update own notes" ON session_notes;
DROP POLICY IF EXISTS "Admins can update notes" ON session_notes;

CREATE POLICY "Authenticated users can view all notes" ON session_notes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create notes" ON session_notes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update notes" ON session_notes FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "PTs can view own exercise plans" ON exercise_plans;
DROP POLICY IF EXISTS "Admins can view all exercise plans" ON exercise_plans;
DROP POLICY IF EXISTS "PTs can create exercise plans" ON exercise_plans;
DROP POLICY IF EXISTS "PTs can update own exercise plans" ON exercise_plans;

CREATE POLICY "Authenticated users can view all exercise plans" ON exercise_plans FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create exercise plans" ON exercise_plans FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update exercise plans" ON exercise_plans FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated read exercises" ON exercise_library;
DROP POLICY IF EXISTS "Admins can manage exercises" ON exercise_library;
DROP POLICY IF EXISTS "PTs can manage exercises" ON exercise_library;

CREATE POLICY "Authenticated users full access exercises" ON exercise_library FOR ALL USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated read authorizations" ON authorizations;
DROP POLICY IF EXISTS "PTs can manage authorizations" ON authorizations;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'authorizations') THEN
    EXECUTE 'CREATE POLICY "Authenticated users full access authorizations" ON authorizations FOR ALL USING (auth.uid() IS NOT NULL)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_insurance') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated read insurance" ON patient_insurance';
    EXECUTE 'CREATE POLICY "Authenticated users full access insurance" ON patient_insurance FOR ALL USING (auth.uid() IS NOT NULL)';
  END IF;
END $$;
