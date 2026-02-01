// 하이브리브 - 프론트엔드 애플리케이션

const API_BASE = '/api';
let currentPatient = null; // 현재 등록된 환자 정보

// 대한민국 시/도별 시/군/구 데이터
const districtData = {
  'seoul': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  'busan': ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'],
  'daegu': ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
  'incheon': ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'],
  'gwangju': ['광산구', '남구', '동구', '북구', '서구'],
  'daejeon': ['대덕구', '동구', '서구', '유성구', '중구'],
  'ulsan': ['남구', '동구', '북구', '울주군', '중구'],
  'sejong': ['세종시'],
  'gyeonggi': ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
  'gangwon': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
  'chungbuk': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시', '충주시'],
  'chungnam': ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'],
  'jeonbuk': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'],
  'jeonnam': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
  'gyeongbuk': ['경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시'],
  'gyeongnam': ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'],
  'jeju': ['서귀포시', '제주시']
};

// 시/군/구 업데이트 함수
function updateDistricts() {
  console.log('updateDistricts() 호출됨');
  const citySelect = document.getElementById('locationCity');
  const districtSelect = document.getElementById('locationDistrict');
  
  console.log('citySelect:', citySelect);
  console.log('districtSelect:', districtSelect);
  
  if (!citySelect || !districtSelect) {
    console.error('셀렉트 요소를 찾을 수 없습니다');
    return;
  }
  
  const selectedCity = citySelect.value;
  console.log('선택된 시/도:', selectedCity);
  
  // 기존 옵션 제거
  districtSelect.innerHTML = '<option value="">선택해주세요</option>';
  
  if (selectedCity && districtData[selectedCity]) {
    console.log('시/군/구 데이터:', districtData[selectedCity]);
    districtData[selectedCity].forEach(district => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });
    console.log('시/군/구 옵션 추가 완료:', districtSelect.options.length + '개');
  } else {
    districtSelect.innerHTML = '<option value="">먼저 시/도를 선택해주세요</option>';
    console.log('선택된 시/도가 없거나 데이터를 찾을 수 없습니다');
  }
}

// 전역 함수로 노출
window.updateDistricts = updateDistricts;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initializeQuestCards();
  // 환자 목록 로드는 제거 - 단일 플로우로 변경
});

// 이벤트 리스너 설정
function setupEventListeners() {
  const form = document.getElementById('patientForm');
  if (form) {
    form.addEventListener('submit', handlePatientSubmit);
  }
}

