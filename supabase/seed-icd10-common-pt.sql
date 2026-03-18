-- Seed file: Common ICD-10-CM codes for Physical Therapy
-- Inserts ~200 codes commonly used in PT practice
-- All codes marked with is_common_pt = true

-- ============================================================================
-- MUSCULOSKELETAL - SPINE (M40-M54)
-- ============================================================================

-- Back pain (M54.x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M54.5', 'Low back pain', 'Musculoskeletal', true, true),
  ('M54.50', 'Low back pain, unspecified', 'Musculoskeletal', true, true),
  ('M54.51', 'Vertebrogenic low back pain', 'Musculoskeletal', true, true),
  ('M54.59', 'Other low back pain', 'Musculoskeletal', true, true),
  ('M54.2', 'Cervicalgia', 'Musculoskeletal', true, true),
  ('M54.6', 'Pain in thoracic spine', 'Musculoskeletal', true, true),
  ('M54.9', 'Dorsalgia, unspecified', 'Musculoskeletal', true, true),
  ('M54.4', 'Lumbago with sciatica, unspecified side', 'Musculoskeletal', true, true),
  ('M54.41', 'Lumbago with sciatica, right side', 'Musculoskeletal', true, true),
  ('M54.42', 'Lumbago with sciatica, left side', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- Radiculopathy (M54.1x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M54.10', 'Radiculopathy, site unspecified', 'Musculoskeletal', true, true),
  ('M54.12', 'Radiculopathy, cervical region', 'Musculoskeletal', true, true),
  ('M54.16', 'Radiculopathy, lumbar region', 'Musculoskeletal', true, true),
  ('M54.17', 'Radiculopathy, lumbosacral region', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- Intervertebral disc disorders (M51.x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M51.16', 'Intervertebral disc disorders with radiculopathy, lumbar region', 'Musculoskeletal', true, true),
  ('M51.17', 'Intervertebral disc disorders with radiculopathy, lumbosacral region', 'Musculoskeletal', true, true),
  ('M51.26', 'Other intervertebral disc displacement, lumbar region', 'Musculoskeletal', true, true),
  ('M51.27', 'Other intervertebral disc displacement, lumbosacral region', 'Musculoskeletal', true, true),
  ('M51.36', 'Other intervertebral disc degeneration, lumbar region', 'Musculoskeletal', true, true),
  ('M51.37', 'Other intervertebral disc degeneration, lumbosacral region', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- Cervical disc disorders (M50.x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M50.10', 'Cervical disc disorder with radiculopathy, unspecified cervical region', 'Musculoskeletal', true, true),
  ('M50.20', 'Other cervical disc displacement, unspecified cervical region', 'Musculoskeletal', true, true),
  ('M50.30', 'Other cervical disc degeneration, unspecified cervical region', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- Spinal stenosis (M48.0x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M48.02', 'Spinal stenosis, cervical region', 'Musculoskeletal', true, true),
  ('M48.06', 'Spinal stenosis, lumbar region', 'Musculoskeletal', true, true),
  ('M48.061', 'Spinal stenosis, lumbar region without neurogenic claudication', 'Musculoskeletal', true, true),
  ('M48.062', 'Spinal stenosis, lumbar region with neurogenic claudication', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- Spondylosis (M47.x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M47.812', 'Spondylosis without myelopathy or radiculopathy, cervical region', 'Musculoskeletal', true, true),
  ('M47.816', 'Spondylosis without myelopathy or radiculopathy, lumbar region', 'Musculoskeletal', true, true),
  ('M47.817', 'Spondylosis without myelopathy or radiculopathy, lumbosacral region', 'Musculoskeletal', true, true),
  ('M47.26', 'Other spondylosis with radiculopathy, lumbar region', 'Musculoskeletal', true, true),
  ('M47.27', 'Other spondylosis with radiculopathy, lumbosacral region', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- MUSCULOSKELETAL - SHOULDER (M75.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  -- Rotator cuff (incomplete)
  ('M75.100', 'Unspecified rotator cuff tear or rupture of unspecified shoulder, not specified as traumatic', 'Musculoskeletal', true, true),
  ('M75.111', 'Incomplete rotator cuff tear or rupture of right shoulder, not specified as traumatic', 'Musculoskeletal', true, true),
  ('M75.112', 'Incomplete rotator cuff tear or rupture of left shoulder, not specified as traumatic', 'Musculoskeletal', true, true),
  -- Rotator cuff (complete)
  ('M75.121', 'Complete rotator cuff tear or rupture of right shoulder, not specified as traumatic', 'Musculoskeletal', true, true),
  ('M75.122', 'Complete rotator cuff tear or rupture of left shoulder, not specified as traumatic', 'Musculoskeletal', true, true),
  -- Adhesive capsulitis (frozen shoulder)
  ('M75.00', 'Adhesive capsulitis of unspecified shoulder', 'Musculoskeletal', true, true),
  ('M75.01', 'Adhesive capsulitis of right shoulder', 'Musculoskeletal', true, true),
  ('M75.02', 'Adhesive capsulitis of left shoulder', 'Musculoskeletal', true, true),
  -- Bicipital tendinitis
  ('M75.21', 'Bicipital tendinitis, right shoulder', 'Musculoskeletal', true, true),
  ('M75.22', 'Bicipital tendinitis, left shoulder', 'Musculoskeletal', true, true),
  -- Impingement syndrome
  ('M75.40', 'Impingement syndrome of unspecified shoulder', 'Musculoskeletal', true, true),
  ('M75.41', 'Impingement syndrome of right shoulder', 'Musculoskeletal', true, true),
  ('M75.42', 'Impingement syndrome of left shoulder', 'Musculoskeletal', true, true),
  -- Bursitis of shoulder
  ('M75.50', 'Bursitis of unspecified shoulder', 'Musculoskeletal', true, true),
  ('M75.51', 'Bursitis of right shoulder', 'Musculoskeletal', true, true),
  ('M75.52', 'Bursitis of left shoulder', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- MUSCULOSKELETAL - KNEE (M17.x, M22.x, M23.x)
-- ============================================================================

-- Osteoarthritis of knee
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M17.0', 'Bilateral primary osteoarthritis of knee', 'Musculoskeletal', true, true),
  ('M17.10', 'Unilateral primary osteoarthritis, unspecified knee', 'Musculoskeletal', true, true),
  ('M17.11', 'Unilateral primary osteoarthritis, right knee', 'Musculoskeletal', true, true),
  ('M17.12', 'Unilateral primary osteoarthritis, left knee', 'Musculoskeletal', true, true),
  ('M17.9', 'Osteoarthritis of knee, unspecified', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- Knee derangement / meniscus (M23.x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M23.50', 'Chronic instability of knee, unspecified knee', 'Musculoskeletal', true, true),
  ('M23.51', 'Chronic instability of knee, right knee', 'Musculoskeletal', true, true),
  ('M23.52', 'Chronic instability of knee, left knee', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- Patellar disorders (M22.x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M22.2X1', 'Patellofemoral disorders, right knee', 'Musculoskeletal', true, true),
  ('M22.2X2', 'Patellofemoral disorders, left knee', 'Musculoskeletal', true, true),
  ('M22.2X9', 'Patellofemoral disorders, unspecified knee', 'Musculoskeletal', true, true),
  ('M22.40', 'Chondromalacia patellae, unspecified knee', 'Musculoskeletal', true, true),
  ('M22.41', 'Chondromalacia patellae, right knee', 'Musculoskeletal', true, true),
  ('M22.42', 'Chondromalacia patellae, left knee', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- MUSCULOSKELETAL - HIP (M16.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M16.0', 'Bilateral primary osteoarthritis of hip', 'Musculoskeletal', true, true),
  ('M16.10', 'Unilateral primary osteoarthritis, unspecified hip', 'Musculoskeletal', true, true),
  ('M16.11', 'Unilateral primary osteoarthritis, right hip', 'Musculoskeletal', true, true),
  ('M16.12', 'Unilateral primary osteoarthritis, left hip', 'Musculoskeletal', true, true),
  ('M16.9', 'Osteoarthritis of hip, unspecified', 'Musculoskeletal', true, true),
  ('M25.551', 'Pain in right hip', 'Musculoskeletal', true, true),
  ('M25.552', 'Pain in left hip', 'Musculoskeletal', true, true),
  ('M25.559', 'Pain in unspecified hip', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- Hip bursitis / trochanteric
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M70.60', 'Trochanteric bursitis, unspecified hip', 'Musculoskeletal', true, true),
  ('M70.61', 'Trochanteric bursitis, right hip', 'Musculoskeletal', true, true),
  ('M70.62', 'Trochanteric bursitis, left hip', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- MUSCULOSKELETAL - TENDINITIS / BURSITIS / ENTHESOPATHY
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  -- Lateral epicondylitis (tennis elbow)
  ('M77.10', 'Lateral epicondylitis, unspecified elbow', 'Musculoskeletal', true, true),
  ('M77.11', 'Lateral epicondylitis, right elbow', 'Musculoskeletal', true, true),
  ('M77.12', 'Lateral epicondylitis, left elbow', 'Musculoskeletal', true, true),
  -- Medial epicondylitis (golfer''s elbow)
  ('M77.01', 'Medial epicondylitis, right elbow', 'Musculoskeletal', true, true),
  ('M77.02', 'Medial epicondylitis, left elbow', 'Musculoskeletal', true, true),
  -- Achilles tendinitis
  ('M76.61', 'Achilles tendinitis, right leg', 'Musculoskeletal', true, true),
  ('M76.62', 'Achilles tendinitis, left leg', 'Musculoskeletal', true, true),
  -- Plantar fasciitis
  ('M72.2', 'Plantar fascial fibromatosis', 'Musculoskeletal', true, true),
  -- Patellar tendinitis
  ('M76.51', 'Patellar tendinitis, right knee', 'Musculoskeletal', true, true),
  ('M76.52', 'Patellar tendinitis, left knee', 'Musculoskeletal', true, true),
  -- De Quervain tendinitis
  ('M65.4', 'Radial styloid tenosynovitis [de Quervain]', 'Musculoskeletal', true, true),
  -- IT band syndrome
  ('M76.31', 'Iliotibial band syndrome, right leg', 'Musculoskeletal', true, true),
  ('M76.32', 'Iliotibial band syndrome, left leg', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- MUSCULOSKELETAL - MYALGIA / MUSCLE DISORDERS (M62.x, M79.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M79.1', 'Myalgia', 'Musculoskeletal', true, true),
  ('M79.10', 'Myalgia, unspecified site', 'Musculoskeletal', true, true),
  ('M79.18', 'Myalgia, other site', 'Musculoskeletal', true, true),
  ('M62.81', 'Muscle weakness (generalized)', 'Musculoskeletal', true, true),
  ('M62.838', 'Muscle spasm of other muscle', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- MUSCULOSKELETAL - JOINT PAIN / STIFFNESS (M25.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M25.511', 'Pain in right shoulder', 'Musculoskeletal', true, true),
  ('M25.512', 'Pain in left shoulder', 'Musculoskeletal', true, true),
  ('M25.519', 'Pain in unspecified shoulder', 'Musculoskeletal', true, true),
  ('M25.529', 'Pain in unspecified elbow', 'Musculoskeletal', true, true),
  ('M25.539', 'Pain in unspecified wrist', 'Musculoskeletal', true, true),
  ('M25.561', 'Pain in right knee', 'Musculoskeletal', true, true),
  ('M25.562', 'Pain in left knee', 'Musculoskeletal', true, true),
  ('M25.569', 'Pain in unspecified knee', 'Musculoskeletal', true, true),
  ('M25.571', 'Pain in right ankle and joints of right foot', 'Musculoskeletal', true, true),
  ('M25.572', 'Pain in left ankle and joints of left foot', 'Musculoskeletal', true, true),
  ('M25.579', 'Pain in unspecified ankle and joints of unspecified foot', 'Musculoskeletal', true, true),
  -- Joint stiffness
  ('M25.611', 'Stiffness of right shoulder, not elsewhere classified', 'Musculoskeletal', true, true),
  ('M25.612', 'Stiffness of left shoulder, not elsewhere classified', 'Musculoskeletal', true, true),
  ('M25.661', 'Stiffness of right knee, not elsewhere classified', 'Musculoskeletal', true, true),
  ('M25.662', 'Stiffness of left knee, not elsewhere classified', 'Musculoskeletal', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- NEUROLOGICAL (G codes)
-- ============================================================================

-- Carpal tunnel syndrome (G56.0x)
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('G56.00', 'Carpal tunnel syndrome, unspecified upper limb', 'Neurological', true, true),
  ('G56.01', 'Carpal tunnel syndrome, right upper limb', 'Neurological', true, true),
  ('G56.02', 'Carpal tunnel syndrome, left upper limb', 'Neurological', true, true),
  ('G56.03', 'Carpal tunnel syndrome, bilateral upper limbs', 'Neurological', true, true)
ON CONFLICT (code) DO NOTHING;

-- Other nerve lesions
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('G56.10', 'Other lesions of median nerve, unspecified upper limb', 'Neurological', true, true),
  ('G56.20', 'Lesion of ulnar nerve, unspecified upper limb', 'Neurological', true, true),
  ('G56.21', 'Lesion of ulnar nerve, right upper limb', 'Neurological', true, true),
  ('G56.22', 'Lesion of ulnar nerve, left upper limb', 'Neurological', true, true)
ON CONFLICT (code) DO NOTHING;

-- Sciatica
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('G57.00', 'Lesion of sciatic nerve, unspecified lower limb', 'Neurological', true, true),
  ('G57.01', 'Lesion of sciatic nerve, right lower limb', 'Neurological', true, true),
  ('G57.02', 'Lesion of sciatic nerve, left lower limb', 'Neurological', true, true)
ON CONFLICT (code) DO NOTHING;

-- Headache / migraine
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('G43.909', 'Migraine, unspecified, not intractable, without status migrainosus', 'Neurological', true, true),
  ('G44.1', 'Vascular headache, not elsewhere classified', 'Neurological', true, true),
  ('G44.209', 'Tension-type headache, unspecified, not intractable', 'Neurological', true, true),
  ('G44.221', 'Chronic tension-type headache, intractable', 'Neurological', true, true),
  ('M53.0', 'Cervicocranial syndrome', 'Neurological', true, true)
ON CONFLICT (code) DO NOTHING;

-- Neuropathy
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('G62.9', 'Polyneuropathy, unspecified', 'Neurological', true, true),
  ('G60.0', 'Hereditary motor and sensory neuropathy', 'Neurological', true, true)
ON CONFLICT (code) DO NOTHING;

-- Balance disorders / vestibular
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('H81.10', 'Benign paroxysmal positional vertigo, unspecified ear', 'Neurological', true, true),
  ('H81.11', 'Benign paroxysmal positional vertigo, right ear', 'Neurological', true, true),
  ('H81.12', 'Benign paroxysmal positional vertigo, left ear', 'Neurological', true, true),
  ('H81.13', 'Benign paroxysmal positional vertigo, bilateral', 'Neurological', true, true),
  ('H81.390', 'Other peripheral vertigo, unspecified ear', 'Neurological', true, true)
ON CONFLICT (code) DO NOTHING;

-- Chronic pain / hemiplegia / stroke
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('G89.29', 'Other chronic pain', 'Neurological', true, true),
  ('G89.4', 'Chronic pain syndrome', 'Neurological', true, true),
  ('G81.90', 'Hemiplegia, unspecified affecting unspecified side', 'Neurological', true, true),
  ('G81.91', 'Hemiplegia, unspecified affecting right dominant side', 'Neurological', true, true),
  ('G81.92', 'Hemiplegia, unspecified affecting left dominant side', 'Neurological', true, true),
  ('I63.9', 'Cerebral infarction, unspecified', 'Neurological', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- INJURY - SPRAINS/STRAINS - SHOULDER (S43.x, S46.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('S43.401A', 'Unspecified sprain of right shoulder joint, initial encounter', 'Injury', true, true),
  ('S43.402A', 'Unspecified sprain of left shoulder joint, initial encounter', 'Injury', true, true),
  ('S43.409A', 'Unspecified sprain of unspecified shoulder joint, initial encounter', 'Injury', true, true),
  ('S46.011A', 'Strain of muscle(s) and tendon(s) of the rotator cuff of right shoulder, initial encounter', 'Injury', true, true),
  ('S46.012A', 'Strain of muscle(s) and tendon(s) of the rotator cuff of left shoulder, initial encounter', 'Injury', true, true),
  ('S46.019A', 'Strain of muscle(s) and tendon(s) of the rotator cuff of unspecified shoulder, initial encounter', 'Injury', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- INJURY - SPRAINS/STRAINS - CERVICAL (S13.x, S16.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('S13.4XXA', 'Sprain of ligaments of cervical spine, initial encounter', 'Injury', true, true),
  ('S13.4XXD', 'Sprain of ligaments of cervical spine, subsequent encounter', 'Injury', true, true),
  ('S16.1XXA', 'Strain of muscle, fascia and tendon at neck level, initial encounter', 'Injury', true, true),
  ('S16.1XXD', 'Strain of muscle, fascia and tendon at neck level, subsequent encounter', 'Injury', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- INJURY - SPRAINS/STRAINS - LUMBAR (S33.x, S39.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('S33.5XXA', 'Sprain of ligaments of lumbar spine, initial encounter', 'Injury', true, true),
  ('S33.5XXD', 'Sprain of ligaments of lumbar spine, subsequent encounter', 'Injury', true, true),
  ('S39.012A', 'Strain of muscle, fascia and tendon of lower back, initial encounter', 'Injury', true, true),
  ('S39.012D', 'Strain of muscle, fascia and tendon of lower back, subsequent encounter', 'Injury', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- INJURY - SPRAINS/STRAINS - KNEE (S83.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('S83.511A', 'Sprain of anterior cruciate ligament of right knee, initial encounter', 'Injury', true, true),
  ('S83.512A', 'Sprain of anterior cruciate ligament of left knee, initial encounter', 'Injury', true, true),
  ('S83.519A', 'Sprain of anterior cruciate ligament of unspecified knee, initial encounter', 'Injury', true, true),
  ('S83.521A', 'Sprain of posterior cruciate ligament of right knee, initial encounter', 'Injury', true, true),
  ('S83.411A', 'Sprain of medial collateral ligament of right knee, initial encounter', 'Injury', true, true),
  ('S83.412A', 'Sprain of medial collateral ligament of left knee, initial encounter', 'Injury', true, true),
  ('S83.421A', 'Sprain of lateral collateral ligament of right knee, initial encounter', 'Injury', true, true),
  ('S83.422A', 'Sprain of lateral collateral ligament of left knee, initial encounter', 'Injury', true, true),
  ('S83.91XA', 'Sprain of unspecified site of right knee, initial encounter', 'Injury', true, true),
  ('S83.92XA', 'Sprain of unspecified site of left knee, initial encounter', 'Injury', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- INJURY - SPRAINS/STRAINS - ANKLE (S93.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('S93.401A', 'Sprain of unspecified ligament of right ankle, initial encounter', 'Injury', true, true),
  ('S93.402A', 'Sprain of unspecified ligament of left ankle, initial encounter', 'Injury', true, true),
  ('S93.409A', 'Sprain of unspecified ligament of unspecified ankle, initial encounter', 'Injury', true, true),
  ('S93.411A', 'Sprain of calcaneofibular ligament of right ankle, initial encounter', 'Injury', true, true),
  ('S93.412A', 'Sprain of calcaneofibular ligament of left ankle, initial encounter', 'Injury', true, true),
  ('S93.421A', 'Sprain of deltoid ligament of right ankle, initial encounter', 'Injury', true, true),
  ('S93.422A', 'Sprain of deltoid ligament of left ankle, initial encounter', 'Injury', true, true),
  ('S93.431A', 'Sprain of tibiofibular ligament of right ankle, initial encounter', 'Injury', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- INJURY - SPRAINS/STRAINS - WRIST/HAND (S63.x)
-- ============================================================================

INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('S63.501A', 'Unspecified sprain of right wrist, initial encounter', 'Injury', true, true),
  ('S63.502A', 'Unspecified sprain of left wrist, initial encounter', 'Injury', true, true),
  ('S63.509A', 'Unspecified sprain of unspecified wrist, initial encounter', 'Injury', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- SYMPTOMS (R codes)
-- ============================================================================

-- Pain
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('R51.9', 'Headache, unspecified', 'Symptoms', true, true),
  ('R52', 'Pain, unspecified', 'Symptoms', true, true),
  ('R07.89', 'Other chest pain', 'Symptoms', true, true)
ON CONFLICT (code) DO NOTHING;

-- Weakness / fatigue
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('R53.1', 'Weakness', 'Symptoms', true, true),
  ('R53.81', 'Other malaise', 'Symptoms', true, true),
  ('R53.83', 'Other fatigue', 'Symptoms', true, true)
ON CONFLICT (code) DO NOTHING;

-- Gait and mobility
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('R26.0', 'Ataxic gait', 'Symptoms', true, true),
  ('R26.1', 'Paralytic gait', 'Symptoms', true, true),
  ('R26.2', 'Difficulty in walking, not elsewhere classified', 'Symptoms', true, true),
  ('R26.81', 'Unsteadiness on feet', 'Symptoms', true, true),
  ('R26.89', 'Other abnormalities of gait and mobility', 'Symptoms', true, true),
  ('R26.9', 'Unspecified abnormalities of gait and mobility', 'Symptoms', true, true)
ON CONFLICT (code) DO NOTHING;

-- Dizziness and falls
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('R42', 'Dizziness and giddiness', 'Symptoms', true, true),
  ('R29.6', 'Repeated falls', 'Symptoms', true, true),
  ('R29.3', 'Abnormal posture', 'Symptoms', true, true)
ON CONFLICT (code) DO NOTHING;

-- Swelling / effusion
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('M25.461', 'Effusion, right knee', 'Symptoms', true, true),
  ('M25.462', 'Effusion, left knee', 'Symptoms', true, true),
  ('M25.469', 'Effusion, unspecified knee', 'Symptoms', true, true),
  ('R60.0', 'Localized edema', 'Symptoms', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- POST-SURGICAL / AFTERCARE (Z codes)
-- ============================================================================

-- Presence of joint implants
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('Z96.641', 'Presence of right artificial hip joint', 'Post-surgical', true, true),
  ('Z96.642', 'Presence of left artificial hip joint', 'Post-surgical', true, true),
  ('Z96.649', 'Presence of unspecified artificial hip joint', 'Post-surgical', true, true),
  ('Z96.651', 'Presence of right artificial knee joint', 'Post-surgical', true, true),
  ('Z96.652', 'Presence of left artificial knee joint', 'Post-surgical', true, true),
  ('Z96.659', 'Presence of unspecified artificial knee joint', 'Post-surgical', true, true),
  ('Z96.611', 'Presence of right artificial shoulder joint', 'Post-surgical', true, true),
  ('Z96.612', 'Presence of left artificial shoulder joint', 'Post-surgical', true, true)
ON CONFLICT (code) DO NOTHING;

-- Aftercare following surgery
INSERT INTO icd10_codes (code, description, category, is_billable, is_common_pt) VALUES
  ('Z47.1', 'Aftercare following joint replacement surgery', 'Post-surgical', true, true),
  ('Z47.2', 'Encounter for removal of internal fixation device', 'Post-surgical', true, true),
  ('Z47.81', 'Encounter for orthopedic aftercare following surgical amputation', 'Post-surgical', true, true),
  ('Z47.89', 'Encounter for other orthopedic aftercare', 'Post-surgical', true, true),
  ('Z48.812', 'Encounter for surgical aftercare following surgery on the nervous system', 'Post-surgical', true, true),
  ('Z48.817', 'Encounter for surgical aftercare following surgery on the musculoskeletal system', 'Post-surgical', true, true),
  ('Z51.89', 'Encounter for other specified aftercare', 'Post-surgical', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total codes: 204
-- Categories: Musculoskeletal, Neurological, Injury, Symptoms, Post-surgical
-- All codes marked is_common_pt = true
-- Uses ON CONFLICT (code) DO NOTHING to allow safe re-runs
