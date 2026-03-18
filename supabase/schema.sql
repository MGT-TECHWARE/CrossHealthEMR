-- Cross Health Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          text NOT NULL CHECK (role IN ('admin', 'pt')),
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text,
  date_of_birth date,
  phone         text,
  created_at    timestamptz DEFAULT now()
);

-- Table: appointments
CREATE TABLE IF NOT EXISTS appointments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name      text NOT NULL,
  patient_email     text,
  patient_phone     text,
  pt_id             uuid NOT NULL REFERENCES profiles(id),
  scheduled_at      timestamptz NOT NULL,
  duration_minutes  int DEFAULT 60,
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  reason            text,
  notes             text,
  created_at        timestamptz DEFAULT now()
);

-- Table: session_notes
CREATE TABLE IF NOT EXISTS session_notes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  uuid REFERENCES appointments(id) ON DELETE CASCADE,
  pt_id           uuid NOT NULL REFERENCES profiles(id),
  patient_name    text,
  subjective      text,
  objective       text,
  assessment      text,
  plan            text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Table: exercise_library
CREATE TABLE IF NOT EXISTS exercise_library (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  description     text,
  instructions    text,
  body_part       text[],
  difficulty      text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  equipment       text[],
  sets            int,
  reps            int,
  duration_seconds int,
  video_url       text,
  image_url       text,
  tags            text[],
  is_active       bool DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- Table: exercise_plans
CREATE TABLE IF NOT EXISTS exercise_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_note_id uuid REFERENCES session_notes(id) ON DELETE CASCADE,
  patient_name    text,
  pt_id           uuid NOT NULL REFERENCES profiles(id),
  exercises       jsonb NOT NULL DEFAULT '[]',
  ai_raw_output   text,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'sent')),
  created_at      timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_appointments_pt ON appointments(pt_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_session_notes_appointment ON session_notes(appointment_id);
CREATE INDEX IF NOT EXISTS idx_exercise_plans_session ON exercise_plans(session_note_id);
CREATE INDEX IF NOT EXISTS idx_exercise_library_active ON exercise_library(is_active);

-- Helper function: get current user role without triggering RLS (avoids infinite recursion)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_plans ENABLE ROW LEVEL SECURITY;

-- All authenticated staff can view all profiles (no patient accounts exist)
CREATE POLICY "Authenticated users can view all profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Appointments: PTs see their own, admins see all
CREATE POLICY "PTs view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = pt_id);

CREATE POLICY "Admins view all appointments" ON appointments
  FOR SELECT USING (public.get_my_role() = 'admin');

CREATE POLICY "PTs can create appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = pt_id);

CREATE POLICY "Admins can create appointments" ON appointments
  FOR INSERT WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "PTs can update their appointments" ON appointments
  FOR UPDATE USING (auth.uid() = pt_id);

CREATE POLICY "Admins can update all appointments" ON appointments
  FOR UPDATE USING (public.get_my_role() = 'admin');

-- Session notes: PTs can CRUD their notes, admins can view all
CREATE POLICY "PTs manage their session notes" ON session_notes
  FOR ALL USING (auth.uid() = pt_id);

CREATE POLICY "Admins view all session notes" ON session_notes
  FOR SELECT USING (public.get_my_role() = 'admin');

-- Exercise library: all authenticated users can view
CREATE POLICY "Authenticated users view exercises" ON exercise_library
  FOR SELECT USING (auth.role() = 'authenticated');

-- Exercise plans: PTs manage, admins view all
CREATE POLICY "PTs manage exercise plans" ON exercise_plans
  FOR ALL USING (auth.uid() = pt_id);

CREATE POLICY "Admins view all exercise plans" ON exercise_plans
  FOR SELECT USING (public.get_my_role() = 'admin');

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, role, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'pt'),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'email', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
