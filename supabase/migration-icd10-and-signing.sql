-- Migration: ICD-10 codes table and PT license fields
-- Run this in Supabase SQL Editor AFTER migration-structured-notes.sql

-- ============================================================
-- 1. ICD-10 codes reference table with full-text search
-- ============================================================
CREATE TABLE IF NOT EXISTS icd10_codes (
  code          text PRIMARY KEY,
  description   text NOT NULL,
  category      text NOT NULL,
  is_billable   boolean DEFAULT true,
  is_common_pt  boolean DEFAULT false,
  search_vector tsvector
);

-- Generate search vector from code + description
CREATE OR REPLACE FUNCTION icd10_search_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.code, '') || ' ' || COALESCE(NEW.description, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS icd10_search_update ON icd10_codes;
CREATE TRIGGER icd10_search_update
  BEFORE INSERT OR UPDATE ON icd10_codes
  FOR EACH ROW EXECUTE FUNCTION icd10_search_trigger();

CREATE INDEX IF NOT EXISTS idx_icd10_search ON icd10_codes USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_icd10_common_pt ON icd10_codes(is_common_pt) WHERE is_common_pt = true;
CREATE INDEX IF NOT EXISTS idx_icd10_category ON icd10_codes(category);

ALTER TABLE icd10_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users view ICD-10 codes" ON icd10_codes
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- 2. Add license fields to profiles
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_state text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS npi text;
