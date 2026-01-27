-- 샘플 재활/요양 기관 데이터
INSERT INTO facilities (name, type, address, latitude, longitude, phone, total_beds, available_beds, specialties, rehabilitation_programs, average_cost, care_cost_range, waiting_period, insurance_coverage_rate, evaluation_grade, visit_policy) VALUES
('서울재활병원', 'rehabilitation', '서울특별시 강남구 테헤란로 123', 37.5010, 127.0394, '02-1234-5678', 150, 15, '["신경과", "재활의학과", "정형외과"]', '["물리치료", "작업치료", "언어치료", "인지재활"]', 8000000, '150-200만원', 7, 0.65, 'A등급', '매일 14:00-20:00'),
('한강재활센터', 'rehabilitation', '서울특별시 마포구 마포대로 456', 37.5456, 126.9542, '02-2345-6789', 100, 8, '["신경과", "재활의학과"]', '["물리치료", "작업치료", "운동치료"]', 7500000, '140-180만원', 10, 0.70, 'A등급', '매일 13:00-19:00'),
('강남요양병원', 'nursing_hospital', '서울특별시 서초구 서초대로 789', 37.4833, 127.0322, '02-3456-7890', 200, 25, '["내과", "신경과", "정형외과"]', '["기본물리치료", "약물치료"]', 3500000, '100-150만원', 3, 0.75, 'B등급', '매일 10:00-18:00'),
('목동요양병원', 'nursing_hospital', '서울특별시 양천구 목동서로 321', 37.5264, 126.8747, '02-4567-8901', 180, 30, '["내과", "노인의학과"]', '["기본물리치료"]', 3200000, '90-140만원', 5, 0.80, 'B등급', '매일 09:00-17:00'),
('서울효사랑요양원', 'nursing_home', '서울특별시 송파구 송파대로 654', 37.5048, 127.1147, '02-5678-9012', 50, 5, '[]', '[]', 2000000, '80-120만원', 14, 0.85, 'C등급', '평일 10:00-18:00, 주말 10:00-16:00'),
('강서실버요양원', 'nursing_home', '서울특별시 강서구 공항대로 987', 37.5509, 126.8495, '02-6789-0123', 60, 8, '[]', '[]', 1800000, '70-100만원', 20, 0.85, 'C등급', '평일 09:00-17:00'),
('분당재활병원', 'rehabilitation', '경기도 성남시 분당구 판교역로 111', 37.3955, 127.1114, '031-1234-5678', 120, 12, '["신경과", "재활의학과", "정형외과"]', '["물리치료", "작업치료", "언어치료", "수치료"]', 7800000, '130-170만원', 5, 0.68, 'A등급', '매일 14:00-19:00'),
('인천참사랑요양병원', 'nursing_hospital', '인천광역시 남동구 인주대로 222', 37.4473, 126.7315, '032-2345-6789', 150, 20, '["내과", "재활의학과"]', '["기본물리치료", "약물치료"]', 3000000, '80-130만원', 3, 0.78, 'B등급', '매일 10:00-17:00');

-- 샘플 사용자 데이터
INSERT INTO users (email, name, phone, relationship) VALUES
('caregiver1@example.com', '김보호', '010-1234-5678', '자녀'),
('caregiver2@example.com', '이가족', '010-2345-6789', '배우자'),
('caregiver3@example.com', '박효자', '010-3456-7890', '자녀');

-- 샘플 환자 데이터
INSERT INTO patients (name, diagnosis, diagnosis_date, age, adl_score, consciousness_level, severity, insurance_type, ltc_grade, current_hospital, comorbidities) VALUES
('홍길동', '뇌경색 (I63.9)', '2025-01-15', 68, 45, '명료', 'moderate', 'employee', NULL, '서울대학교병원', '{"hypertension": true, "diabetes": true}'),
('김영희', '뇌출혈 (I61.9)', '2025-01-10', 72, 30, '혼미', 'severe', 'local', 3, '삼성서울병원', '{"hypertension": true}'),
('이철수', '대장암 수술 후 (C18.9)', '2025-01-20', 65, 60, '명료', 'mild', 'employee', NULL, '아산병원', '{"none": true}');

