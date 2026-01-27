import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings, CareSchedule } from '../types';

const schedules = new Hono<{ Bindings: Bindings }>();

schedules.use('/*', cors());

// 환자별 스케줄 조회
schedules.get('/patient/:patientId', async (c) => {
  const patientId = c.req.param('patientId');
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');
  
  try {
    let query = 'SELECT * FROM care_schedules WHERE patient_id = ?';
    const bindings: any[] = [patientId];
    
    if (startDate) {
      query += ' AND start_datetime >= ?';
      bindings.push(startDate);
    }
    
    if (endDate) {
      query += ' AND end_datetime <= ?';
      bindings.push(endDate);
    }
    
    query += ' ORDER BY start_datetime ASC';
    
    const { results } = await c.env.DB.prepare(query).bind(...bindings).all();
    
    // 간병 공백 구간 분석
    const gaps = [];
    for (let i = 0; i < results.length - 1; i++) {
      const current: any = results[i];
      const next: any = results[i + 1];
      
      const currentEnd = new Date(current.end_datetime);
      const nextStart = new Date(next.start_datetime);
      
      if (nextStart > currentEnd) {
        const gapHours = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60);
        if (gapHours > 1) {
          gaps.push({
            start: currentEnd.toISOString(),
            end: nextStart.toISOString(),
            durationHours: Math.round(gapHours * 10) / 10
          });
        }
      }
    }
    
    return c.json({ success: true, data: { schedules: results, gaps } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch schedules' }, 500);
  }
});

// 스케줄 추가
schedules.post('/', async (c) => {
  try {
    const data: CareSchedule = await c.req.json();
    
    if (!data.patient_id || !data.caregiver_name || !data.start_datetime || !data.end_datetime) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const result = await c.env.DB.prepare(
      `INSERT INTO care_schedules (patient_id, caregiver_name, caregiver_type, start_datetime,
       end_datetime, is_recurring, recurrence_pattern, notes, emergency_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.patient_id,
      data.caregiver_name,
      data.caregiver_type || 'family',
      data.start_datetime,
      data.end_datetime,
      data.is_recurring ? 1 : 0,
      data.recurrence_pattern || null,
      data.notes || null,
      data.emergency_contact || null
    ).run();
    
    return c.json({ 
      success: true, 
      data: { id: result.meta.last_row_id },
      message: 'Schedule created successfully'
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create schedule' }, 500);
  }
});

// 스케줄 수정
schedules.put('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const data: CareSchedule = await c.req.json();
    
    const result = await c.env.DB.prepare(
      `UPDATE care_schedules SET
       caregiver_name = ?, caregiver_type = ?, start_datetime = ?, end_datetime = ?,
       is_recurring = ?, recurrence_pattern = ?, notes = ?, emergency_contact = ?
       WHERE id = ?`
    ).bind(
      data.caregiver_name,
      data.caregiver_type,
      data.start_datetime,
      data.end_datetime,
      data.is_recurring ? 1 : 0,
      data.recurrence_pattern || null,
      data.notes || null,
      data.emergency_contact || null,
      id
    ).run();
    
    return c.json({ success: true, message: 'Schedule updated successfully' });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update schedule' }, 500);
  }
});

// 스케줄 삭제
schedules.delete('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await c.env.DB.prepare('DELETE FROM care_schedules WHERE id = ?').bind(id).run();
    return c.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete schedule' }, 500);
  }
});

export default schedules;
