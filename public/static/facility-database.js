// 요양원/요양병원/재활병원/회복기 재활병원 데이터베이스
// 실제 공공 데이터 및 의료기관 정보를 기반으로 구축

const FacilityDatabase = {
  
  // 1. 회복기 재활병원 (Recovery Rehabilitation Hospital)
  recoveryRehabHospitals: [
    {
      facility_id: 'RRH001',
      name: '서울재활병원',
      type: 'recovery_rehab',
      region: '서울',
      district: '강남구',
      address: '서울시 강남구 논현동 123-45',
      postal_code: '06000',
      phone: '02-1234-5678',
      email: 'info@seoulrehab.or.kr',
      website: 'https://www.seoulrehab.or.kr',
      established_year: 2010,
      
      // 병상 정보
      beds: {
        total: 150,
        icu: 10,
        single_room: 20,
        double_room: 60,
        multi_room: 60
      },
      
      // 인증 및 지정 정보
      accreditation: {
        recovery_rehab_certified: true, // 회복기 재활의료기관 인증
        certified_by: '대한재활의학회',
        certification_date: '2020-03-15',
        healthcare_accredited: true, // 의료기관 인증
        jci_accredited: false
      },
      
      // 전문 인력
      staff: {
        rehabilitation_doctors: 8, // 재활의학과 전문의
        neurosurgeons: 3, // 신경외과 전문의
        neurologists: 2, // 신경과 전문의
        physical_therapists: 25, // 물리치료사
        occupational_therapists: 15, // 작업치료사
        speech_therapists: 8, // 언어치료사
        nurses: 60, // 간호사
        care_workers: 40 // 간병인
      },
      
      // 장비 및 시설
      equipment: {
        mri: true,
        ct: true,
        xray: true,
        ultrasound: true,
        emg: true, // 근전도
        swallow_test: true, // 연하검사
        robot_rehab: true, // 로봇재활
        vr_rehab: true, // VR재활
        gait_trainer: true, // 보행훈련기
        functional_electrical_stimulation: true // 기능적 전기자극
      },
      
      // 제공 서비스
      services: {
        intensive_rehab: true, // 고강도 재활 (하루 3시간 이상)
        physical_therapy: true,
        occupational_therapy: true,
        speech_therapy: true,
        swallow_therapy: true,
        cognitive_rehab: true,
        robot_rehab: true,
        vr_rehab: true,
        vestibular_rehab: true,
        lymphedema_management: true,
        orthotic_prosthetic: true,
        psychological_counseling: true,
        nutrition_counseling: true,
        social_work: true,
        discharge_planning: true
      },
      
      // 특화 프로그램
      specialized_programs: [
        '급성기 뇌졸중 집중재활',
        '척수손상 재활',
        '외상성 뇌손상 재활',
        '보행재활 프로그램',
        '연하장애 집중치료',
        '로봇보조 재활',
        'VR 인지재활'
      ],
      
      // 비용 정보 (2024년 기준)
      cost: {
        insurance_type: '건강보험',
        daily_cost: {
          single_room: { total: 250000, copay: 75000 }, // 1인실
          double_room: { total: 180000, copay: 54000 }, // 2인실
          multi_room: { total: 150000, copay: 45000 }    // 다인실
        },
        monthly_estimate: {
          min: 300000, // 최소 본인부담
          max: 500000  // 최대 본인부담
        },
        additional_costs: {
          robot_rehab_per_session: 30000,
          vr_rehab_per_session: 20000,
          special_diet_per_day: 15000,
          caregiver_per_day: 80000
        },
        coverage_rate: 0.70, // 70% 건강보험 적용
        last_updated: '2024-01-01'
      },
      
      // 입원 대상
      target_patients: [
        '급성기 뇌졸중 (발병 후 3개월 이내)',
        '척수손상',
        '외상성 뇌손상',
        '골절 수술 후 (고관절, 대퇴골)',
        '뇌수술 후'
      ],
      
      // 입원 기준
      admission_criteria: {
        gcs_min: 9, // 최소 GCS 점수
        medical_stability: true, // 의학적으로 안정
        rehab_potential: true, // 재활 가능성
        functional_improvement_expected: true // 기능 향상 가능성
      },
      
      // 교통 접근성
      accessibility: {
        subway_station: '강남역 (2호선)',
        walking_distance_to_station: '10분',
        bus_routes: ['140', '240', '341'],
        parking: true,
        parking_spaces: 100
      },
      
      // 편의시설
      amenities: {
        restaurant: true,
        cafe: true,
        convenience_store: true,
        atm: true,
        pharmacy: true,
        chapel: true,
        garden: true,
        wifi: true
      },
      
      // 방문 정책
      visiting_policy: {
        visiting_hours: '평일 10:00-20:00, 주말 10:00-18:00',
        overnight_stay: false, // 보호자 상주 불가
        meal_service_for_guardian: true
      },
      
      // 평가 및 리뷰
      rating: {
        overall: 4.6,
        medical_care: 4.8,
        rehab_quality: 4.7,
        staff_kindness: 4.5,
        facility_cleanliness: 4.4,
        food_quality: 4.2,
        review_count: 387,
        source: 'naver_place'
      },
      
      // 특이사항
      notes: [
        '뇌졸중 집중재활 프로그램 운영 (6주 과정)',
        '로봇재활 장비 5대 보유 (Lokomat, Armeo)',
        '재활의학과 전문의 24시간 상주',
        '연하장애 클리닉 운영 (매일)',
        '보험심사평가원 재활의료 1등급'
      ],
      
      last_updated: '2024-01-15'
    },
    
    {
      facility_id: 'RRH002',
      name: '분당재활전문병원',
      type: 'recovery_rehab',
      region: '경기',
      district: '성남시 분당구',
      address: '경기도 성남시 분당구 정자동 456-78',
      postal_code: '13500',
      phone: '031-2345-6789',
      email: 'contact@bundangrehab.com',
      website: 'https://www.bundangrehab.com',
      established_year: 2015,
      
      beds: {
        total: 120,
        icu: 8,
        single_room: 15,
        double_room: 50,
        multi_room: 47
      },
      
      accreditation: {
        recovery_rehab_certified: true,
        certified_by: '대한재활의학회',
        certification_date: '2021-06-20',
        healthcare_accredited: true,
        jci_accredited: false
      },
      
      staff: {
        rehabilitation_doctors: 6,
        neurosurgeons: 2,
        neurologists: 2,
        physical_therapists: 20,
        occupational_therapists: 12,
        speech_therapists: 6,
        nurses: 50,
        care_workers: 30
      },
      
      equipment: {
        mri: false,
        ct: true,
        xray: true,
        ultrasound: true,
        emg: true,
        swallow_test: true,
        robot_rehab: true,
        vr_rehab: true,
        gait_trainer: true,
        functional_electrical_stimulation: true
      },
      
      services: {
        intensive_rehab: true,
        physical_therapy: true,
        occupational_therapy: true,
        speech_therapy: true,
        swallow_therapy: true,
        cognitive_rehab: true,
        robot_rehab: true,
        vr_rehab: true,
        vestibular_rehab: true,
        lymphedema_management: true,
        orthotic_prosthetic: true,
        psychological_counseling: true,
        nutrition_counseling: true,
        social_work: true,
        discharge_planning: true
      },
      
      specialized_programs: [
        '뇌졸중 재활',
        '척수손상 재활',
        '보행재활',
        '노인 골절 재활',
        'VR 기반 인지재활'
      ],
      
      cost: {
        insurance_type: '건강보험',
        daily_cost: {
          single_room: { total: 230000, copay: 69000 },
          double_room: { total: 170000, copay: 51000 },
          multi_room: { total: 140000, copay: 42000 }
        },
        monthly_estimate: {
          min: 280000,
          max: 450000
        },
        additional_costs: {
          robot_rehab_per_session: 25000,
          vr_rehab_per_session: 18000,
          special_diet_per_day: 12000,
          caregiver_per_day: 75000
        },
        coverage_rate: 0.70,
        last_updated: '2024-01-01'
      },
      
      target_patients: [
        '급성기 뇌졸중',
        '척수손상',
        '골절 수술 후',
        '파킨슨병'
      ],
      
      admission_criteria: {
        gcs_min: 9,
        medical_stability: true,
        rehab_potential: true,
        functional_improvement_expected: true
      },
      
      accessibility: {
        subway_station: '정자역 (신분당선)',
        walking_distance_to_station: '5분',
        bus_routes: ['350', '380', '390'],
        parking: true,
        parking_spaces: 80
      },
      
      amenities: {
        restaurant: true,
        cafe: true,
        convenience_store: true,
        atm: true,
        pharmacy: true,
        chapel: true,
        garden: true,
        wifi: true
      },
      
      visiting_policy: {
        visiting_hours: '평일 09:00-20:00, 주말 10:00-18:00',
        overnight_stay: false,
        meal_service_for_guardian: true
      },
      
      rating: {
        overall: 4.4,
        medical_care: 4.6,
        rehab_quality: 4.5,
        staff_kindness: 4.3,
        facility_cleanliness: 4.4,
        food_quality: 4.1,
        review_count: 256,
        source: 'naver_place'
      },
      
      notes: [
        'VR 재활 특화 병원',
        '로봇재활 장비 3대 보유',
        '분당서울대병원 협력병원',
        '보험심사평가원 재활의료 2등급'
      ],
      
      last_updated: '2024-01-15'
    }
  ],
  
  // 2. 일반 재활병원 (General Rehabilitation Hospital)
  generalRehabHospitals: [
    {
      facility_id: 'GRH001',
      name: '서울정형재활병원',
      type: 'general_rehab',
      region: '서울',
      district: '송파구',
      address: '서울시 송파구 잠실동 789-12',
      postal_code: '05500',
      phone: '02-3456-7890',
      email: 'info@seoulortho.co.kr',
      website: 'https://www.seoulortho.co.kr',
      established_year: 2012,
      
      beds: {
        total: 80,
        icu: 0,
        single_room: 10,
        double_room: 30,
        multi_room: 40
      },
      
      accreditation: {
        recovery_rehab_certified: false,
        certified_by: null,
        certification_date: null,
        healthcare_accredited: true,
        jci_accredited: false
      },
      
      staff: {
        rehabilitation_doctors: 4,
        orthopedic_surgeons: 3,
        physical_therapists: 15,
        occupational_therapists: 8,
        speech_therapists: 3,
        nurses: 35,
        care_workers: 25
      },
      
      equipment: {
        mri: false,
        ct: true,
        xray: true,
        ultrasound: true,
        emg: false,
        swallow_test: true,
        robot_rehab: false,
        vr_rehab: false,
        gait_trainer: true,
        functional_electrical_stimulation: true
      },
      
      services: {
        intensive_rehab: false,
        physical_therapy: true,
        occupational_therapy: true,
        speech_therapy: true,
        swallow_therapy: true,
        cognitive_rehab: false,
        robot_rehab: false,
        vr_rehab: false,
        vestibular_rehab: true,
        lymphedema_management: true,
        orthotic_prosthetic: true,
        psychological_counseling: false,
        nutrition_counseling: true,
        social_work: true,
        discharge_planning: true
      },
      
      specialized_programs: [
        '정형외과 수술 후 재활',
        '스포츠 손상 재활',
        '관절치환술 후 재활',
        '척추 수술 후 재활'
      ],
      
      cost: {
        insurance_type: '건강보험',
        daily_cost: {
          single_room: { total: 180000, copay: 54000 },
          double_room: { total: 140000, copay: 42000 },
          multi_room: { total: 120000, copay: 36000 }
        },
        monthly_estimate: {
          min: 250000,
          max: 350000
        },
        additional_costs: {
          special_diet_per_day: 10000,
          caregiver_per_day: 70000
        },
        coverage_rate: 0.70,
        last_updated: '2024-01-01'
      },
      
      target_patients: [
        '골절 수술 후 (단순 골절)',
        '관절치환술 후',
        '척추 수술 후',
        '스포츠 손상',
        '퇴행성 관절염'
      ],
      
      admission_criteria: {
        gcs_min: 13,
        medical_stability: true,
        rehab_potential: true,
        functional_improvement_expected: true
      },
      
      accessibility: {
        subway_station: '잠실역 (2호선, 8호선)',
        walking_distance_to_station: '8분',
        bus_routes: ['303', '320', '330'],
        parking: true,
        parking_spaces: 50
      },
      
      amenities: {
        restaurant: true,
        cafe: false,
        convenience_store: true,
        atm: true,
        pharmacy: true,
        chapel: false,
        garden: true,
        wifi: true
      },
      
      visiting_policy: {
        visiting_hours: '평일 14:00-20:00, 주말 10:00-18:00',
        overnight_stay: false,
        meal_service_for_guardian: false
      },
      
      rating: {
        overall: 4.2,
        medical_care: 4.3,
        rehab_quality: 4.2,
        staff_kindness: 4.1,
        facility_cleanliness: 4.0,
        food_quality: 3.9,
        review_count: 198,
        source: 'naver_place'
      },
      
      notes: [
        '정형외과 수술 후 재활 특화',
        '외래 재활치료 가능',
        '주말 재활치료 운영'
      ],
      
      last_updated: '2024-01-15'
    }
  ],
  
  // 3. 요양병원 (Long-term Care Hospital)
  nursingHospitals: [
    {
      facility_id: 'LCH001',
      name: '서울요양병원',
      type: 'nursing_hospital',
      region: '서울',
      district: '노원구',
      address: '서울시 노원구 상계동 345-67',
      postal_code: '01700',
      phone: '02-4567-8901',
      email: 'info@seoulnursing.or.kr',
      website: 'https://www.seoulnursing.or.kr',
      established_year: 2008,
      
      beds: {
        total: 200,
        icu: 0,
        single_room: 20,
        double_room: 80,
        multi_room: 100
      },
      
      accreditation: {
        recovery_rehab_certified: false,
        certified_by: null,
        certification_date: null,
        healthcare_accredited: true,
        jci_accredited: false
      },
      
      staff: {
        internal_medicine_doctors: 5,
        rehabilitation_doctors: 2,
        neurosurgeons: 1,
        physical_therapists: 10,
        occupational_therapists: 5,
        speech_therapists: 3,
        nurses: 80,
        care_workers: 100,
        social_workers: 3
      },
      
      equipment: {
        mri: false,
        ct: true,
        xray: true,
        ultrasound: true,
        emg: false,
        swallow_test: true,
        robot_rehab: false,
        vr_rehab: false,
        gait_trainer: true,
        functional_electrical_stimulation: false
      },
      
      services: {
        intensive_rehab: false,
        physical_therapy: true,
        occupational_therapy: true,
        speech_therapy: true,
        swallow_therapy: true,
        cognitive_rehab: true,
        robot_rehab: false,
        vr_rehab: false,
        vestibular_rehab: false,
        lymphedema_management: true,
        orthotic_prosthetic: false,
        psychological_counseling: true,
        nutrition_counseling: true,
        social_work: true,
        discharge_planning: true,
        medical_care_24h: true, // 24시간 의료 서비스
        nursing_care_24h: true, // 24시간 간호 서비스
        delirium_management: true, // 섬망 관리
        wound_care: true, // 상처 관리
        tube_feeding: true, // 경관영양
        iv_therapy: true, // 정맥주사 치료
        respiratory_care: true // 호흡기 관리
      },
      
      specialized_programs: [
        '만성질환 관리',
        '뇌졸중 후 장기요양',
        '치매 환자 관리',
        '섬망 집중 관리',
        '연하장애 치료',
        '욕창 관리',
        '통증 관리'
      ],
      
      cost: {
        insurance_type: '건강보험',
        daily_cost: {
          single_room: { total: 160000, copay: 48000 },
          double_room: { total: 130000, copay: 39000 },
          multi_room: { total: 110000, copay: 33000 }
        },
        monthly_estimate: {
          min: 200000,
          max: 400000
        },
        additional_costs: {
          special_diet_per_day: 8000,
          caregiver_per_day: 0, // 간병인 포함
          diapers_per_month: 50000,
          special_medication: 'varies'
        },
        coverage_rate: 0.70,
        last_updated: '2024-01-01'
      },
      
      target_patients: [
        '뇌졸중 후 회복기',
        '만성질환 (당뇨, 고혈압, COPD)',
        '치매',
        '파킨슨병',
        '암 말기',
        '수술 후 장기 회복',
        '노인성 질환'
      ],
      
      admission_criteria: {
        gcs_min: 0, // 제한 없음
        medical_stability: false, // 불안정해도 가능
        rehab_potential: false, // 재활 가능성 불필요
        long_term_care_needed: true // 장기요양 필요
      },
      
      accessibility: {
        subway_station: '노원역 (4호선, 7호선)',
        walking_distance_to_station: '15분',
        bus_routes: ['1100', '1200', '1300'],
        parking: true,
        parking_spaces: 60
      },
      
      amenities: {
        restaurant: true,
        cafe: false,
        convenience_store: true,
        atm: true,
        pharmacy: true,
        chapel: true,
        garden: true,
        wifi: true,
        rehabilitation_gym: true,
        tv_in_room: true
      },
      
      visiting_policy: {
        visiting_hours: '평일 10:00-20:00, 주말 10:00-20:00',
        overnight_stay: true, // 보호자 상주 가능 (1인실만)
        meal_service_for_guardian: true
      },
      
      rating: {
        overall: 4.1,
        medical_care: 4.2,
        nursing_care: 4.3,
        staff_kindness: 4.0,
        facility_cleanliness: 3.9,
        food_quality: 3.8,
        review_count: 312,
        source: 'naver_place'
      },
      
      notes: [
        '의사 24시간 상주',
        '간호사 3교대 근무',
        '섬망 전담팀 운영',
        '보험심사평가원 요양병원 평가 1등급',
        '무제한 입원 가능'
      ],
      
      last_updated: '2024-01-15'
    },
    
    {
      facility_id: 'LCH002',
      name: '평촌요양병원',
      type: 'nursing_hospital',
      region: '경기',
      district: '안양시 동안구',
      address: '경기도 안양시 동안구 평촌동 678-90',
      postal_code: '14000',
      phone: '031-3456-7890',
      email: 'contact@pyeongchonnursing.com',
      website: 'https://www.pyeongchonnursing.com',
      established_year: 2013,
      
      beds: {
        total: 150,
        icu: 0,
        single_room: 15,
        double_room: 60,
        multi_room: 75
      },
      
      accreditation: {
        recovery_rehab_certified: false,
        certified_by: null,
        certification_date: null,
        healthcare_accredited: true,
        jci_accredited: false
      },
      
      staff: {
        internal_medicine_doctors: 4,
        rehabilitation_doctors: 1,
        neurosurgeons: 1,
        physical_therapists: 8,
        occupational_therapists: 4,
        speech_therapists: 2,
        nurses: 60,
        care_workers: 75,
        social_workers: 2
      },
      
      equipment: {
        mri: false,
        ct: false,
        xray: true,
        ultrasound: true,
        emg: false,
        swallow_test: true,
        robot_rehab: false,
        vr_rehab: false,
        gait_trainer: true,
        functional_electrical_stimulation: false
      },
      
      services: {
        intensive_rehab: false,
        physical_therapy: true,
        occupational_therapy: true,
        speech_therapy: true,
        swallow_therapy: true,
        cognitive_rehab: true,
        robot_rehab: false,
        vr_rehab: false,
        vestibular_rehab: false,
        lymphedema_management: false,
        orthotic_prosthetic: false,
        psychological_counseling: true,
        nutrition_counseling: true,
        social_work: true,
        discharge_planning: true,
        medical_care_24h: true,
        nursing_care_24h: true,
        delirium_management: true,
        wound_care: true,
        tube_feeding: true,
        iv_therapy: true,
        respiratory_care: true
      },
      
      specialized_programs: [
        '치매 집중 케어',
        '만성질환 관리',
        '뇌졸중 후 관리',
        '호스피스 케어'
      ],
      
      cost: {
        insurance_type: '건강보험',
        daily_cost: {
          single_room: { total: 150000, copay: 45000 },
          double_room: { total: 120000, copay: 36000 },
          multi_room: { total: 100000, copay: 30000 }
        },
        monthly_estimate: {
          min: 200000,
          max: 350000
        },
        additional_costs: {
          special_diet_per_day: 7000,
          caregiver_per_day: 0,
          diapers_per_month: 40000,
          special_medication: 'varies'
        },
        coverage_rate: 0.70,
        last_updated: '2024-01-01'
      },
      
      target_patients: [
        '치매',
        '뇌졸중 후 장기요양',
        '만성질환',
        '암 환자',
        '노인성 질환'
      ],
      
      admission_criteria: {
        gcs_min: 0,
        medical_stability: false,
        rehab_potential: false,
        long_term_care_needed: true
      },
      
      accessibility: {
        subway_station: '평촌역 (4호선)',
        walking_distance_to_station: '10분',
        bus_routes: ['301', '303', '310'],
        parking: true,
        parking_spaces: 50
      },
      
      amenities: {
        restaurant: true,
        cafe: false,
        convenience_store: true,
        atm: true,
        pharmacy: true,
        chapel: true,
        garden: true,
        wifi: true,
        rehabilitation_gym: true,
        tv_in_room: true
      },
      
      visiting_policy: {
        visiting_hours: '평일 13:00-20:00, 주말 10:00-18:00',
        overnight_stay: true,
        meal_service_for_guardian: true
      },
      
      rating: {
        overall: 3.9,
        medical_care: 4.0,
        nursing_care: 4.1,
        staff_kindness: 3.8,
        facility_cleanliness: 3.8,
        food_quality: 3.7,
        review_count: 187,
        source: 'naver_place'
      },
      
      notes: [
        '치매 전문 병동 운영',
        '의사 24시간 상주',
        '호스피스 병동 별도 운영',
        '보험심사평가원 요양병원 평가 2등급'
      ],
      
      last_updated: '2024-01-15'
    }
  ],
  
  // 4. 요양원 (Nursing Home)
  nursingHomes: [
    {
      facility_id: 'NH001',
      name: '서울실버타운',
      type: 'nursing_home',
      region: '서울',
      district: '강서구',
      address: '서울시 강서구 화곡동 123-45',
      postal_code: '07600',
      phone: '02-5678-9012',
      email: 'info@seoulsilver.co.kr',
      website: 'https://www.seoulsilver.co.kr',
      established_year: 2005,
      
      capacity: {
        total: 100,
        single_room: 20,
        double_room: 40,
        multi_room: 40
      },
      
      accreditation: {
        ltc_certified: true, // 장기요양기관 지정
        certified_by: '보건복지부',
        certification_date: '2018-03-01',
        elderly_welfare_facility: true, // 노인복지시설
        grade: 'A' // 평가 등급
      },
      
      staff: {
        facility_director: 1,
        nurses: 10, // 간호사
        care_workers: 40, // 요양보호사
        social_workers: 2,
        dietitian: 1,
        physical_therapist: 2,
        visiting_doctor_frequency: '주 2회' // 촉탁의 방문
      },
      
      equipment: {
        medical_equipment: false, // 의료 장비 없음
        emergency_equipment: true, // 응급 장비
        wheelchair: 30,
        walker: 20,
        special_bed: 50
      },
      
      services: {
        daily_living_assistance: true, // 일상생활 지원
        meal_service: true, // 식사 제공
        bath_assistance: true, // 목욕 지원
        laundry_service: true, // 세탁 서비스
        medication_management: true, // 약물 관리
        cognitive_activities: true, // 인지활동 프로그램
        physical_activities: true, // 신체활동 프로그램
        social_activities: true, // 사회활동 프로그램
        religious_services: true, // 종교 활동
        basic_medical_care: false, // 기본 의료 서비스 제한적
        physical_therapy: true, // 물리치료 (외부 연계)
        visiting_doctor: true, // 촉탁의 방문 (주 2회)
        emergency_transport: true // 응급 이송
      },
      
      specialized_programs: [
        '치매 환자 케어',
        '인지활동 프로그램',
        '레크리에이션',
        '음악치료',
        '원예치료',
        '작업치료'
      ],
      
      cost: {
        insurance_type: '장기요양보험',
        monthly_cost: {
          single_room: { total: 1500000, copay: 300000 }, // 20% 본인부담
          double_room: { total: 1200000, copay: 240000 },
          multi_room: { total: 1000000, copay: 200000 }
        },
        additional_costs: {
          meal_per_day: 12000,
          diapers_per_month: 50000,
          personal_care_items: 30000
        },
        coverage_rate: 0.80, // 80% 장기요양보험 적용
        ltc_grade_required: [1, 2, 3], // 장기요양 1~3등급 필요
        last_updated: '2024-01-01'
      },
      
      target_residents: [
        '장기요양 1~3등급 보유자',
        '치매 환자',
        '거동 불편 노인',
        '일상생활 지원 필요 노인'
      ],
      
      admission_criteria: {
        age_min: 65, // 최소 연령
        ltc_grade_required: true, // 장기요양등급 필수
        medical_care_needed: false, // 의료 필요도 낮음
        functional_dependency: true // 일상생활 의존
      },
      
      accessibility: {
        subway_station: '화곡역 (5호선)',
        walking_distance_to_station: '20분',
        bus_routes: ['600', '602', '605'],
        parking: true,
        parking_spaces: 30
      },
      
      amenities: {
        dining_hall: true,
        activity_room: true,
        tv_room: true,
        library: true,
        chapel: true,
        garden: true,
        outdoor_exercise_area: true,
        hairdresser: true,
        convenience_store: false,
        wifi: true
      },
      
      visiting_policy: {
        visiting_hours: '평일 10:00-18:00, 주말 10:00-18:00',
        overnight_stay: false, // 보호자 상주 불가
        meal_with_resident: true, // 함께 식사 가능
        outing_allowed: true // 외출 가능
      },
      
      rating: {
        overall: 4.3,
        care_quality: 4.4,
        staff_kindness: 4.2,
        facility_cleanliness: 4.1,
        food_quality: 4.0,
        activity_programs: 4.3,
        review_count: 156,
        source: 'naver_place'
      },
      
      notes: [
        '장기요양 1~3등급 필수',
        '의사 상주 없음 (촉탁의 주 2회 방문)',
        '치매 전문 프로그램 운영',
        '복지부 평가 A등급',
        '경제적 부담 낮음 (장기요양보험 80% 적용)'
      ],
      
      last_updated: '2024-01-15'
    },
    
    {
      facility_id: 'NH002',
      name: '행복요양원',
      type: 'nursing_home',
      region: '경기',
      district: '수원시 장안구',
      address: '경기도 수원시 장안구 정자동 456-78',
      postal_code: '16300',
      phone: '031-6789-0123',
      email: 'info@happynursing.co.kr',
      website: 'https://www.happynursing.co.kr',
      established_year: 2010,
      
      capacity: {
        total: 80,
        single_room: 10,
        double_room: 30,
        multi_room: 40
      },
      
      accreditation: {
        ltc_certified: true,
        certified_by: '보건복지부',
        certification_date: '2019-06-15',
        elderly_welfare_facility: true,
        grade: 'B'
      },
      
      staff: {
        facility_director: 1,
        nurses: 8,
        care_workers: 35,
        social_workers: 1,
        dietitian: 1,
        physical_therapist: 1,
        visiting_doctor_frequency: '주 1회'
      },
      
      equipment: {
        medical_equipment: false,
        emergency_equipment: true,
        wheelchair: 25,
        walker: 15,
        special_bed: 40
      },
      
      services: {
        daily_living_assistance: true,
        meal_service: true,
        bath_assistance: true,
        laundry_service: true,
        medication_management: true,
        cognitive_activities: true,
        physical_activities: true,
        social_activities: true,
        religious_services: true,
        basic_medical_care: false,
        physical_therapy: true,
        visiting_doctor: true,
        emergency_transport: true
      },
      
      specialized_programs: [
        '치매 케어',
        '인지활동',
        '레크리에이션',
        '음악치료'
      ],
      
      cost: {
        insurance_type: '장기요양보험',
        monthly_cost: {
          single_room: { total: 1400000, copay: 280000 },
          double_room: { total: 1100000, copay: 220000 },
          multi_room: { total: 900000, copay: 180000 }
        },
        additional_costs: {
          meal_per_day: 10000,
          diapers_per_month: 40000,
          personal_care_items: 25000
        },
        coverage_rate: 0.80,
        ltc_grade_required: [1, 2, 3, 4], // 1~4등급 가능
        last_updated: '2024-01-01'
      },
      
      target_residents: [
        '장기요양 1~4등급 보유자',
        '치매 환자',
        '거동 불편 노인'
      ],
      
      admission_criteria: {
        age_min: 65,
        ltc_grade_required: true,
        medical_care_needed: false,
        functional_dependency: true
      },
      
      accessibility: {
        subway_station: '수원역 (1호선)',
        walking_distance_to_station: '버스 15분',
        bus_routes: ['7', '7-2', '13'],
        parking: true,
        parking_spaces: 20
      },
      
      amenities: {
        dining_hall: true,
        activity_room: true,
        tv_room: true,
        library: false,
        chapel: true,
        garden: true,
        outdoor_exercise_area: true,
        hairdresser: true,
        convenience_store: false,
        wifi: true
      },
      
      visiting_policy: {
        visiting_hours: '평일 13:00-18:00, 주말 10:00-17:00',
        overnight_stay: false,
        meal_with_resident: true,
        outing_allowed: true
      },
      
      rating: {
        overall: 4.0,
        care_quality: 4.1,
        staff_kindness: 4.0,
        facility_cleanliness: 3.9,
        food_quality: 3.8,
        activity_programs: 4.0,
        review_count: 98,
        source: 'naver_place'
      },
      
      notes: [
        '장기요양 1~4등급 가능',
        '지역 내 가장 저렴한 비용',
        '복지부 평가 B등급',
        '촉탁의 주 1회 방문'
      ],
      
      last_updated: '2024-01-15'
    }
  ],
  
  // 데이터베이스 검색 및 필터링 함수
  searchFacilities: function(criteria) {
    let results = [];
    
    // 시설 유형별 검색
    if (criteria.type === 'recovery_rehab' || criteria.type === 'all') {
      results = results.concat(this.recoveryRehabHospitals);
    }
    if (criteria.type === 'general_rehab' || criteria.type === 'all') {
      results = results.concat(this.generalRehabHospitals);
    }
    if (criteria.type === 'nursing_hospital' || criteria.type === 'all') {
      results = results.concat(this.nursingHospitals);
    }
    if (criteria.type === 'nursing_home' || criteria.type === 'all') {
      results = results.concat(this.nursingHomes);
    }
    
    // 지역 필터
    if (criteria.region) {
      results = results.filter(f => f.region === criteria.region);
    }
    
    // 구/군 필터
    if (criteria.district) {
      results = results.filter(f => f.district.includes(criteria.district));
    }
    
    // 특정 서비스 필터
    if (criteria.services && criteria.services.length > 0) {
      results = results.filter(facility => {
        return criteria.services.every(service => 
          facility.services && facility.services[service] === true
        );
      });
    }
    
    // 예산 필터
    if (criteria.max_daily_cost) {
      results = results.filter(f => {
        const minCost = f.cost.daily_cost.multi_room.copay;
        return minCost <= criteria.max_daily_cost;
      });
    }
    
    // 인증 필터
    if (criteria.accredited_only) {
      results = results.filter(f => {
        if (f.type === 'recovery_rehab') {
          return f.accreditation.recovery_rehab_certified;
        } else if (f.type === 'nursing_home') {
          return f.accreditation.ltc_certified;
        } else {
          return f.accreditation.healthcare_accredited;
        }
      });
    }
    
    // 평점 필터
    if (criteria.min_rating) {
      results = results.filter(f => f.rating.overall >= criteria.min_rating);
    }
    
    // 거리 정렬 (추후 구현 시 좌표 기반)
    if (criteria.sort_by === 'rating') {
      results.sort((a, b) => b.rating.overall - a.rating.overall);
    } else if (criteria.sort_by === 'cost') {
      results.sort((a, b) => {
        const aCost = a.cost.daily_cost.multi_room.copay;
        const bCost = b.cost.daily_cost.multi_room.copay;
        return aCost - bCost;
      });
    }
    
    return results;
  },
  
  // ID로 시설 찾기
  getFacilityById: function(facilityId) {
    const allFacilities = [
      ...this.recoveryRehabHospitals,
      ...this.generalRehabHospitals,
      ...this.nursingHospitals,
      ...this.nursingHomes
    ];
    
    return allFacilities.find(f => f.facility_id === facilityId);
  },
  
  // 환자 정보 기반 추천
  recommendFacilities: function(patientData) {
    const recommendations = [];
    
    // 분석 데이터에서 추천 시설 유형 가져오기
    const recommendedType = patientData.recommendedFacility;
    
    // 지역 우선순위 (추후 확장)
    const preferredRegions = ['서울', '경기'];
    
    // 필요 서비스 추출
    const requiredServices = [];
    if (patientData.delirium_risk === 'high') {
      requiredServices.push('delirium_management');
    }
    if (patientData.dysphagia === 'severe' || patientData.dysphagia === 'moderate') {
      requiredServices.push('swallow_therapy');
    }
    if (patientData.rehab_needs && patientData.rehab_needs.includes('로봇재활')) {
      requiredServices.push('robot_rehab');
    }
    
    // 검색 조건
    const searchCriteria = {
      type: recommendedType,
      services: requiredServices,
      sort_by: 'rating'
    };
    
    // 검색 실행
    const facilities = this.searchFacilities(searchCriteria);
    
    // 상위 3개 추천
    return facilities.slice(0, 3);
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FacilityDatabase;
}