-- 환자-사용자 관계 설정
INSERT INTO patient_users (patient_id, user_id, role) VALUES
(1, 1, 'primary'),
(2, 2, 'primary'),
(3, 3, 'primary');

-- 샘플 전원 경로 데이터
INSERT INTO care_pathways (patient_id, step_order, step_type, facility_id, duration_weeks, treatment_goal, estimated_cost, ltc_application_timing, status) VALUES
(1, 1, 'rehabilitation', 1, 6, 'ADL 점수 70점까지 회복, 보행 능력 향상', 12000000, 1, 'recommended'),
(1, 2, 'nursing_hospital', 3, 12, '일상생활 유지 및 재발 방지', 10500000, 0, 'recommended'),
(2, 1, 'rehabilitation', 2, 8, 'ADL 점수 50점까지 회복, 기본 일상생활 가능', 15000000, 0, 'selected'),
(2, 2, 'nursing_home', 5, 24, '장기 요양 및 삶의 질 유지', 12000000, 0, 'recommended');

-- 샘플 비용 시뮬레이션 데이터
INSERT INTO cost_simulations (patient_id, facility_type, facility_id, duration_months, insurance_coverage, non_coverage, ltc_copayment, total_cost, monthly_cashflow) VALUES
(1, 'rehabilitation', 1, 3, 5400000, 6600000, 0, 12000000, '[4000000, 4000000, 4000000]'),
(1, 'nursing_hospital', 3, 6, 6300000, 4200000, 0, 10500000, '[1750000, 1750000, 1750000, 1750000, 1750000, 1750000]'),
(2, 'rehabilitation', 2, 4, 6000000, 9000000, 0, 15000000, '[3750000, 3750000, 3750000, 3750000]');

-- 샘플 전원 체크리스트 데이터
INSERT INTO transfer_checklists (patient_id, transfer_type, item_name, category, is_required, is_completed) VALUES
(1, 'acute_to_rehab', '진료의뢰서 발급', '서류', 1, 0),
(1, 'acute_to_rehab', '영상 CD 복사', '검사', 1, 0),
(1, 'acute_to_rehab', '약 처방전 수령', '서류', 1, 0),
(1, 'acute_to_rehab', '간호기록지 사본', '서류', 1, 0),
(1, 'acute_to_rehab', '장기요양등급 신청서 작성', '행정', 1, 0),
(1, 'acute_to_rehab', '건강보험 사전승인', '행정', 1, 0),
(2, 'acute_to_rehab', '진료의뢰서 발급', '서류', 1, 1),
(2, 'acute_to_rehab', '영상 CD 복사', '검사', 1, 1),
(2, 'acute_to_rehab', '약 처방전 수령', '서류', 1, 0);

-- 샘플 간병 스케줄 데이터
INSERT INTO care_schedules (patient_id, caregiver_name, caregiver_type, start_datetime, end_datetime, notes, emergency_contact) VALUES
(1, '김보호 (자녀)', 'family', '2025-01-27 09:00:00', '2025-01-27 18:00:00', '아침 약 복용 확인 필요', '010-1234-5678'),
(1, '간병인 박씨', 'professional', '2025-01-27 18:00:00', '2025-01-28 09:00:00', '야간 배뇨 도움, 체위 변경 2시간마다', '010-9876-5432'),
(2, '이가족 (배우자)', 'family', '2025-01-27 10:00:00', '2025-01-27 20:00:00', '점심 식사 도움, 물리치료 동행', '010-2345-6789'),
(2, '방문간호사 최씨', 'nurse', '2025-01-28 14:00:00', '2025-01-28 15:00:00', '욕창 상처 소독 및 드레싱', '010-1111-2222');
