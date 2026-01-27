import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings, CostSimulation } from '../types';

const costs = new Hono<{ Bindings: Bindings }>();

costs.use('/*', cors());

// 비용 계산 API
costs.post('/calculate', async (c) => {
  try {
    const {
      patientId,
      facilityType,
      facilityId,
      durationMonths,
      insuranceType = 'employee',
      ltcGrade = null
    } = await c.req.json();
    
    if (!facilityType || !durationMonths) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    // 기관 유형별 평균 월 비용 (원)
    const baseCosts: Record<string, number> = {
      rehabilitation: 4000000,
      nursing_hospital: 1750000,
      nursing_home: 1000000,
      home: 375000
    };
    
    // 건강보험 본인부담률
    const insuranceRates: Record<string, number> = {
      employee: 0.20,
      local: 0.20,
      medical_aid: 0.05
    };
    
    // 장기요양등급별 본인부담률
    const ltcRates: Record<number, number> = {
      1: 0.15,
      2: 0.15,
      3: 0.15,
      4: 0.20,
      5: 0.20
    };
    
    const baseCost = baseCosts[facilityType] || 2000000;
    const totalBaseCost = baseCost * durationMonths;
    
    // 건강보험 적용 비용 (전체 비용의 65%)
    const insurableCost = totalBaseCost * 0.65;
    const insuranceCoverage = Math.round(insurableCost * insuranceRates[insuranceType]);
    
    // 비급여 항목 (간병비, 특실료 등 - 전체 비용의 35%)
    const nonCoverage = Math.round(totalBaseCost * 0.35);
    
    // 장기요양보험 본인부담금
    let ltcCopayment = 0;
    if (ltcGrade && facilityType !== 'rehabilitation') {
      const ltcRate = ltcRates[ltcGrade] || 0.20;
      ltcCopayment = Math.round(insurableCost * ltcRate);
    }
    
    const totalCost = insuranceCoverage + nonCoverage + ltcCopayment;
    
    // 월별 현금흐름 계산
    const monthlyCost = Math.round(totalCost / durationMonths);
    const monthlyCashflow = Array(durationMonths).fill(monthlyCost);
    
    // 오차 범위 (±15%)
    const errorMargin = 15;
    
    // 결과 저장 (patientId가 있는 경우)
    if (patientId) {
      await c.env.DB.prepare(
        `INSERT INTO cost_simulations (patient_id, facility_type, facility_id, duration_months,
         insurance_coverage, non_coverage, ltc_copayment, total_cost, monthly_cashflow, error_margin_percent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        patientId,
        facilityType,
        facilityId || null,
        durationMonths,
        insuranceCoverage,
        nonCoverage,
        ltcCopayment,
        totalCost,
        JSON.stringify(monthlyCashflow),
        errorMargin
      ).run();
    }
    
    return c.json({
      success: true,
      data: {
        facilityType,
        durationMonths,
        breakdown: {
          insuranceCoverage,
          nonCoverage,
          ltcCopayment
        },
        totalCost,
        monthlyCost,
        monthlyCashflow,
        errorMargin: {
          percent: errorMargin,
          range: {
            min: Math.round(totalCost * (1 - errorMargin / 100)),
            max: Math.round(totalCost * (1 + errorMargin / 100))
          }
        }
      }
    });
  } catch (error) {
    console.error('Cost calculation error:', error);
    return c.json({ success: false, error: 'Failed to calculate cost' }, 500);
  }
});

// 환자별 비용 시뮬레이션 이력 조회
costs.get('/patient/:patientId', async (c) => {
  const patientId = c.req.param('patientId');
  
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT cs.*, f.name as facility_name
       FROM cost_simulations cs
       LEFT JOIN facilities f ON cs.facility_id = f.id
       WHERE cs.patient_id = ?
       ORDER BY cs.created_at DESC`
    ).bind(patientId).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch cost simulations' }, 500);
  }
});

// 비용 비교 API (여러 시나리오 동시 계산)
costs.post('/compare', async (c) => {
  try {
    const { scenarios } = await c.req.json();
    
    if (!Array.isArray(scenarios) || scenarios.length === 0) {
      return c.json({ success: false, error: 'Invalid scenarios' }, 400);
    }
    
    const results = [];
    
    for (const scenario of scenarios) {
      // 각 시나리오에 대해 비용 계산
      const response = await fetch(c.req.url.replace('/compare', '/calculate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario)
      });
      
      // 실제 구현에서는 내부 함수 호출로 대체
      // 여기서는 간단히 직접 계산
      const baseCosts: Record<string, number> = {
        rehabilitation: 4000000,
        nursing_hospital: 1750000,
        nursing_home: 1000000,
        home: 375000
      };
      
      const baseCost = baseCosts[scenario.facilityType] || 2000000;
      const totalCost = baseCost * scenario.durationMonths;
      
      results.push({
        name: scenario.name || scenario.facilityType,
        facilityType: scenario.facilityType,
        durationMonths: scenario.durationMonths,
        totalCost,
        monthlyCost: Math.round(totalCost / scenario.durationMonths)
      });
    }
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to compare costs' }, 500);
  }
});

export default costs;
