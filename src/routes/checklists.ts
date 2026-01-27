import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings, TransferChecklist } from '../types';

const checklists = new Hono<{ Bindings: Bindings }>();

checklists.use('/*', cors());

// 환자별 체크리스트 조회
checklists.get('/patient/:patientId', async (c) => {
  const patientId = c.req.param('patientId');
  
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM transfer_checklists 
       WHERE patient_id = ? 
       ORDER BY is_completed ASC, category, item_name`
    ).bind(patientId).all();
    
    // 카테고리별로 그룹화
    const grouped = results.reduce((acc: any, item: any) => {
      const category = item.category || '기타';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
    
    return c.json({ success: true, data: { items: results, grouped } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch checklist' }, 500);
  }
});

// 체크리스트 항목 완료 처리
checklists.put('/:id/complete', async (c) => {
  const id = c.req.param('id');
  
  try {
    const { isCompleted, notes, documentUrl } = await c.req.json();
    
    const result = await c.env.DB.prepare(
      `UPDATE transfer_checklists 
       SET is_completed = ?, notes = ?, document_url = ?,
           completed_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END
       WHERE id = ?`
    ).bind(
      isCompleted ? 1 : 0,
      notes || null,
      documentUrl || null,
      isCompleted ? 1 : 0,
      id
    ).run();
    
    return c.json({ success: true, message: 'Checklist item updated' });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update checklist item' }, 500);
  }
});

// 전원 타입별 기본 체크리스트 생성
checklists.post('/generate', async (c) => {
  try {
    const { patientId, transferType } = await c.req.json();
    
    if (!patientId || !transferType) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    // 전원 유형별 기본 체크리스트 템플릿
    const templates: Record<string, Array<{item: string, category: string, required: boolean}>> = {
      'acute_to_rehab': [
        { item: '진료의뢰서 발급', category: '서류', required: true },
        { item: '영상 CD 복사 (X-ray, CT, MRI)', category: '검사', required: true },
        { item: '약 처방전 수령', category: '서류', required: true },
        { item: '간호기록지 사본', category: '서류', required: true },
        { item: '장기요양등급 신청서 작성', category: '행정', required: true },
        { item: '건강보험 사전승인', category: '행정', required: true },
        { item: '재활병원 입원 예약', category: '행정', required: true },
        { item: '이송 차량 예약', category: '기타', required: false },
        { item: '개인 물품 준비', category: '기타', required: false }
      ],
      'rehab_to_nursing': [
        { item: '진료의뢰서 발급', category: '서류', required: true },
        { item: '재활 치료 기록', category: '서류', required: true },
        { item: '약 처방전 수령', category: '서류', required: true },
        { item: '장기요양등급 인정서', category: '행정', required: true },
        { item: '요양병원 입원 예약', category: '행정', required: true },
        { item: '이송 차량 예약', category: '기타', required: false }
      ],
      'nursing_to_home': [
        { item: '퇴원 요약서', category: '서류', required: true },
        { item: '약 처방전 및 복약 지도', category: '서류', required: true },
        { item: '재택 간호 신청', category: '행정', required: false },
        { item: '방문 간호사 예약', category: '행정', required: false },
        { item: '간병인 구인', category: '기타', required: false },
        { item: '집 환경 개선 (안전바, 휠체어 등)', category: '기타', required: true }
      ]
    };
    
    const items = templates[transferType] || templates['acute_to_rehab'];
    
    // 체크리스트 항목 삽입
    for (const item of items) {
      await c.env.DB.prepare(
        `INSERT INTO transfer_checklists (patient_id, transfer_type, item_name, category, is_required)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(
        patientId,
        transferType,
        item.item,
        item.category,
        item.required ? 1 : 0
      ).run();
    }
    
    return c.json({ 
      success: true, 
      message: 'Checklist generated successfully',
      count: items.length
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to generate checklist' }, 500);
  }
});

export default checklists;
