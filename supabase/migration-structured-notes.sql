-- Migration: Structured SOAP notes with note types, signing, and clinical fields
-- Run this in Supabase SQL Editor AFTER migration-clinical-features.sql

-- ============================================================
-- 1. Expand session_notes for structured documentation
-- ============================================================

-- Note type (what kind of visit)
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS note_type text DEFAULT 'daily_note'
  CHECK (note_type IN ('initial_evaluation', 'daily_note', 'progress_note', 're_evaluation', 'discharge'));

-- Note status workflow
ALTER TABLE session_notes DROP CONSTRAINT IF EXISTS session_notes_status_check;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft'
  CHECK (status IN ('draft', 'in_progress', 'completed', 'signed', 'amended'));

-- Convert S/O/A/P to JSONB for structured data
-- Keep original text columns for backward compatibility, add structured versions
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS subjective_data jsonb DEFAULT '{}';
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS objective_data jsonb DEFAULT '{}';
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS assessment_data jsonb DEFAULT '{}';
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS plan_data jsonb DEFAULT '{}';

-- Signing fields
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS signed_at timestamptz;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS signed_by_name text;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS signed_by_license text;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS signature_data text;

-- Time tracking
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS time_in timestamptz;
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS time_out timestamptz;

-- Complexity for evaluation notes
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS complexity text
  CHECK (complexity IN ('low', 'moderate', 'high'));

-- Exercise carry-forward from previous session
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS carried_exercises jsonb DEFAULT '[]';

-- Treatment plan data
ALTER TABLE session_notes ADD COLUMN IF NOT EXISTS treatment_plan jsonb DEFAULT '{}';

-- Indexes for new fields
CREATE INDEX IF NOT EXISTS idx_session_notes_note_type ON session_notes(note_type);
CREATE INDEX IF NOT EXISTS idx_session_notes_status ON session_notes(status);
CREATE INDEX IF NOT EXISTS idx_session_notes_signed_at ON session_notes(signed_at);
