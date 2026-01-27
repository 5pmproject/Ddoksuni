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
                  primary: '#2563eb',
                  secondary: '#7c3aed',
                }
              }
            }
          }
        </script>
        <style>
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .card-hover {
            transition: all 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 헤더 -->
        <header class="gradient-bg text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-hospital-user text-3xl"></i>
                        <h1 class="text-3xl font-bold">하이브리브</h1>
                    </div>
                    <nav class="hidden md:flex space-x-6">
                        <a href="#dashboard" class="hover:text-gray-200 transition">대시보드</a>
                        <a href="#pathway" class="hover:text-gray-200 transition">경로 추천</a>
                        <a href="#cost" class="hover:text-gray-200 transition">비용 계산</a>
                        <a href="#facilities" class="hover:text-gray-200 transition">기관 찾기</a>
                    </nav>
                </div>
                <p class="mt-2 text-blue-100">재활·요양 전원 의사결정을 돕는 지능형 플랫폼</p>
            </div>
        </header>

        <!-- 메인 컨텐츠 -->
        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- 대시보드 섹션 -->
            <section id="dashboard" class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-chart-line text-primary mr-2"></i>
                    환자 대시보드
                </h2>
                <div id="patientsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- 환자 카드가 여기에 동적으로 추가됩니다 -->
                </div>
            </section>

            <!-- 기능 카드 섹션 -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-tools text-primary mr-2"></i>
                    주요 기능
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- 경로 추천 -->
                    <div class="bg-white rounded-lg shadow-md p-6 card-hover cursor-pointer" onclick="showPathway()">
                        <div class="text-center">
                            <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-route text-3xl text-blue-600"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">경로 추천</h3>
                            <p class="text-sm text-gray-600">환자 상태 기반 최적 전원 경로 제시</p>
                        </div>
                    </div>

                    <!-- 비용 계산 -->
                    <div class="bg-white rounded-lg shadow-md p-6 card-hover cursor-pointer" onclick="showCostCalculator()">
                        <div class="text-center">
                            <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-calculator text-3xl text-green-600"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">비용 계산</h3>
                            <p class="text-sm text-gray-600">실시간 비용 시뮬레이션 및 비교</p>
                        </div>
                    </div>

                    <!-- 기관 찾기 -->
                    <div class="bg-white rounded-lg shadow-md p-6 card-hover cursor-pointer" onclick="showFacilities()">
                        <div class="text-center">
                            <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-hospital text-3xl text-purple-600"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">기관 찾기</h3>
                            <p class="text-sm text-gray-600">조건별 재활·요양 기관 검색</p>
                        </div>
                    </div>

                    <!-- 전원 체크리스트 -->
                    <div class="bg-white rounded-lg shadow-md p-6 card-hover cursor-pointer" onclick="showChecklist()">
                        <div class="text-center">
                            <div class="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-tasks text-3xl text-yellow-600"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">체크리스트</h3>
                            <p class="text-sm text-gray-600">전원 준비 사항 관리</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 환자 등록 폼 -->
            <section id="registerForm" class="mb-12">
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">
                        <i class="fas fa-user-plus text-primary mr-2"></i>
                        환자 등록
                    </h2>
                    <form id="patientForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">환자명</label>
                                <input type="text" name="name" required 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">나이</label>
                                <input type="number" name="age" required 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">진단명</label>
                                <input type="text" name="diagnosis" required placeholder="예: 뇌경색 (I63.9)"
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">발병/수술일</label>
                                <input type="date" name="diagnosis_date" required 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">ADL 점수 (0-100)</label>
                                <input type="number" name="adl_score" min="0" max="100" value="50"
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">의식수준</label>
                                <select name="consciousness_level" 
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="명료">명료</option>
                                    <option value="기면">기면</option>
                                    <option value="혼미">혼미</option>
                                    <option value="혼수">혼수</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">건강보험 유형</label>
                                <select name="insurance_type" 
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="employee">직장가입자</option>
                                    <option value="local">지역가입자</option>
                                    <option value="medical_aid">의료급여</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">장기요양등급 (선택)</label>
                                <select name="ltc_grade" 
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">미신청</option>
                                    <option value="1">1급</option>
                                    <option value="2">2급</option>
                                    <option value="3">3급</option>
                                    <option value="4">4급</option>
                                    <option value="5">5급</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">현재 입원 병원</label>
                            <input type="text" name="current_hospital" required 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button type="submit" 
                                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold">
                            <i class="fas fa-plus mr-2"></i>환자 등록하기
                        </button>
                    </form>
                </div>
            </section>

            <!-- 모달 영역 -->
            <div id="modalContainer"></div>
        </main>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
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
