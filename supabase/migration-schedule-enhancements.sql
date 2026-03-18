-- Migration: Schedule enhancements — check-in flow, payment types, expanded status
-- Run this in Supabase SQL Editor AFTER migration-clinical-features.sql

-- ============================================================
-- 1. Expand appointments with check-in and payment tracking
-- ============================================================

-- Check-in tracking
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS checked_in_at timestamptz;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS checked_in_by uuid REFERENCES profiles(id);

-- Payment type for color coding
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_type text DEFAULT 'cash'
  CHECK (payment_type IN ('cash', 'insurance', 'medicare', 'telehealth', 'workers_comp', 'auto'));

-- Expand status enum to include checked_in, in_progress, no_show
-- Drop old constraint and add new one
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'));
