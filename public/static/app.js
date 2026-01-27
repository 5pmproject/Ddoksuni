// 하이브리브 - 프론트엔드 애플리케이션

const API_BASE = '/api';

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadPatients();
  setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
  const form = document.getElementById('patientForm');
  if (form) {
    form.addEventListener('submit', handlePatientSubmit);
  }
}

// ADL 값 업데이트
function updateADLValue(value) {
  document.getElementById('adlValue').textContent = value + '점';
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
              <h4 class="font-semibold text-blue-800 mb-2">
                <i class="fas fa-building mr-2"></i>직장가입자
              </h4>
              <p class="text-sm text-gray-700">
                회사나 직장에 다니면서 건강보험료를 회사와 본인이 반반씩 부담하는 경우입니다.
                건강보험증에 "직장"이라고 표시되어 있습니다.
              </p>
            </div>
            
            <div class="bg-green-50 border-l-4 border-green-500 p-4">
              <h4 class="font-semibold text-green-800 mb-2">
                <i class="fas fa-home mr-2"></i>지역가입자
              </h4>
              <p class="text-sm text-gray-700">
                자영업자, 무직자 등 직장에 다니지 않아 개인이 건강보험료를 전액 부담하는 경우입니다.
                건강보험증에 "지역"이라고 표시되어 있습니다.
              </p>
            </div>
            
            <div class="bg-purple-50 border-l-4 border-purple-500 p-4">
              <h4 class="font-semibold text-purple-800 mb-2">
                <i class="fas fa-hand-holding-heart mr-2"></i>의료급여
              </h4>
              <p class="text-sm text-gray-700">
                기초생활수급자나 차상위계층으로 국가에서 의료비를 지원받는 경우입니다.
                의료급여증을 가지고 있으면 이에 해당합니다.
              </p>
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
  const data = {
    name: formData.get('name'),
    age: parseInt(formData.get('age')),
    diagnosis: formData.get('diagnosis'),
    diagnosis_date: formData.get('diagnosis_date'),
    adl_score: parseInt(formData.get('adl_score')),
    consciousness_level: formData.get('consciousness_level'),
    insurance_type: formData.get('insurance_type'),
    ltc_grade: formData.get('ltc_grade') ? parseInt(formData.get('ltc_grade')) : null,
    current_hospital: formData.get('current_hospital'),
    comorbidities: '{}'
  };
  
  try {
    const response = await axios.post(`${API_BASE}/patients`, data);
    
    if (response.data.success) {
      showSuccess('환자가 성공적으로 등록되었습니다!');
      e.target.reset();
      loadPatients();
      
      // 체크리스트 자동 생성
      await axios.post(`${API_BASE}/checklists/generate`, {
        patientId: response.data.data.id,
        transferType: 'acute_to_rehab'
      });
    }
  } catch (error) {
    console.error('Failed to register patient:', error);
    showError('환자 등록에 실패했습니다.');
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
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  
  modal.innerHTML = `
    <div class="bg-white rounded-lg ${widthClass} w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">상세 정보</h2>
        <button onclick="this.closest('.fixed').remove()" 
                class="text-gray-500 hover:text-gray-700 text-2xl">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="p-6">
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
