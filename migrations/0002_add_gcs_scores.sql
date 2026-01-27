-- GCS 점수 필드 추가 (comorbidities JSON에 저장되지만 검색을 위해 별도 컬럼 추가)
ALTER TABLE patients ADD COLUMN gcs_total INTEGER DEFAULT 15;
ALTER TABLE patients ADD COLUMN gcs_eye INTEGER DEFAULT 4;
ALTER TABLE patients ADD COLUMN gcs_verbal INTEGER DEFAULT 5;
ALTER TABLE patients ADD COLUMN gcs_motor INTEGER DEFAULT 6;

-- 기존 환자 데이터 업데이트 (의식수준 텍스트에서 GCS 추출)
UPDATE patients SET 
  gcs_total = 15,
  gcs_eye = 4,
  gcs_verbal = 5,
  gcs_motor = 6
WHERE consciousness_level LIKE '%명료%' OR consciousness_level = '명료';

UPDATE patients SET 
  gcs_total = 10,
  gcs_eye = 3,
  gcs_verbal = 3,
  gcs_motor = 4
WHERE consciousness_level LIKE '%혼미%' OR consciousness_level = '혼미';

UPDATE patients SET 
  gcs_total = 5,
  gcs_eye = 1,
  gcs_verbal = 2,
  gcs_motor = 2
WHERE consciousness_level LIKE '%혼수%' OR consciousness_level = '혼수';

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_patients_gcs_total ON patients(gcs_total);
