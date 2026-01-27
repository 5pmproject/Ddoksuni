import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings, Patient, CarePathway } from '../types';

const patients = new Hono<{ Bindings: Bindings }>();

// CORS 설정
patients.use('/*', cors());

// 환자 목록 조회
patients.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM patients ORDER BY created_at DESC'
    ).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch patients' }, 500);
  }
});

// 환자 상세 조회
patients.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const patient = await c.env.DB.prepare(
      'SELECT * FROM patients WHERE id = ?'
    ).bind(id).first();
    
    if (!patient) {
      return c.json({ success: false, error: 'Patient not found' }, 404);
    }
    
    // 환자의 경로 추천 정보도 함께 조회
    const { results: pathways } = await c.env.DB.prepare(
      `SELECT cp.*, f.name as facility_name, f.type as facility_type, f.address as facility_address
       FROM care_pathways cp
       LEFT JOIN facilities f ON cp.facility_id = f.id
       WHERE cp.patient_id = ?
       ORDER BY cp.step_order`
    ).bind(id).all();
    
    return c.json({ 
      success: true, 
      data: {
        patient,
        pathways
      }
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch patient' }, 500);
  }
});

// 환자 등록
patients.post('/', async (c) => {
  try {
    const data: Patient = await c.req.json();
    
    // 필수 필드 검증
    if (!data.name || !data.diagnosis || !data.diagnosis_date || !data.age) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    // 환자 중증도 자동 분류 (ADL 점수 기반)
    let severity: 'mild' | 'moderate' | 'severe' = 'moderate';
    if (data.adl_score >= 70) severity = 'mild';
    else if (data.adl_score < 40) severity = 'severe';
    
    const result = await c.env.DB.prepare(
      `INSERT INTO patients (name, diagnosis, diagnosis_date, age, adl_score, consciousness_level, 
       severity, insurance_type, ltc_grade, current_hospital, comorbidities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.name,
      data.diagnosis,
      data.diagnosis_date,
      data.age,
      data.adl_score || 50,
      data.consciousness_level || '명료',
      severity,
      data.insurance_type || 'employee',
      data.ltc_grade || null,
      data.current_hospital,
      data.comorbidities || '{}'
    ).run();
    
    if (!result.success) {
      throw new Error('Failed to insert patient');
    }
    
    // 환자 등록 후 자동으로 경로 추천 생성
    const patientId = result.meta.last_row_id;
    await generateCarePathway(c.env.DB, patientId, severity, data.adl_score || 50);
    
    return c.json({ 
      success: true, 
      data: { id: patientId },
      message: 'Patient registered successfully'
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    return c.json({ success: false, error: 'Failed to create patient' }, 500);
  }
});

// 환자 정보 수정
patients.put('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const data: Patient = await c.req.json();
    
    const result = await c.env.DB.prepare(
      `UPDATE patients SET 
       name = ?, diagnosis = ?, diagnosis_date = ?, age = ?, adl_score = ?,
       consciousness_level = ?, severity = ?, insurance_type = ?, ltc_grade = ?,
       current_hospital = ?, comorbidities = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      data.name,
      data.diagnosis,
      data.diagnosis_date,
      data.age,
      data.adl_score,
      data.consciousness_level,
      data.severity,
      data.insurance_type,
      data.ltc_grade,
      data.current_hospital,
      data.comorbidities,
      id
    ).run();
    
    if (!result.success) {
      throw new Error('Failed to update patient');
    }
    
    return c.json({ success: true, message: 'Patient updated successfully' });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update patient' }, 500);
  }
});

// 경로 추천 자동 생성 함수
async function generateCarePathway(
  db: D1Database, 
  patientId: number, 
  severity: string, 
  adlScore: number
) {
  // 중증도에 따른 경로 설정
  let pathways: Array<{
    step_order: number;
    step_type: string;
    duration_weeks: number;
    treatment_goal: string;
    estimated_cost: number;
    ltc_application_timing: boolean;
  }> = [];
  
  if (severity === 'severe') {
    // 중증: 재활병원 → 요양병원 → 요양원
    pathways = [
      {
        step_order: 1,
        step_type: 'rehabilitation',
        duration_weeks: 8,
        treatment_goal: `ADL 점수 ${adlScore + 20}점까지 회복, 기본 일상생활 동작 훈련`,
        estimated_cost: 16000000,
        ltc_application_timing: true
      },
      {
        step_order: 2,
        step_type: 'nursing_hospital',
        duration_weeks: 12,
        treatment_goal: '의료적 관리 및 재활 치료 지속',
        estimated_cost: 10500000,
        ltc_application_timing: false
      },
      {
        step_order: 3,
        step_type: 'nursing_home',
        duration_weeks: 24,
        treatment_goal: '장기 요양 및 삶의 질 유지',
        estimated_cost: 12000000,
        ltc_application_timing: false
      }
    ];
  } else if (severity === 'moderate') {
    // 중등도: 재활병원 → 요양병원
    pathways = [
      {
        step_order: 1,
        step_type: 'rehabilitation',
        duration_weeks: 6,
        treatment_goal: `ADL 점수 ${adlScore + 25}점까지 회복, 독립적 일상생활 가능`,
        estimated_cost: 12000000,
        ltc_application_timing: true
      },
      {
        step_order: 2,
        step_type: 'nursing_hospital',
        duration_weeks: 12,
        treatment_goal: '회복 유지 및 재발 방지',
        estimated_cost: 10500000,
        ltc_application_timing: false
      }
    ];
  } else {
    // 경증: 재활병원 → 재택
    pathways = [
      {
        step_order: 1,
        step_type: 'rehabilitation',
        duration_weeks: 4,
        treatment_goal: `ADL 점수 ${Math.min(adlScore + 20, 100)}점까지 회복, 완전한 독립 생활`,
        estimated_cost: 8000000,
        ltc_application_timing: false
      },
      {
        step_order: 2,
        step_type: 'home',
        duration_weeks: 8,
        treatment_goal: '재택 관리 및 정기 외래 진료',
        estimated_cost: 3000000,
        ltc_application_timing: false
      }
    ];
  }
  
  // 경로 데이터 삽입
  for (const pathway of pathways) {
    await db.prepare(
      `INSERT INTO care_pathways (patient_id, step_order, step_type, duration_weeks, 
       treatment_goal, estimated_cost, ltc_application_timing, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'recommended')`
    ).bind(
      patientId,
      pathway.step_order,
      pathway.step_type,
      pathway.duration_weeks,
      pathway.treatment_goal,
      pathway.estimated_cost,
      pathway.ltc_application_timing ? 1 : 0
    ).run();
  }
}

export default patients;
