// 의료 지식 데이터베이스 (Medical Knowledge Base)
// 실제 의료 데이터 기반으로 구축된 규칙 기반 시스템

const MedicalKnowledgeBase = {
  
  // 1. 질병별 데이터
  diagnoses: {
    // 급성 뇌혈관 질환
    '뇌경색': {
      category: 'acute_stroke',
      severity: 'high',
      goldenTime: 90, // 일
      preferredFacility: 'recovery_rehab',
      requiredCare: ['intensive_rehab', 'medical_monitoring', 'swallow_eval'],
      commonComplications: ['pneumonia', 'delirium', 'depression'],
      rehabIntensity: 'high',
      estimatedStay: { recovery: '45-90일', longterm: '3-6개월' }
    },
    '뇌출혈': {
      category: 'acute_stroke',
      severity: 'critical',
      goldenTime: 90,
      preferredFacility: 'recovery_rehab',
      requiredCare: ['intensive_rehab', 'medical_monitoring', 'neurological_care'],
      commonComplications: ['hydrocephalus', 'seizure', 'cognitive_impairment'],
      rehabIntensity: 'high',
      estimatedStay: { recovery: '60-120일', longterm: '6-12개월' }
    },
    '뇌졸중': {
      category: 'acute_stroke',
      severity: 'high',
      goldenTime: 90,
      preferredFacility: 'recovery_rehab',
      requiredCare: ['intensive_rehab', 'medical_monitoring'],
      commonComplications: ['pneumonia', 'delirium'],
      rehabIntensity: 'high',
      estimatedStay: { recovery: '45-90일', longterm: '3-6개월' }
    },
    
    // 척수 손상
    '척수손상': {
      category: 'spinal_injury',
      severity: 'critical',
      goldenTime: 180,
      preferredFacility: 'recovery_rehab',
      requiredCare: ['intensive_rehab', 'bowel_bladder_management', 'skin_care'],
      commonComplications: ['pressure_ulcer', 'urinary_infection', 'autonomic_dysreflexia'],
      rehabIntensity: 'very_high',
      estimatedStay: { recovery: '90-180일', longterm: '6-12개월' }
    },
    
    // 외상성 뇌손상
    '외상성 뇌손상': {
      category: 'traumatic_brain_injury',
      severity: 'critical',
      goldenTime: 90,
      preferredFacility: 'recovery_rehab',
      requiredCare: ['intensive_rehab', 'cognitive_rehab', 'behavioral_management'],
      commonComplications: ['seizure', 'cognitive_impairment', 'behavioral_issues'],
      rehabIntensity: 'high',
      estimatedStay: { recovery: '60-120일', longterm: '6-12개월' }
    },
    
    // 골절 및 정형외과
    '대퇴골 골절': {
      category: 'orthopedic',
      severity: 'moderate',
      goldenTime: 60,
      preferredFacility: 'general_rehab',
      requiredCare: ['physical_therapy', 'pain_management'],
      commonComplications: ['pneumonia', 'delirium'],
      rehabIntensity: 'moderate',
      estimatedStay: { recovery: '30-60일', longterm: '2-4개월' }
    },
    '척추 수술': {
      category: 'orthopedic',
      severity: 'moderate',
      goldenTime: 45,
      preferredFacility: 'general_rehab',
      requiredCare: ['physical_therapy', 'pain_management'],
      commonComplications: ['infection', 'nerve_damage'],
      rehabIntensity: 'moderate',
      estimatedStay: { recovery: '30-45일', longterm: '2-3개월' }
    },
    
    // 심혈관 질환
    '심근경색': {
      category: 'cardiac',
      severity: 'high',
      goldenTime: 30,
      preferredFacility: 'cardiac_rehab',
      requiredCare: ['cardiac_monitoring', 'cardiac_rehab', 'medical_management'],
      commonComplications: ['heart_failure', 'arrhythmia'],
      rehabIntensity: 'moderate',
      estimatedStay: { recovery: '14-30일', longterm: '1-3개월' }
    },
    '심부전': {
      category: 'cardiac',
      severity: 'high',
      goldenTime: null,
      preferredFacility: 'nursing_hospital',
      requiredCare: ['medical_monitoring', 'fluid_management'],
      commonComplications: ['pulmonary_edema', 'kidney_failure'],
      rehabIntensity: 'low',
      estimatedStay: { longterm: '3-6개월' }
    },
    
    // 암
    '대장암': {
      category: 'cancer',
      severity: 'high',
      goldenTime: null,
      preferredFacility: 'nursing_hospital',
      requiredCare: ['medical_management', 'pain_management', 'nutrition'],
      commonComplications: ['infection', 'malnutrition', 'bowel_obstruction'],
      rehabIntensity: 'low',
      estimatedStay: { longterm: '3-6개월' }
    },
    '폐암': {
      category: 'cancer',
      severity: 'high',
      goldenTime: null,
      preferredFacility: 'nursing_hospital',
      requiredCare: ['respiratory_care', 'pain_management', 'oxygen_therapy'],
      commonComplications: ['pneumonia', 'respiratory_failure'],
      rehabIntensity: 'low',
      estimatedStay: { longterm: '3-6개월' }
    },
    
    // 호흡기 질환
    'COPD': {
      category: 'respiratory',
      severity: 'moderate',
      goldenTime: null,
      preferredFacility: 'nursing_hospital',
      requiredCare: ['respiratory_care', 'oxygen_therapy'],
      commonComplications: ['pneumonia', 'respiratory_failure'],
      rehabIntensity: 'low',
      estimatedStay: { longterm: '3-6개월' }
    },
    
    // 치매
    '알츠하이머': {
      category: 'dementia',
      severity: 'moderate',
      goldenTime: null,
      preferredFacility: 'nursing_home',
      requiredCare: ['daily_living_support', 'cognitive_care', 'behavioral_management'],
      commonComplications: ['wandering', 'agitation', 'falls'],
      rehabIntensity: 'minimal',
      estimatedStay: { longterm: '장기' }
    },
    '혈관성 치매': {
      category: 'dementia',
      severity: 'moderate',
      goldenTime: null,
      preferredFacility: 'nursing_home',
      requiredCare: ['daily_living_support', 'cognitive_care'],
      commonComplications: ['falls', 'aspiration'],
      rehabIntensity: 'minimal',
      estimatedStay: { longterm: '장기' }
    },
    
    // 파킨슨병
    '파킨슨병': {
      category: 'neurodegenerative',
      severity: 'moderate',
      goldenTime: null,
      preferredFacility: 'nursing_hospital',
      requiredCare: ['physical_therapy', 'medication_management', 'fall_prevention'],
      commonComplications: ['falls', 'aspiration', 'depression'],
      rehabIntensity: 'moderate',
      estimatedStay: { longterm: '장기' }
    }
  },
  
  // 2. GCS 점수별 평가
  gcsLevels: {
    15: {
      level: 'normal',
      description: '정상 의식',
      riskLevel: 'low',
      careNeeds: ['routine'],
      preferredSettings: ['home', 'outpatient', 'general_rehab']
    },
    '13-14': {
      level: 'mild',
      description: '경미한 의식 장애',
      riskLevel: 'low-moderate',
      careNeeds: ['routine', 'monitoring'],
      preferredSettings: ['general_rehab', 'nursing_hospital']
    },
    '9-12': {
      level: 'moderate',
      description: '중등도 의식 장애',
      riskLevel: 'moderate-high',
      careNeeds: ['close_monitoring', 'nursing_care'],
      preferredSettings: ['recovery_rehab', 'nursing_hospital']
    },
    '3-8': {
      level: 'severe',
      description: '중증 의식 장애',
      riskLevel: 'critical',
      careNeeds: ['intensive_monitoring', 'respiratory_support', 'critical_care'],
      preferredSettings: ['icu', 'recovery_rehab']
    }
  },
  
  // 3. 재활 치료별 요구사항
  rehabRequirements: {
    robot: {
      name: '로봇재활',
      facilityTypes: ['recovery_rehab', 'specialized_rehab'],
      costIncrease: 20000, // 하루 추가 비용
      equipment: ['Lokomat', 'Armeo', 'Balance_Robot'],
      conditions: ['stroke', 'spinal_injury', 'orthopedic']
    },
    vr: {
      name: 'VR재활',
      facilityTypes: ['recovery_rehab', 'specialized_rehab'],
      costIncrease: 15000,
      equipment: ['VR_Headset', 'Motion_Capture'],
      conditions: ['stroke', 'cognitive_impairment', 'balance_disorder']
    },
    physical: {
      name: '물리치료',
      facilityTypes: ['all'],
      costIncrease: 0,
      frequency: '주 5-7회',
      duration: '30-60분/회'
    },
    occupational: {
      name: '작업치료',
      facilityTypes: ['recovery_rehab', 'general_rehab', 'nursing_hospital'],
      costIncrease: 0,
      frequency: '주 3-5회',
      duration: '30-45분/회'
    },
    speech: {
      name: '언어치료',
      facilityTypes: ['recovery_rehab', 'general_rehab', 'nursing_hospital'],
      costIncrease: 0,
      frequency: '주 3-5회',
      duration: '30분/회',
      conditions: ['stroke', 'brain_injury', 'dementia']
    },
    swallowing: {
      name: '연하치료',
      facilityTypes: ['recovery_rehab', 'nursing_hospital'],
      costIncrease: 0,
      critical: true,
      equipment: ['VFSS', 'FEES'],
      conditions: ['stroke', 'brain_injury', 'neurodegenerative']
    }
  },
  
  // 4. 시설별 상세 정보
  facilities: {
    recovery_rehab: {
      name: '회복기 재활병원',
      icon: '♿',
      legalBasis: '의료법 (회복기재활의료기관)',
      insurance: '건강보험',
      targetPatients: [
        '뇌졸중 발병 후 2주~2개월',
        '척수손상 발병 후 2주~2개월',
        '대퇴골 골절 수술 후 2주~2개월',
        '고관절 골절 수술 후 2주~2개월',
        '외상성 뇌손상 발병 후 2주~2개월'
      ],
      criteria: {
        gcs: '≥9',
        adl: '≤60',
        medicalStability: 'stable',
        goldenTime: '<90일'
      },
      services: {
        rehabIntensity: '하루 3시간 이상',
        medicalCare: '전문의 상주',
        nursingCare: '24시간 간호',
        equipment: ['로봇', 'VR', 'VFSS', 'CT', 'MRI'],
        specialties: ['재활의학과', '신경외과', '정형외과']
      },
      costs: {
        daily: { min: 150000, max: 200000 },
        monthly: { min: 4500000, max: 6000000 },
        selfPay: { min: 300000, max: 500000 },
        roomUpgrade: { single: '+30-50%', vip: '+100%' }
      },
      duration: '45-90일',
      strengths: [
        '골든타임 내 집중 재활로 기능 회복 극대화',
        '고강도 재활 프로그램 (하루 3시간+)',
        '로봇·VR 등 최신 재활 장비 보유',
        '재활의학과 전문의 상주로 체계적 치료',
        '다학제 팀 접근 (의사·물리·작업·언어치료사)'
      ],
      limitations: [
        '입원 기간 제한 (평균 45-90일)',
        '비용이 상대적으로 높음',
        '병상 확보 경쟁 치열',
        '의료적으로 안정된 환자만 입원 가능'
      ]
    },
    
    general_rehab: {
      name: '일반 재활병원',
      icon: '🏥',
      legalBasis: '의료법',
      insurance: '건강보험',
      targetPatients: [
        '골절 수술 후 회복',
        '스포츠 손상',
        '만성 통증',
        '퇴행성 관절염'
      ],
      criteria: {
        gcs: '≥13',
        adl: '30-80',
        medicalStability: 'stable'
      },
      services: {
        rehabIntensity: '하루 1-2시간',
        medicalCare: '의사 진료',
        nursingCare: '간호사 배치',
        equipment: ['기본 재활 장비', 'X-ray'],
        specialties: ['재활의학과', '정형외과']
      },
      costs: {
        daily: { min: 120000, max: 150000 },
        monthly: { min: 3600000, max: 4500000 },
        selfPay: { min: 250000, max: 350000 }
      },
      duration: '30-60일',
      strengths: [
        '기본적인 재활 치료 제공',
        '회복기 재활병원보다 입원 용이',
        '외래 치료 병행 가능',
        '비교적 저렴한 비용'
      ],
      limitations: [
        '고강도 재활 프로그램 제한적',
        '최신 재활 장비 부족',
        '중증 환자 케어 어려움'
      ]
    },
    
    nursing_hospital: {
      name: '요양병원',
      icon: '🏨',
      legalBasis: '의료법',
      insurance: '건강보험 + 장기요양보험',
      targetPatients: [
        '만성질환자 (당뇨, 고혈압, COPD)',
        '암 수술 후 회복기',
        '뇌졸중 아급성기',
        '치매 초기-중기',
        '와상 환자'
      ],
      criteria: {
        gcs: '모든 수준',
        chronicCondition: true,
        longTermCare: true
      },
      services: {
        rehabIntensity: '하루 30분-1시간',
        medicalCare: '의사 상주 (필수)',
        nursingCare: '24시간 간호',
        equipment: ['기본 의료장비', 'X-ray', '일부 CT'],
        specialties: ['내과', '가정의학과', '재활의학과']
      },
      costs: {
        daily: { min: 100000, max: 150000 },
        monthly: { min: 3000000, max: 4500000 },
        selfPay: { min: 200000, max: 400000 }
      },
      duration: '입원 기간 제한 없음',
      strengths: [
        '의사 상주로 의료 서비스 제공',
        '24시간 간호 케어',
        '장기 입원 가능',
        '재활 + 의료 + 요양 통합 제공',
        '만성질환 관리'
      ],
      limitations: [
        '재활 강도가 낮음',
        '최신 재활 장비 거의 없음',
        '병원마다 질 차이 큼',
        '일부는 사실상 요양원 수준'
      ]
    },
    
    nursing_home: {
      name: '요양원',
      icon: '🏡',
      legalBasis: '노인복지법',
      insurance: '장기요양보험',
      targetPatients: [
        '치매 중기-말기',
        '장기요양등급 1-3급',
        '와상 노인',
        '일상생활 전적 의존'
      ],
      criteria: {
        ltcGrade: '1-5급',
        age: '≥65 (또는 노인성 질환)',
        dailyLivingSupport: true
      },
      services: {
        rehabIntensity: '거의 없음',
        medicalCare: '월 2회 방문 진료 (의사 상주 X)',
        nursingCare: '요양보호사 중심',
        equipment: ['생활 지원 장비'],
        specialties: ['요양보호사', '간호사']
      },
      costs: {
        daily: { min: 80000, max: 120000 },
        monthly: { min: 2400000, max: 3600000 },
        selfPay: { min: 200000, max: 400000, percentage: 20 }
      },
      duration: '입원 기간 제한 없음 (장기)',
      strengths: [
        '장기요양보험으로 본인 부담 20%',
        '일상생활 전반 지원',
        '가족 같은 분위기',
        '장기 케어 가능',
        '비교적 저렴한 비용'
      ],
      limitations: [
        '의사 상주 안 함 (응급 대응 늦음)',
        '의료 서비스 제한적',
        '재활 치료 거의 없음',
        '시설마다 질 차이 매우 큼'
      ]
    }
  },
  
  // 5. 전원 경로 템플릿
  pathwayTemplates: {
    acute_stroke_optimal: {
      name: '급성 뇌졸중 최적 경로',
      stages: [
        { facility: '급성기병원', duration: '1-2주', goal: '생명 안정화, 급성기 치료' },
        { facility: '회복기 재활병원', duration: '6-12주', goal: '집중 재활, 기능 회복' },
        { facility: '요양병원 또는 재택', duration: '3-6개월', goal: '유지 재활, 만성질환 관리' }
      ],
      totalDuration: '6-9개월',
      expectedOutcome: '60-70% 기능 회복 가능'
    },
    chronic_care: {
      name: '만성질환 장기 케어',
      stages: [
        { facility: '요양병원', duration: '3-6개월', goal: '안정화, 재활, 의료 관리' },
        { facility: '요양원 또는 재택', duration: '장기', goal: '유지 케어, 생활 지원' }
      ],
      totalDuration: '장기',
      expectedOutcome: '현상 유지 또는 완만한 호전'
    },
    dementia_care: {
      name: '치매 장기 돌봄',
      stages: [
        { facility: '요양원', duration: '장기', goal: '일상생활 지원, 인지 케어' }
      ],
      totalDuration: '장기',
      expectedOutcome: '안전한 환경에서 존엄한 돌봄'
    }
  },
  
  // 6. 체크리스트 및 주의사항
  checklistsByCondition: {
    stroke: [
      { item: '발병일로부터 경과 기간 확인', importance: 'critical', detail: '골든타임 3개월 이내' },
      { item: 'GCS 점수 및 의식 수준', importance: 'high', detail: '9점 이상이면 재활병원 입원 가능' },
      { item: '연하기능 평가 (VFSS)', importance: 'high', detail: '흡인성 폐렴 예방' },
      { item: '욕창 유무 확인', importance: 'moderate', detail: '욕창 있으면 치료 후 전원' },
      { item: '인공호흡기 사용 여부', importance: 'critical', detail: '사용 중이면 전원 어려움' },
      { item: '보험 종류 및 장기요양등급', importance: 'moderate', detail: '비용 계획 수립' }
    ],
    dementia: [
      { item: '장기요양등급 신청', importance: 'critical', detail: '요양원 입소 필수 조건' },
      { item: 'BPSD (행동심리증상) 평가', importance: 'high', detail: '심하면 케어 가능한 곳 선택' },
      { item: '낙상 위험도 평가', importance: 'high', detail: '안전 장치 필요' },
      { item: '배회 여부 확인', importance: 'moderate', detail: '인지케어 프로그램 있는 곳' },
      { item: '식사 거부/폭력성', importance: 'high', detail: '전문 인력 있는 곳 선택' }
    ],
    cancer: [
      { item: '현재 치료 단계 확인', importance: 'critical', detail: '항암 중이면 외래 가능한 곳' },
      { item: '통증 관리 필요성', importance: 'high', detail: '마약성 진통제 처방 가능한 곳' },
      { item: '영양 상태 평가', importance: 'high', detail: '영양 지원 필요 시 전문 케어' },
      { item: '감염 위험도', importance: 'high', detail: '면역저하 시 격리 가능한 곳' }
    ]
  },
  
  // 7. 비용 보정 계수
  costModifiers: {
    location: {
      서울: 1.3,
      경기: 1.2,
      부산: 1.1,
      대구: 1.05,
      광주: 1.0,
      대전: 1.0,
      울산: 1.0,
      세종: 1.0,
      기타: 0.95
    },
    roomType: {
      '1인실': 1.5,
      '2인실': 1.0,
      '3인실': 0.9,
      '4인실': 0.8,
      '6인실': 0.7
    },
    specialCare: {
      intensive_monitoring: 50000,
      ventilator: 100000,
      hemodialysis: 80000,
      chemotherapy: 150000
    }
  }
};

// 전역에서 접근 가능하도록 설정
if (typeof window !== 'undefined') {
  window.MedicalKnowledgeBase = MedicalKnowledgeBase;
}

// Node.js 환경에서도 사용 가능하도록
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MedicalKnowledgeBase;
}