// 진행 단계 업데이트
function updateProgressSteps(currentStep) {
  // 모든 단계 초기화
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step${i}`);
    const circle = stepEl.querySelector('div');
    const text = stepEl.querySelector('span');
    
    if (i < currentStep) {
      // 완료된 단계
      circle.className = 'w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold';
      circle.innerHTML = '<i class="fas fa-check"></i>';
      text.className = 'ml-2 text-sm font-medium text-green-700';
    } else if (i === currentStep) {
      // 현재 단계
      circle.className = 'w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold';
      circle.textContent = i;
      text.className = 'ml-2 text-sm font-medium text-gray-700';
    } else {
      // 미완료 단계
      circle.className = 'w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold';
      circle.textContent = i;
      text.className = 'ml-2 text-sm font-medium text-gray-400';
    }
  }
  
  // 퀘스트 카드 업데이트
  updateQuestCards(currentStep);
}

// 퀘스트 카드 초기화
function initializeQuestCards() {
  const cards = document.querySelectorAll('.quest-card-3d');
  cards.forEach((card, index) => {
    card.addEventListener('click', function() {
      const questNumber = parseInt(this.dataset.quest);
      
      // 첫 번째 퀘스트 - 보호자 5대 혼란 가이드
      if (questNumber === 1) {
        showCaregiverConfusionGuide();
      }
      
      // 두 번째 퀘스트 - 전원 가이드
      else if (questNumber === 2) {
        showTransferGuide();
      }
      
      // 세 번째 퀘스트 - 비용 가이드
      else if (questNumber === 3) {
        showCostGuide();
      }
      
      // 네 번째 퀘스트 - 장소 선택 가이드
      else if (questNumber === 4) {
        showFacilityGuide();
      }
    });
  });
}

// 환자 정보 입력 팝업 표시
function showPatientFormModal() {
  // registerForm의 내용을 가져옴
  const registerForm = document.getElementById('registerForm');
  const formContent = registerForm.querySelector('.section-card').innerHTML;
  
  const modal = createModal(`
    <div class="section-card rounded-lg shadow-lg p-8 border max-h-[80vh] overflow-y-auto">
      ${formContent}
    </div>
  `, 'max-w-5xl');
  
  document.getElementById('modalContainer').appendChild(modal);
  
  // 모달 내부의 폼에 이벤트 리스너 다시 등록
  const modalForm = modal.querySelector('#patientForm');
  if (modalForm) {
    modalForm.addEventListener('submit', handlePatientSubmitInModal);
  }
  
  // ADL 값 업데이트 함수 다시 바인딩
  const adlSlider = modal.querySelector('input[name="adl_score"]');
  if (adlSlider) {
    adlSlider.addEventListener('input', function() {
      const valueSpan = modal.querySelector('#adlValue');
      if (valueSpan) {
        valueSpan.textContent = this.value + '점';
      }
    });
  }
  
  // GCS 셀렉트 다시 바인딩
  const gcsSelects = modal.querySelectorAll('select[name^="gcs_"]');
  gcsSelects.forEach(select => {
    select.addEventListener('change', function() {
      updateGCSTotalInModal(modal);
    });
  });
}

// 모달 내부 GCS 총점 업데이트
function updateGCSTotalInModal(modal) {
  const eye = parseInt(modal.querySelector('select[name="gcs_eye"]')?.value || 4);
  const verbal = parseInt(modal.querySelector('select[name="gcs_verbal"]')?.value || 5);
  const motor = parseInt(modal.querySelector('select[name="gcs_motor"]')?.value || 6);
  
  const total = eye + verbal + motor;
  const totalElement = modal.querySelector('#gcsTotal');
  const levelElement = modal.querySelector('#gcsLevel');
  
  if (totalElement) {
    totalElement.textContent = total + '점';
  }
  
  if (levelElement) {
    let level, color;
    if (total === 15) {
      level = '정상';
      color = 'bg-green-500 text-white';
    } else if (total >= 13) {
      level = '경미한 장애';
      color = 'bg-blue-100 text-blue-800';
    } else if (total >= 9) {
      level = '중등도 장애';
      color = 'bg-yellow-100 text-yellow-800';
    } else {
      level = '중증 장애';
      color = 'bg-red-100 text-red-800';
    }
    
    levelElement.textContent = level;
    levelElement.className = `text-sm px-3 py-1 rounded-full ${color} font-semibold`;
  }
}

// 모달 내부 폼 제출 처리
async function handlePatientSubmitInModal(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  // GCS 점수 계산
  const gcsEye = parseInt(formData.get('gcs_eye') || 4);
  const gcsVerbal = parseInt(formData.get('gcs_verbal') || 5);
  const gcsMotor = parseInt(formData.get('gcs_motor') || 6);
  const gcsTotal = gcsEye + gcsVerbal + gcsMotor;
  
  // GCS 점수를 의식수준 텍스트로 변환
  let consciousnessLevel;
  if (gcsTotal === 15) {
    consciousnessLevel = '명료 (GCS 15)';
  } else if (gcsTotal >= 13) {
    consciousnessLevel = `경미한 의식 장애 (GCS ${gcsTotal})`;
  } else if (gcsTotal >= 9) {
    consciousnessLevel = `중등도 의식 장애 (GCS ${gcsTotal})`;
  } else {
    consciousnessLevel = `중증 의식 장애 (GCS ${gcsTotal})`;
  }
  
  // 재활 치료 항목 수집
  const rehabNeeds = {
    physical: formData.get('rehab_physical') === 'true',
    occupational: formData.get('rehab_occupational') === 'true',
    speech: formData.get('rehab_speech') === 'true',
    swallowing: formData.get('rehab_swallowing') === 'true',
    cognitive: formData.get('rehab_cognitive') === 'true',
    psychological: formData.get('rehab_psychological') === 'true',
    robot: formData.get('rehab_robot') === 'true',
    vr: formData.get('rehab_vr') === 'true',
    vestibular: formData.get('rehab_vestibular') === 'true',
    lymphedema: formData.get('rehab_lymphedema') === 'true',
    prosthesis: formData.get('needs_prosthesis') === 'true',
    wheelchair: formData.get('needs_wheelchair') === 'true'
  };
  
  const data = {
    name: formData.get('name'),
    age: parseInt(formData.get('age')),
    diagnosis: formData.get('diagnosis'),
    diagnosis_date: formData.get('diagnosis_date'),
    consciousness_level: consciousnessLevel,
    insurance_type: formData.get('insurance_type'),
    ltc_grade: formData.get('ltc_grade') ? parseInt(formData.get('ltc_grade')) : null,
    current_hospital: formData.get('current_hospital'),
    delirium_risk: formData.get('delirium_risk') || 'low',
    dysphagia: formData.get('dysphagia') || 'none',
    rehab_needs: rehabNeeds,
    comorbidities: JSON.stringify({
      gcs_eye: gcsEye,
      gcs_verbal: gcsVerbal,
      gcs_motor: gcsMotor,
      gcs_total: gcsTotal
    })
  };
  
  try {
    // 로딩 표시
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>분석 중...';
    
    // 환자 정보를 currentPatient에 바로 저장 (API 호출 없이)
    currentPatient = {
      id: Date.now(), // 임시 ID
      ...data,
      gcs_total: gcsTotal
    };
    
    // 분석 결과 생성
    const analysis = analyzePatientData(currentPatient);
    
    // 모달 닫기
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
    
    // 분석 결과 표시 (progressSteps는 숨김 상태 유지)
    showAnalysisResult(analysis);
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  } catch (error) {
    console.error('Failed to analyze patient:', error);
    showError('환자 정보 분석에 실패했습니다. 다시 시도해주세요.');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>분석 시작하기';
  }
}

// 환자 데이터 분석 함수 (고급 의료 지식 데이터베이스 활용)
function analyzePatientData(patient) {
  console.log('🔍 환자 데이터 분석 시작:', patient);
  
  const KB = window.MedicalKnowledgeBase || {};
  const { gcs_total, diagnosis, age, delirium_risk, dysphagia, rehab_needs, ltc_grade, diagnosis_date } = patient;
  
  // 1. 진단명 분석 및 질병 데이터 가져오기
  let diagnosisData = null;
  let diagnosisKey = null;
  
  for (const [key, data] of Object.entries(KB.diagnoses || {})) {
    if (diagnosis && diagnosis.includes(key)) {
      diagnosisData = data;
      diagnosisKey = key;
      break;
    }
  }
  
  console.log('📋 진단 데이터:', diagnosisKey, diagnosisData);
  
  // 2. GCS 레벨 분석
  let gcsLevelData = null;
  if (gcs_total === 15) {
    gcsLevelData = KB.gcsLevels?.[15];
  } else if (gcs_total >= 13) {
    gcsLevelData = KB.gcsLevels?.['13-14'];
  } else if (gcs_total >= 9) {
    gcsLevelData = KB.gcsLevels?.['9-12'];
  } else {
    gcsLevelData = KB.gcsLevels?.['3-8'];
  }
  
  console.log('🧠 GCS 레벨:', gcsLevelData);
  
  // 3. 재활 필요도 분석
  const rehabScore = calculateRehabScore(rehab_needs);
  const needsIntensiveRehab = rehabScore >= 3 || rehab_needs.robot || rehab_needs.vr;
  const needsSpecializedRehab = rehab_needs.swallowing || rehab_needs.cognitive || rehab_needs.speech;
  
  console.log('♿ 재활 점수:', rehabScore, '고강도 필요:', needsIntensiveRehab);
  
  // 4. 발병일로부터 경과 시간 계산
  let daysSinceOnset = null;
  if (diagnosis_date) {
    const onsetDate = new Date(diagnosis_date);
    const today = new Date();
    daysSinceOnset = Math.floor((today - onsetDate) / (1000 * 60 * 60 * 24));
  }
  
  const withinGoldenTime = diagnosisData?.goldenTime && daysSinceOnset <= diagnosisData.goldenTime;
  
  console.log('⏰ 경과 일수:', daysSinceOnset, '골든타임 내:', withinGoldenTime);
  
  // 5. 의료적 필요도 평가
  const medicalNeedsScore = calculateMedicalNeedsScore({
    gcs_total,
    delirium_risk,
    dysphagia,
    diagnosisCategory: diagnosisData?.category
  });
  
  console.log('🏥 의료 필요도:', medicalNeedsScore);
  
  // 6. 종합 평가 및 시설 추천
  const recommendation = determineOptimalFacility({
    diagnosisData,
    gcsLevelData,
    rehabScore,
    needsIntensiveRehab,
    needsSpecializedRehab,
    medicalNeedsScore,
    withinGoldenTime,
    ltc_grade,
    age,
    delirium_risk,
    dysphagia
  });
  
  console.log('✅ 최종 추천:', recommendation);
  
  // 7. 체크리스트 생성
  const checklist = generateChecklist(diagnosisData, gcsLevelData, recommendation);
  
  // 8. 전원 경로 생성
  const pathway = generateTransferPathway(diagnosisData, recommendation);
  
  // 9. 상세 분석 리포트 생성
  const detailedAnalysis = generateDetailedAnalysis({
    patient,
    diagnosisData,
    gcsLevelData,
    recommendation,
    rehabScore,
    medicalNeedsScore,
    withinGoldenTime,
    daysSinceOnset
  });
  
  // 10. 재활 치료 목록
  const rehabList = [];
  if (rehab_needs.physical) rehabList.push({ name: '💪 물리치료', priority: 'high' });
  if (rehab_needs.occupational) rehabList.push({ name: '🖐️ 작업치료', priority: 'high' });
  if (rehab_needs.speech) rehabList.push({ name: '🗣️ 언어치료', priority: 'high' });
  if (rehab_needs.swallowing) rehabList.push({ name: '🍽️ 연하치료', priority: 'critical' });
  if (rehab_needs.cognitive) rehabList.push({ name: '🧠 인지재활', priority: 'moderate' });
  if (rehab_needs.psychological) rehabList.push({ name: '💭 심리상담', priority: 'moderate' });
  if (rehab_needs.robot) rehabList.push({ name: '🤖 로봇재활', priority: 'high' });
  if (rehab_needs.vr) rehabList.push({ name: '🥽 VR재활', priority: 'moderate' });
  if (rehab_needs.vestibular) rehabList.push({ name: '🌀 전정재활', priority: 'moderate' });
  if (rehab_needs.lymphedema) rehabList.push({ name: '💧 림프부종관리', priority: 'moderate' });
  if (rehab_needs.prosthesis) rehabList.push({ name: '🦿 의지·보조기', priority: 'high' });
  if (rehab_needs.wheelchair) rehabList.push({ name: '♿ 휠체어·보행보조기', priority: 'moderate' });
  
  return {
    recommendedFacility: recommendation.facility,
    facilityData: recommendation.facilityData,
    reasons: recommendation.reasons,
    estimatedCost: recommendation.costs,
    urgency: recommendation.urgency,
    rehabList,
    checklist,
    pathway,
    detailedAnalysis,
    gcsLevel: gcs_total >= 13 ? '양호' : gcs_total >= 9 ? '주의' : '중증',
    patientSummary: {
      name: patient.name,
      age: patient.age,
      diagnosis: patient.diagnosis,
      gcs: gcs_total,
      deliriumRisk: delirium_risk,
      dysphagia: dysphagia,
      daysSinceOnset
    }
  };
}

// 재활 필요도 점수 계산
function calculateRehabScore(rehab_needs) {
  let score = 0;
  if (rehab_needs.physical) score += 1;
  if (rehab_needs.occupational) score += 1;
  if (rehab_needs.speech) score += 1;
  if (rehab_needs.swallowing) score += 2; // 연하는 더 중요
  if (rehab_needs.cognitive) score += 1;
  if (rehab_needs.psychological) score += 0.5;
  if (rehab_needs.robot) score += 2; // 로봇은 고강도
  if (rehab_needs.vr) score += 1.5;
  if (rehab_needs.vestibular) score += 1;
  if (rehab_needs.lymphedema) score += 1;
  return score;
}

// 의료 필요도 점수 계산
function calculateMedicalNeedsScore(params) {
  const { gcs_total, delirium_risk, dysphagia, diagnosisCategory } = params;
  let score = 0;
  
  // GCS 기반
  if (gcs_total < 9) score += 5;
  else if (gcs_total < 13) score += 3;
  else if (gcs_total < 15) score += 1;
  
  // 섬망 위험
  if (delirium_risk === 'high') score += 3;
  else if (delirium_risk === 'moderate') score += 2;
  else if (delirium_risk === 'low') score += 0;
  
  // 연하장애
  if (dysphagia === 'severe') score += 4;
  else if (dysphagia === 'moderate') score += 2;
  
  // 진단 카테고리
  const highMedicalCategories = ['acute_stroke', 'cardiac', 'respiratory', 'cancer'];
  if (highMedicalCategories.includes(diagnosisCategory)) score += 2;
  
  return score;
}

// 최적 시설 결정
function determineOptimalFacility(params) {
  const KB = window.MedicalKnowledgeBase || {};
  const {
    diagnosisData,
    gcsLevelData,
    rehabScore,
    needsIntensiveRehab,
    needsSpecializedRehab,
    medicalNeedsScore,
    withinGoldenTime,
    ltc_grade,
    age,
    delirium_risk,
    dysphagia
  } = params;
  
  let facilityType = 'nursing_hospital'; // 기본값
  let reasons = [];
  let urgency = 'normal';
  
  // 우선순위 1: 회복기 재활병원
  if (diagnosisData?.category === 'acute_stroke' && withinGoldenTime && rehabScore >= 3) {
    if (gcsLevelData?.level === 'moderate' || (gcsLevelData?.level === 'mild' && needsIntensiveRehab)) {
      facilityType = 'recovery_rehab';
      urgency = 'high';
      reasons = [
        `${diagnosisData.preferredFacility === 'recovery_rehab' ? '급성기 질환으로 골든타임 내 집중 재활이 필수입니다' : '재활 치료가 필요합니다'}`,
        `발병 후 ${params.withinGoldenTime ? '골든타임' : ''}으로 기능 회복 가능성이 높습니다`,
        `GCS ${params.gcs_total || '평가됨'}으로 재활병원 입원이 가능한 상태입니다`,
        needsIntensiveRehab ? '로봇·VR 등 고강도 재활 장비가 필요합니다' : '',
        needsSpecializedRehab ? '전문 재활 치료사의 집중 케어가 필요합니다' : ''
      ].filter(r => r);
    }
  }
  
  // 우선순위 2: 척수손상
  if (diagnosisData?.category === 'spinal_injury' && withinGoldenTime) {
    facilityType = 'recovery_rehab';
    urgency = 'critical';
    reasons = [
      '척수손상은 골든타임 내 집중 재활이 필수적입니다',
      '배뇨·배변 관리, 욕창 예방 등 전문 케어가 필요합니다',
      '보행 로봇, 전동 휠체어 훈련이 가능한 시설이 필요합니다'
    ];
  }
  
  // 우선순위 3: 일반 재활병원
  if (facilityType === 'nursing_hospital' && rehabScore >= 2 && medicalNeedsScore < 5) {
    if (diagnosisData?.category === 'orthopedic' || (rehabScore >= 2 && !withinGoldenTime)) {
      facilityType = 'general_rehab';
      urgency = 'normal';
      reasons = [
        '물리·작업·언어 치료를 통한 기능 회복이 가능합니다',
        'GCS 점수가 안정적이어서 일반 재활병원 입원이 적합합니다',
        '집중적인 재활 프로그램이 필요합니다'
      ];
    }
  }
  
  // 우선순위 4: 요양병원
  if (facilityType === 'nursing_hospital') {
    reasons = ['의료적 관리와 간호가 지속적으로 필요합니다'];
    
    if (medicalNeedsScore >= 5) {
      reasons.push('의식 수준이나 전신 상태로 인해 의사 상주가 필요합니다');
    }
    if (delirium_risk === 'high') {
      reasons.push('섬망 위험이 높아 24시간 관찰과 전문 관리가 필요합니다');
    }
    if (dysphagia === 'severe' || dysphagia === 'moderate') {
      reasons.push('연하장애로 인한 흡인성 폐렴 예방이 필요합니다');
    }
    if (diagnosisData?.category === 'cardiac' || diagnosisData?.category === 'respiratory') {
      reasons.push('심폐 기능 모니터링과 응급 대응이 가능한 의료 환경이 필요합니다');
    }
    if (diagnosisData?.category === 'cancer') {
      reasons.push('항암 치료 연계 및 통증 관리가 필요합니다');
    }
    if (reasons.length === 1) {
      reasons.push('장기적인 치료와 돌봄이 가능한 환경이 적합합니다');
      reasons.push('재활 치료와 의료 서비스를 함께 받을 수 있습니다');
    }
  }
  
  // 우선순위 5: 요양원
  if (ltc_grade && parseInt(ltc_grade) <= 3 && medicalNeedsScore < 3) {
    if (diagnosisData?.category === 'dementia' || age >= 80) {
      facilityType = 'nursing_home';
      urgency = 'low';
      reasons = [
        `장기요양등급 ${ltc_grade}급으로 요양원 입소가 가능합니다`,
        '일상생활 지원과 돌봄이 주된 필요사항입니다',
        '장기요양보험 적용으로 본인 부담금이 20%로 경제적입니다',
        '의료적 치료보다는 편안한 생활 환경이 중요합니다'
      ];
    }
  }
  
  // 시설 데이터 가져오기
  const facilityData = KB.facilities?.[facilityType] || {};
  
  // 비용 계산
  const costs = facilityData.costs || { daily: { min: 100000, max: 150000 }, monthly: { min: 200000, max: 400000 } };
  
  return {
    facility: facilityData.name || '요양병원',
    facilityType,
    facilityData,
    reasons,
    urgency,
    costs
  };
}

// 체크리스트 생성
function generateChecklist(diagnosisData, gcsLevelData, recommendation) {
  const KB = window.MedicalKnowledgeBase || {};
  const category = diagnosisData?.category || 'general';
  
  // 질병별 체크리스트
  const diseaseChecklist = KB.checklistsByCondition?.[category] || [];
  
  // 시설별 체크리스트
  const facilityChecklist = [
    { item: '병원 방문 및 상담', importance: 'high', detail: '2-3곳 직접 방문 권장' },
    { item: '재활 치료 프로그램 확인', importance: 'high', detail: '하루 몇 회, 몇 시간 진행되는지' },
    { item: '의료진 구성 확인', importance: 'moderate', detail: '전문의, 치료사 수' },
    { item: '병실 환경 확인', importance: 'moderate', detail: '1인실/2인실/다인실 비용' },
    { item: '식사 및 영양 관리', importance: 'moderate', detail: '특수 식이 가능 여부' },
    { item: '면회 시간 및 외출 규정', importance: 'low', detail: '가족 면회 자유도' }
  ];
  
  return [...diseaseChecklist, ...facilityChecklist];
}

// 전원 경로 생성
function generateTransferPathway(diagnosisData, recommendation) {
  const KB = window.MedicalKnowledgeBase || {};
  
  // 진단 기반 경로 템플릿
  let pathwayTemplate = null;
  if (diagnosisData?.category === 'acute_stroke') {
    pathwayTemplate = KB.pathwayTemplates?.acute_stroke_optimal;
  } else if (diagnosisData?.category === 'dementia') {
    pathwayTemplate = KB.pathwayTemplates?.dementia_care;
  } else {
    pathwayTemplate = KB.pathwayTemplates?.chronic_care;
  }
  
  return pathwayTemplate || {
    name: '표준 케어 경로',
    stages: [
      { facility: recommendation.facility, duration: '3-6개월', goal: '안정화 및 재활' }
    ]
  };
}

// 상세 분석 리포트 생성
function generateDetailedAnalysis(params) {
  const { patient, diagnosisData, gcsLevelData, recommendation, rehabScore, medicalNeedsScore, withinGoldenTime, daysSinceOnset } = params;
  
  return {
    healthStatus: {
      consciousness: gcsLevelData?.description || '평가 필요',
      riskLevel: gcsLevelData?.riskLevel || 'moderate',
      medicalNeeds: medicalNeedsScore >= 5 ? '높음' : medicalNeedsScore >= 3 ? '보통' : '낮음'
    },
    rehabPotential: {
      score: rehabScore,
      level: rehabScore >= 5 ? '고강도 재활 필요' : rehabScore >= 3 ? '중등도 재활 필요' : '기본 재활 필요',
      goldenTime: withinGoldenTime ? '골든타임 내' : daysSinceOnset ? `발병 후 ${daysSinceOnset}일 경과` : '정보 없음'
    },
    recommendations: {
      primary: recommendation.facility,
      alternative: recommendation.facilityType === 'recovery_rehab' ? '요양병원' : 
                    recommendation.facilityType === 'nursing_hospital' ? '요양원' : '재활병원',
      urgency: recommendation.urgency
    }
  };
}

// 분석 결과 표시 함수
function showAnalysisResult(analysis) {
  const { recommendedFacility, reasons, estimatedCost, urgency, rehabList, gcsLevel, patientSummary } = analysis;
  
  // 긴급도에 따른 색상
  let urgencyColor = 'blue';
  let urgencyText = '일반';
  if (urgency === 'high') {
    urgencyColor = 'red';
    urgencyText = '긴급';
  } else if (urgency === 'normal') {
    urgencyColor = 'orange';
    urgencyText = '보통';
  }
  
  // 시설 타입에 따른 아이콘
  let facilityIcon = '🏥';
  if (recommendedFacility.includes('재활병원')) facilityIcon = '♿';
  if (recommendedFacility.includes('요양병원')) facilityIcon = '🏨';
  if (recommendedFacility.includes('요양원')) facilityIcon = '🏡';
  
  const resultHTML = `
    <div class="modal-backdrop fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div class="modal-content-3d bg-gradient-to-br from-white to-gray-50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-4 border-white/50 shadow-2xl">
        <div class="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-lg border-b-4 border-white/30 px-6 py-4 flex justify-between items-center shadow-lg">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <span class="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <i class="fas fa-chart-line"></i>
            </span>
            맞춤 전원 경로 분석 결과
          </h2>
          <button onclick="this.closest('.modal-backdrop').remove()" class="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all hover:rotate-90 hover:scale-110">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
          
          <!-- 환자 정보 요약 -->
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 border-2 border-blue-200">
            <h3 class="text-lg font-bold text-blue-800 mb-3 flex items-center">
              <i class="fas fa-user-circle mr-2"></i>
              ${patientSummary.name}님의 현재 상태
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div class="bg-white rounded-lg p-3 text-center">
                <div class="text-gray-600 text-xs mb-1">나이</div>
                <div class="font-bold text-blue-700">${patientSummary.age}세</div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center">
                <div class="text-gray-600 text-xs mb-1">진단명</div>
                <div class="font-bold text-blue-700">${patientSummary.diagnosis}</div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center">
                <div class="text-gray-600 text-xs mb-1">의식 수준</div>
                <div class="font-bold text-${gcsLevel === '양호' ? 'green' : gcsLevel === '주의' ? 'orange' : 'red'}-700">
                  GCS ${patientSummary.gcs}점 (${gcsLevel})
                </div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center">
                <div class="text-gray-600 text-xs mb-1">섬망 위험</div>
                <div class="font-bold text-${patientSummary.deliriumRisk === 'high' ? 'red' : patientSummary.deliriumRisk === 'moderate' ? 'orange' : 'green'}-700">
                  ${patientSummary.deliriumRisk === 'high' ? '🔴 고위험' : patientSummary.deliriumRisk === 'moderate' ? '🟡 중위험' : '🟢 저위험'}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 추천 시설 -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-green-800 flex items-center">
                <i class="fas fa-hospital-alt mr-2"></i>
                추천 전원 경로
              </h3>
              <span class="bg-${urgencyColor}-100 text-${urgencyColor}-700 px-4 py-2 rounded-full text-sm font-bold">
                ${urgencyText} 우선도
              </span>
            </div>
            <div class="bg-white rounded-lg p-6 border-2 border-green-400 shadow-md">
              <div class="text-center mb-4">
                <div class="text-6xl mb-3">${facilityIcon}</div>
                <h4 class="text-2xl font-bold text-green-700 mb-2">${recommendedFacility}</h4>
                <p class="text-gray-600">환자분께 가장 적합한 시설입니다</p>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <h5 class="font-bold text-green-800 mb-2 flex items-center">
                  <i class="fas fa-lightbulb mr-2"></i>
                  왜 이 시설을 추천하나요?
                </h5>
                <ul class="space-y-2">
                  ${reasons.map(reason => `
                    <li class="text-sm text-gray-700 flex items-start">
                      <i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                      <span>${reason}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>
          
          <!-- 예상 비용 -->
          <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-5 border-2 border-orange-200">
            <h3 class="text-lg font-bold text-orange-800 mb-3 flex items-center">
              <i class="fas fa-piggy-bank mr-2"></i>
              예상 비용 (2인실 기준)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white rounded-lg p-4 border-2 border-orange-300">
                <div class="text-sm text-gray-600 mb-1">하루 비용</div>
                <div class="text-2xl font-bold text-orange-700">
                  ${(estimatedCost.min / 10000).toFixed(0)}~${(estimatedCost.max / 10000).toFixed(0)}만원
                </div>
              </div>
              <div class="bg-white rounded-lg p-4 border-2 border-orange-300">
                <div class="text-sm text-gray-600 mb-1">월 본인부담금 (보험 적용 후)</div>
                <div class="text-2xl font-bold text-orange-700">
                  ${(estimatedCost.monthly.min / 10000).toFixed(0)}~${(estimatedCost.monthly.max / 10000).toFixed(0)}만원
                </div>
              </div>
            </div>
            <p class="text-xs text-gray-600 mt-3 bg-yellow-50 rounded px-3 py-2">
              <i class="fas fa-info-circle mr-1"></i>
              실제 비용은 병원, 지역, 환자 상태에 따라 달라질 수 있습니다
            </p>
          </div>
          
          <!-- 필요한 재활 치료 -->
          ${rehabList.length > 0 ? `
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border-2 border-purple-200">
            <h3 class="text-lg font-bold text-purple-800 mb-3 flex items-center">
              <i class="fas fa-heartbeat mr-2"></i>
              필요한 재활 치료 (${rehabList.length}개)
            </h3>
            <div class="flex flex-wrap gap-2">
              ${rehabList.map(rehab => `
                <span class="bg-white px-3 py-2 rounded-lg text-sm font-semibold text-purple-700 border-2 border-purple-200">
                  ${rehab}
                </span>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          <!-- 추천 병원 목록 -->
          <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border-2 border-green-300">
            <h3 class="text-lg font-bold text-green-800 mb-4 flex items-center">
              <i class="fas fa-hospital-alt mr-2"></i>
              맞춤 추천 병원 (Top 3)
            </h3>
            <div id="recommendedFacilities" class="space-y-3">
              <p class="text-gray-600 text-center py-4">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                추천 병원을 검색하고 있습니다...
              </p>
            </div>
          </div>
          
          <!-- 홈으로 돌아가기 버튼 -->
          <div class="mt-6 text-center">
            <button onclick="goBackToHome()" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg shadow-xl transition transform hover:scale-105">
              <i class="fas fa-home mr-2"></i>
              홈으로 돌아가기
            </button>
          </div>
          
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', resultHTML);
  
  // 추천 병원 로딩
  setTimeout(() => {
    loadRecommendedFacilities(analysis);
  }, 500);
}

// 추천 병원 로딩 함수
function loadRecommendedFacilities(analysis) {
  const facilityContainer = document.getElementById('recommendedFacilities');
  
  if (!facilityContainer) return;
  
  // FacilityDatabase가 로드되었는지 확인
  if (typeof FacilityDatabase === 'undefined') {
    facilityContainer.innerHTML = `
      <p class="text-red-600 text-center py-4">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        병원 데이터베이스를 불러올 수 없습니다
      </p>
    `;
    return;
  }
  
  // 환자 데이터 준비
  const patientData = {
    recommendedFacility: analysis.recommendedFacility,
    delirium_risk: analysis.patientSummary.delirium_risk,
    dysphagia: analysis.patientSummary.dysphagia,
    rehab_needs: analysis.rehabList,
    gcs_total: analysis.patientSummary.gcs_total
  };
  
  // 추천 병원 검색
  const recommendedFacilities = FacilityDatabase.recommendFacilities(patientData);
  
  if (recommendedFacilities.length === 0) {
    facilityContainer.innerHTML = `
      <p class="text-gray-600 text-center py-4">
        <i class="fas fa-info-circle mr-2"></i>
        조건에 맞는 병원을 찾지 못했습니다. 검색 조건을 조정해주세요.
      </p>
    `;
    return;
  }
  
  // 추천 병원 표시
  facilityContainer.innerHTML = recommendedFacilities.map((facility, index) => `
    <div class="bg-white rounded-lg p-4 border-2 ${index === 0 ? 'border-green-400 shadow-lg' : 'border-gray-200'} hover:shadow-xl transition">
      ${index === 0 ? '<div class="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mb-2"><i class="fas fa-crown mr-1"></i>추천 1순위</div>' : ''}
      
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h4 class="font-bold text-lg text-gray-900 mb-1">
            ${index + 1}. ${facility.name}
          </h4>
          <p class="text-sm text-gray-600">
            <i class="fas fa-map-marker-alt mr-1 text-red-500"></i>
            ${facility.address}
          </p>
        </div>
        <div class="text-right ml-3">
          <div class="text-yellow-500 font-bold">
            <i class="fas fa-star"></i> ${facility.rating.overall}
          </div>
          <div class="text-xs text-gray-500">
            (${facility.rating.review_count}명)
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div class="text-sm">
          <span class="text-gray-600">유형:</span>
          <span class="font-semibold ml-1">
            ${facility.type === 'recovery_rehab' ? '회복기 재활병원' : 
              facility.type === 'general_rehab' ? '일반 재활병원' :
              facility.type === 'nursing_hospital' ? '요양병원' : '요양원'}
          </span>
        </div>
        <div class="text-sm">
          <span class="text-gray-600">병상:</span>
          <span class="font-semibold ml-1">
            ${facility.beds ? facility.beds.total : facility.capacity.total}개
          </span>
        </div>
      </div>
      
      <div class="bg-blue-50 rounded p-3 mb-3">
        <div class="text-sm font-semibold text-gray-700 mb-1">💰 예상 비용 (2인실 기준)</div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-600">1일 본인부담</span>
          <span class="font-bold text-blue-700">
            ${facility.cost.daily_cost.double_room.copay.toLocaleString()}원
          </span>
        </div>
        <div class="flex justify-between items-center mt-1">
          <span class="text-xs text-gray-600">월 예상 본인부담</span>
          <span class="font-bold text-blue-700">
            ${facility.cost.monthly_estimate.min.toLocaleString()}~${facility.cost.monthly_estimate.max.toLocaleString()}원
          </span>
        </div>
      </div>
      
      ${facility.specialized_programs ? `
      <div class="mb-3">
        <div class="text-xs font-semibold text-gray-700 mb-1">🎯 특화 프로그램</div>
        <div class="flex flex-wrap gap-1">
          ${facility.specialized_programs.slice(0, 3).map(program => `
            <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">${program}</span>
          `).join('')}
          ${facility.specialized_programs.length > 3 ? `<span class="text-xs text-gray-500">외 ${facility.specialized_programs.length - 3}개</span>` : ''}
        </div>
      </div>
      ` : ''}
      
      <div class="flex gap-2 mt-3">
        <a href="tel:${facility.phone}" class="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-3 rounded text-center transition">
          <i class="fas fa-phone mr-1"></i>
          전화하기
        </a>
        ${facility.website ? `
        <a href="${facility.website}" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded text-center transition">
          <i class="fas fa-external-link-alt mr-1"></i>
          홈페이지
        </a>
        ` : ''}
      </div>
      
      ${facility.notes && facility.notes.length > 0 ? `
      <div class="mt-3 pt-3 border-t border-gray-200">
        <div class="text-xs text-gray-600">
          <i class="fas fa-info-circle mr-1"></i>
          ${facility.notes[0]}
        </div>
      </div>
      ` : ''}
    </div>
  `).join('');
}

// 홈으로 돌아가기 함수
function goBackToHome() {
  // 분석 결과 모달 닫기
  const modal = document.querySelector('.modal-backdrop');
  if (modal) {
    modal.remove();
  }
  
  // 환영 메시지 표시
  const welcomeMsg = document.getElementById('welcomeMessage');
  if (welcomeMsg) {
    welcomeMsg.style.display = 'block';
  }
  
  // 진행 단계 숨기기
  const progressSteps = document.getElementById('progressSteps');
  if (progressSteps) {
    progressSteps.classList.add('hidden');
  }
  
  // 페이지 상단으로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // 환자 정보 초기화 (선택사항)
  currentPatient = null;
}

// 전원 가이드 표시
function showTransferGuide() {
  const modal = createModal(`
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          <i class="fas fa-map-signs text-blue-600 mr-2"></i>
          전원, 어디로 가야 할까요?
        </h2>
        <p class="text-lg text-gray-700">
          똑순이가 쉽게 알려드릴게요! 천천히 읽어보세요 😊
        </p>
      </div>

      <!-- 주요 기관 종류 -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
          병원과 요양시설, 어떻게 다를까요?
        </h3>
        
        <div class="space-y-4">
          <!-- 회복기 재활병원 -->
          <div class="bg-white rounded-lg p-4 border-2 border-green-400 shadow-md">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🏥</span>
              <h4 class="text-lg font-bold text-green-700">회복기 재활병원</h4>
              <span class="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">2-4주</span>
            </div>
            <p class="text-gray-700 mb-2 font-semibold">급성·중증 환자의 집중 재활! (뇌졸중, 척수손상 등)</p>
            <div class="flex flex-wrap gap-2 text-xs mb-2">
              <span class="bg-green-50 text-green-700 px-2 py-1 rounded">💪 하루 2시간+ 고강도 재활</span>
              <span class="bg-green-50 text-green-700 px-2 py-1 rounded">🤖 로봇·VR 보조</span>
              <span class="bg-green-50 text-green-700 px-2 py-1 rounded">👨‍⚕️ 의사 상주</span>
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">건강보험 + 재활특례</span>
            </div>
            <p class="text-xs text-gray-600">💰 하루 15~20만원 (2인실) / 월 30~50만원 본인부담</p>
          </div>

          <!-- 일반 재활병원 -->
          <div class="bg-white rounded-lg p-4 border-2 border-teal-300">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🏥</span>
              <h4 class="text-lg font-bold text-teal-700">일반 재활병원</h4>
              <span class="ml-auto bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">단기·외래</span>
            </div>
            <p class="text-gray-700 mb-2">중·경증 환자의 재활 (골절, 수술 후 회복 등)</p>
            <div class="flex flex-wrap gap-2 text-xs mb-2">
              <span class="bg-teal-50 text-teal-700 px-2 py-1 rounded">💪 물리·작업·언어치료</span>
              <span class="bg-teal-50 text-teal-700 px-2 py-1 rounded">🚶 외래 위주</span>
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">건강보험 적용</span>
            </div>
            <p class="text-xs text-gray-600">💰 하루 12~15만원 (2인실)</p>
          </div>

          <!-- 요양병원 -->
          <div class="bg-white rounded-lg p-4 border-2 border-blue-400 shadow-md">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🏨</span>
              <h4 class="text-lg font-bold text-blue-700">요양병원 (의료기관)</h4>
              <span class="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">1-6개월</span>
            </div>
            <p class="text-gray-700 mb-2 font-semibold">의료·재활·간호가 모두 필요한 환자</p>
            <div class="flex flex-wrap gap-2 text-xs mb-2">
              <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded">💊 의사 상주</span>
              <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded">👩‍⚕️ 24시간 간호</span>
              <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded">💪 물리·작업치료</span>
              <span class="bg-orange-100 text-orange-700 px-2 py-1 rounded">장기요양보험</span>
            </div>
            <p class="text-xs text-gray-600">💰 하루 10~15만원 (2인실) / 월 20~40만원 본인부담</p>
          </div>

          <!-- 요양원 -->
          <div class="bg-white rounded-lg p-4 border-2 border-purple-300">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🏡</span>
              <h4 class="text-lg font-bold text-purple-700">요양원 (거주시설)</h4>
              <span class="ml-auto bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">6개월+</span>
            </div>
            <p class="text-gray-700 mb-2">일상생활 보조가 주목적 (치매, 노인 장기 돌봄)</p>
            <div class="flex flex-wrap gap-2 text-xs mb-2">
              <span class="bg-purple-50 text-purple-700 px-2 py-1 rounded">🛏️ 생활 지원</span>
              <span class="bg-purple-50 text-purple-700 px-2 py-1 rounded">🍽️ 식사·돌봄</span>
              <span class="bg-purple-50 text-purple-700 px-2 py-1 rounded">🚿 목욕 지원</span>
              <span class="bg-red-100 text-red-700 px-2 py-1 rounded">장기요양등급 필수</span>
            </div>
            <p class="text-xs text-gray-600">💰 하루 8~12만원 (2인실) / 월 20~40만원 본인부담</p>
            <p class="text-xs text-orange-600 mt-1">⚠️ 의사 상주 안 함 (외부 병원 연계)</p>
          </div>

          <!-- 재활센터 -->
          <div class="bg-white rounded-lg p-4 border-2 border-yellow-300">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🏃</span>
              <h4 class="text-lg font-bold text-yellow-700">재활센터 (통원)</h4>
              <span class="ml-auto bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">주 1-5회</span>
            </div>
            <p class="text-gray-700 mb-2">집에서 생활하며 정기적으로 치료받는 곳</p>
            <div class="flex flex-wrap gap-2 text-xs mb-2">
              <span class="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">🏠 재가</span>
              <span class="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">🚶 통원 치료</span>
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">건강보험 적용</span>
            </div>
          </div>
        </div>

        <!-- 요양병원 vs 요양원 차이 -->
        <div class="bg-red-50 border-2 border-red-300 rounded-lg p-5 mt-4">
          <h3 class="text-lg font-bold text-red-800 mb-3 flex items-center">
            <i class="fas fa-exclamation-triangle text-red-600 mr-2 text-xl"></i>
            요양병원 ≠ 요양원! 완전히 다른 곳이에요!
          </h3>
          <div class="space-y-2 text-sm">
            <p class="flex items-start">
              <span class="text-blue-600 mr-2 font-bold">🏨</span>
              <span><strong>요양병원</strong>: 의료기관 → 의사·간호사 상주, 의료·재활 제공</span>
            </p>
            <p class="flex items-start">
              <span class="text-purple-600 mr-2 font-bold">🏡</span>
              <span><strong>요양원</strong>: 생활시설 → 일상 돌봄 중심, 의료는 외부 병원</span>
            </p>
            <p class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>요양병원은 <strong class="text-blue-600">의료·재활</strong>이 필요할 때!</span>
            </p>
            <p class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span>요양원은 <strong class="text-purple-600">생활 보조</strong>가 필요할 때!</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 상황별 추천 -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
        <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">
          <span class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
          우리 환자분은 어디로 가면 좋을까요?
        </h3>
        
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-l-4 border-red-500">
            <p class="font-bold text-gray-800 mb-1">🔴 혼자서 거의 못 하심 (중증)</p>
            <p class="text-gray-700 text-sm">→ <strong>재활병원</strong>에서 집중 치료가 필요해요</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 border-l-4 border-orange-500">
            <p class="font-bold text-gray-800 mb-1">🟠 부분적으로 도움 필요 (중등도)</p>
            <p class="text-gray-700 text-sm">→ <strong>재활병원 → 요양병원</strong> 순서로 가시면 좋아요</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
            <p class="font-bold text-gray-800 mb-1">🟡 일부 도움 필요 (경증)</p>
            <p class="text-gray-700 text-sm">→ <strong>요양병원</strong>이나 <strong>요양원</strong>을 선택하시면 돼요</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <p class="font-bold text-gray-800 mb-1">🟢 대부분 혼자 가능</p>
            <p class="text-gray-700 text-sm">→ <strong>재활센터</strong>에 통원하거나 집에서 요양하세요</p>
          </div>
        </div>
      </div>

      <!-- 핵심 차이점 -->
      <div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-5">
        <h3 class="text-lg font-bold text-yellow-800 mb-3 flex items-center">
          <i class="fas fa-lightbulb text-yellow-600 mr-2 text-xl"></i>
          꼭 기억하세요!
        </h3>
        <div class="space-y-2 text-sm">
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>회복기 재활병원</strong>은 급성·중증 → 집중 재활 (재활특례 가능)</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>일반 재활병원</strong>은 중·경증 → 외래·단기 입원</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>요양병원</strong>은 의료기관 → 의사 상주, 의료·재활 제공</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>요양원</strong>은 생활시설 → 돌봄 중심, 장기요양등급 필수!</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span>재활병원·재활센터는 <strong class="text-blue-600">건강보험</strong> 적용</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span>요양병원·요양원은 <strong class="text-orange-600">장기요양보험</strong> 적용</span>
          </p>
        </div>
      </div>


    </div>
  `, 'max-w-4xl');
  
  document.getElementById('modalContainer').appendChild(modal);
}

// 비용 가이드 표시
function showCostGuide() {
  const modal = createModal(`
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          <i class="fas fa-coins text-purple-600 mr-2"></i>
          비용, 얼마나 들까요?
        </h2>
        <p class="text-lg text-gray-700">
          똑순이가 급여·비급여를 쉽게 알려드릴게요! 😊
        </p>
      </div>

      <!-- 급여 비급여 개념 -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
          급여와 비급여, 뭐가 다를까요?
        </h3>
        
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-2 border-green-300">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">✅</span>
              <h4 class="text-lg font-bold text-green-700">급여 항목</h4>
            </div>
            <p class="text-gray-700 mb-2">보험에서 대부분 내주는 비용이에요</p>
            <div class="flex flex-wrap gap-2 text-xs">
              <span class="bg-green-50 text-green-700 px-2 py-1 rounded">🏥 기본 병실료</span>
              <span class="bg-green-50 text-green-700 px-2 py-1 rounded">💊 기본 치료</span>
              <span class="bg-green-50 text-green-700 px-2 py-1 rounded">🍚 식사</span>
              <span class="bg-green-50 text-green-700 px-2 py-1 rounded">👩‍⚕️ 간호</span>
            </div>
            <p class="text-sm text-green-700 mt-2 font-semibold">💰 본인 부담: 약 20-30%</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-orange-300">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">💳</span>
              <h4 class="text-lg font-bold text-orange-700">비급여 항목</h4>
            </div>
            <p class="text-gray-700 mb-2">본인이 전부 내야 하는 추가 비용이에요</p>
            <div class="flex flex-wrap gap-2 text-xs">
              <span class="bg-orange-50 text-orange-700 px-2 py-1 rounded">🛏️ 상급병실</span>
              <span class="bg-orange-50 text-orange-700 px-2 py-1 rounded">🤖 특수 재활</span>
              <span class="bg-orange-50 text-orange-700 px-2 py-1 rounded">🦽 전동 휠체어</span>
              <span class="bg-orange-50 text-orange-700 px-2 py-1 rounded">🥗 특수 식단</span>
            </div>
            <p class="text-sm text-orange-700 mt-2 font-semibold">💰 본인 부담: 전액 (100%)</p>
          </div>
        </div>
      </div>

      <!-- 병실 구분 설명 -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
        <h3 class="text-xl font-bold text-purple-800 mb-4 flex items-center">
          <span class="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
          병실 종류, 어떻게 다를까요?
        </h3>
        
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🏨</span>
              <h4 class="text-lg font-bold text-purple-700">상급병실 (1인실)</h4>
            </div>
            <p class="text-gray-700 mb-1">완전히 혼자 쓰는 방이에요</p>
            <div class="text-sm text-gray-600 space-y-1">
              <p>✓ 프라이버시 완벽 보장</p>
              <p>✓ 조용하고 편안한 환경</p>
              <p class="text-orange-700 font-semibold">⚠️ 추가 비용이 많이 들어요 (비급여)</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🛏️</span>
              <h4 class="text-lg font-bold text-blue-700">다인실 (2-6인)</h4>
            </div>
            <p class="text-gray-700 mb-1">여러 환자분이 함께 쓰는 방이에요</p>
            <div class="text-sm text-gray-600 space-y-1">
              <p>• <strong>2인실</strong>: 두 분이 함께 (중급병실)</p>
              <p>• <strong>3-4인실</strong>: 세 분 이상이 함께</p>
              <p>• <strong>5-6인실</strong>: 더 많은 분들과 함께</p>
              <p class="text-green-700 font-semibold">✓ 보험 적용으로 본인 부담이 적어요</p>
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
            <p class="text-sm text-blue-800">
              <i class="fas fa-lightbulb mr-1"></i>
              <strong>꿀팁:</strong> 2인실은 다인실에 속하지만 프라이버시와 비용의 중간 옵션이에요!
            </p>
          </div>
        </div>
      </div>

      <!-- 실제 비용 테이블 -->
      <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200">
        <h3 class="text-xl font-bold text-indigo-800 mb-4 flex items-center">
          <span class="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
          2025년 실제 비용 (한 달 기준)
        </h3>
        
        <div class="bg-yellow-50 rounded-lg p-3 mb-4 border-l-4 border-yellow-500">
          <p class="text-sm text-yellow-800">
            <i class="fas fa-exclamation-circle mr-1"></i>
            <strong>2인실 기준</strong>으로 계산한 평균 비용이에요 (보험 적용 후 본인 부담)
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-indigo-100">
                <th class="px-3 py-2 text-left text-indigo-900 font-bold border border-indigo-200">시설 종류</th>
                <th class="px-3 py-2 text-right text-indigo-900 font-bold border border-indigo-200">기본료 (보험 전)</th>
                <th class="px-3 py-2 text-right text-indigo-900 font-bold border border-indigo-200">본인 부담 (월)</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr class="border-b border-gray-200">
                <td class="px-3 py-2 border border-gray-200">🏥 일반·1차 병원</td>
                <td class="px-3 py-2 text-right border border-gray-200 text-gray-600">70~100만원</td>
                <td class="px-3 py-2 text-right border border-gray-200">
                  <span class="font-bold text-blue-600">20~30만원</span>
                </td>
              </tr>
              <tr class="border-b border-gray-200 bg-green-50">
                <td class="px-3 py-2 border border-gray-200">💪 회복기 재활병원</td>
                <td class="px-3 py-2 text-right border border-gray-200 text-gray-600">120~150만원</td>
                <td class="px-3 py-2 text-right border border-gray-200">
                  <span class="font-bold text-green-600">30~50만원</span>
                </td>
              </tr>
              <tr class="border-b border-gray-200 bg-teal-50">
                <td class="px-3 py-2 border border-gray-200">🏥 일반 재활병원</td>
                <td class="px-3 py-2 text-right border border-gray-200 text-gray-600">100~120만원</td>
                <td class="px-3 py-2 text-right border border-gray-200">
                  <span class="font-bold text-teal-600">25~35만원</span>
                </td>
              </tr>
              <tr class="border-b border-gray-200 bg-blue-50">
                <td class="px-3 py-2 border border-gray-200">🏨 요양병원 (의료기관)</td>
                <td class="px-3 py-2 text-right border border-gray-200 text-gray-600">100~130만원</td>
                <td class="px-3 py-2 text-right border border-gray-200">
                  <span class="font-bold text-blue-600">20~40만원</span>
                </td>
              </tr>
              <tr class="bg-purple-50">
                <td class="px-3 py-2 border border-gray-200">🏡 요양원 (거주시설)</td>
                <td class="px-3 py-2 text-right border border-gray-200 text-gray-600">90~120만원</td>
                <td class="px-3 py-2 text-right border border-gray-200">
                  <span class="font-bold text-purple-600">20~40만원</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 space-y-2 text-xs text-gray-600">
          <p class="flex items-start">
            <span class="mr-1">※</span>
            <span>실제 금액은 병원·지역·보험 종류·환자 상태에 따라 달라질 수 있어요</span>
          </p>
          <p class="flex items-start">
            <span class="mr-1">※</span>
            <span>건강보험은 약 70%, 장기요양보험은 60~80%를 지원해요</span>
          </p>
          <p class="flex items-start">
            <span class="mr-1">※</span>
            <span><strong class="text-red-600">상급병실(1인실)</strong>을 선택하시면 <strong>월 100~300만원</strong>이 추가로 들어요</span>
          </p>
          <p class="flex items-start bg-red-50 p-2 rounded mt-2">
            <span class="mr-1 text-red-600">⚠️</span>
            <span><strong class="text-red-700">요양병원 ≠ 요양원!</strong> 요양병원은 의료기관(의사 상주), 요양원은 생활시설(돌봄 중심)이에요</span>
          </p>
        </div>
      </div>

      <!-- 법적 근거 및 명확한 차이 -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-300">
        <h3 class="text-xl font-bold text-amber-900 mb-4 flex items-center">
          <span class="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">📋</span>
          요양병원 vs 재활병원 vs 요양원, 법적으로 뭐가 다를까요?
        </h3>
        
        <div class="bg-red-50 rounded-lg p-4 mb-4 border-l-4 border-red-500">
          <p class="text-sm text-red-900 font-bold mb-2">
            <i class="fas fa-exclamation-triangle mr-1"></i>
            이름이 비슷해서 헷갈리지만, 완전히 다른 기관이에요!
          </p>
          <p class="text-xs text-red-800">
            각각 다른 법률로 운영되고, 보험도 다르고, 목적도 달라요
          </p>
        </div>

        <!-- 법적 근거 비교 테이블 -->
        <div class="overflow-x-auto mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-amber-100">
                <th class="px-3 py-2 text-left text-amber-900 font-bold border border-amber-200">구분</th>
                <th class="px-3 py-2 text-center text-amber-900 font-bold border border-amber-200">🏥 재활병원</th>
                <th class="px-3 py-2 text-center text-amber-900 font-bold border border-amber-200">🏨 요양병원</th>
                <th class="px-3 py-2 text-center text-amber-900 font-bold border border-amber-200">🏡 요양원</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr class="border-b border-gray-200">
                <td class="px-3 py-2 border border-gray-200 font-semibold">📜 법적 근거</td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-green-50">
                  <span class="text-green-800 font-semibold">의료법</span><br>
                  <span class="text-xs text-green-600">(회복기재활의료기관)</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-blue-50">
                  <span class="text-blue-800 font-semibold">의료법</span><br>
                  <span class="text-xs text-blue-600">(요양병원)</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-purple-50">
                  <span class="text-purple-800 font-semibold">노인복지법</span><br>
                  <span class="text-xs text-purple-600">(복지시설)</span>
                </td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-3 py-2 border border-gray-200 font-semibold">💳 보험 체계</td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-green-50">
                  <span class="text-green-800 font-bold">건강보험</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-blue-50">
                  <span class="text-blue-800 font-bold">건강보험</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-purple-50">
                  <span class="text-purple-800 font-bold">장기요양보험</span>
                </td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-3 py-2 border border-gray-200 font-semibold">🎯 입원 대상</td>
                <td class="px-3 py-2 border border-gray-200 bg-green-50 text-xs">
                  뇌졸중, 척수손상, 골절 수술 후<br>
                  <strong class="text-green-700">급성기 직후 환자</strong>
                </td>
                <td class="px-3 py-2 border border-gray-200 bg-blue-50 text-xs">
                  65세+ 노인성 질환<br>
                  만성질환, 수술 후 회복기<br>
                  <strong class="text-blue-700">치료+돌봄 모두 필요</strong>
                </td>
                <td class="px-3 py-2 border border-gray-200 bg-purple-50 text-xs">
                  65세+ 장기요양등급<br>
                  (1~5등급) 보유자<br>
                  <strong class="text-purple-700">일상 돌봄 필요</strong>
                </td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-3 py-2 border border-gray-200 font-semibold">📅 입원 기간</td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-green-50">
                  <span class="text-green-800 font-bold">45~90일</span><br>
                  <span class="text-xs text-green-600">(골든타임 집중)</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-blue-50">
                  <span class="text-blue-800 font-bold">제한 없음</span><br>
                  <span class="text-xs text-blue-600">(수개월~수년)</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-purple-50">
                  <span class="text-purple-800 font-bold">제한 없음</span><br>
                  <span class="text-xs text-purple-600">(장기 거주)</span>
                </td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-3 py-2 border border-gray-200 font-semibold">👨‍⚕️ 의료진</td>
                <td class="px-3 py-2 border border-gray-200 bg-green-50 text-xs">
                  재활의학과 전문의<br>
                  물리치료사, 작업치료사<br>
                  <strong class="text-green-700">재활팀 구성</strong>
                </td>
                <td class="px-3 py-2 border border-gray-200 bg-blue-50 text-xs">
                  의사 상주 (필수)<br>
                  간호사 24시간 배치<br>
                  <strong class="text-blue-700">의료기관</strong>
                </td>
                <td class="px-3 py-2 border border-gray-200 bg-purple-50 text-xs">
                  의사 상주 X<br>
                  요양보호사 중심<br>
                  <strong class="text-purple-700">생활시설</strong>
                </td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="px-3 py-2 border border-gray-200 font-semibold">🎯 목적</td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-green-50">
                  <span class="text-green-800 font-bold">기능 회복</span><br>
                  <span class="text-xs text-green-600">사회 복귀</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-blue-50">
                  <span class="text-blue-800 font-bold">장기 치료</span><br>
                  <span class="text-xs text-blue-600">치료 + 요양</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-purple-50">
                  <span class="text-purple-800 font-bold">생활 지원</span><br>
                  <span class="text-xs text-purple-600">일상 돌봄</span>
                </td>
              </tr>
              <tr>
                <td class="px-3 py-2 border border-gray-200 font-semibold">💰 월 평균 비용</td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-green-50">
                  <span class="text-green-800 font-bold">160~200만원</span><br>
                  <span class="text-xs text-green-600">본인 30~50만원</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-blue-50">
                  <span class="text-blue-800 font-bold">160~200만원</span><br>
                  <span class="text-xs text-blue-600">본인 20~40만원</span>
                </td>
                <td class="px-3 py-2 text-center border border-gray-200 bg-purple-50">
                  <span class="text-purple-800 font-bold">80~100만원</span><br>
                  <span class="text-xs text-purple-600">본인 20~30만원</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 핵심 차이점 강조 -->
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <h4 class="font-bold text-green-800 mb-2 flex items-center">
              <span class="text-xl mr-2">🏥</span>
              재활병원: "빨리 회복해서 집으로 돌아가자"
            </h4>
            <ul class="text-sm text-gray-700 space-y-1">
              <li>✓ <strong>하루 3시간 이상</strong> 고강도 재활 치료</li>
              <li>✓ 회복기 <strong>골든타임(3개월)</strong>에 집중</li>
              <li>✓ 집으로 돌아가는 것이 목표</li>
              <li>⚠️ 2019년 이후 <strong>"회복기 재활병원"</strong> 제도 신설</li>
            </ul>
          </div>

          <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <h4 class="font-bold text-blue-800 mb-2 flex items-center">
              <span class="text-xl mr-2">🏨</span>
              요양병원: "치료도 받고, 돌봄도 받고"
            </h4>
            <ul class="text-sm text-gray-700 space-y-1">
              <li>✓ 의료 + 생활 돌봄 <strong>중간 지대</strong></li>
              <li>✓ 의사가 상주하는 <strong>의료기관</strong></li>
              <li>✓ 입원 기간 제한 없음 (장기 입원 가능)</li>
              <li>⚠️ <strong>"요양병원" ≠ "요양원"</strong> 완전히 다름!</li>
            </ul>
          </div>

          <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <h4 class="font-bold text-purple-800 mb-2 flex items-center">
              <span class="text-xl mr-2">🏡</span>
              요양원: "편안하게 일상을 보내자"
            </h4>
            <ul class="text-sm text-gray-700 space-y-1">
              <li>✓ <strong>장기요양등급</strong> 필수 (1~5등급)</li>
              <li>✓ 의료 치료 X, <strong>일상 돌봄</strong> 중심</li>
              <li>✓ 의사 상주 없음 (월 2회 방문 정도)</li>
              <li>⚠️ 급한 치료 필요 시 <strong>외부 병원 이송</strong></li>
            </ul>
          </div>
        </div>

        <!-- 헷갈리는 용어 정리 -->
        <div class="mt-4 bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
          <h4 class="font-bold text-yellow-900 mb-2 flex items-center">
            <i class="fas fa-lightbulb mr-2 text-yellow-600"></i>
            헷갈리는 용어 정리
          </h4>
          <div class="space-y-2 text-sm text-gray-700">
            <p class="flex items-start">
              <span class="mr-2">1️⃣</span>
              <span><strong>"요양병원" vs "요양원"</strong><br>
              → 이름 비슷하지만 <strong class="text-red-600">완전히 다른 기관!</strong> 요양병원은 의료기관, 요양원은 복지시설</span>
            </p>
            <p class="flex items-start">
              <span class="mr-2">2️⃣</span>
              <span><strong>"재활병원" vs "요양병원"</strong><br>
              → 재활병원은 <strong class="text-green-600">집중 재활이 목표</strong>, 요양병원은 장기 치료+돌봄</span>
            </p>
            <p class="flex items-start">
              <span class="mr-2">3️⃣</span>
              <span><strong>"회복기 재활병원"</strong><br>
              → 2019년 이후 생긴 제도로, 보건복지부가 <strong class="text-blue-600">별도 지정</strong>한 고강도 재활 전문병원</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 재활병원 비용 -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
        <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">
          <span class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
          재활병원 하루 비용 상세
        </h3>
        
        <div class="bg-yellow-50 rounded-lg p-3 mb-4 border-l-4 border-yellow-500">
          <p class="text-sm text-yellow-800 font-semibold">
            <i class="fas fa-info-circle mr-1"></i>
            병원·지역마다 차이가 있어요! 아래는 평균 범위입니다
          </p>
        </div>
        
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-bold text-gray-800">🛏️ 다인실 (2-6인)</h4>
              <span class="text-green-600 font-bold text-lg">3~5만원/일</span>
            </div>
            <p class="text-sm text-gray-600">건강보험 70% 적용 → 본인 부담 30%</p>
            <p class="text-xs text-green-700 mt-1">💰 한 달: 약 90~150만원</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-bold text-gray-800">🏨 상급병실 (1인실)</h4>
              <span class="text-purple-600 font-bold text-lg">8~15만원/일</span>
            </div>
            <p class="text-sm text-gray-600">다인실 비용 + 상급병실 추가비 (비급여)</p>
            <p class="text-xs text-purple-700 mt-1">💰 한 달: 약 240~450만원</p>
          </div>

          <div class="bg-blue-50 rounded-lg p-3 text-sm">
            <p class="text-blue-800 font-semibold mb-1">➕ 추가 비용 예시</p>
            <div class="space-y-1 text-xs text-gray-700">
              <p>• 🤖 로봇 재활: 2~5만원/회 (주 2회 → 월 약 16~40만원)</p>
              <p>• 🦽 전동 휠체어: 15~30만원/월</p>
              <p>• 🥗 특수 식단: 1~3만원/일 (월 약 30~90만원)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 요양병원 비용 -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">5</span>
          요양병원 하루 비용 상세
        </h3>
        
        <div class="bg-yellow-50 rounded-lg p-3 mb-4 border-l-4 border-yellow-500">
          <p class="text-sm text-yellow-800 font-semibold">
            <i class="fas fa-info-circle mr-1"></i>
            병원·요양등급마다 차이가 있어요! 아래는 평균 범위입니다
          </p>
        </div>
        
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-bold text-gray-800">🛏️ 다인실 (2-6인)</h4>
              <span class="text-blue-600 font-bold text-lg">2~4만원/일</span>
            </div>
            <p class="text-sm text-gray-600">장기요양보험 60-80% 적용</p>
            <p class="text-xs text-blue-700 mt-1">💰 한 달: 약 60~120만원</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-bold text-gray-800">🏨 상급병실 (1인실)</h4>
              <span class="text-indigo-600 font-bold text-lg">6~12만원/일</span>
            </div>
            <p class="text-sm text-gray-600">다인실 비용 + 상급병실 추가비 (비급여)</p>
            <p class="text-xs text-indigo-700 mt-1">💰 한 달: 약 180~360만원</p>
          </div>

          <div class="bg-orange-50 rounded-lg p-3 text-sm">
            <p class="text-orange-800 font-semibold mb-1">⚠️ 요양등급에 따라 달라요</p>
            <div class="space-y-1 text-xs text-gray-700">
              <p>• 1등급: 보험 80% → 본인 부담 20%</p>
              <p>• 2등급: 보험 70% → 본인 부담 30%</p>
              <p>• 3등급: 보험 60% → 본인 부담 40%</p>
              <p class="text-blue-700 font-semibold mt-2">→ 등급이 높을수록 본인 부담이 줄어요!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 비급여 체크리스트 -->
      <div class="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border-2 border-yellow-300">
        <h3 class="text-xl font-bold text-yellow-800 mb-4 flex items-center">
          <span class="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">6</span>
          비용이 더 나올 수 있는 경우
        </h3>
        
        <div class="space-y-2">
          <div class="bg-white rounded-lg p-3 flex items-start">
            <span class="text-xl mr-3">🛏️</span>
            <div class="flex-1">
              <p class="font-semibold text-gray-800">상급병실(1인실)을 원하시나요?</p>
              <p class="text-sm text-gray-600">→ 하루 4~10만원 추가 (병원마다 다름)</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-3 flex items-start">
            <span class="text-xl mr-3">🤖</span>
            <div class="flex-1">
              <p class="font-semibold text-gray-800">로봇·특수 재활을 하실 건가요?</p>
              <p class="text-sm text-gray-600">→ 회당 2~5만원 추가</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-3 flex items-start">
            <span class="text-xl mr-3">🦽</span>
            <div class="flex-1">
              <p class="font-semibold text-gray-800">전동 휠체어가 필요하신가요?</p>
              <p class="text-sm text-gray-600">→ 한 달 15~30만원 추가</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-3 flex items-start">
            <span class="text-xl mr-3">🥗</span>
            <div class="flex-1">
              <p class="font-semibold text-gray-800">특수 식단이 필요하신가요?</p>
              <p class="text-sm text-gray-600">→ 하루 1~3만원 추가</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-3 flex items-start">
            <span class="text-xl mr-3">👤</span>
            <div class="flex-1">
              <p class="font-semibold text-gray-800">추가 간병인이 필요하신가요?</p>
              <p class="text-sm text-gray-600">→ 한 달 30~80만원 추가</p>
            </div>
          </div>
        </div>
        
        <div class="mt-4 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
          <p class="text-sm text-blue-800">
            <i class="fas fa-chart-line mr-1"></i>
            <strong>지역별 차이:</strong> 서울·수도권이 지방보다 20-40% 더 비쌀 수 있어요
          </p>
        </div>
      </div>

      <!-- 꿀팁 -->
      <div class="bg-green-50 border-2 border-green-400 rounded-lg p-5">
        <h3 class="text-lg font-bold text-green-800 mb-3 flex items-center">
          <i class="fas fa-lightbulb text-green-600 mr-2 text-xl"></i>
          똑순이 꿀팁! 💡
        </h3>
        <div class="space-y-2 text-sm">
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>산재(산업재해)</strong> 적용되면 <strong class="text-red-600">본인 부담 0원!</strong></span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>재활특례</strong> 받으면 본인 부담이 <strong class="text-blue-600">15%</strong>로 줄어요</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>저소득층·장애인</strong>은 <strong class="text-purple-600">30-50% 감면</strong> 받을 수 있어요</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span>병원마다 비용이 다르니 <strong class="text-orange-600">꼭 여러 곳을 비교</strong>하세요!</span>
          </p>
        </div>
      </div>

      <!-- 선택을 위한 체크리스트 -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-300">
        <h3 class="text-xl font-bold text-indigo-900 mb-4 flex items-center">
          <span class="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">✓</span>
          선택을 위한 체크리스트
        </h3>

        <div class="bg-white rounded-lg p-4 mb-4 border-l-4 border-indigo-500">
          <p class="text-sm text-indigo-900 font-semibold mb-2">
            <i class="fas fa-info-circle mr-1"></i>
            환자분의 상태와 필요에 따라 적합한 기관을 선택하세요
          </p>
        </div>

        <div class="space-y-4">
          <!-- 1. 현재 의료 필요성 -->
          <div class="bg-white rounded-lg p-4 border-2 border-blue-200">
            <h4 class="font-bold text-blue-800 mb-3 flex items-center">
              <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">1</span>
              현재 의료 필요성
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-start p-2 bg-green-50 rounded">
                <span class="text-green-600 mr-2 mt-0.5">🏥</span>
                <div>
                  <strong class="text-green-800">급성 재활 필요 (뇌졸중·척수손상 등)</strong><br>
                  <span class="text-gray-700">→ <strong class="text-green-700">회복기 재활병원</strong> 우선 (골든타임 3개월 집중!)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-blue-50 rounded">
                <span class="text-blue-600 mr-2 mt-0.5">🏨</span>
                <div>
                  <strong class="text-blue-800">만성질환·수술 후 회복, 의료+요양 동시 필요</strong><br>
                  <span class="text-gray-700">→ <strong class="text-blue-700">요양병원</strong> (치료와 돌봄 모두)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-purple-50 rounded">
                <span class="text-purple-600 mr-2 mt-0.5">🏡</span>
                <div>
                  <strong class="text-purple-800">일상 돌봄·장기요양등급 높은 경우</strong><br>
                  <span class="text-gray-700">→ <strong class="text-purple-700">요양원</strong> (생활 지원 중심)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 보험·비용 부담 -->
          <div class="bg-white rounded-lg p-4 border-2 border-orange-200">
            <h4 class="font-bold text-orange-800 mb-3 flex items-center">
              <span class="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">2</span>
              보험·비용 부담
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-start p-2 bg-green-50 rounded">
                <span class="text-green-600 mr-2 mt-0.5">💳</span>
                <div>
                  <strong class="text-green-800">건강보험 중심</strong><br>
                  <span class="text-gray-700">→ <strong class="text-green-700">요양병원·재활병원</strong> (본인 부담 20~30%)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-purple-50 rounded">
                <span class="text-purple-600 mr-2 mt-0.5">🏛️</span>
                <div>
                  <strong class="text-purple-800">장기요양보험·본인 부담 20%</strong><br>
                  <span class="text-gray-700">→ <strong class="text-purple-700">요양원</strong> (장기요양등급 필수)</span>
                </div>
              </div>
              <div class="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                <p class="text-xs text-yellow-800">
                  <i class="fas fa-lightbulb mr-1"></i>
                  <strong>팁:</strong> 장기요양등급이 있으면 요양원이 경제적으로 유리할 수 있어요
                </p>
              </div>
            </div>
          </div>

          <!-- 3. 입원 기간·연계 -->
          <div class="bg-white rounded-lg p-4 border-2 border-teal-200">
            <h4 class="font-bold text-teal-800 mb-3 flex items-center">
              <span class="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">3</span>
              입원 기간·연계 계획
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-start p-2 bg-blue-50 rounded">
                <span class="text-blue-600 mr-2 mt-0.5">📅</span>
                <div>
                  <strong class="text-blue-800">장기 입원 필요 (수개월~수년)</strong><br>
                  <span class="text-gray-700">→ <strong class="text-blue-700">요양병원</strong> (입원 기간 제한 없음)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-green-50 rounded">
                <span class="text-green-600 mr-2 mt-0.5">⚡</span>
                <div>
                  <strong class="text-green-800">재활 집중 기간 (45~90일)</strong><br>
                  <span class="text-gray-700">→ <strong class="text-green-700">재활병원</strong> (골든타임 집중 후 전원)</span>
                </div>
              </div>
              <div class="bg-indigo-50 p-2 rounded border-l-4 border-indigo-400">
                <p class="text-xs text-indigo-800">
                  <i class="fas fa-route mr-1"></i>
                  <strong>전환 플랜 설계:</strong> 재활병원(45~90일) → 요양병원(3~6개월) → 재택/요양원<br>
                  연계 계획을 미리 세우면 전체 비용과 시간을 절감할 수 있어요!
                </p>
              </div>
            </div>
          </div>

          <!-- 4. 의료·재활 강도 -->
          <div class="bg-white rounded-lg p-4 border-2 border-pink-200">
            <h4 class="font-bold text-pink-800 mb-3 flex items-center">
              <span class="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">4</span>
              의료·재활 강도
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-start p-2 bg-green-50 rounded">
                <span class="text-green-600 mr-2 mt-0.5">💪</span>
                <div>
                  <strong class="text-green-800">고강도 재활 필요 (하루 3시간+)</strong><br>
                  <span class="text-gray-700">→ <strong class="text-green-700">재활병원</strong> (전문 인력·장비 확인 필수!)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-blue-50 rounded">
                <span class="text-blue-600 mr-2 mt-0.5">🏥</span>
                <div>
                  <strong class="text-blue-800">일반 치료·돌봄</strong><br>
                  <span class="text-gray-700">→ <strong class="text-blue-700">요양병원·요양원</strong> (치료 강도 사전 확인)</span>
                </div>
              </div>
              <div class="bg-red-50 p-2 rounded border-l-4 border-red-400">
                <p class="text-xs text-red-800">
                  <i class="fas fa-exclamation-triangle mr-1"></i>
                  <strong>주의:</strong> 요양병원도 재활 강도는 천차만별이에요!<br>
                  반드시 물리치료사 인원, 하루 재활 시간을 직접 확인하세요
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 최종 결정 팁 -->
        <div class="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-2 border-purple-300">
          <h4 class="font-bold text-purple-900 mb-2 flex items-center">
            <i class="fas fa-star text-yellow-500 mr-2"></i>
            최종 결정 전 꼭 확인하세요!
          </h4>
          <div class="space-y-1 text-sm text-gray-700">
            <p class="flex items-start">
              <span class="text-purple-600 mr-2">✓</span>
              <span><strong>병원 방문:</strong> 실제 환경, 의료진, 재활 강도를 눈으로 확인</span>
            </p>
            <p class="flex items-start">
              <span class="text-purple-600 mr-2">✓</span>
              <span><strong>비용 견적:</strong> 여러 곳 비교 후 상세 견적서 요청</span>
            </p>
            <p class="flex items-start">
              <span class="text-purple-600 mr-2">✓</span>
              <span><strong>입원 대기:</strong> 인기 병원은 대기 기간이 길 수 있으니 미리 예약</span>
            </p>
            <p class="flex items-start">
              <span class="text-purple-600 mr-2">✓</span>
              <span><strong>전환 계획:</strong> 재활병원 → 요양병원 → 재택 순서로 단계별 계획 수립</span>
            </p>
          </div>
        </div>
      </div>


    </div>
  `, 'max-w-4xl');
  
  document.getElementById('modalContainer').appendChild(modal);
}

// 장소 선택 가이드 표시
function showFacilityGuide() {
  const modal = createModal(`
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          <i class="fas fa-hospital-alt text-green-600 mr-2"></i>
          어디가 가장 좋을까요?
        </h2>
        <p class="text-lg text-gray-700">
          똑순이가 장소 선택의 모든 것을 알려드릴게요! 😊
        </p>
      </div>

      <!-- 5가지 체크리스트 -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
          병원 결정, 5가지만 체크하세요!
        </h3>
        
        <div class="space-y-3">
          <!-- 임상 전문성 -->
          <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">👨‍⚕️</span>
              <h4 class="text-lg font-bold text-green-700">① 임상·전문성</h4>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>질문:</strong> "재활의학과·신경외과·언어치료사가 상주하나요?"
            </p>
            <p class="text-xs text-gray-600">
              <i class="fas fa-check-circle text-green-600 mr-1"></i>
              환자의 상태에 맞는 진료과가 상주하는지, 전문치료사가 많을수록 치료 질이 높아요!
            </p>
          </div>

          <!-- 검사 진단 -->
          <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🔬</span>
              <h4 class="text-lg font-bold text-blue-700">② 검사·진단 가능 여부</h4>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>질문:</strong> "연하검사, X-ray, CT, MRI 장비가 있나요?"
            </p>
            <p class="text-xs text-gray-600">
              <i class="fas fa-check-circle text-blue-600 mr-1"></i>
              환자에게 필요한 검사 기기가 있는지 확인하세요!
            </p>
          </div>

          <!-- 환경 간호 -->
          <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🏥</span>
              <h4 class="text-lg font-bold text-purple-700">③ 환경·간호·보호</h4>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>질문:</strong> "간호통합병동이 있나요? 1인실 가능한가요? 섬망 관리 프로토콜이 있나요?"
            </p>
            <p class="text-xs text-gray-600">
              <i class="fas fa-check-circle text-purple-600 mr-1"></i>
              1인실/1인간병 여부와 섬망(혼동) 대처가 가능한지 확인하세요!
            </p>
          </div>

          <!-- 접근성 -->
          <div class="bg-white rounded-lg p-4 border-l-4 border-orange-500">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🚗</span>
              <h4 class="text-lg font-bold text-orange-700">④ 접근성·거리</h4>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>질문:</strong> "큰 병원과 얼마나 가까운가요? 우리 집에서 몇 km예요?"
            </p>
            <p class="text-xs text-gray-600">
              <i class="fas fa-check-circle text-orange-600 mr-1"></i>
              응급 상황·재진료·가족 방문 시 거리가 중요해요!
            </p>
          </div>

          <!-- 사회 심리 비용 -->
          <div class="bg-white rounded-lg p-4 border-l-4 border-pink-500">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">💰</span>
              <h4 class="text-lg font-bold text-pink-700">⑤ 사회·심리·비용</h4>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>질문:</strong> "면회·외출 시간은? 비용은 얼마예요? 장기요양등급 필요한가요?"
            </p>
            <p class="text-xs text-gray-600">
              <i class="fas fa-check-circle text-pink-600 mr-1"></i>
              외래 진료가 필요한 경우, 외출 가능성 여부 확인이 필요하고 가족 면회가 가능한 시간대도 확인하세요!
            </p>
          </div>
        </div>
      </div>

      <!-- 시설 유형별 비교 -->
      <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border-2 border-green-200">
        <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">
          <span class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
          일반적인 특징 한눈에 보기
        </h3>

        <div class="space-y-4">
          <!-- 회복기 재활병원 -->
          <div class="bg-white rounded-lg p-4 border-2 border-green-400 shadow-md">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <span class="text-2xl mr-3">🏥</span>
                <h4 class="text-lg font-bold text-green-700">회복기 재활병원</h4>
              </div>
              <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">급성·중증</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-2">
              <div>
                <p class="text-gray-600 mb-1"><strong>전문 인력:</strong></p>
                <p class="text-xs text-gray-700">재활의학과·신경외과·작업·물리·언어치료사 상주</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>검사 장비:</strong></p>
                <p class="text-xs text-gray-700">연하검사·X-ray·CT·MRI·로봇·VR 전부 가능</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>환경:</strong></p>
                <p class="text-xs text-gray-700">통합병동·24시간 간호·1인실 가능 (+20%)</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>면회·외출:</strong></p>
                <p class="text-xs text-gray-700">면회 주 2회·외출 주 1회·섬망 전담팀</p>
              </div>
            </div>
            
            <div class="bg-green-50 rounded p-2 text-xs mb-2">
              <p class="text-green-700"><strong>대표 환자:</strong> 뇌졸중, 척수손상, 외상, 심근경색 (ADL ≤30)</p>
            </div>
            
            <p class="text-sm font-semibold text-green-700">
              💰 하루 15~20만원 (2인실) / 월 30~50만원 본인부담
            </p>
          </div>

          <!-- 일반 재활병원 -->
          <div class="bg-white rounded-lg p-4 border-2 border-teal-300">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <span class="text-2xl mr-3">🏥</span>
                <h4 class="text-lg font-bold text-teal-700">일반 재활병원</h4>
              </div>
              <span class="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">중·경증</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-2">
              <div>
                <p class="text-gray-600 mb-1"><strong>전문 인력:</strong></p>
                <p class="text-xs text-gray-700">재활전문의·작업·물리·언어치료사 상주</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>검사 장비:</strong></p>
                <p class="text-xs text-gray-700">기본 연하검사·X-ray·CT (로봇·VR 보통 없음)</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>환경:</strong></p>
                <p class="text-xs text-gray-700">통합병동·24시간 간호·1인실 제한적</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>면회·외출:</strong></p>
                <p class="text-xs text-gray-700">면회 주 1-2회·외출 주 1회·일반 수준</p>
              </div>
            </div>
            
            <div class="bg-teal-50 rounded p-2 text-xs mb-2">
              <p class="text-teal-700"><strong>대표 환자:</strong> 골절, 관절 수술, 스포츠 손상 (ADL 30-50)</p>
            </div>
            
            <p class="text-sm font-semibold text-teal-700">
              💰 하루 12~15만원 (2인실) / 월 25~35만원 본인부담
            </p>
          </div>

          <!-- 요양병원 -->
          <div class="bg-white rounded-lg p-4 border-2 border-blue-400 shadow-md">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <span class="text-2xl mr-3">🏨</span>
                <h4 class="text-lg font-bold text-blue-700">요양병원 (의료기관)</h4>
              </div>
              <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">장기·만성</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-2">
              <div>
                <p class="text-gray-600 mb-1"><strong>전문 인력:</strong></p>
                <p class="text-xs text-gray-700">내과·재활·신경외과·치료사 상주</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>검사 장비:</strong></p>
                <p class="text-xs text-gray-700">연하검사·X-ray·CT·MRI 보유 (로봇·VR 대부분 없음)</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>환경:</strong></p>
                <p class="text-xs text-gray-700">통합병동·24시간 간호·1인실 가능 (+20%)</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>면회·외출:</strong></p>
                <p class="text-xs text-gray-700">면회 주 2회·외출 주 1회·섬망 전담팀</p>
              </div>
            </div>
            
            <div class="bg-blue-50 rounded p-2 text-xs mb-2">
              <p class="text-blue-700"><strong>대표 환자:</strong> 뇌졸중, 척수손상, 심부전, COPD, 치매 (ADL 30-60)</p>
            </div>
            
            <p class="text-sm font-semibold text-blue-700">
              💰 하루 10~15만원 (2인실) / 월 20~40만원 본인부담
            </p>
            <p class="text-xs text-green-600 mt-1">
              <i class="fas fa-check-circle mr-1"></i>
              의사 상주 - 의료·재활·간호 모두 제공
            </p>
          </div>

          <!-- 요양원 -->
          <div class="bg-white rounded-lg p-4 border-2 border-purple-300">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <span class="text-2xl mr-3">🏡</span>
                <h4 class="text-lg font-bold text-purple-700">요양원 (거주시설)</h4>
              </div>
              <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">일상 보조</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-2">
              <div>
                <p class="text-gray-600 mb-1"><strong>전문 인력:</strong></p>
                <p class="text-xs text-gray-700">간호사·보조인력 (의사 거의 없음)</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>검사 장비:</strong></p>
                <p class="text-xs text-gray-700">연하검사·X-ray·CT 외부 연계 (자체 장비 없음)</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>환경:</strong></p>
                <p class="text-xs text-gray-700">거주형 방(다인실·1인실) 가능 (+15%)</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1"><strong>면회·외출:</strong></p>
                <p class="text-xs text-gray-700">면회 주 2-3회·외출 주 1회·섬망 팀 없음</p>
              </div>
            </div>
            
            <div class="bg-purple-50 rounded p-2 text-xs mb-2">
              <p class="text-purple-700"><strong>대표 환자:</strong> 치매, 노인성 질환, 만성 관절염 (ADL 40-70)</p>
            </div>
            
            <p class="text-sm font-semibold text-purple-700">
              💰 하루 8~12만원 (2인실) / 월 20~40만원 본인부담
            </p>
            <p class="text-xs text-orange-600 mt-1">
              <i class="fas fa-exclamation-triangle mr-1"></i>
              의사 상주 안 함 - 외부 병원 연계
            </p>
          </div>
        </div>
      </div>

      <!-- 보호자 거주지 근접성 -->
      <div class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border-2 border-orange-200">
        <h3 class="text-xl font-bold text-orange-800 mb-4 flex items-center">
          <span class="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
          거리, 얼마나 중요할까요?
        </h3>

        <div class="bg-white rounded-lg p-4 border-l-4 border-orange-500 mb-3">
          <p class="text-sm text-gray-700 mb-3">
            <strong class="text-orange-700">거리를 가장 먼저 확인하세요!</strong>
            응급 상황·재진료·가족 방문 시 거리가 매우 중요해요.
          </p>
          
          <div class="space-y-2 text-xs">
            <div class="flex items-start">
              <span class="text-green-600 mr-2 mt-0.5">✓</span>
              <div>
                <strong>30km 이내:</strong> 우선 고려! 자주 방문 가능
              </div>
            </div>
            <div class="flex items-start">
              <span class="text-yellow-600 mr-2 mt-0.5">⚠️</span>
              <div>
                <strong>30km 이상:</strong> 교통·통근 비용 추가 고려
              </div>
            </div>
            <div class="flex items-start">
              <span class="text-blue-600 mr-2 mt-0.5">🚗</span>
              <div>
                <strong>버스·지하철·셔틀:</strong> 대중교통 편의성 확인
              </div>
            </div>
            <div class="flex items-start">
              <span class="text-red-600 mr-2 mt-0.5">🏥</span>
              <div>
                <strong>큰 병원 15km 이내:</strong> 응급·재진료 시 유리
              </div>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
          <p class="text-sm text-yellow-800">
            <i class="fas fa-lightbulb mr-1"></i>
            <strong>꿀팁:</strong> 보호자·간병인 출퇴근 시간이 2시간 이상이면 보조 인력이나 외주를 고려하세요!
          </p>
        </div>
      </div>

      <!-- 체크리스트 -->
      <div class="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-6 border-2 border-pink-200">
        <h3 class="text-xl font-bold text-pink-800 mb-4 flex items-center">
          <span class="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
          전원 전 반드시 체크하세요! ✅
        </h3>

        <div class="space-y-2 text-sm">
          <div class="bg-white rounded p-3 border-l-4 border-pink-400">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" class="mt-1 mr-3">
              <span><strong>거리:</strong> 보호자 집 → 시설까지 30km 이내인가요?</span>
            </label>
          </div>
          <div class="bg-white rounded p-3 border-l-4 border-purple-400">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" class="mt-1 mr-3">
              <span><strong>ADL 점수:</strong> 현재 환자의 ADL 점수를 확인했나요?</span>
            </label>
          </div>
          <div class="bg-white rounded p-3 border-l-4 border-blue-400">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" class="mt-1 mr-3">
              <span><strong>검사 필요:</strong> 연하검사·영상검사가 필요한가요?</span>
            </label>
          </div>
          <div class="bg-white rounded p-3 border-l-4 border-green-400">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" class="mt-1 mr-3">
              <span><strong>전문 인력:</strong> 전공의·전문의·치료사가 상주하나요?</span>
            </label>
          </div>
          <div class="bg-white rounded p-3 border-l-4 border-orange-400">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" class="mt-1 mr-3">
              <span><strong>1인실:</strong> 1인실이 필요한가요? (비용 +20-30%)</span>
            </label>
          </div>
          <div class="bg-white rounded p-3 border-l-4 border-yellow-400">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" class="mt-1 mr-3">
              <span><strong>섬망 관리:</strong> 섬망 예방·관리 프로토콜이 있나요?</span>
            </label>
          </div>
          <div class="bg-white rounded p-3 border-l-4 border-red-400">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" class="mt-1 mr-3">
              <span><strong>면회·외출:</strong> 면회·외출 시간과 정책을 확인했나요?</span>
            </label>
          </div>
          <div class="bg-white rounded p-3 border-l-4 border-indigo-400">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" class="mt-1 mr-3">
              <span><strong>보험·등급:</strong> 장기요양등급·재활특례 적용 여부를 확인했나요?</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 전원 결정 순서 -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
        <h3 class="text-xl font-bold text-indigo-800 mb-4 flex items-center">
          <span class="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">5</span>
          전원 결정 순서 (단계별 가이드)
        </h3>

        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
            <p class="font-bold text-indigo-700 mb-2">STEP 1: 거리 확인</p>
            <p class="text-sm text-gray-700">
              보호자 집에서 30km 이내인가요?<br>
              → <strong class="text-green-600">예:</strong> 다음 단계로<br>
              → <strong class="text-orange-600">아니오:</strong> 교통·통근 비용 고려
            </p>
          </div>

          <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p class="font-bold text-purple-700 mb-2">STEP 2: 환자 상태 확인</p>
            <p class="text-sm text-gray-700">
              ADL 점수가 30점 이하인가요?<br>
              → <strong class="text-green-600">예:</strong> <strong>회복기 재활병원</strong> 우선<br>
              → <strong class="text-blue-600">아니오:</strong> 다음 단계로
            </p>
          </div>

          <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <p class="font-bold text-blue-700 mb-2">STEP 3: 특수 검사 필요성</p>
            <p class="text-sm text-gray-700">
              연하검사·영상검사가 필요한가요?<br>
              → <strong class="text-green-600">예:</strong> <strong>회복기 재활병원</strong> 또는 <strong>일반 재활병원</strong><br>
              → <strong class="text-blue-600">아니오:</strong> 다음 단계로
            </p>
          </div>

          <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <p class="font-bold text-green-700 mb-2">STEP 4: 재활·요양·섬망 관리 필요성</p>
            <p class="text-sm text-gray-700">
              의료·재활·섬망 전담팀이 필요한가요?<br>
              → <strong class="text-green-600">예:</strong> <strong>요양병원</strong><br>
              → <strong class="text-purple-600">아니오:</strong> <strong>요양원</strong> (일상 보조 위주)
            </p>
          </div>
        </div>
      </div>

      <!-- 똑순이 꿀팁 -->
      <div class="bg-green-50 border-2 border-green-400 rounded-lg p-5">
        <h3 class="text-lg font-bold text-green-800 mb-3 flex items-center">
          <i class="fas fa-lightbulb text-green-600 mr-2 text-xl"></i>
          똑순이 꿀팁! 💡
        </h3>
        <div class="space-y-2 text-sm">
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>거리가 우선!</strong> 가까운 곳이 응급 시 가장 안전해요</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>ADL 30 이하</strong>면 회복기 재활병원이 최우선이에요</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>섬망 위험</strong>이 있다면 케어가 가능한지 꼭 물어보세요</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span><strong>면회·외출</strong> 시간이 넉넉한 곳이 심리적 안정에 좋아요</span>
          </p>
          <p class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span>여러 병원을 <strong class="text-orange-600">꼭 비교</strong>하고 직접 방문해보세요!</span>
          </p>
        </div>
      </div>

      <!-- 선택을 위한 체크리스트 -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-300">
        <h3 class="text-xl font-bold text-indigo-900 mb-4 flex items-center">
          <span class="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">✓</span>
          선택을 위한 체크리스트
        </h3>

        <div class="bg-white rounded-lg p-4 mb-4 border-l-4 border-indigo-500">
          <p class="text-sm text-indigo-900 font-semibold mb-2">
            <i class="fas fa-info-circle mr-1"></i>
            환자분의 상태와 필요에 따라 적합한 기관을 선택하세요
          </p>
        </div>

        <div class="space-y-4">
          <!-- 1. 현재 의료 필요성 -->
          <div class="bg-white rounded-lg p-4 border-2 border-blue-200">
            <h4 class="font-bold text-blue-800 mb-3 flex items-center">
              <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">1</span>
              현재 의료 필요성
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-start p-2 bg-green-50 rounded">
                <span class="text-green-600 mr-2 mt-0.5">🏥</span>
                <div>
                  <strong class="text-green-800">급성 재활 필요 (뇌졸중·척수손상 등)</strong><br>
                  <span class="text-gray-700">→ <strong class="text-green-700">회복기 재활병원</strong> 우선 (골든타임 3개월 집중!)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-blue-50 rounded">
                <span class="text-blue-600 mr-2 mt-0.5">🏨</span>
                <div>
                  <strong class="text-blue-800">만성질환·수술 후 회복, 의료+요양 동시 필요</strong><br>
                  <span class="text-gray-700">→ <strong class="text-blue-700">요양병원</strong> (치료와 돌봄 모두)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-purple-50 rounded">
                <span class="text-purple-600 mr-2 mt-0.5">🏡</span>
                <div>
                  <strong class="text-purple-800">일상 돌봄·장기요양등급 높은 경우</strong><br>
                  <span class="text-gray-700">→ <strong class="text-purple-700">요양원</strong> (생활 지원 중심)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 보험·비용 부담 -->
          <div class="bg-white rounded-lg p-4 border-2 border-orange-200">
            <h4 class="font-bold text-orange-800 mb-3 flex items-center">
              <span class="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">2</span>
              보험·비용 부담
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-start p-2 bg-green-50 rounded">
                <span class="text-green-600 mr-2 mt-0.5">💳</span>
                <div>
                  <strong class="text-green-800">건강보험 중심</strong><br>
                  <span class="text-gray-700">→ <strong class="text-green-700">요양병원·재활병원</strong> (본인 부담 20~30%)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-purple-50 rounded">
                <span class="text-purple-600 mr-2 mt-0.5">🏛️</span>
                <div>
                  <strong class="text-purple-800">장기요양보험·본인 부담 20%</strong><br>
                  <span class="text-gray-700">→ <strong class="text-purple-700">요양원</strong> (장기요양등급 필수)</span>
                </div>
              </div>
              <div class="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                <p class="text-xs text-yellow-800">
                  <i class="fas fa-lightbulb mr-1"></i>
                  <strong>팁:</strong> 장기요양등급이 있으면 요양원이 경제적으로 유리할 수 있어요
                </p>
              </div>
            </div>
          </div>

          <!-- 3. 입원 기간·연계 -->
          <div class="bg-white rounded-lg p-4 border-2 border-teal-200">
            <h4 class="font-bold text-teal-800 mb-3 flex items-center">
              <span class="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">3</span>
              입원 기간·연계 계획
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-start p-2 bg-blue-50 rounded">
                <span class="text-blue-600 mr-2 mt-0.5">📅</span>
                <div>
                  <strong class="text-blue-800">장기 입원 필요 (수개월~수년)</strong><br>
                  <span class="text-gray-700">→ <strong class="text-blue-700">요양병원</strong> (입원 기간 제한 없음)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-green-50 rounded">
                <span class="text-green-600 mr-2 mt-0.5">⚡</span>
                <div>
                  <strong class="text-green-800">재활 집중 기간 (45~90일)</strong><br>
                  <span class="text-gray-700">→ <strong class="text-green-700">재활병원</strong> (골든타임 집중 후 전원)</span>
                </div>
              </div>
              <div class="bg-indigo-50 p-2 rounded border-l-4 border-indigo-400">
                <p class="text-xs text-indigo-800">
                  <i class="fas fa-route mr-1"></i>
                  <strong>전환 플랜 설계:</strong> 재활병원(45~90일) → 요양병원(3~6개월) → 재택/요양원<br>
                  연계 계획을 미리 세우면 전체 비용과 시간을 절감할 수 있어요!
                </p>
              </div>
            </div>
          </div>

          <!-- 4. 의료·재활 강도 -->
          <div class="bg-white rounded-lg p-4 border-2 border-pink-200">
            <h4 class="font-bold text-pink-800 mb-3 flex items-center">
              <span class="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">4</span>
              의료·재활 강도
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-start p-2 bg-green-50 rounded">
                <span class="text-green-600 mr-2 mt-0.5">💪</span>
                <div>
                  <strong class="text-green-800">고강도 재활 필요 (하루 3시간+)</strong><br>
                  <span class="text-gray-700">→ <strong class="text-green-700">재활병원</strong> (전문 인력·장비 확인 필수!)</span>
                </div>
              </div>
              <div class="flex items-start p-2 bg-blue-50 rounded">
                <span class="text-blue-600 mr-2 mt-0.5">🏥</span>
                <div>
                  <strong class="text-blue-800">일반 치료·돌봄</strong><br>
                  <span class="text-gray-700">→ <strong class="text-blue-700">요양병원·요양원</strong> (치료 강도 사전 확인)</span>
                </div>
              </div>
              <div class="bg-red-50 p-2 rounded border-l-4 border-red-400">
                <p class="text-xs text-red-800">
                  <i class="fas fa-exclamation-triangle mr-1"></i>
                  <strong>주의:</strong> 요양병원도 재활 강도는 천차만별이에요!<br>
                  병원 방문 시 반드시 "재활 치료 횟수와 시간"을 직접 물어보세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  `, 'max-w-4xl');
  
  document.getElementById('modalContainer').appendChild(modal);
}

// 보호자 5대 혼란 설명 페이지
function showCaregiverConfusionGuide() {
  const modal = createModal(`
    <div class="space-y-6">
      <!-- 헤더 -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          <i class="fas fa-question-circle text-orange-600 mr-2"></i>
          보호자가 직면하는 5대 혼란
        </h2>
        <p class="text-lg text-gray-700">
          중증환자를 돌보는 보호자님, 이런 혼란을 겪고 계시지 않나요?
        </p>
      </div>

      <!-- 설명 카드 -->
      <div class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border-2 border-orange-200">
        <h3 class="text-xl font-bold text-orange-800 mb-4 flex items-center">
          <i class="fas fa-lightbulb text-orange-600 mr-2"></i>
          똑순이가 정리한 5가지 주요 문제
        </h3>
        
        <!-- 표 형태 -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr class="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <th class="px-4 py-3 text-left font-bold w-8">#</th>
                <th class="px-4 py-3 text-left font-bold">문제</th>
                <th class="px-4 py-3 text-left font-bold">구체적 내용</th>
                <th class="px-4 py-3 text-left font-bold">왜 어려운가?</th>
              </tr>
            </thead>
            <tbody>
              <!-- 1. 전원 경로 선택 -->
              <tr class="border-b border-gray-200 hover:bg-blue-50 transition">
                <td class="px-4 py-4 font-bold text-blue-600">1</td>
                <td class="px-4 py-4">
                  <span class="font-bold text-blue-700">전원 경로 선택</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  회복기 재활병원 → 요양병원 → 재택 등 여러 갈래가 존재
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  각 갈래마다 <strong>치료 목표·비용·시설 특성</strong>이 다름 → 정보 비대칭
                </td>
              </tr>
              
              <!-- 2. 비용·보험 계산 -->
              <tr class="border-b border-gray-200 hover:bg-green-50 transition">
                <td class="px-4 py-4 font-bold text-green-600">2</td>
                <td class="px-4 py-4">
                  <span class="font-bold text-green-700">비용·보험 계산</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  입원·재활·간병·보조기구·비급여 항목이 복합적으로 적용됨
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  급여/비급여, 본인부담률, 장기요양등급 등 <strong>계산 구조가 복잡</strong>함
                </td>
              </tr>
              
              <!-- 3. 간병·스케줄링 -->
              <tr class="border-b border-gray-200 hover:bg-purple-50 transition">
                <td class="px-4 py-4 font-bold text-purple-600">3</td>
                <td class="px-4 py-4">
                  <span class="font-bold text-purple-700">간병·스케줄링</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  24시간 간호, 가족 교대, 외부 간병인 등 다양한 옵션 존재
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  <strong>교대 시간·비용·인력 확보</strong>를 모두 고려해야 해 부담이 큼
                </td>
              </tr>
              
              <!-- 4. 서류·신청 자동화 -->
              <tr class="border-b border-gray-200 hover:bg-indigo-50 transition">
                <td class="px-4 py-4 font-bold text-indigo-600">4</td>
                <td class="px-4 py-4">
                  <span class="font-bold text-indigo-700">서류·신청 절차</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  퇴원 요약지, 전원 요청서, 장기요양등급 신청 등 다수의 서류 필요
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  <strong>서류 양식·마감일·제출처</strong>가 각기 달라 실수하기 쉬움
                </td>
              </tr>
              
              <!-- 5. 심리·시간 압박 -->
              <tr class="hover:bg-pink-50 transition">
                <td class="px-4 py-4 font-bold text-pink-600">5</td>
                <td class="px-4 py-4">
                  <span class="font-bold text-pink-700">심리·시간 압박</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  진단 직후 급하게 결정해야 하고, 정보를 찾을 시간이 부족함
                </td>
                <td class="px-4 py-4 text-sm text-gray-700">
                  <strong>정서적 충격 + 시간 제약</strong>으로 올바른 판단이 어려움
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 똑순이의 해결책 -->
      <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border-2 border-green-200">
        <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">
          <i class="fas fa-check-circle text-green-600 mr-2"></i>
          똑순이가 이 모든 혼란을 해결해드립니다
        </h3>
        
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <p class="font-bold text-blue-700 mb-1">✓ 전원 경로 시각화</p>
            <p class="text-sm text-gray-700">
              환자님의 상태(ADL, 진단)를 입력하면 <strong>최적 경로를 자동 추천</strong>해드려요
            </p>
          </div>
          
          <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <p class="font-bold text-green-700 mb-1">✓ 비용 자동 계산</p>
            <p class="text-sm text-gray-700">
              보험 종류, 장기요양등급, 병실 선택만 하면 <strong>총 비용을 즉시 산출</strong>해드려요
            </p>
          </div>
          
          <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p class="font-bold text-purple-700 mb-1">✓ 간병 스케줄 제안</p>
            <p class="text-sm text-gray-700">
              가족 교대, 외부 인력 등 <strong>최적 간병 스케줄</strong>을 추천해드려요
            </p>
          </div>
          
          <div class="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
            <p class="font-bold text-indigo-700 mb-1">✓ 서류 자동 생성</p>
            <p class="text-sm text-gray-700">
              필요한 서류를 <strong>자동으로 작성하고 제출처까지 안내</strong>해드려요
            </p>
          </div>
          
          <div class="bg-white rounded-lg p-4 border-l-4 border-pink-500">
            <p class="font-bold text-pink-700 mb-1">✓ 단계별 알림</p>
            <p class="text-sm text-gray-700">
              중요한 일정과 마감일을 <strong>푸시·SMS로 알림</strong>해드려요
            </p>
          </div>
        </div>
      </div>


    </div>
  `, 'max-w-5xl');
  
  document.getElementById('modalContainer').appendChild(modal);
}

// 커뮤니티 모달 표시
function showCommunityModal() {
  const modal = createModal(`
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          <i class="fas fa-users text-green-600 mr-2"></i>
          함께 나눠요
        </h2>
        <p class="text-lg text-gray-700">
          혼자 고민하지 마세요. 함께 이야기하고 정보를 나눠요! 😊
        </p>
      </div>

      <!-- 탭 네비게이션 -->
      <div class="flex border-b border-gray-300">
        <button onclick="switchCommunityTab('community')" 
                id="tab-community"
                class="community-tab flex-1 py-3 px-4 font-semibold text-gray-600 hover:text-green-600 border-b-2 border-transparent hover:border-green-600 transition-all">
          <i class="fas fa-comments mr-2"></i>
          커뮤니티
        </button>
        <button onclick="switchCommunityTab('blog')" 
                id="tab-blog"
                class="community-tab flex-1 py-3 px-4 font-semibold text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all">
          <i class="fas fa-book-open mr-2"></i>
          블로그
        </button>
        <button onclick="switchCommunityTab('youtube')" 
                id="tab-youtube"
                class="community-tab flex-1 py-3 px-4 font-semibold text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all">
          <i class="fab fa-youtube mr-2"></i>
          유튜브
        </button>
      </div>

      <!-- 커뮤니티 탭 -->
      <div id="content-community" class="community-content">
        <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border-2 border-green-200">
          <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">
            <i class="fas fa-comments text-green-600 mr-2"></i>
            자유롭게 이야기 나눠요
          </h3>
          
          <!-- 글쓰기 영역 -->
          <div class="bg-white rounded-lg p-4 mb-4 border-2 border-green-300">
            <textarea 
              id="communityPostContent"
              placeholder="어떤 고민이 있으신가요? 편하게 이야기해주세요..."
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows="4"></textarea>
            <div class="flex justify-between items-center mt-3">
              <span class="text-sm text-gray-500">💬 참여하고 소통해요</span>
              <button onclick="submitCommunityPost()" 
                      class="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-6 rounded-lg hover:from-green-600 hover:to-teal-600 transition font-semibold shadow-md">
                <i class="fas fa-paper-plane mr-2"></i>
                글 올리기
              </button>
            </div>
          </div>

          <!-- 게시글 목록 -->
          <div class="space-y-3" id="communityPostList">
            <!-- 예시 게시글 -->
            <div class="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    김
                  </div>
                  <span class="font-semibold text-gray-800">김○○님</span>
                  <span class="text-xs text-gray-500">2시간 전</span>
                </div>
              </div>
              <p class="text-gray-700 mb-3">
                어머니가 뇌졸중으로 쓰러지셔서 요양병원을 알아보고 있는데, 어디가 좋을지 모르겠어요. 강남 쪽에 괜찮은 곳 아시는 분 계실까요?
              </p>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <button class="hover:text-green-600 transition">
                  <i class="fas fa-comment mr-1"></i>
                  댓글 3
                </button>
                <button class="hover:text-red-500 transition">
                  <i class="fas fa-heart mr-1"></i>
                  응원 12
                </button>
              </div>
            </div>

            <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    박
                  </div>
                  <span class="font-semibold text-gray-800">박○○님</span>
                  <span class="text-xs text-gray-500">5시간 전</span>
                </div>
              </div>
              <p class="text-gray-700 mb-3">
                요양병원과 요양원의 차이를 잘 몰라서 많이 헤맸는데, 똑순이 덕분에 이해가 쏙쏙 됐어요! 감사합니다 😊
              </p>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <button class="hover:text-green-600 transition">
                  <i class="fas fa-comment mr-1"></i>
                  댓글 1
                </button>
                <button class="hover:text-red-500 transition">
                  <i class="fas fa-heart mr-1"></i>
                  응원 8
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 블로그 탭 -->
      <div id="content-blog" class="community-content hidden">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
          <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <i class="fas fa-book-open text-blue-600 mr-2"></i>
            전문가 칼럼
          </h3>
          
          <!-- 칼럼 목록 -->
          <div class="space-y-4">
            <div class="bg-white rounded-lg p-5 border-2 border-blue-300 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div class="flex items-start space-x-4">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-stethoscope text-white text-3xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-blue-800 mb-2">
                    뇌졸중 환자의 재활 치료, 어떻게 시작해야 할까요?
                  </h4>
                  <p class="text-sm text-gray-600 mb-2">
                    뇌졸중 발병 후 초기 재활 치료의 중요성과 단계별 치료 방법을 소개합니다.
                  </p>
                  <div class="flex items-center space-x-3 text-xs text-gray-500">
                    <span><i class="fas fa-user-md mr-1"></i>재활의학과 전문의</span>
                    <span><i class="fas fa-calendar mr-1"></i>2025.01.20</span>
                    <span><i class="fas fa-eye mr-1"></i>1,234회</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg p-5 border-2 border-purple-300 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div class="flex items-start space-x-4">
                <div class="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-hospital text-white text-3xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-purple-800 mb-2">
                    요양병원 선택 시 꼭 확인해야 할 체크리스트
                  </h4>
                  <p class="text-sm text-gray-600 mb-2">
                    좋은 요양병원을 선택하기 위한 실전 가이드와 체크포인트를 정리했습니다.
                  </p>
                  <div class="flex items-center space-x-3 text-xs text-gray-500">
                    <span><i class="fas fa-user-md mr-1"></i>병원 코디네이터</span>
                    <span><i class="fas fa-calendar mr-1"></i>2025.01.18</span>
                    <span><i class="fas fa-eye mr-1"></i>2,567회</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg p-5 border-2 border-green-300 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div class="flex items-start space-x-4">
                <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-hand-holding-heart text-white text-3xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-green-800 mb-2">
                    보호자를 위한 섬망 예방 및 대처 방법
                  </h4>
                  <p class="text-sm text-gray-600 mb-2">
                    섬망의 초기 증상을 알아보고 효과적으로 대처하는 방법을 알려드립니다.
                  </p>
                  <div class="flex items-center space-x-3 text-xs text-gray-500">
                    <span><i class="fas fa-user-md mr-1"></i>신경과 전문의</span>
                    <span><i class="fas fa-calendar mr-1"></i>2025.01.15</span>
                    <span><i class="fas fa-eye mr-1"></i>3,891회</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 유튜브 탭 -->
      <div id="content-youtube" class="community-content hidden">
        <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 border-2 border-red-200">
          <h3 class="text-xl font-bold text-red-800 mb-4 flex items-center">
            <i class="fab fa-youtube text-red-600 mr-2"></i>
            유용한 영상
          </h3>
          
          <!-- 유튜브 영상 목록 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-lg overflow-hidden border-2 border-red-300 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div class="aspect-video bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                <i class="fab fa-youtube text-white text-6xl"></i>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-gray-800 mb-2">
                  뇌졸중 환자 재활운동 따라하기
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  집에서 할 수 있는 간단한 재활운동을 소개합니다.
                </p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <span><i class="fas fa-play-circle mr-1"></i>15분</span>
                  <span><i class="fas fa-eye mr-1"></i>12,345회</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg overflow-hidden border-2 border-blue-300 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div class="aspect-video bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <i class="fab fa-youtube text-white text-6xl"></i>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-gray-800 mb-2">
                  요양병원 vs 요양원, 완벽 비교
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  두 시설의 차이점을 알기 쉽게 설명해드립니다.
                </p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <span><i class="fas fa-play-circle mr-1"></i>8분</span>
                  <span><i class="fas fa-eye mr-1"></i>8,901회</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg overflow-hidden border-2 border-purple-300 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div class="aspect-video bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <i class="fab fa-youtube text-white text-6xl"></i>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-gray-800 mb-2">
                  장기요양등급 신청 완벽 가이드
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  장기요양등급 신청부터 인정까지 전 과정을 설명합니다.
                </p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <span><i class="fas fa-play-circle mr-1"></i>12분</span>
                  <span><i class="fas fa-eye mr-1"></i>6,234회</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg overflow-hidden border-2 border-green-300 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div class="aspect-video bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                <i class="fab fa-youtube text-white text-6xl"></i>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-gray-800 mb-2">
                  보호자를 위한 간병 팁
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  간병 시 알아두면 좋은 실전 노하우를 공유합니다.
                </p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <span><i class="fas fa-play-circle mr-1"></i>20분</span>
                  <span><i class="fas fa-eye mr-1"></i>15,678회</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 안내 메시지 -->
      <div class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <p class="text-sm text-yellow-800 text-center">
          <i class="fas fa-info-circle mr-2"></i>
          <strong>알림:</strong> 커뮤니티 기능은 현재 개발 중입니다. 곧 더 나은 서비스로 찾아뵙겠습니다!
        </p>
      </div>
    </div>
  `, 'max-w-5xl');
  
  document.getElementById('modalContainer').appendChild(modal);
  
  // 첫 번째 탭 활성화
  switchCommunityTab('community');
}

// 커뮤니티 탭 전환
function switchCommunityTab(tabName) {
  // 모든 탭 버튼과 콘텐츠 비활성화
  document.querySelectorAll('.community-tab').forEach(tab => {
    tab.classList.remove('border-green-600', 'border-blue-600', 'border-red-600', 'text-green-600', 'text-blue-600', 'text-red-600');
    tab.classList.add('text-gray-600');
  });
  document.querySelectorAll('.community-content').forEach(content => {
    content.classList.add('hidden');
  });
  
  // 선택된 탭 활성화
  const selectedTab = document.getElementById(`tab-${tabName}`);
  const selectedContent = document.getElementById(`content-${tabName}`);
  
  if (tabName === 'community') {
    selectedTab.classList.remove('text-gray-600');
    selectedTab.classList.add('text-green-600', 'border-green-600');
  } else if (tabName === 'blog') {
    selectedTab.classList.remove('text-gray-600');
    selectedTab.classList.add('text-blue-600', 'border-blue-600');
  } else if (tabName === 'youtube') {
    selectedTab.classList.remove('text-gray-600');
    selectedTab.classList.add('text-red-600', 'border-red-600');
  }
  
  selectedContent.classList.remove('hidden');
}

// 커뮤니티 게시글 제출
function submitCommunityPost() {
  const content = document.getElementById('communityPostContent').value.trim();
  
  if (!content) {
    alert('내용을 입력해주세요.');
    return;
  }
  
  // 임시로 알림만 표시 (실제로는 API 호출)
  alert('게시글이 등록되었습니다!\n\n커뮤니티 기능은 현재 개발 중입니다. 곧 더 나은 서비스로 찾아뵙겠습니다.');
  document.getElementById('communityPostContent').value = '';
}

// 모달 닫고 환자 정보 입력 모달 표시
function closeModalAndShowForm() {
  // 현재 모달 닫기
  const modal = document.querySelector('.fixed.inset-0');
  if (modal) modal.remove();
  
  // 짧은 지연 후 환자 정보 입력 모달 표시
  setTimeout(() => {
    showPatientFormModal();
  }, 100);
}

// 퀘스트 카드 상태 업데이트
function updateQuestCards(currentStep) {
  const cards = document.querySelectorAll('.quest-card-3d');
  let completedQuests = currentStep - 1;
  
  cards.forEach((card, index) => {
    const questNumber = index + 1;
    const statusBadge = card.querySelector('.quest-status');
    
    // 1번, 2번, 3번 카드는 항상 클릭 가능하게 (가이드 용도)
    if (questNumber === 1 || questNumber === 2 || questNumber === 3) {
      card.classList.remove('opacity-60');
      statusBadge.className = 'quest-status status-available';
      statusBadge.textContent = '시작';
      card.style.pointerEvents = 'auto';
    }
    else if (questNumber < currentStep) {
      // 완료된 퀘스트
      card.classList.remove('opacity-60');
      statusBadge.className = 'quest-status status-completed';
      statusBadge.textContent = '완료';
      card.style.pointerEvents = 'none';
    } else if (questNumber === currentStep) {
      // 현재 진행 중인 퀘스트
      card.classList.remove('opacity-60');
      statusBadge.className = 'quest-status status-available';
      statusBadge.textContent = '진행중';
      card.style.pointerEvents = 'auto';
    } else {
      // 잠금된 퀘스트
      card.classList.add('opacity-60');
      statusBadge.className = 'quest-status status-locked';
      statusBadge.textContent = '잠김';
      card.style.pointerEvents = 'none';
    }
  });
  
  // 진행도 바 업데이트
  const progress = (completedQuests / 4) * 100;
  const progressBar = document.getElementById('questProgressBar');
  const progressText = document.getElementById('questProgress');
  
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
  
  if (progressText) {
    progressText.textContent = `${completedQuests}/4 완료`;
  }
}

// 단계 이동
function goToStep(step) {
  updateProgressSteps(step);
  
  // 섹션 표시/숨김
  const sections = ['registerForm', 'pathwayResult', 'costResult', 'facilitiesResult'];
  sections.forEach((id, index) => {
    const section = document.getElementById(id);
    if (section) {
      if (index + 1 === step) {
        section.classList.remove('hidden');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        section.classList.add('hidden');
      }
    }
  });
  
  // 웰컴 메시지는 1단계에만 표시
  const welcomeMsg = document.getElementById('welcomeMessage');
  if (welcomeMsg) {
    if (step === 1) {
      welcomeMsg.classList.remove('hidden');
    } else {
      welcomeMsg.classList.add('hidden');
    }
  }
  
  // 각 단계별 콘텐츠 로드
  if (step === 2 && currentPatient) {
    loadPathwayRecommendation();
  } else if (step === 3 && currentPatient) {
    loadCostEstimation();
  } else if (step === 4 && currentPatient) {
    loadFacilities();
  }
}

// ADL 값 업데이트
function updateADLValue(value) {
  document.getElementById('adlValue').textContent = value + '점';
}

// GCS 총점 업데이트
function updateGCSTotal() {
  const eye = parseInt(document.querySelector('select[name="gcs_eye"]')?.value || 4);
  const verbal = parseInt(document.querySelector('select[name="gcs_verbal"]')?.value || 5);
  const motor = parseInt(document.querySelector('select[name="gcs_motor"]')?.value || 6);
  
  const total = eye + verbal + motor;
  const totalElement = document.getElementById('gcsTotal');
  const levelElement = document.getElementById('gcsLevel');
  
  if (totalElement) {
    totalElement.textContent = total + '점';
  }
  
  if (levelElement) {
    let level, color;
    if (total === 15) {
      level = '정상';
      color = 'bg-green-100 text-green-800';
    } else if (total >= 13) {
      level = '경미한 장애';
      color = 'bg-blue-100 text-blue-800';
    } else if (total >= 9) {
      level = '중등도 장애';
      color = 'bg-yellow-100 text-yellow-800';
    } else {
      level = '중증 장애';
      color = 'bg-red-100 text-red-800';
    }
    
    levelElement.textContent = level;
    levelElement.className = `text-xs px-2 py-1 rounded ${color}`;
  }
  
  return total;
}

// ADL 가이드 표시
function showADLGuide() {
  const modal = createModal(`
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          <i class="fas fa-walking text-blue-600 mr-2"></i>
          일상생활 수행능력 (ADL) 평가 가이드
        </h2>
        <p class="text-gray-600 mb-4">
          환자가 혼자서 할 수 있는 일상생활 동작을 평가합니다. 
          아래 항목들을 참고하여 대략적인 점수를 입력하세요.
        </p>
      </div>

      <div class="bg-gradient-to-r from-red-50 to-green-50 p-6 rounded-lg">
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="w-24 text-center">
              <div class="text-2xl font-bold text-red-600">0-30점</div>
              <div class="text-xs text-red-600">중증</div>
            </div>
            <div class="flex-1 pl-4 border-l-2 border-red-300">
              <h4 class="font-semibold text-gray-800 mb-2">거의 모든 일상생활에 전적인 도움 필요</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• 침대에서 스스로 일어나지 못함</li>
                <li>• 식사를 혼자 할 수 없음 (식사 도움 필요)</li>
                <li>• 옷 입고 벗기를 전혀 못함</li>
                <li>• 대소변을 가리지 못하거나 기저귀 사용</li>
                <li>• 목욕을 전혀 혼자 못함</li>
              </ul>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-24 text-center">
              <div class="text-2xl font-bold text-orange-600">40-60점</div>
              <div class="text-xs text-orange-600">중등도</div>
            </div>
            <div class="flex-1 pl-4 border-l-2 border-orange-300">
              <h4 class="font-semibold text-gray-800 mb-2">일부 일상생활에 도움 필요</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• 침대에서 일어나는데 도움이 필요함</li>
                <li>• 식사를 혼자 하지만 준비는 도움 필요</li>
                <li>• 간단한 옷은 혼자 입지만 복잡한 옷은 도움 필요</li>
                <li>• 화장실 사용 가능하지만 이동에 도움 필요</li>
                <li>• 샤워는 도움 받아 가능</li>
              </ul>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-24 text-center">
              <div class="text-2xl font-bold text-green-600">70-100점</div>
              <div class="text-xs text-green-600">경증</div>
            </div>
            <div class="flex-1 pl-4 border-l-2 border-green-300">
              <h4 class="font-semibold text-gray-800 mb-2">대부분의 일상생활을 혼자 가능</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• 침대에서 혼자 일어날 수 있음</li>
                <li>• 식사를 혼자 할 수 있음</li>
                <li>• 옷을 혼자 입고 벗을 수 있음</li>
                <li>• 화장실을 혼자 사용할 수 있음</li>
                <li>• 씻기와 목욕을 혼자 할 수 있음</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-semibold text-blue-800 mb-2">
          <i class="fas fa-lightbulb mr-2"></i>간단 평가 방법
        </h4>
        <p class="text-sm text-blue-700 mb-3">
          다음 5가지 항목에서 혼자 할 수 있는 것의 개수로 대략 판단하세요:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div class="flex items-center">
            <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">1</span>
            <span>식사하기</span>
          </div>
          <div class="flex items-center">
            <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">2</span>
            <span>옷 입고 벗기</span>
          </div>
          <div class="flex items-center">
            <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">3</span>
            <span>화장실 사용</span>
          </div>
          <div class="flex items-center">
            <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">4</span>
            <span>목욕/씻기</span>
          </div>
          <div class="flex items-center col-span-full">
            <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">5</span>
            <span>걷기 또는 이동하기</span>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
          <div class="bg-white p-2 rounded">
            <div class="font-semibold text-red-600">0-1개 가능</div>
            <div class="text-gray-600">→ 약 20점</div>
          </div>
          <div class="bg-white p-2 rounded">
            <div class="font-semibold text-orange-600">2-3개 가능</div>
            <div class="text-gray-600">→ 약 50점</div>
          </div>
          <div class="bg-white p-2 rounded">
            <div class="font-semibold text-green-600">4-5개 가능</div>
            <div class="text-gray-600">→ 약 80점</div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-sm text-gray-600">
          <i class="fas fa-info-circle text-gray-500 mr-2"></i>
          <strong>참고:</strong> 이 점수는 대략적인 평가입니다. 
          정확한 평가는 의료진이 수행하며, 전원 경로 추천에만 참고용으로 사용됩니다.
        </p>
      </div>
    </div>
  `, 'max-w-4xl');
  
  document.getElementById('modalContainer').appendChild(modal);
}

// 도움말 표시
function showHelp(type) {
  let content = '';
  
  switch(type) {
    case 'diagnosis_date':
      content = `
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-gray-800">
            <i class="fas fa-calendar-check text-blue-600 mr-2"></i>
            발병/수술일이란?
          </h3>
          <div class="space-y-3 text-gray-700">
            <p class="font-semibold text-gray-800">주요 치료가 시작된 날짜를 의미합니다:</p>
            <ul class="space-y-2 ml-4">
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <div>
                  <strong>뇌졸중 (뇌경색, 뇌출혈):</strong> 
                  <span class="text-gray-600">쓰러지거나 증상이 발생한 날짜</span>
                </div>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <div>
                  <strong>암 환자:</strong> 
                  <span class="text-gray-600">수술을 받은 날짜 (또는 항암치료 시작일)</span>
                </div>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <div>
                  <strong>골절/사고:</strong> 
                  <span class="text-gray-600">사고가 발생한 날짜 또는 수술일</span>
                </div>
              </li>
            </ul>
            <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
              <p class="text-sm text-yellow-800">
                <i class="fas fa-lightbulb mr-2"></i>
                <strong>왜 중요한가요?</strong><br>
                발병일로부터 경과 기간에 따라 적절한 재활 시기와 전원 계획이 달라집니다.
                예를 들어, 뇌졸중은 발병 후 3개월이 재활의 골든타임입니다.
              </p>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'insurance':
      content = `
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-gray-800">
            <i class="fas fa-id-card text-blue-600 mr-2"></i>
            건강보험 유형이란?
          </h3>
          <div class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h4 class="font-semibold text-blue-800 mb-3">
                <i class="fas fa-building mr-2"></i>직장가입자 (고용보험)
              </h4>
              <p class="text-sm text-gray-700 mb-3">
                회사나 직장에 다니면서 건강보험료를 회사와 본인이 반반씩 부담하는 경우입니다.
                건강보험증에 "직장"이라고 표시되어 있습니다.
              </p>
              
              <div class="bg-white rounded-lg p-3 mt-2 space-y-2 border border-blue-200">
                <div class="text-xs text-gray-700">
                  <div class="font-semibold text-blue-700 mb-2">📋 주요 특징:</div>
                  <ul class="space-y-1 ml-4">
                    <li>• <strong>고용주가 50%를 부담</strong> (본인 부담 50%)</li>
                    <li>• 급여 비율: <strong>입원 약 80%</strong>, <strong>외래 약 30%</strong></li>
                    <li>• <strong>가족·피부양자</strong>(배우자, 자녀, 부모 등)도 동일 보험 적용 가능</li>
                  </ul>
                </div>
                
                <div class="text-xs text-gray-700 mt-2 pt-2 border-t border-blue-100">
                  <div class="font-semibold text-blue-700 mb-2">👥 적용 대상:</div>
                  <ul class="space-y-1 ml-4">
                    <li>• <strong>본인인 경우:</strong> 현재 직장(사업장)에 고용된 사람</li>
                    <li>• <strong>피부양자:</strong> 직장에 다니는 사람의 가족·피부양자 (직장보험 적용)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 border-l-4 border-green-500 p-4">
              <h4 class="font-semibold text-green-800 mb-3">
                <i class="fas fa-home mr-2"></i>지역가입자 (주민보험)
              </h4>
              <p class="text-sm text-gray-700 mb-3">
                자영업자, 무직자 등 직장에 다니지 않아 개인이 건강보험료를 전액 부담하는 경우입니다.
                건강보험증에 "지역"이라고 표시되어 있습니다.
              </p>
              
              <div class="bg-white rounded-lg p-3 mt-2 space-y-2 border border-green-200">
                <div class="text-xs text-gray-700">
                  <div class="font-semibold text-green-700 mb-2">📋 주요 특징:</div>
                  <ul class="space-y-1 ml-4">
                    <li>• <strong>본인이 100% 부담</strong> (고용주 부담 없음)</li>
                    <li>• 급여 비율: <strong>입원 약 80%</strong>, <strong>외래 약 30%</strong> (직장가입자와 동일)</li>
                    <li>• 소득·재산에 따라 보험료 산정</li>
                  </ul>
                </div>
                
                <div class="text-xs text-gray-700 mt-2 pt-2 border-t border-green-100">
                  <div class="font-semibold text-green-700 mb-2">👥 적용 대상:</div>
                  <ul class="space-y-1 ml-4">
                    <li>• 자영업자, 프리랜서, 무직자</li>
                    <li>• 직장가입자의 피부양자 자격이 없는 사람</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-purple-50 border-l-4 border-purple-500 p-4">
              <h4 class="font-semibold text-purple-800 mb-3">
                <i class="fas fa-landmark mr-2"></i>특수·공공지원
              </h4>
              <p class="text-sm text-gray-700 mb-3">
                의료급여, 산재보험, 보훈, 기타 공공 지원 등 특수한 보험 혜택을 받는 경우입니다.
              </p>
              
              <div class="bg-white rounded-lg p-3 mt-2 space-y-2 border border-purple-200">
                <div class="text-xs text-gray-700">
                  <div class="font-semibold text-purple-700 mb-2">📋 포함 항목:</div>
                  <ul class="space-y-1 ml-4">
                    <li>• <strong>의료급여 (1종/2종):</strong> 기초생활수급자, 차상위계층</li>
                    <li>• <strong>산재보험:</strong> 업무상 재해로 인한 경우 (본인 부담 0%)</li>
                    <li>• <strong>보훈 대상자:</strong> 국가유공자, 보훈 등록자</li>
                    <li>• <strong>기타 공공지원:</strong> 특수 공무원, 군인 가족 등</li>
                  </ul>
                </div>
                
                <div class="text-xs text-gray-700 mt-2 pt-2 border-t border-purple-100">
                  <div class="font-semibold text-purple-700 mb-2">💡 확인 방법:</div>
                  <ul class="space-y-1 ml-4">
                    <li>• 의료급여증, 산재승인서, 보훈등록증 등 확인</li>
                    <li>• 해당 증명서가 있으면 특수·공공지원에 해당</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded p-4 mt-4">
              <h4 class="font-semibold text-gray-800 mb-2">
                <i class="fas fa-search mr-2"></i>확인 방법
              </h4>
              <p class="text-sm text-gray-700">
                건강보험증 또는 의료급여증을 확인하시면 유형을 알 수 있습니다.
                잘 모르겠다면 가족에게 물어보거나 병원 원무과에 문의하세요.
              </p>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
              <p class="text-sm text-yellow-800">
                <i class="fas fa-info-circle mr-2"></i>
                건강보험 유형에 따라 본인부담률이 다르므로 비용 계산에 중요합니다.
              </p>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'ltc':
      content = `
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-gray-800">
            <i class="fas fa-clipboard-check text-blue-600 mr-2"></i>
            장기요양등급이란?
          </h3>
          
          <p class="text-gray-700">
            고령이나 노인성 질병으로 인해 혼자 일상생활이 어려운 분들을 위한 
            <strong class="text-blue-600">국가 지원 제도</strong>입니다.
          </p>

          <div class="space-y-3">
            <div class="bg-red-50 border-l-4 border-red-500 p-3">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-semibold text-red-800">1급 (최중증)</h4>
                <span class="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">점수 95점 이상</span>
              </div>
              <p class="text-sm text-gray-700">완전 와상 상태, 거의 모든 일상생활에 전적인 도움 필요</p>
            </div>

            <div class="bg-orange-50 border-l-4 border-orange-500 p-3">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-semibold text-orange-800">2급 (중증)</h4>
                <span class="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">점수 75-95점</span>
              </div>
              <p class="text-sm text-gray-700">거의 와상 상태, 대부분의 일상생활에 상당한 도움 필요</p>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-3">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-semibold text-yellow-800">3급 (중등증)</h4>
                <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">점수 60-75점</span>
              </div>
              <p class="text-sm text-gray-700">부분적 도움 필요, 일부 일상생활 가능하지만 지원 필요</p>
            </div>

            <div class="bg-green-50 border-l-4 border-green-500 p-3">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-semibold text-green-800">4급 (경증)</h4>
                <span class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">점수 51-60점</span>
              </div>
              <p class="text-sm text-gray-700">약간의 도움 필요, 기본적인 일상생활은 가능</p>
            </div>

            <div class="bg-blue-50 border-l-4 border-blue-500 p-3">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-semibold text-blue-800">5급 (경증)</h4>
                <span class="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">점수 45-51점</span>
              </div>
              <p class="text-sm text-gray-700">치매 환자 중심, 신체 기능은 양호하나 인지 문제로 일부 지원 필요</p>
            </div>
          </div>

          <div class="bg-purple-50 border border-purple-200 rounded p-4 mt-4">
            <h4 class="font-semibold text-purple-800 mb-2">
              <i class="fas fa-file-alt mr-2"></i>신청 방법
            </h4>
            <ol class="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
              <li>국민건강보험공단에 신청 (전화 1577-1000 또는 방문)</li>
              <li>공단 직원이 방문하여 조사 (약 2주 소요)</li>
              <li>등급 판정 결과 통보 (조사 후 약 1개월)</li>
            </ol>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded p-3">
            <p class="text-sm text-blue-800">
              <i class="fas fa-lightbulb mr-2"></i>
              <strong>혜택:</strong> 요양병원, 요양원 이용 시 비용의 80-85%를 국가에서 지원받습니다.
            </p>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded p-3">
            <p class="text-sm text-gray-700">
              <i class="fas fa-info-circle mr-2"></i>
              아직 신청하지 않았다면 <strong>'아직 신청 안함'</strong>을 선택하세요.
              전원 경로 추천 시 적절한 신청 시기를 안내해드립니다.
            </p>
          </div>
        </div>
      `;
      break;
      
    case 'facility_types':
      content = `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-5">
            <h3 class="text-2xl font-bold text-red-800 mb-2 flex items-center">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              많은 분들이 혼동하시는 부분!
            </h3>
            <p class="text-lg text-gray-700">
              <strong>요양병원</strong>과 <strong>요양시설</strong>은 <span class="text-red-600 font-bold">완전히 다른 기관</span>입니다!
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 요양병원 -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-lg p-5">
              <div class="flex items-center mb-3">
                <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-3">
                  <i class="fas fa-hospital text-2xl"></i>
                </div>
                <h4 class="text-xl font-bold text-blue-800">요양병원</h4>
              </div>
              <p class="text-sm text-gray-600 mb-3 font-semibold">(의료기관 = 병원)</p>
              
              <div class="space-y-2 text-sm">
                <div class="bg-white rounded p-2">
                  <p class="font-semibold text-green-700 mb-1">
                    <i class="fas fa-check-circle mr-1"></i>장기요양등급 필요 없음
                  </p>
                  <p class="text-gray-600 text-xs">건강보험만 있으면 입원 가능</p>
                </div>
                
                <div class="bg-white rounded p-2">
                  <p class="font-semibold text-blue-700 mb-1">
                    <i class="fas fa-user-md mr-1"></i>의사 진료 제공
                  </p>
                  <p class="text-gray-600 text-xs">의료행위 가능 (주사, 처치, 수술 등)</p>
                </div>
                
                <div class="bg-white rounded p-2">
                  <p class="font-semibold text-purple-700 mb-1">
                    <i class="fas fa-percentage mr-1"></i>산정특례 적용 가능
                  </p>
                  <p class="text-gray-600 text-xs">암, 중증질환 → 본인부담 5% or 10%</p>
                </div>
                
                <div class="bg-green-50 border border-green-300 rounded p-2 mt-2">
                  <p class="text-xs font-semibold text-green-800 mb-1">
                    <i class="fas fa-clipboard-check mr-1"></i>입원 조건:
                  </p>
                  <ul class="text-xs text-gray-700 ml-3 space-y-1">
                    <li>• 의사가 입원 필요성 판단</li>
                    <li>• 급성기 이후 지속적 치료 필요</li>
                  </ul>
                </div>
                
                <div class="bg-blue-50 border border-blue-300 rounded p-2 mt-2">
                  <p class="text-xs font-semibold text-blue-800 mb-1">
                    <i class="fas fa-won-sign mr-1"></i>비용 예시 (폐암 산정특례):
                  </p>
                  <ul class="text-xs text-gray-700 ml-3 space-y-1">
                    <li>• 6인실 입원료: <strong>5% 부담</strong></li>
                    <li>• 치료비, 검사비: <strong>5% 부담</strong></li>
                    <li>• 상급병실 차액: <strong>100% 부담</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 요양시설 -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 rounded-lg p-5">
              <div class="flex items-center mb-3">
                <div class="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-3">
                  <i class="fas fa-home text-2xl"></i>
                </div>
                <h4 class="text-xl font-bold text-orange-800">요양시설/요양원</h4>
              </div>
              <p class="text-sm text-gray-600 mb-3 font-semibold">(장기요양기관 = 복지시설)</p>
              
              <div class="space-y-2 text-sm">
                <div class="bg-white rounded p-2">
                  <p class="font-semibold text-red-700 mb-1">
                    <i class="fas fa-exclamation-circle mr-1"></i>장기요양등급 필수
                  </p>
                  <p class="text-gray-600 text-xs">1~5등급 중 하나 필요</p>
                </div>
                
                <div class="bg-white rounded p-2">
                  <p class="font-semibold text-orange-700 mb-1">
                    <i class="fas fa-hands-helping mr-1"></i>요양보호사 중심 돌봄
                  </p>
                  <p class="text-gray-600 text-xs">의료행위 제한적 (간단한 투약 정도)</p>
                </div>
                
                <div class="bg-white rounded p-2">
                  <p class="font-semibold text-purple-700 mb-1">
                    <i class="fas fa-shield-alt mr-1"></i>장기요양보험 적용
                  </p>
                  <p class="text-gray-600 text-xs">국가 지원 80-85% (1~5등급)</p>
                </div>
                
                <div class="bg-orange-50 border border-orange-300 rounded p-2 mt-2">
                  <p class="text-xs font-semibold text-orange-800 mb-1">
                    <i class="fas fa-clipboard-check mr-1"></i>이용 조건:
                  </p>
                  <ul class="text-xs text-gray-700 ml-3 space-y-1">
                    <li>• 65세 이상 or 노인성 질병</li>
                    <li>• 장기요양등급 인정 필수</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 실제 경로 비교 -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-5">
            <h4 class="text-lg font-bold text-purple-800 mb-3 flex items-center">
              <i class="fas fa-route mr-2"></i>
              실제 경로 비교: 폐암 환자의 경우
            </h4>
            <div class="relative">
              <div class="flex flex-col space-y-3">
                <div class="flex items-center">
                  <div class="bg-purple-600 text-white rounded px-3 py-2 font-semibold text-sm">
                    급성기 병원 (수술, 항암)
                  </div>
                </div>
                <div class="flex items-center ml-8">
                  <i class="fas fa-arrow-down text-purple-600 text-2xl mr-2"></i>
                  <span class="text-gray-600 text-sm">회복 후 퇴원 or 전원</span>
                </div>
                <div class="flex items-center">
                  <div class="bg-blue-600 text-white rounded px-3 py-2 font-semibold text-sm">
                    요양병원
                  </div>
                  <span class="ml-3 text-xs text-green-700 font-semibold">
                    <i class="fas fa-check-circle mr-1"></i>산정특례만 있으면 됨
                  </span>
                </div>
                <div class="flex items-center ml-8">
                  <i class="fas fa-arrow-down text-purple-600 text-2xl mr-2"></i>
                  <span class="text-gray-600 text-sm">(상태 안정 후)</span>
                </div>
                <div class="flex items-center">
                  <div class="bg-orange-600 text-white rounded px-3 py-2 font-semibold text-sm">
                    재가 or 요양시설
                  </div>
                  <span class="ml-3 text-xs text-red-700 font-semibold">
                    <i class="fas fa-exclamation-circle mr-1"></i>장기요양등급 필요
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 헷갈리는 이유 -->
          <div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
            <h4 class="font-bold text-yellow-800 mb-2 flex items-center">
              <i class="fas fa-question-circle mr-2"></i>
              왜 헷갈리나요?
            </h4>
            <p class="text-sm text-gray-700 mb-2">
              <strong>이름이 비슷해서!</strong> 하지만 완전히 다릅니다:
            </p>
            <ul class="text-sm text-gray-700 ml-4 space-y-1">
              <li>• <strong>요양병원</strong>: 의료기관 (병원)</li>
              <li>• <strong>요양시설</strong>: 복지시설 (요양원)</li>
            </ul>
          </div>

          <!-- 실무 팁 -->
          <div class="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-400 rounded-lg p-4">
            <h4 class="font-bold text-green-800 mb-3 flex items-center">
              <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>
              실무 팁
            </h4>
            <div class="space-y-2 text-sm">
              <div class="bg-white rounded p-3">
                <p class="font-semibold text-blue-700 mb-1">
                  <i class="fas fa-arrow-right text-blue-600 mr-2"></i>
                  의사의 지속적 치료가 필요한 경우
                </p>
                <p class="text-gray-600 ml-6">→ <strong>요양병원</strong> (산정특례 적용)</p>
              </div>
              <div class="bg-white rounded p-3">
                <p class="font-semibold text-orange-700 mb-1">
                  <i class="fas fa-arrow-right text-orange-600 mr-2"></i>
                  일상생활 돌봄만 필요한 경우
                </p>
                <p class="text-gray-600 ml-6">→ <strong>요양시설</strong> (장기요양등급 필요)</p>
              </div>
              <div class="bg-white rounded p-3">
                <p class="font-semibold text-purple-700 mb-1">
                  <i class="fas fa-sync-alt text-purple-600 mr-2"></i>
                  둘 다 필요한 시기도 있음
                </p>
                <p class="text-gray-600 ml-6">→ 순차적으로 이용 (요양병원 → 요양시설)</p>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
  }
  
  const modal = createModal(content, 'max-w-3xl');
  document.getElementById('modalContainer').appendChild(modal);
}

// 환자 목록 로드
async function loadPatients() {
  try {
    const response = await axios.get(`${API_BASE}/patients`);
    const patients = response.data.data;
    
    const container = document.getElementById('patientsList');
    if (!container) return;
    
    if (patients.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 text-gray-500">
          <i class="fas fa-user-injured text-6xl mb-4"></i>
          <p class="text-lg">등록된 환자가 없습니다.</p>
          <p class="text-sm">아래 폼에서 환자를 등록해주세요.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = patients.map(patient => `
      <div class="bg-white rounded-lg shadow-md p-6 card-hover cursor-pointer" onclick="showPatientDetail(${patient.id})">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">${patient.name}</h3>
            <p class="text-sm text-gray-600">${patient.age}세 · ${patient.diagnosis}</p>
          </div>
          <span class="px-3 py-1 text-xs font-semibold rounded-full ${getSeverityColor(patient.severity)}">
            ${getSeverityLabel(patient.severity)}
          </span>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex items-center text-gray-600">
            <i class="fas fa-hospital w-5"></i>
            <span>${patient.current_hospital}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <i class="fas fa-heartbeat w-5"></i>
            <span>ADL 점수: ${patient.adl_score}점</span>
          </div>
          <div class="flex items-center text-gray-600">
            <i class="fas fa-calendar w-5"></i>
            <span>${new Date(patient.diagnosis_date).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
        <button class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm">
          상세 보기 <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load patients:', error);
    showError('환자 목록을 불러오는데 실패했습니다.');
  }
}

// 환자 등록 처리
async function handlePatientSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  // GCS 점수 계산
  const gcsEye = parseInt(formData.get('gcs_eye') || 4);
  const gcsVerbal = parseInt(formData.get('gcs_verbal') || 5);
  const gcsMotor = parseInt(formData.get('gcs_motor') || 6);
  const gcsTotal = gcsEye + gcsVerbal + gcsMotor;
  
  // GCS 점수를 의식수준 텍스트로 변환
  let consciousnessLevel;
  if (gcsTotal === 15) {
    consciousnessLevel = '명료 (GCS 15)';
  } else if (gcsTotal >= 13) {
    consciousnessLevel = `경미한 의식 장애 (GCS ${gcsTotal})`;
  } else if (gcsTotal >= 9) {
    consciousnessLevel = `중등도 의식 장애 (GCS ${gcsTotal})`;
  } else {
    consciousnessLevel = `중증 의식 장애 (GCS ${gcsTotal})`;
  }
  
  const data = {
    name: formData.get('name'),
    age: parseInt(formData.get('age')),
    diagnosis: formData.get('diagnosis'),
    diagnosis_date: formData.get('diagnosis_date'),
    adl_score: parseInt(formData.get('adl_score')),
    consciousness_level: consciousnessLevel,
    insurance_type: formData.get('insurance_type'),
    ltc_grade: formData.get('ltc_grade') ? parseInt(formData.get('ltc_grade')) : null,
    current_hospital: formData.get('current_hospital'),
    comorbidities: JSON.stringify({
      gcs_eye: gcsEye,
      gcs_verbal: gcsVerbal,
      gcs_motor: gcsMotor,
      gcs_total: gcsTotal
    })
  };
  
  try {
    // 로딩 표시
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>분석 중...';
    
    const response = await axios.post(`${API_BASE}/patients`, data);
    
    if (response.data.success) {
      // 환자 정보 저장
      currentPatient = {
        id: response.data.data.id,
        ...data
      };
      
      // 체크리스트 자동 생성
      await axios.post(`${API_BASE}/checklists/generate`, {
        patientId: currentPatient.id,
        transferType: 'acute_to_rehab'
      });
      
      showSuccess('환자 정보가 등록되었습니다! 맞춤형 전원 경로를 분석 중입니다...');
      
      // 폼 숨기기 및 2단계로 자동 이동 (웰컴 메시지도 숨김)
      setTimeout(() => {
        document.getElementById('welcomeMessage').classList.add('hidden');
        goToStep(2);
      }, 1500);
    }
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  } catch (error) {
    console.error('Failed to register patient:', error);
    showError('환자 등록에 실패했습니다. 다시 시도해주세요.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// 경로 추천 로드
async function loadPathwayRecommendation() {
  try {
    const response = await axios.get(`${API_BASE}/patients/${currentPatient.id}`);
    const { patient, pathways } = response.data.data;
    
    // 환자 이름 표시
    document.getElementById('patientNameDisplay').textContent = patient.name;
    
    const content = document.getElementById('pathwayContent');
    
    if (pathways.length === 0) {
      content.innerHTML = '<p class="text-gray-500 text-center py-8">경로 추천 정보를 불러올 수 없습니다.</p>';
      return;
    }
    
    // 환자 상태 요약
    const statusSummary = `
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
        <h3 class="font-bold text-blue-800 mb-3 flex items-center">
          <i class="fas fa-user-injured mr-2"></i>
          환자 상태 요약
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-gray-600">중증도:</span>
            <span class="font-semibold ml-2 ${getSeverityColor(patient.severity)}">${getSeverityLabel(patient.severity)}</span>
          </div>
          <div>
            <span class="text-gray-600">ADL 점수:</span>
            <span class="font-semibold ml-2">${patient.adl_score}점</span>
          </div>
          <div>
            <span class="text-gray-600">의식 상태:</span>
            <span class="font-semibold ml-2">${patient.consciousness_level}</span>
          </div>
          <div>
            <span class="text-gray-600">장기요양등급:</span>
            <span class="font-semibold ml-2">${patient.ltc_grade ? patient.ltc_grade + '급' : '미신청'}</span>
          </div>
        </div>
      </div>
    `;
    
    // 경로 단계 표시
    const pathwaySteps = pathways.map((pathway, index) => `
      <div class="relative ${index < pathways.length - 1 ? 'mb-6' : ''}">
        ${index < pathways.length - 1 ? '<div class="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-300"></div>' : ''}
        <div class="flex items-start">
          <div class="flex-shrink-0 w-12 h-12 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-400'} text-white flex items-center justify-center font-bold text-lg z-10">
            ${pathway.step_order}
          </div>
          <div class="ml-4 flex-1 bg-gray-50 rounded-lg p-5 border-2 ${index === 0 ? 'border-blue-500' : 'border-gray-200'}">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-bold text-lg text-gray-800">${getPathwayTypeLabel(pathway.step_type)}</h4>
              <span class="px-3 py-1 text-sm font-semibold rounded-full ${getPathwayTypeColor(pathway.step_type)}">
                ${pathway.duration_weeks}주 예상
              </span>
            </div>
            <p class="text-gray-700 mb-3">${pathway.treatment_goal}</p>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">
                <i class="fas fa-won-sign mr-1"></i>
                예상 비용: <strong class="text-gray-800">${formatCurrency(pathway.estimated_cost)}</strong>
              </span>
              ${pathway.ltc_application_timing ? 
                '<span class="text-orange-600 font-semibold"><i class="fas fa-exclamation-circle mr-1"></i>장기요양등급 신청 권장 시점</span>' 
                : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    content.innerHTML = statusSummary + '<div class="space-y-4">' + pathwaySteps + '</div>';
    
  } catch (error) {
    console.error('Failed to load pathway:', error);
    showError('경로 추천을 불러오는데 실패했습니다.');
  }
}

// 비용 계산 로드
async function loadCostEstimation() {
  try {
    const response = await axios.get(`${API_BASE}/patients/${currentPatient.id}`);
    const { patient, pathways } = response.data.data;
    
    const content = document.getElementById('costContent');
    
    if (pathways.length === 0) {
      content.innerHTML = '<p class="text-gray-500 text-center py-8">비용 정보를 불러올 수 없습니다.</p>';
      return;
    }
    
    // 전체 비용 계산
    const totalCost = pathways.reduce((sum, p) => sum + p.estimated_cost, 0);
    const totalWeeks = pathways.reduce((sum, p) => sum + p.duration_weeks, 0);
    const totalMonths = Math.ceil(totalWeeks / 4);
    
    const costSummary = `
      <div class="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500 rounded-lg p-6 mb-6">
        <div class="text-center mb-4">
          <h3 class="text-2xl font-bold text-gray-800 mb-2">전체 예상 비용</h3>
          <div class="text-5xl font-bold text-green-600 mb-2">${formatCurrency(totalCost)}</div>
          <p class="text-gray-600">전체 기간: 약 ${totalMonths}개월 (${totalWeeks}주)</p>
        </div>
        <div class="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
          <p class="text-sm text-yellow-800 text-center">
            <i class="fas fa-info-circle mr-1"></i>
            실제 비용은 ±15% 범위로 변동될 수 있습니다. 기관별 비급여 항목과 간병 방식에 따라 차이가 있습니다.
          </p>
        </div>
      </div>
    `;
    
    // 단계별 비용 상세
    const costDetails = pathways.map((pathway, index) => `
      <div class="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-bold text-gray-800">
            ${getPathwayTypeLabel(pathway.step_type)}
            <span class="text-sm font-normal text-gray-600 ml-2">(${pathway.duration_weeks}주)</span>
          </h4>
          <span class="text-xl font-bold text-green-600">${formatCurrency(pathway.estimated_cost)}</span>
        </div>
        <div class="text-sm text-gray-600 space-y-1">
          <p><i class="fas fa-arrow-right text-gray-400 mr-2"></i>월평균: ${formatCurrency(Math.round(pathway.estimated_cost / (pathway.duration_weeks / 4)))}</p>
          <p><i class="fas fa-calendar text-gray-400 mr-2"></i>예상 기간: ${pathway.duration_weeks}주 (약 ${Math.ceil(pathway.duration_weeks / 4)}개월)</p>
        </div>
      </div>
    `).join('');
    
    content.innerHTML = costSummary + '<h3 class="font-bold text-gray-800 mb-4 text-lg">단계별 비용 상세</h3>' + costDetails;
    
  } catch (error) {
    console.error('Failed to load cost:', error);
    showError('비용 정보를 불러오는데 실패했습니다.');
  }
}

// 기관 찾기 로드
async function loadFacilities() {
  try {
    const response = await axios.get(`${API_BASE}/patients/${currentPatient.id}`);
    const { pathways } = response.data.data;
    
    // 첫 번째 단계의 기관 유형 가져오기
    const firstStepType = pathways[0]?.step_type || 'rehabilitation';
    
    const facilitiesResponse = await axios.get(`${API_BASE}/facilities/search?type=${firstStepType}`);
    const facilities = facilitiesResponse.data.data;
    
    const content = document.getElementById('facilitiesContent');
    
    const intro = `
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-5 mb-6">
        <h3 class="font-bold text-purple-800 mb-2">
          <i class="fas fa-info-circle mr-2"></i>
          추천 기관 유형: ${getPathwayTypeLabel(firstStepType)}
        </h3>
        <p class="text-sm text-gray-700">
          환자의 상태 분석 결과, 첫 번째 단계로 <strong>${getPathwayTypeLabel(firstStepType)}</strong>를 추천합니다.
          아래 기관들을 참고하여 상담을 진행해보세요.
        </p>
      </div>
    `;
    
    if (facilities.length === 0) {
      content.innerHTML = intro + '<p class="text-gray-500 text-center py-8">해당 유형의 기관 정보가 없습니다.</p>';
      return;
    }
    
    const facilityList = facilities.map(facility => `
      <div class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition mb-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-lg text-gray-800 mb-1">${facility.name}</h4>
            <p class="text-sm text-gray-600">
              <i class="fas fa-map-marker-alt mr-1"></i>${facility.address}
            </p>
          </div>
          <span class="px-3 py-1 text-sm font-semibold rounded-full ${getFacilityTypeColor(facility.type)}">
            ${getFacilityTypeLabel(facility.type)}
          </span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
          <div>
            <span class="text-gray-600">병상:</span>
            <span class="font-semibold ml-1">${facility.available_beds}/${facility.total_beds}</span>
          </div>
          <div>
            <span class="text-gray-600">월 평균:</span>
            <span class="font-semibold ml-1">${formatCurrency(facility.average_cost)}</span>
          </div>
          <div>
            <span class="text-gray-600">대기:</span>
            <span class="font-semibold ml-1">${facility.waiting_period}일</span>
          </div>
          <div>
            <span class="text-gray-600">평가:</span>
            <span class="font-semibold ml-1">${facility.evaluation_grade || 'N/A'}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">
            <i class="fas fa-phone mr-1"></i>${facility.phone || '정보 없음'}
          </span>
          <button onclick="alert('전화 연결: ${facility.phone}')" 
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold">
            <i class="fas fa-phone mr-1"></i>전화 문의
          </button>
        </div>
      </div>
    `).join('');
    
    content.innerHTML = intro + facilityList;
    
  } catch (error) {
    console.error('Failed to load facilities:', error);
    showError('기관 정보를 불러오는데 실패했습니다.');
  }
}

// 환자 상세 정보 표시
async function showPatientDetail(patientId) {
  try {
    const response = await axios.get(`${API_BASE}/patients/${patientId}`);
    const { patient, pathways } = response.data.data;
    
    const modal = createModal(`
      <div class="space-y-6">
        <div class="border-b pb-4">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">${patient.name} (${patient.age}세)</h2>
          <p class="text-gray-600">${patient.diagnosis}</p>
          <span class="inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getSeverityColor(patient.severity)}">
            ${getSeverityLabel(patient.severity)}
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-600">현재 입원 병원</label>
            <p class="text-gray-800 font-semibold">${patient.current_hospital}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">ADL 점수</label>
            <p class="text-gray-800 font-semibold">${patient.adl_score}점</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">의식수준</label>
            <p class="text-gray-800 font-semibold">${patient.consciousness_level}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">건강보험</label>
            <p class="text-gray-800 font-semibold">${getInsuranceLabel(patient.insurance_type)}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">장기요양등급</label>
            <p class="text-gray-800 font-semibold">${patient.ltc_grade ? patient.ltc_grade + '급' : '미신청'}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">발병/수술일</label>
            <p class="text-gray-800 font-semibold">${new Date(patient.diagnosis_date).toLocaleDateString('ko-KR')}</p>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">
            <i class="fas fa-route text-blue-600 mr-2"></i>
            추천 경로
          </h3>
          ${pathways.length > 0 ? `
            <div class="space-y-3">
              ${pathways.map((pathway, index) => `
                <div class="bg-gray-50 rounded-lg p-4 border-l-4 ${index === 0 ? 'border-blue-600' : 'border-gray-300'}">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-semibold text-gray-600">단계 ${pathway.step_order}</span>
                    <span class="px-2 py-1 text-xs font-semibold rounded ${getPathwayTypeColor(pathway.step_type)}">
                      ${getPathwayTypeLabel(pathway.step_type)}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 mb-2">${pathway.treatment_goal}</p>
                  <div class="flex items-center justify-between text-xs text-gray-600">
                    <span><i class="fas fa-clock mr-1"></i>${pathway.duration_weeks}주</span>
                    <span><i class="fas fa-won-sign mr-1"></i>${formatCurrency(pathway.estimated_cost)}</span>
                  </div>
                  ${pathway.ltc_application_timing ? '<p class="mt-2 text-xs text-orange-600 font-semibold"><i class="fas fa-exclamation-circle mr-1"></i>장기요양등급 신청 권장 시점</p>' : ''}
                </div>
              `).join('')}
            </div>
          ` : '<p class="text-gray-500">추천 경로가 없습니다.</p>'}
        </div>
        
        <div class="flex space-x-3">
          <button onclick="showCostCalculatorForPatient(${patientId})" 
                  class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
            <i class="fas fa-calculator mr-2"></i>비용 계산
          </button>
          <button onclick="showChecklistForPatient(${patientId})" 
                  class="flex-1 bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition">
            <i class="fas fa-tasks mr-2"></i>체크리스트
          </button>
          <button onclick="showScheduleForPatient(${patientId})" 
                  class="flex-1 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
            <i class="fas fa-calendar-alt mr-2"></i>간병 일정
          </button>
        </div>
      </div>
    `);
    
    document.getElementById('modalContainer').appendChild(modal);
  } catch (error) {
    console.error('Failed to load patient detail:', error);
    showError('환자 정보를 불러오는데 실패했습니다.');
  }
}

// 비용 계산기 표시
function showCostCalculator() {
  const modal = createModal(`
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        <i class="fas fa-calculator text-green-600 mr-2"></i>
        비용 계산기
      </h2>
      
      <form id="costForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">기관 유형</label>
          <select name="facilityType" required 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            <option value="rehabilitation">재활병원</option>
            <option value="nursing_hospital">요양병원</option>
            <option value="nursing_home">요양원</option>
            <option value="home">재택 간병</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">입원 기간 (개월)</label>
          <input type="number" name="durationMonths" min="1" max="24" value="3" required 
                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">건강보험 유형</label>
          <select name="insuranceType" required 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            <option value="employee">직장가입자</option>
            <option value="local">지역가입자</option>
            <option value="medical_aid">의료급여</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">장기요양등급</label>
          <select name="ltcGrade" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            <option value="">미신청</option>
            <option value="1">1급</option>
            <option value="2">2급</option>
            <option value="3">3급</option>
            <option value="4">4급</option>
            <option value="5">5급</option>
          </select>
        </div>
        
        <button type="submit" 
                class="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold">
          비용 계산하기
        </button>
      </form>
      
      <div id="costResult" class="mt-6"></div>
    </div>
  `);
  
  document.getElementById('modalContainer').appendChild(modal);
  
  document.getElementById('costForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      facilityType: formData.get('facilityType'),
      durationMonths: parseInt(formData.get('durationMonths')),
      insuranceType: formData.get('insuranceType'),
      ltcGrade: formData.get('ltcGrade') ? parseInt(formData.get('ltcGrade')) : null
    };
    
    try {
      const response = await axios.post(`${API_BASE}/costs/calculate`, data);
      const result = response.data.data;
      
      document.getElementById('costResult').innerHTML = `
        <div class="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4">계산 결과</h3>
          
          <div class="space-y-3 mb-4">
            <div class="flex justify-between">
              <span class="text-gray-600">건강보험 본인부담금</span>
              <span class="font-semibold">${formatCurrency(result.breakdown.insuranceCoverage)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">비급여 항목</span>
              <span class="font-semibold">${formatCurrency(result.breakdown.nonCoverage)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">장기요양 본인부담금</span>
              <span class="font-semibold">${formatCurrency(result.breakdown.ltcCopayment)}</span>
            </div>
            <div class="border-t pt-3 flex justify-between text-lg">
              <span class="font-bold">총 예상 비용</span>
              <span class="font-bold text-green-600">${formatCurrency(result.totalCost)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">월평균 비용</span>
              <span class="font-semibold">${formatCurrency(result.monthlyCost)}</span>
            </div>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p class="text-sm text-yellow-800">
              <i class="fas fa-info-circle mr-1"></i>
              실제 비용은 ±${result.errorMargin.percent}% 범위로 변동될 수 있습니다.
              <br>
              예상 범위: ${formatCurrency(result.errorMargin.range.min)} ~ ${formatCurrency(result.errorMargin.range.max)}
            </p>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Cost calculation failed:', error);
      showError('비용 계산에 실패했습니다.');
    }
  });
}

// 상세 비용 계산기 표시 (showCostCalculator 호출)
function showDetailedCostCalculator() {
  showCostCalculator();
}

// 기관 찾기 표시
async function showFacilities() {
  try {
    const response = await axios.get(`${API_BASE}/facilities`);
    const facilities = response.data.data;
    
    const modal = createModal(`
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          <i class="fas fa-hospital text-purple-600 mr-2"></i>
          재활·요양 기관 찾기
        </h2>
        
        <div class="mb-4 flex space-x-2">
          <button onclick="filterFacilities('all')" 
                  class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-sm">
            전체
          </button>
          <button onclick="filterFacilities('rehabilitation')" 
                  class="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm">
            재활병원
          </button>
          <button onclick="filterFacilities('nursing_hospital')" 
                  class="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm">
            요양병원
          </button>
          <button onclick="filterFacilities('nursing_home')" 
                  class="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-sm">
            요양원
          </button>
        </div>
        
        <div id="facilitiesList" class="space-y-3 max-h-96 overflow-y-auto">
          ${facilities.map(facility => `
            <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition facility-item" data-type="${facility.type}">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800">${facility.name}</h3>
                <span class="px-2 py-1 text-xs font-semibold rounded ${getFacilityTypeColor(facility.type)}">
                  ${getFacilityTypeLabel(facility.type)}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-2">
                <i class="fas fa-map-marker-alt mr-1"></i>${facility.address}
              </p>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">
                  <i class="fas fa-bed mr-1"></i>
                  ${facility.available_beds}/${facility.total_beds} 병상
                </span>
                <span class="font-semibold text-gray-800">
                  월 ${formatCurrency(facility.average_cost)}
                </span>
              </div>
              ${facility.waiting_period ? `<p class="text-xs text-orange-600 mt-2"><i class="fas fa-clock mr-1"></i>대기 ${facility.waiting_period}일</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `, 'max-w-4xl');
    
    document.getElementById('modalContainer').appendChild(modal);
  } catch (error) {
    console.error('Failed to load facilities:', error);
    showError('기관 목록을 불러오는데 실패했습니다.');
  }
}

// 체크리스트 표시
async function showChecklistForPatient(patientId) {
  try {
    const response = await axios.get(`${API_BASE}/checklists/patient/${patientId}`);
    const { items, grouped } = response.data.data;
    
    const modal = createModal(`
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          <i class="fas fa-tasks text-yellow-600 mr-2"></i>
          전원 체크리스트
        </h2>
        
        <div class="mb-4 bg-blue-50 border border-blue-200 rounded p-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-blue-800">진행률</span>
            <span class="text-sm font-bold text-blue-800">
              ${items.filter(i => i.is_completed).length} / ${items.length}
            </span>
          </div>
          <div class="mt-2 bg-blue-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" 
                 style="width: ${(items.filter(i => i.is_completed).length / items.length * 100)}%"></div>
          </div>
        </div>
        
        <div class="space-y-4 max-h-96 overflow-y-auto">
          ${Object.entries(grouped).map(([category, categoryItems]) => `
            <div>
              <h3 class="font-semibold text-gray-700 mb-2">
                <i class="fas fa-folder mr-2"></i>${category}
              </h3>
              <div class="space-y-2">
                ${categoryItems.map(item => `
                  <div class="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
                    <input type="checkbox" 
                           ${item.is_completed ? 'checked' : ''}
                           onchange="toggleChecklistItem(${item.id}, this.checked)"
                           class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
                    <label class="ml-3 flex-1 ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}">
                      ${item.item_name}
                      ${item.is_required ? '<span class="text-red-500 ml-1">*</span>' : ''}
                    </label>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `);
    
    document.getElementById('modalContainer').appendChild(modal);
  } catch (error) {
    console.error('Failed to load checklist:', error);
    showError('체크리스트를 불러오는데 실패했습니다.');
  }
}

// 체크리스트 항목 토글
async function toggleChecklistItem(itemId, isCompleted) {
  try {
    await axios.put(`${API_BASE}/checklists/${itemId}/complete`, {
      isCompleted
    });
  } catch (error) {
    console.error('Failed to update checklist item:', error);
    showError('체크리스트 업데이트에 실패했습니다.');
  }
}

// 간병 스케줄 표시
async function showScheduleForPatient(patientId) {
  const modal = createModal(`
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        <i class="fas fa-calendar-alt text-purple-600 mr-2"></i>
        간병 스케줄
      </h2>
      <p class="text-gray-600 text-center py-8">간병 스케줄 기능은 곧 추가될 예정입니다.</p>
    </div>
  `);
  
  document.getElementById('modalContainer').appendChild(modal);
}

// 경로 표시 함수들
function showPathway() {
  showError('환자를 먼저 선택해주세요.');
}

function showCostCalculatorForPatient(patientId) {
  showCostCalculator();
}

function showChecklist() {
  showError('환자를 먼저 선택해주세요.');
}

// 기관 필터링
function filterFacilities(type) {
  const items = document.querySelectorAll('.facility-item');
  items.forEach(item => {
    if (type === 'all' || item.dataset.type === type) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// 유틸리티 함수들
function getSeverityColor(severity) {
  const colors = {
    mild: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    severe: 'bg-red-100 text-red-800'
  };
  return colors[severity] || colors.moderate;
}

function getSeverityLabel(severity) {
  const labels = {
    mild: '경증',
    moderate: '중등도',
    severe: '중증'
  };
  return labels[severity] || '중등도';
}

function getInsuranceLabel(type) {
  const labels = {
    employee: '직장가입자',
    local: '지역가입자',
    medical_aid: '의료급여'
  };
  return labels[type] || type;
}

function getPathwayTypeLabel(type) {
  const labels = {
    acute: '급성기',
    rehabilitation: '재활병원',
    nursing_hospital: '요양병원',
    nursing_home: '요양원',
    home: '재택'
  };
  return labels[type] || type;
}

function getPathwayTypeColor(type) {
  const colors = {
    acute: 'bg-red-100 text-red-700',
    rehabilitation: 'bg-blue-100 text-blue-700',
    nursing_hospital: 'bg-green-100 text-green-700',
    nursing_home: 'bg-purple-100 text-purple-700',
    home: 'bg-gray-100 text-gray-700'
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
}

function getFacilityTypeLabel(type) {
  const labels = {
    rehabilitation: '재활병원',
    nursing_hospital: '요양병원',
    nursing_home: '요양원'
  };
  return labels[type] || type;
}

function getFacilityTypeColor(type) {
  const colors = {
    rehabilitation: 'bg-blue-100 text-blue-700',
    nursing_hospital: 'bg-green-100 text-green-700',
    nursing_home: 'bg-purple-100 text-purple-700'
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(amount) + '원';
}

// 모달 생성 함수
function createModal(content, widthClass = 'max-w-2xl') {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4';
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => modal.remove(), 300);
    }
  };
  
  modal.innerHTML = `
    <div class="modal-content-3d bg-gradient-to-br from-white to-gray-50 rounded-2xl ${widthClass} w-full max-h-[90vh] overflow-hidden border-4 border-white/50 shadow-2xl">
      <div class="sticky top-0 bg-gradient-to-r from-primary-500 to-primary-600 backdrop-blur-lg border-b-4 border-white/30 px-6 py-4 flex justify-between items-center shadow-lg">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            <i class="fas fa-book"></i>
          </span>
          설명서
        </h2>
        <button onclick="this.closest('.modal-backdrop').remove()" 
                class="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all hover:rotate-90 hover:scale-110">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
        ${content}
      </div>
    </div>
  `;
  
  return modal;
}

// 알림 함수들
function showSuccess(message) {
  showNotification(message, 'success');
}

function showError(message) {
  showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50`;
  notification.innerHTML = `
    <i class="fas ${icons[type]} text-xl"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}
