import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings, Facility } from '../types';

const facilities = new Hono<{ Bindings: Bindings }>();

facilities.use('/*', cors());

// 기관 검색 (필터링)
facilities.get('/search', async (c) => {
  try {
    const type = c.req.query('type'); // rehabilitation, nursing_hospital, nursing_home
    const maxCost = c.req.query('maxCost');
    const specialty = c.req.query('specialty');
    const maxDistance = c.req.query('maxDistance');
    const userLat = c.req.query('lat');
    const userLng = c.req.query('lng');
    
    let query = 'SELECT * FROM facilities WHERE 1=1';
    const bindings: any[] = [];
    
    if (type) {
      query += ' AND type = ?';
      bindings.push(type);
    }
    
    if (maxCost) {
      query += ' AND average_cost <= ?';
      bindings.push(parseInt(maxCost));
    }
    
    if (specialty) {
      query += ' AND specialties LIKE ?';
      bindings.push(`%${specialty}%`);
    }
    
    query += ' ORDER BY average_cost ASC';
    
    const { results } = await c.env.DB.prepare(query).bind(...bindings).all();
    
    // 거리 계산 (간단한 유클리드 거리)
    let filteredResults = results;
    if (userLat && userLng && maxDistance) {
      const lat = parseFloat(userLat);
      const lng = parseFloat(userLng);
      const maxDist = parseFloat(maxDistance);
      
      filteredResults = results.filter((facility: any) => {
        if (!facility.latitude || !facility.longitude) return false;
        const distance = Math.sqrt(
          Math.pow((facility.latitude - lat) * 111, 2) + 
          Math.pow((facility.longitude - lng) * 88, 2)
        );
        return distance <= maxDist;
      });
    }
    
    return c.json({ success: true, data: filteredResults });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to search facilities' }, 500);
  }
});

// 모든 기관 조회
facilities.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM facilities ORDER BY name'
    ).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch facilities' }, 500);
  }
});

// 기관 상세 조회
facilities.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const facility = await c.env.DB.prepare(
      'SELECT * FROM facilities WHERE id = ?'
    ).bind(id).first();
    
    if (!facility) {
      return c.json({ success: false, error: 'Facility not found' }, 404);
    }
    
    return c.json({ success: true, data: facility });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch facility' }, 500);
  }
});

// 기관 등록 (관리자용)
facilities.post('/', async (c) => {
  try {
    const data: Facility = await c.req.json();
    
    if (!data.name || !data.type || !data.address) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const result = await c.env.DB.prepare(
      `INSERT INTO facilities (name, type, address, latitude, longitude, phone, 
       total_beds, available_beds, specialties, rehabilitation_programs, average_cost,
       care_cost_range, waiting_period, insurance_coverage_rate, evaluation_grade, visit_policy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.name,
      data.type,
      data.address,
      data.latitude || null,
      data.longitude || null,
      data.phone || null,
      data.total_beds || 0,
      data.available_beds || 0,
      data.specialties || '[]',
      data.rehabilitation_programs || '[]',
      data.average_cost || 0,
      data.care_cost_range || '',
      data.waiting_period || 0,
      data.insurance_coverage_rate || 0.7,
      data.evaluation_grade || '',
      data.visit_policy || ''
    ).run();
    
    return c.json({ 
      success: true, 
      data: { id: result.meta.last_row_id },
      message: 'Facility created successfully'
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create facility' }, 500);
  }
});

export default facilities;
