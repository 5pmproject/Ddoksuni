import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings } from './types';
import patients from './routes/patients';
import facilities from './routes/facilities';
import costs from './routes/costs';
import checklists from './routes/checklists';
import schedules from './routes/schedules';

const app = new Hono<{ Bindings: Bindings }>();

// CORS 설정
app.use('/api/*', cors());

// 정적 파일 서빙
app.use('/static/*', serveStatic({ root: './public' }));

// API 라우트 등록
app.route('/api/patients', patients);
app.route('/api/facilities', facilities);
app.route('/api/costs', costs);
app.route('/api/checklists', checklists);
app.route('/api/schedules', schedules);

// 헬스 체크
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 메인 페이지
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>하이브리브 - 재활·요양 전원 의사결정 지원 플랫폼</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  // Wood Tone System
                  wood: {
                    50: '#FAF8F5',
                    100: '#F0EBE3',
                    200: '#E8DFD0',
                    300: '#D4C4AB',
                    400: '#BFA786',
                    500: '#A68968',
                    600: '#8D7354',
                    700: '#6B5842',
                    800: '#574837',
                    900: '#4D3C2E',
                  },
                  // Primary (Sage Green)
                  primary: {
                    50: '#F2F3F0',
                    100: '#E3E6DF',
                    200: '#D1D6C8',
                    300: '#B5BCAA',
                    400: '#99A38B',
                    500: '#8C9785',
                    600: '#7A8472',
                    700: '#636B5C',
                    800: '#4F5549',
                    900: '#3E443A',
                  },
                  // Grays (Warm)
                  gray: {
                    50: '#FAFAF9',
                    100: '#F5F4F3',
                    200: '#E8E6E3',
                    300: '#D4D1CD',
                    400: '#B8B3AE',
                    500: '#9B9791',
                    600: '#7D7874',
                    700: '#615E5A',
                    800: '#4A4744',
                    900: '#3E3A36',
                  }
                }
              }
            }
          }
        </script>
        <style>
          body {
            background-color: #FAF8F5;
          }
          .gradient-bg {
            background: linear-gradient(135deg, #8C9785 0%, #636B5C 100%);
          }
          .card-hover {
            transition: all 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(140, 151, 133, 0.2);
          }
          .section-card {
            background-color: #F2F3F0;
            border-color: #E3E6DF;
          }
        </style>
    </head>
    <body class="bg-wood-50">
        <!-- 헤더 -->
        <header class="gradient-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-hospital-user text-3xl"></i>
                        <h1 class="text-3xl font-bold">하이브리브</h1>
                    </div>
                    <nav class="hidden md:flex space-x-6">
                        <a href="#dashboard" class="hover:text-wood-100 transition">대시보드</a>
                        <a href="#pathway" class="hover:text-wood-100 transition">경로 추천</a>
                        <a href="#cost" class="hover:text-wood-100 transition">비용 계산</a>
                        <a href="#facilities" class="hover:text-wood-100 transition">기관 찾기</a>
                    </nav>
                </div>
                <p class="mt-2 text-wood-100">재활·요양 전원 의사결정을 돕는 지능형 플랫폼</p>
            </div>
        </header>

        <!-- 메인 컨텐츠 -->
        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- 진행 단계 표시 -->
            <div id="progressSteps" class="mb-8">
                <div class="flex items-center justify-center space-x-4">
                    <div id="step1" class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                            1
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-900">환자 정보</span>
                    </div>
                    <div class="w-16 h-1 bg-primary-100"></div>
                    <div id="step2" class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-gray-500 flex items-center justify-center font-bold">
                            2
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-500">전원 경로</span>
                    </div>
                    <div class="w-16 h-1 bg-primary-100"></div>
                    <div id="step3" class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-gray-500 flex items-center justify-center font-bold">
                            3
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-500">비용 확인</span>
                    </div>
                    <div class="w-16 h-1 bg-primary-100"></div>
                    <div id="step4" class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-gray-500 flex items-center justify-center font-bold">
                            4
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-500">기관 찾기</span>
                    </div>
                </div>
            </div>

            <!-- 웰컴 메시지 (최초 진입 시만) -->
            <div id="welcomeMessage" class="mb-8 bg-gradient-to-r from-wood-50 via-primary-50 to-wood-100 rounded-lg p-8 border-2 border-wood-300 shadow-lg">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <i class="fas fa-hand-holding-heart text-5xl text-wood-500"></i>
                    </div>
                    <div class="ml-6 flex-1">
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">
                            <span class="text-wood-500">환영합니다!</span> 하이브리브가 최적의 전원 경로를 찾아드립니다
                        </h2>
                        <p class="text-wood-900 mb-4 text-lg">
                            재활·요양 전원은 환자의 회복에 매우 중요한 결정입니다. 
                            하이브리브는 환자의 상태를 분석하여 <strong class="text-primary-700">맞춤형 전원 경로와 비용을 추천</strong>해드립니다.
                        </p>
                        <div class="bg-white rounded-lg p-5 text-sm text-wood-900 shadow-md">
                            <p class="font-bold text-primary-700 mb-3 text-lg flex items-center">
                                <i class="fas fa-route mr-2 text-2xl text-wood-500"></i>
                                4단계로 간편하게 전원 계획 수립:
                            </p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div class="flex items-start bg-wood-50 rounded p-3 border border-wood-200">
                                    <span class="bg-wood-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">1</span>
                                    <div>
                                        <strong class="text-wood-700">환자 정보 입력</strong>
                                        <p class="text-xs text-gray-500 mt-1">약 5분 소요 • ADL 점수, GCS 등</p>
                                    </div>
                                </div>
                                <div class="flex items-start bg-primary-50 rounded p-3 border border-primary-200">
                                    <span class="bg-primary-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">2</span>
                                    <div>
                                        <strong class="text-primary-700">맞춤 경로 확인</strong>
                                        <p class="text-xs text-gray-500 mt-1">AI 기반 최적 전원 경로 추천</p>
                                    </div>
                                </div>
                                <div class="flex items-start bg-wood-100 rounded p-3 border border-wood-300">
                                    <span class="bg-wood-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">3</span>
                                    <div>
                                        <strong class="text-wood-700">예상 비용 계산</strong>
                                        <p class="text-xs text-gray-500 mt-1">단계별 비용 및 본인부담금</p>
                                    </div>
                                </div>
                                <div class="flex items-start bg-primary-100 rounded p-3 border border-primary-300">
                                    <span class="bg-primary-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">4</span>
                                    <div>
                                        <strong class="text-primary-700">기관 찾기</strong>
                                        <p class="text-xs text-gray-500 mt-1">조건에 맞는 재활·요양 기관</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 bg-wood-100 border border-wood-300 rounded-lg p-3 text-center">
                            <p class="text-wood-800 font-semibold">
                                <i class="fas fa-arrow-down mr-2 animate-bounce inline-block text-wood-500"></i>
                                아래에서 환자 정보를 입력하고 맞춤 전원 계획을 받아보세요!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 1단계: 환자 등록 폼 -->
            <section id="registerForm" class="mb-12">
                <div class="section-card rounded-lg shadow-lg p-8 border">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">
                                <i class="fas fa-user-plus text-wood-500 mr-2"></i>
                                1단계: 환자 정보 입력
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                정확한 전원 경로와 비용 추천을 위해 환자의 상태 정보를 입력해주세요
                            </p>
                        </div>
                    </div>
                    <form id="patientForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">환자명</label>
                                <input type="text" name="name" required 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">나이</label>
                                <input type="number" name="age" required 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">진단명</label>
                                <input type="text" name="diagnosis" required placeholder="예: 뇌경색, 뇌출혈, 대장암"
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                <p class="text-xs text-gray-500 mt-1">
                                    <i class="fas fa-info-circle"></i> 진료기록지나 진단서에 적힌 질병명을 입력하세요
                                </p>
                            </div>
                            <div>
                                <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    발병/수술일
                                    <button type="button" onclick="showHelp('diagnosis_date')" 
                                            class="ml-2 text-wood-500 hover:text-wood-700">
                                        <i class="fas fa-question-circle"></i>
                                    </button>
                                </label>
                                <input type="date" name="diagnosis_date" required 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                <p class="text-xs text-gray-500 mt-1">
                                    <i class="fas fa-info-circle"></i> 뇌졸중 발생일, 암 수술일 등 주요 치료가 시작된 날짜
                                </p>
                            </div>
                            <div>
                                <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    일상생활 수행능력 (ADL)
                                    <button type="button" onclick="showADLGuide()" 
                                            class="ml-2 text-wood-500 hover:text-wood-700">
                                        <i class="fas fa-question-circle"></i>
                                    </button>
                                </label>
                                <div class="flex items-center space-x-2">
                                    <input type="range" name="adl_score" min="0" max="100" value="50" 
                                           oninput="updateADLValue(this.value)"
                                           class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                    <span id="adlValue" class="text-lg font-semibold text-blue-600 w-12">50점</span>
                                </div>
                                <div class="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>전혀 못함</span>
                                    <span>부분 도움</span>
                                    <span>혼자 가능</span>
                                </div>
                                <p class="text-xs text-blue-600 mt-2">
                                    <i class="fas fa-lightbulb"></i> 잘 모르시면 간단한 평가를 해보세요
                                </p>
                            </div>
                            <div class="md:col-span-2">
                                <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    의식 상태 평가 (Glasgow Coma Scale)
                                    <button type="button" onclick="showGCSGuide()" 
                                            class="ml-2 text-wood-500 hover:text-wood-700">
                                        <i class="fas fa-question-circle"></i>
                                    </button>
                                </label>
                                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <!-- 눈 뜨기 반응 -->
                                    <div>
                                        <label class="text-xs font-medium text-gray-600 mb-1 block">1. 눈 뜨기 반응 (Eye Opening)</label>
                                        <select name="gcs_eye" onchange="updateGCSTotal()" 
                                                class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500">
                                            <option value="4">자발적으로 눈을 뜸 (4점)</option>
                                            <option value="3">말에 반응하여 눈을 뜸 (3점)</option>
                                            <option value="2">통증에 반응하여 눈을 뜸 (2점)</option>
                                            <option value="1">전혀 눈을 뜨지 않음 (1점)</option>
                                        </select>
                                    </div>
                                    
                                    <!-- 언어 반응 -->
                                    <div>
                                        <label class="text-xs font-medium text-gray-600 mb-1 block">2. 언어 반응 (Verbal Response)</label>
                                        <select name="gcs_verbal" onchange="updateGCSTotal()" 
                                                class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500">
                                            <option value="5">대화 가능하고 지남력 정상 (5점)</option>
                                            <option value="4">대화는 되나 지남력 저하/혼란스러움 (4점)</option>
                                            <option value="3">단어만 말함, 문장 구성 불가 (3점)</option>
                                            <option value="2">이해할 수 없는 소리만 냄 (2점)</option>
                                            <option value="1">전혀 소리를 내지 않음 (1점)</option>
                                        </select>
                                    </div>
                                    
                                    <!-- 운동 반응 -->
                                    <div>
                                        <label class="text-xs font-medium text-gray-600 mb-1 block">3. 운동 반응 (Motor Response)</label>
                                        <select name="gcs_motor" onchange="updateGCSTotal()" 
                                                class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500">
                                            <option value="6">명령에 따라 움직임 (6점)</option>
                                            <option value="5">통증 위치를 정확히 찾아 손으로 제거 (5점)</option>
                                            <option value="4">통증에 손을 뻗으나 부정확 (4점)</option>
                                            <option value="3">통증에 팔을 구부림 (3점)</option>
                                            <option value="2">통증에 팔을 펴는 반응 (2점)</option>
                                            <option value="1">전혀 움직이지 않음 (1점)</option>
                                        </select>
                                    </div>
                                    
                                    <!-- 총점 표시 -->
                                    <div class="bg-white rounded border-2 border-blue-500 p-3 flex items-center justify-between">
                                        <span class="text-sm font-semibold text-gray-700">GCS 총점:</span>
                                        <div class="flex items-center space-x-2">
                                            <span id="gcsTotal" class="text-2xl font-bold text-blue-600">15점</span>
                                            <span id="gcsLevel" class="text-xs px-2 py-1 rounded bg-green-100 text-green-800">정상</span>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-xs text-gray-500 mt-2">
                                    <i class="fas fa-info-circle"></i> 15점: 정상 | 13-14점: 경미한 장애 | 9-12점: 중등도 | 8점 이하: 중증
                                </p>
                            </div>
                            <div>
                                <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    건강보험 유형
                                    <button type="button" onclick="showHelp('insurance')" 
                                            class="ml-2 text-wood-500 hover:text-wood-700">
                                        <i class="fas fa-question-circle"></i>
                                    </button>
                                </label>
                                <select name="insurance_type" 
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                    <option value="employee">직장가입자 (회사에서 보험료 납부)</option>
                                    <option value="local">지역가입자 (개인이 보험료 납부)</option>
                                    <option value="medical_aid">의료급여 (기초생활수급자)</option>
                                </select>
                                <p class="text-xs text-gray-500 mt-1">
                                    <i class="fas fa-info-circle"></i> 건강보험증에서 확인 가능합니다
                                </p>
                            </div>
                        </div>
                        
                        <!-- 요양병원 vs 요양시설 차이 안내 -->
                        <div class="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-4 mt-6 mb-6">
                            <div class="flex items-start">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-exclamation-triangle text-3xl text-orange-600"></i>
                                </div>
                                <div class="ml-4 flex-1">
                                    <h4 class="font-bold text-orange-800 mb-2 text-base">
                                        잠깐! 요양병원 vs 요양시설의 차이를 아시나요?
                                    </h4>
                                    <p class="text-sm text-gray-700 mb-3">
                                        많은 분들이 혼동하시는데, <strong class="text-red-600">완전히 다른 기관</strong>입니다!
                                    </p>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                                        <div class="bg-white rounded p-2 border border-blue-200">
                                            <p class="font-semibold text-blue-700 mb-1">
                                                <i class="fas fa-hospital mr-1"></i>요양병원 (의료기관)
                                            </p>
                                            <p class="text-gray-600">장기요양등급 불필요 • 건강보험</p>
                                        </div>
                                        <div class="bg-white rounded p-2 border border-orange-200">
                                            <p class="font-semibold text-orange-700 mb-1">
                                                <i class="fas fa-home mr-1"></i>요양시설 (복지시설)
                                            </p>
                                            <p class="text-gray-600">장기요양등급 필수 • 요양보험</p>
                                        </div>
                                    </div>
                                    <button type="button" onclick="showHelp('facility_types')" 
                                            class="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition text-sm font-semibold">
                                        <i class="fas fa-search mr-2"></i>
                                        상세 차이점 보기 (필독!)
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    장기요양등급
                                    <button type="button" onclick="showHelp('ltc')" 
                                            class="ml-2 text-wood-500 hover:text-wood-700">
                                        <i class="fas fa-question-circle"></i>
                                    </button>
                                </label>
                                <select name="ltc_grade" 
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                    <option value="">아직 신청 안함 (모르겠음)</option>
                                    <option value="1">1급 (최중증 - 완전 와상)</option>
                                    <option value="2">2급 (중증 - 거의 와상)</option>
                                    <option value="3">3급 (중등증 - 부분 도움 필요)</option>
                                    <option value="4">4급 (경증 - 약간의 도움 필요)</option>
                                    <option value="5">5급 (경증 - 일부 도움 필요)</option>
                                </select>
                                <p class="text-xs text-blue-600 mt-1">
                                    <i class="fas fa-lightbulb"></i> 신청하지 않았다면 '아직 신청 안함'을 선택하세요
                                </p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">현재 입원 병원</label>
                            <input type="text" name="current_hospital" required 
                                   class="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                        </div>
                        <button type="submit" 
                                class="w-full bg-primary-500 text-white py-4 px-6 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg">
                            <i class="fas fa-arrow-right mr-2"></i>
                            환자 정보 입력 완료 및 맞춤 추천 받기
                        </button>
                    </form>
                </div>
            </section>

            <!-- 2단계: 전원 경로 추천 결과 (등록 후 표시) -->
            <section id="pathwayResult" class="mb-12 hidden">
                <div class="section-card rounded-lg shadow-lg p-8 border">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">
                                <i class="fas fa-route text-wood-500 mr-2"></i>
                                2단계: <span id="patientNameDisplay"></span>님의 맞춤 전원 경로
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                환자 상태 분석 결과, 다음과 같은 전원 경로를 추천합니다
                            </p>
                        </div>
                    </div>
                    <div id="pathwayContent"></div>
                    
                    <!-- 다음 단계 안내 -->
                    <div class="mt-6 bg-gradient-to-r from-wood-50 to-primary-50 border border-wood-300 rounded-lg p-4">
                        <p class="text-wood-900 text-center mb-3">
                            <i class="fas fa-lightbulb text-wood-500 mr-2"></i>
                            <strong class="text-primary-700">추천 경로를 확인하셨나요?</strong> 
                            이제 예상 비용과 적합한 기관을 찾아보세요!
                        </p>
                        <div class="flex space-x-3">
                            <button onclick="goToStep(3)" 
                                    class="flex-1 bg-primary-500 text-white py-4 px-6 rounded-lg hover:bg-primary-700 transition font-bold text-lg shadow-lg">
                                <i class="fas fa-arrow-right mr-2"></i>
                                다음: 예상 비용 확인하기
                            </button>
                        </div>
                        <button onclick="goToStep(4)" 
                                class="mt-2 w-full bg-white border-2 border-primary-300 text-primary-700 py-2 px-4 rounded-lg hover:bg-primary-50 transition font-semibold text-sm">
                            <i class="fas fa-hospital mr-2"></i>
                            또는 기관 바로 찾아보기
                        </button>
                    </div>
                </div>
            </section>

            <!-- 3단계: 비용 계산 결과 (경로 확인 후 표시) -->
            <section id="costResult" class="mb-12 hidden">
                <div class="section-card rounded-lg shadow-lg p-8 border">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">
                                <i class="fas fa-calculator text-wood-600 mr-2"></i>
                                3단계: 예상 비용 안내
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                추천 경로별 예상 비용을 확인하세요
                            </p>
                        </div>
                    </div>
                    <div id="costContent"></div>
                    
                    <!-- 다음 단계 안내 -->
                    <div class="mt-6 bg-gradient-to-r from-wood-100 to-primary-100 border border-wood-400 rounded-lg p-4">
                        <p class="text-wood-900 text-center mb-3">
                            <i class="fas fa-lightbulb text-wood-500 mr-2"></i>
                            <strong class="text-wood-700">예상 비용을 확인하셨나요?</strong> 
                            이제 조건에 맞는 재활·요양 기관을 찾아보세요!
                        </p>
                        <button onclick="goToStep(4)" 
                                class="w-full bg-wood-500 text-white py-4 px-6 rounded-lg hover:bg-wood-700 transition font-bold text-lg shadow-lg">
                            <i class="fas fa-arrow-right mr-2"></i>
                            다음: 적합한 기관 찾기
                        </button>
                        <button onclick="showDetailedCostCalculator()" 
                                class="mt-2 w-full bg-white border-2 border-primary-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-primary-50 transition font-semibold text-sm">
                            <i class="fas fa-chart-line mr-2"></i>
                            상세 비용 시뮬레이션 (선택사항)
                        </button>
                    </div>
                </div>
            </section>

            <!-- 4단계: 기관 찾기 (비용 확인 후 표시) -->
            <section id="facilitiesResult" class="mb-12 hidden">
                <div class="section-card rounded-lg shadow-lg p-8 border">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">
                                <i class="fas fa-hospital text-primary-600 mr-2"></i>
                                4단계: 적합한 재활·요양 기관 찾기
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                추천 경로에 맞는 기관을 찾아보세요
                            </p>
                        </div>
                    </div>
                    <div id="facilitiesContent"></div>
                    
                    <!-- 완료 안내 -->
                    <div class="mt-6 bg-gradient-to-r from-wood-100 to-wood-200 border border-wood-400 rounded-lg p-4">
                        <p class="text-wood-900 text-center mb-3">
                            <i class="fas fa-check-circle text-primary-600 mr-2"></i>
                            <strong class="text-wood-700">기관 정보를 확인하셨나요?</strong> 
                            전원 준비를 위한 체크리스트를 확인하세요!
                        </p>
                        <button onclick="showChecklist()" 
                                class="w-full bg-wood-600 text-white py-4 px-6 rounded-lg hover:bg-wood-800 transition font-bold text-lg shadow-lg">
                            <i class="fas fa-tasks mr-2"></i>
                            전원 준비 체크리스트 확인하기
                        </button>
                        <p class="text-xs text-gray-500 text-center mt-3">
                            <i class="fas fa-info-circle mr-1"></i>
                            체크리스트를 통해 전원에 필요한 서류와 절차를 빠짐없이 준비하세요.
                        </p>
                    </div>
                </div>
            </section>

            <!-- 모달 영역 -->
            <div id="modalContainer"></div>
        </main>

        <!-- 푸터 -->
        <footer class="bg-gray-900 text-wood-200 py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© 2025 하이브리브. 재활·요양 전원 의사결정 지원 플랫폼</p>
                <p class="text-sm text-gray-500 mt-2">환자의 최적 회복을 위한 디지털 가이드</p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

export default app;
