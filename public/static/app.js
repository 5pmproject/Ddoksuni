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
