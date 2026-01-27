// Type definitions for the application

export type Bindings = {
  DB: D1Database;
};

export interface Patient {
  id?: number;
  name: string;
  diagnosis: string;
  diagnosis_date: string;
  age: number;
  adl_score: number;
  consciousness_level: string;
  severity: 'mild' | 'moderate' | 'severe';
  insurance_type: 'employee' | 'local' | 'medical_aid';
  ltc_grade?: number | null;
  current_hospital: string;
  comorbidities?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Facility {
  id?: number;
  name: string;
  type: 'rehabilitation' | 'nursing_hospital' | 'nursing_home';
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  total_beds?: number;
  available_beds?: number;
  specialties?: string;
  rehabilitation_programs?: string;
  average_cost?: number;
  care_cost_range?: string;
  waiting_period?: number;
  insurance_coverage_rate?: number;
  evaluation_grade?: string;
  visit_policy?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarePathway {
  id?: number;
  patient_id: number;
  step_order: number;
  step_type: 'acute' | 'rehabilitation' | 'nursing_hospital' | 'nursing_home' | 'home';
  facility_id?: number;
  duration_weeks: number;
  treatment_goal: string;
  estimated_cost: number;
  ltc_application_timing: boolean;
  status: 'recommended' | 'selected' | 'completed';
  created_at?: string;
  facility?: Facility;
}

export interface CostSimulation {
  id?: number;
  patient_id: number;
  facility_type: string;
  facility_id?: number;
  duration_months: number;
  insurance_coverage: number;
  non_coverage: number;
  ltc_copayment: number;
  total_cost: number;
  monthly_cashflow?: string;
  error_margin_percent: number;
  created_at?: string;
}

export interface TransferChecklist {
  id?: number;
  patient_id: number;
  transfer_type: string;
  item_name: string;
  category?: string;
  is_required: boolean;
  is_completed: boolean;
  document_url?: string;
  notes?: string;
  completed_at?: string;
  created_at?: string;
}

export interface CareSchedule {
  id?: number;
  patient_id: number;
  caregiver_name: string;
  caregiver_type: 'family' | 'professional' | 'nurse';
  start_datetime: string;
  end_datetime: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  notes?: string;
  emergency_contact?: string;
  created_at?: string;
}
