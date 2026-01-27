-- 환자 정보 테이블
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  diagnosis TEXT NOT NULL, -- 진단명 (ICD-10 코드 포함)
  diagnosis_date DATE NOT NULL, -- 수술/발병일
  age INTEGER NOT NULL,
  adl_score INTEGER DEFAULT 0, -- ADL 점수 (0-100)
  consciousness_level TEXT, -- 의식수준 (명료/혼미/혼수 등)
  severity TEXT CHECK(severity IN ('mild', 'moderate', 'severe')), -- 중증도
  insurance_type TEXT CHECK(insurance_type IN ('employee', 'local', 'medical_aid')), -- 건강보험 유형
  ltc_grade INTEGER, -- 장기요양등급 (1-5급, NULL이면 미신청)
  current_hospital TEXT, -- 현재 입원 병원
  comorbidities TEXT, -- 동반질환 (JSON 형태)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 재활/요양 기관 정보 테이블
CREATE TABLE IF NOT EXISTS facilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('rehabilitation', 'nursing_hospital', 'nursing_home')), -- 재활병원/요양병원/요양원
  address TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  phone TEXT,
  total_beds INTEGER, -- 전체 병상 수
  available_beds INTEGER, -- 가용 병상 수
  specialties TEXT, -- 전문 진료과 (JSON 배열)
  rehabilitation_programs TEXT, -- 재활치료 프로그램 (JSON 배열)
  average_cost INTEGER, -- 평균 월 비용 (원)
  care_cost_range TEXT, -- 간병비 범위 (예: "150-200만원")
  waiting_period INTEGER, -- 평균 대기 기간 (일)
  insurance_coverage_rate REAL, -- 건강보험 적용률 (0-1)
  evaluation_grade TEXT, -- 심평원 평가 등급
  visit_policy TEXT, -- 가족 면회 정책
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 전원 경로 추천 테이블
CREATE TABLE IF NOT EXISTS care_pathways (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  step_order INTEGER NOT NULL, -- 경로 단계 순서
  step_type TEXT CHECK(step_type IN ('acute', 'rehabilitation', 'nursing_hospital', 'nursing_home', 'home')),
  facility_id INTEGER, -- 추천 기관 ID
  duration_weeks INTEGER, -- 예상 소요 기간 (주)
  treatment_goal TEXT, -- 치료 목표
  estimated_cost INTEGER, -- 예상 비용 (원)
  ltc_application_timing BOOLEAN DEFAULT 0, -- 장기요양등급 신청 권장 시점 여부
  status TEXT CHECK(status IN ('recommended', 'selected', 'completed')) DEFAULT 'recommended',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- 비용 시뮬레이션 테이블
CREATE TABLE IF NOT EXISTS cost_simulations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  facility_type TEXT NOT NULL, -- 기관 유형
  facility_id INTEGER, -- 특정 기관 ID (선택사항)
  duration_months INTEGER NOT NULL, -- 입원 기간 (개월)
  insurance_coverage INTEGER, -- 건강보험 본인부담금
  non_coverage INTEGER, -- 비급여 항목 (간병비, 특실료 등)
  ltc_copayment INTEGER, -- 장기요양 본인부담금
  total_cost INTEGER, -- 총 예상 비용
  monthly_cashflow TEXT, -- 월별 현금흐름 (JSON)
  error_margin_percent REAL DEFAULT 15, -- 오차 범위 (%)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- 전원 체크리스트 테이블
CREATE TABLE IF NOT EXISTS transfer_checklists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  transfer_type TEXT NOT NULL, -- 전원 유형 (예: 'acute_to_rehab')
  item_name TEXT NOT NULL, -- 항목명 (예: '진료의뢰서')
  category TEXT, -- 카테고리 (서류/검사/행정 등)
  is_required BOOLEAN DEFAULT 1, -- 필수 여부
  is_completed BOOLEAN DEFAULT 0, -- 완료 여부
  document_url TEXT, -- 업로드된 서류 URL
  notes TEXT, -- 메모
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- 간병 스케줄 테이블
CREATE TABLE IF NOT EXISTS care_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  caregiver_name TEXT NOT NULL, -- 간병인/가족 이름
  caregiver_type TEXT CHECK(caregiver_type IN ('family', 'professional', 'nurse')), -- 간병인 유형
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  is_recurring BOOLEAN DEFAULT 0, -- 반복 일정 여부
  recurrence_pattern TEXT, -- 반복 패턴 (JSON)
  notes TEXT, -- 인수인계 메모
  emergency_contact TEXT, -- 응급 연락처
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- 사용자 (보호자) 테이블
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  relationship TEXT, -- 환자와의 관계
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 환자-사용자 관계 테이블
CREATE TABLE IF NOT EXISTS patient_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT CHECK(role IN ('primary', 'secondary')), -- 주보호자/부보호자
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(patient_id, user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(type);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_care_pathways_patient_id ON care_pathways(patient_id);
CREATE INDEX IF NOT EXISTS idx_cost_simulations_patient_id ON cost_simulations(patient_id);
CREATE INDEX IF NOT EXISTS idx_transfer_checklists_patient_id ON transfer_checklists(patient_id);
CREATE INDEX IF NOT EXISTS idx_care_schedules_patient_id ON care_schedules(patient_id);
CREATE INDEX IF NOT EXISTS idx_care_schedules_datetime ON care_schedules(start_datetime, end_datetime);
