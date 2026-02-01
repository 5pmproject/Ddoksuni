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
        <title>똑순이 - 간병하는 당신을 돌봐드립니다</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="/static/medical-knowledge-base.js"></script>
        <script src="/static/facility-database.js"></script>
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
          
          /* 3D Quest Card Styles - Enhanced */
          .quest-card-3d {
            position: relative;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-style: preserve-3d;
            cursor: pointer;
            perspective: 1000px;
          }
          
          .quest-card-3d:hover {
            transform: translateY(-15px) translateZ(50px) rotateX(5deg) scale(1.05);
            box-shadow: 0 25px 50px -12px rgba(50, 50, 93, 0.35),
                        0 15px 35px -15px rgba(0, 0, 0, 0.25),
                        0 5px 15px -3px rgba(0, 0, 0, 0.1),
                        inset 0 -5px 15px rgba(255, 255, 255, 0.1);
          }
          
          .quest-card-3d::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 1rem;
            background: linear-gradient(135deg, 
              rgba(255,255,255,0.4) 0%, 
              rgba(255,255,255,0.2) 25%,
              rgba(255,255,255,0) 60%);
            opacity: 0;
            transition: opacity 0.5s ease-out;
            pointer-events: none;
            z-index: 10;
          }
          
          .quest-card-3d:hover::before {
            opacity: 1;
          }
          
          .quest-card-3d::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: all 0.6s ease-out;
            pointer-events: none;
            z-index: 5;
          }
          
          .quest-card-3d:hover::after {
            width: 300px;
            height: 300px;
          }
          
          .quest-badge {
            position: absolute;
            top: -15px;
            left: -15px;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: white;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4),
                        0 5px 10px rgba(0, 0, 0, 0.3),
                        inset 0 -5px 10px rgba(0, 0, 0, 0.25),
                        inset 0 2px 5px rgba(255, 255, 255, 0.3);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 3px solid rgba(255, 255, 255, 0.3);
          }
          
          .quest-card-3d:hover .quest-badge {
            transform: translateZ(80px) scale(1.15) rotate(10deg);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5),
                        0 8px 15px rgba(0, 0, 0, 0.4),
                        inset 0 -5px 10px rgba(0, 0, 0, 0.25),
                        inset 0 2px 5px rgba(255, 255, 255, 0.3);
          }
          
          .quest-card-image {
            width: 100%;
            height: auto;
            border-radius: 1rem;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-style: preserve-3d;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .quest-card-3d:hover .quest-card-image {
            transform: translateZ(30px) scale(1.03);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
          
          .quest-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s ease-out;
            border-radius: 1rem;
          }
          
          .quest-card-3d:hover .quest-shine {
            left: 100%;
          }
          
          .quest-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-locked {
            background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
            color: #2d3748;
          }
          
          .status-available {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            animation: pulse 2s infinite;
          }
          
          .status-completed {
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            color: white;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
          
          .progress-track {
            height: 8px;
            background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 100%);
            border-radius: 999px;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #48bb78 0%, #38a169 50%, #2f855a 100%);
            border-radius: 999px;
            transition: width 1s cubic-bezier(0.65, 0, 0.35, 1);
            position: relative;
            overflow: hidden;
          }
          
          .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
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
          
          /* Parallax effect */
          .parallax-scene {
            perspective: 1000px;
          }
          
          /* Enhanced 3D Modal Styles */
          .modal-backdrop {
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            animation: fadeIn 0.3s ease-out;
          }
          
          .modal-content-3d {
            animation: modalSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-style: preserve-3d;
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4),
                        0 15px 30px -10px rgba(0, 0, 0, 0.3),
                        0 5px 15px -5px rgba(0, 0, 0, 0.2),
                        inset 0 -2px 10px rgba(0, 0, 0, 0.1);
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: scale(0.8) translateY(-50px) rotateX(-15deg);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0) rotateX(0deg);
            }
          }
          
          /* Form Section 3D Effect */
          .form-section-3d {
            transition: all 0.3s ease-out;
            transform-style: preserve-3d;
          }
          
          .form-section-3d:hover {
            transform: translateZ(5px);
            box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
          }
          
          /* Input 3D Effect */
          .input-3d {
            transition: all 0.3s ease-out;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          
          .input-3d:focus {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(140, 151, 133, 0.2),
                        inset 0 2px 4px rgba(0, 0, 0, 0.05);
          }
        </style>
    </head>
    <body class="bg-wood-50">
        <!-- 메인 컨텐츠 -->
        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- 진행 단계 표시 (초기에는 숨김) -->
            <div id="progressSteps" class="mb-8 hidden">
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
                    <div class="flex-1">
                        <h2 class="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                            <span class="text-wood-600">중증환자를 간병하는 당신도</span> <span class="text-primary-600">돌봄이 필요해요</span>
                        </h2>
                        <p class="text-wood-900 mb-4 text-base leading-relaxed">
                            혼자 감당하기 어려운 전원 준비, 똑순이가 <strong class="text-primary-700">환자분께 맞춤 경로</strong>를 알려드릴게요.
                        </p>
                        
                        <div class="bg-white rounded-lg p-5 text-sm text-wood-900 shadow-md">
                            <p class="font-bold text-primary-700 mb-5 text-xl flex items-center">
                                <i class="fas fa-tasks mr-2 text-3xl text-wood-500"></i>
                                네 걸음으로, 함께 준비해요
                            </p>
                            
                            <!-- 3D Quest Cards Grid - Extra Large Size -->
                            <div class="parallax-scene grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                                <!-- Quest Card 1 -->
                                <div class="quest-card-3d relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 cursor-pointer transform hover:scale-105 transition-all duration-300" data-quest="1" style="box-shadow: 0 12px 35px rgba(16, 185, 129, 0.3);">
                                    <img src="/static/quest-card-1.png" alt="환자분 이야기 듣기" class="quest-card-image w-full" style="height: 240px; object-fit: contain; object-position: center;">
                                    <div class="quest-shine"></div>
                                </div>
                                
                                <!-- Quest Card 2 -->
                                <div class="quest-card-3d relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 opacity-90 cursor-pointer transform hover:scale-105 transition-all duration-300" data-quest="2" style="box-shadow: 0 12px 35px rgba(59, 130, 246, 0.25);">
                                    <img src="/static/quest-card-2.png" alt="맞춤 경로 함께 보기" class="quest-card-image w-full" style="height: 240px; object-fit: contain; object-position: center;">
                                    <div class="quest-shine"></div>
                                </div>
                                
                                <!-- Quest Card 3 -->
                                <div class="quest-card-3d relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 opacity-90 cursor-pointer transform hover:scale-105 transition-all duration-300" data-quest="3" style="box-shadow: 0 12px 35px rgba(168, 85, 247, 0.25);">
                                    <img src="/static/quest-card-3.png" alt="비용 미리 살펴보기" class="quest-card-image w-full" style="height: 240px; object-fit: contain; object-position: center;">
                                    <div class="quest-shine"></div>
                                </div>
                                
                                <!-- Quest Card 4 -->
                                <div class="quest-card-3d relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 opacity-90 cursor-pointer transform hover:scale-105 transition-all duration-300" data-quest="4" style="box-shadow: 0 12px 35px rgba(245, 158, 11, 0.25);">
                                    <img src="/static/quest-card-4.png" alt="좋은 곳 함께 고르기" class="quest-card-image w-full" style="height: 240px; object-fit: contain; object-position: center;">
                                    <div class="quest-shine"></div>
                                </div>
                            </div>
                            
                            <!-- Progress Bar -->
                            <div class="mt-5 mb-5">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-semibold text-gray-600">전체 진행도</span>
                                    <span class="text-sm font-bold text-primary-600" id="questProgress">0/4 완료</span>
                                </div>
                                <div class="progress-track">
                                    <div class="progress-bar" style="width: 0%" id="questProgressBar"></div>
                                </div>
                            </div>
                            
                            <!-- CTA Banner - Compact Size -->
                            <div class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-1 shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
                                <div class="bg-white rounded-lg p-4 text-center">
                                    <div class="flex items-center justify-center mb-2">
                                        <i class="fas fa-heart text-red-500 text-2xl mr-2 animate-pulse"></i>
                                        <h3 class="text-lg font-bold text-gray-900">
                                            이제 더 이상 혼란스러워하지 마세요!
                                        </h3>
                                    </div>
                                    <p class="text-gray-700 mb-3 text-sm">
                                        <strong class="text-purple-700">환자분 정보를 입력</strong>하시면 똑순이가 모든 걸 정리해드릴게요
                                    </p>
                                    <button onclick="closeModalAndShowForm()" 
                                            class="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                                        <i class="fas fa-arrow-right mr-2 animate-bounce"></i>
                                        지금 바로 시작하기
                                        <i class="fas fa-chevron-right ml-2"></i>
                                    </button>
                                    <p class="text-xs text-gray-500 mt-2">
                                        <i class="fas fa-clock mr-1"></i>
                                        단 5분이면 완료됩니다
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 bg-wood-100 border border-wood-300 rounded-lg p-3 text-center cursor-pointer hover:bg-wood-200 transition-all" onclick="showCommunityModal()">
                            <p class="text-wood-800 font-medium">
                                <i class="fas fa-comments mr-2 animate-bounce inline-block text-wood-500"></i>
                                혼자 고민하지 마세요. 함께 이야기해 볼까요?
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 1단계: 환자 등록 폼 (초기에는 숨김) -->
            <section id="registerForm" class="mb-12 hidden">
                <div class="section-card rounded-lg shadow-lg p-8 border">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">
                                <i class="fas fa-user-heart text-wood-500 mr-2"></i>
                                환자분 이야기를 들려주세요
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                천천히 작성하셔도 괜찮아요. 모르는 부분은 <strong class="text-wood-600">?</strong> 아이콘을 눌러 도움을 받으세요
                            </p>
                        </div>
                    </div>
                    <form id="patientForm" class="space-y-6">
                        <!-- 기본 정보 섹션 -->
                        <div class="form-section-3d bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <h3 class="text-lg font-bold text-blue-800 mb-4 flex items-center">
                                <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                                기본 정보
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold text-gray-800 mb-2">
                                        <span class="text-red-500">*</span> 환자 이름
                                    </label>
                                    <input type="text" name="name" required 
                                           placeholder="예: 김영희"
                                           class="input-3d w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base">
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-800 mb-2">
                                        <span class="text-red-500">*</span> 나이
                                    </label>
                                    <input type="number" name="age" required 
                                           placeholder="예: 75"
                                           class="input-3d w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base">
                                </div>
                            </div>
                        </div>
                        
                        <!-- 진단 정보 섹션 -->
                        <div class="form-section-3d bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <h3 class="text-lg font-bold text-green-800 mb-4 flex items-center">
                                <span class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                                진단 정보
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold text-gray-800 mb-2">
                                        <span class="text-red-500">*</span> 진단명 (질병명)
                                    </label>
                                    <input type="text" name="diagnosis" required 
                                           placeholder="예: 뇌경색, 뇌출혈, 대장암"
                                           class="input-3d w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base">
                                    <p class="text-xs text-gray-600 mt-1 bg-white rounded px-2 py-1">
                                        💡 진료기록지나 진단서에 적힌 병명을 적어주세요
                                    </p>
                                </div>
                                <div>
                                    <label class="flex items-center text-sm font-bold text-gray-800 mb-2">
                                        <span class="text-red-500">*</span> 발병/수술일
                                        <button type="button" onclick="showHelp('diagnosis_date')" 
                                                class="ml-2 text-green-600 hover:text-green-800 text-lg">
                                            <i class="fas fa-question-circle"></i>
                                        </button>
                                    </label>
                                    <input type="date" name="diagnosis_date" required 
                                           class="input-3d w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base">
                                    <p class="text-xs text-gray-600 mt-1 bg-white rounded px-2 py-1">
                                        📅 언제 쓰러지셨거나 수술하셨나요?
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 건강 상태 섹션 -->
                        <div class="form-section-3d bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <h3 class="text-lg font-bold text-purple-800 mb-4 flex items-center">
                                <span class="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                                환자 건강 평가
                            </h3>
                            
                            <!-- GCS 설명 -->
                            <div class="bg-purple-100 rounded-lg p-4 mb-4 border-l-4 border-purple-500">
                                <p class="text-sm text-purple-900">
                                    <i class="fas fa-info-circle mr-2"></i>
                                    <strong>GCS(Glasgow Coma Scale)은 병원에서 의식 수준을 평가하는 가장 표준화되고 객관적인 방법입니다.</strong><br>
                                    세 가지 영역(눈 뜨기, 언어 반응, 운동 반응)을 각각 평가하여 총점으로 의식 수준을 판단합니다.
                                </p>
                            </div>
                            
                            <div class="space-y-4">
                                <!-- GCS 평가 -->
                                <div class="bg-white rounded-lg p-4 border-2 border-purple-200 space-y-4">
                                    <!-- 눈 뜨기 반응 -->
                                    <div>
                                        <label class="text-sm font-bold text-gray-700 mb-2 block flex items-center">
                                            <span class="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">1</span>
                                            👁️ 눈 뜨기 반응 (Eye Opening) - 1~4점
                                        </label>
                                        <select name="gcs_eye" onchange="updateGCSTotal()" 
                                                class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-2">
                                            <option value="4">4점: 자발적으로 눈을 뜸 (정상)</option>
                                            <option value="3">3점: 말을 걸면 눈을 뜸</option>
                                            <option value="2">2점: 통증 자극에만 눈을 뜸</option>
                                            <option value="1">1점: 어떤 자극에도 눈을 뜨지 않음</option>
                                        </select>
                                        <p class="text-xs text-gray-600 bg-blue-50 rounded px-3 py-2">
                                            💡 이름을 부르거나 "눈을 떠보세요"라고 하면 반응하는지 확인
                                        </p>
                                    </div>
                                    
                                    <!-- 언어 반응 -->
                                    <div>
                                        <label class="text-sm font-bold text-gray-700 mb-2 block flex items-center">
                                            <span class="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">2</span>
                                            💬 언어 반응 (Verbal Response) - 1~5점
                                        </label>
                                        <select name="gcs_verbal" onchange="updateGCSTotal()" 
                                                class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-2">
                                            <option value="5">5점: 정상 대화 + 지남력 정상 (날짜/장소/이름 정확)</option>
                                            <option value="4">4점: 대화는 되나 혼란스러움 (섬망 가능)</option>
                                            <option value="3">3점: 단어만 말함 (문장 구성 불가)</option>
                                            <option value="2">2점: 이해할 수 없는 소리 (신음)</option>
                                            <option value="1">1점: 전혀 소리를 내지 않음</option>
                                        </select>
                                        <p class="text-xs text-gray-600 bg-green-50 rounded px-3 py-2">
                                            💡 오늘 날짜, 여기가 어디인지, 자신과 가족 이름을 아는지 확인
                                        </p>
                                    </div>
                                    
                                    <!-- 운동 반응 -->
                                    <div>
                                        <label class="text-sm font-bold text-gray-700 mb-2 block flex items-center">
                                            <span class="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">3</span>
                                            🤚 운동 반응 (Motor Response) - 1~6점
                                        </label>
                                        <select name="gcs_motor" onchange="updateGCSTotal()" 
                                                class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-2">
                                            <option value="6">6점: 명령에 따라 움직임 ("손을 들어보세요" 등)</option>
                                            <option value="5">5점: 통증 위치를 정확히 찾아 제거</option>
                                            <option value="4">4점: 통증에 손을 뻗으나 부정확</option>
                                            <option value="3">3점: 팔을 구부리는 비정상 반응</option>
                                            <option value="2">2점: 팔을 펴는 비정상 반응 (더 심각)</option>
                                            <option value="1">1점: 전혀 움직이지 않음</option>
                                        </select>
                                        <p class="text-xs text-gray-600 bg-purple-50 rounded px-3 py-2">
                                            💡 지시에 따라 움직이는지, 통증에 어떻게 반응하는지 확인
                                        </p>
                                    </div>
                                    
                                    <!-- 총점 표시 -->
                                    <div class="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-400 p-4 mt-4">
                                        <div class="flex items-center justify-between mb-3">
                                            <span class="text-base font-bold text-gray-800">GCS 총점 (3~15점):</span>
                                            <div class="flex items-center space-x-3">
                                                <span id="gcsTotal" class="text-3xl font-bold text-purple-700">15점</span>
                                                <span id="gcsLevel" class="text-sm px-3 py-1 rounded-full bg-green-500 text-white font-semibold">정상</span>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                            <div class="bg-green-50 rounded p-2 text-center border border-green-300">
                                                <div class="font-bold text-green-800">15점</div>
                                                <div class="text-gray-600">정상</div>
                                            </div>
                                            <div class="bg-blue-50 rounded p-2 text-center border border-blue-300">
                                                <div class="font-bold text-blue-800">13-14점</div>
                                                <div class="text-gray-600">경미한 장애</div>
                                            </div>
                                            <div class="bg-yellow-50 rounded p-2 text-center border border-yellow-300">
                                                <div class="font-bold text-yellow-800">9-12점</div>
                                                <div class="text-gray-600">중등도 장애</div>
                                            </div>
                                            <div class="bg-red-50 rounded p-2 text-center border border-red-300">
                                                <div class="font-bold text-red-800">≤8점</div>
                                                <div class="text-gray-600">중증 장애</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- 평가 팁 -->
                                    <div class="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                                        <h5 class="font-bold text-blue-800 mb-2 text-sm flex items-center">
                                            <i class="fas fa-lightbulb text-blue-600 mr-2"></i>
                                            평가 팁
                                        </h5>
                                        <ul class="text-xs text-gray-700 space-y-1">
                                            <li>✓ 환자를 직접 보면서 평가하거나 의료진에게 물어보세요</li>
                                            <li>✓ 각 항목별로 가장 좋은 반응을 선택하세요</li>
                                            <li>✓ 잘 모르겠다면 간호사나 의사에게 GCS 점수를 문의하세요</li>
                                        </ul>
                                    </div>
                                    
                                    <!-- 주의사항 -->
                                    <div class="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
                                        <h5 class="font-bold text-red-800 mb-2 text-sm flex items-center">
                                            <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                                            주의사항
                                        </h5>
                                        <ul class="text-xs text-gray-700 space-y-1">
                                            <li>⚠️ GCS 점수가 갑자기 낮아지면 즉시 의료진에게 알리세요</li>
                                            <li>⚠️ 8점 이하는 기도 관리가 필요한 중증 상태입니다</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 보험 정보 섹션 -->
                        <div class="form-section-3d bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <h3 class="text-lg font-bold text-orange-800 mb-4 flex items-center">
                                <span class="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4️⃣</span>
                                보험 가입 현황
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="flex items-center text-sm font-bold text-gray-800 mb-2">
                                        <span class="text-red-500">*</span> 건강보험 종류
                                        <button type="button" onclick="showHelp('insurance')" 
                                                class="ml-2 text-orange-600 hover:text-orange-800 text-lg">
                                            <i class="fas fa-question-circle"></i>
                                        </button>
                                    </label>
                                    <select name="insurance_type" 
                                            class="input-3d w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 text-base">
                                        <option value="employee">💼 직장가입자 (고용보험)</option>
                                        <option value="local">🏠 지역가입자 (주민보험)</option>
                                        <option value="special">🏛️ 특수·공공지원</option>
                                    </select>
                                    <p class="text-xs text-gray-600 mt-1 bg-white rounded px-2 py-1">
                                        📄 건강보험증을 확인해주세요
                                    </p>
                                </div>
                                <div>
                                    <label class="flex items-center text-sm font-bold text-gray-800 mb-2">
                                        장기요양등급 (있으면 선택)
                                        <button type="button" onclick="showHelp('ltc')" 
                                                class="ml-2 text-orange-600 hover:text-orange-800 text-lg">
                                            <i class="fas fa-question-circle"></i>
                                        </button>
                                    </label>
                                    <select name="ltc_grade" 
                                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base">
                                        <option value="">❔ 신청 안했거나 모름</option>
                                        <option value="1">1급 (가장 심함)</option>
                                        <option value="2">2급 (심함)</option>
                                        <option value="3">3급 (보통)</option>
                                        <option value="4">4급 (약함)</option>
                                        <option value="5">5급 (약함)</option>
                                    </select>
                                    <p class="text-xs text-gray-600 mt-1 bg-white rounded px-2 py-1">
                                        💡 없으면 첫 번째 선택하세요
                                    </p>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-bold text-gray-800 mb-2">
                                        <span class="text-red-500">*</span> 현재 입원 병원 이름
                                    </label>
                                    <input type="text" name="current_hospital" required 
                                           placeholder="예: 서울대학교병원, 삼성서울병원"
                                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base">
                                    <p class="text-xs text-gray-600 mt-1 bg-white rounded px-2 py-1">
                                        🏥 지금 계신 병원 이름을 적어주세요
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 특수 케어 필요 사항 섹션 -->
                        <div class="form-section-3d bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <h3 class="text-lg font-bold text-rose-800 mb-4 flex items-center">
                                <span class="bg-rose-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">5</span>
                                특수 케어 필요 사항
                            </h3>
                            <div class="space-y-4">
                                <!-- 섬망 위험 -->
                                <div class="bg-white rounded-lg p-4 border-2 border-rose-200">
                                    <label class="flex items-center text-sm font-bold text-gray-800 mb-2">
                                        🧠 섬망 위험 여부
                                        <button type="button" onclick="showHelp('delirium')" 
                                                class="ml-2 text-rose-600 hover:text-rose-800 text-lg">
                                            <i class="fas fa-question-circle"></i>
                                        </button>
                                    </label>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg hover:bg-rose-50 cursor-pointer transition">
                                            <input type="radio" name="delirium_risk" value="high" class="mr-3 w-5 h-5">
                                            <span class="text-sm">🔴 고위험 (자주 혼란)</span>
                                        </label>
                                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg hover:bg-rose-50 cursor-pointer transition">
                                            <input type="radio" name="delirium_risk" value="moderate" class="mr-3 w-5 h-5">
                                            <span class="text-sm">🟡 중위험 (가끔 혼란)</span>
                                        </label>
                                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg hover:bg-rose-50 cursor-pointer transition">
                                            <input type="radio" name="delirium_risk" value="low" class="mr-3 w-5 h-5" checked>
                                            <span class="text-sm">🟢 저위험 (정상)</span>
                                        </label>
                                    </div>
                                    <p class="text-xs text-gray-600 mt-2 bg-rose-50 rounded px-3 py-2">
                                        💡 섬망: 밤낮이 바뀌거나, 헛것을 보거나, 갑자기 혼란스러워하는 증상
                                    </p>
                                </div>
                                
                                <!-- 연하장애 -->
                                <div class="bg-white rounded-lg p-4 border-2 border-rose-200">
                                    <label class="flex items-center text-sm font-bold text-gray-800 mb-2">
                                        🍽️ 연하(삼키기) 문제 여부
                                        <button type="button" onclick="showHelp('dysphagia')" 
                                                class="ml-2 text-rose-600 hover:text-rose-800 text-lg">
                                            <i class="fas fa-question-circle"></i>
                                        </button>
                                    </label>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg hover:bg-rose-50 cursor-pointer transition">
                                            <input type="radio" name="dysphagia" value="severe" class="mr-3 w-5 h-5">
                                            <span class="text-sm">🔴 심함 (콧줄)</span>
                                        </label>
                                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg hover:bg-rose-50 cursor-pointer transition">
                                            <input type="radio" name="dysphagia" value="moderate" class="mr-3 w-5 h-5">
                                            <span class="text-sm">🟡 보통 (죽/갈은 음식)</span>
                                        </label>
                                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg hover:bg-rose-50 cursor-pointer transition">
                                            <input type="radio" name="dysphagia" value="none" class="mr-3 w-5 h-5" checked>
                                            <span class="text-sm">🟢 없음 (정상)</span>
                                        </label>
                                    </div>
                                    <p class="text-xs text-gray-600 mt-2 bg-rose-50 rounded px-3 py-2">
                                        💡 음식을 삼킬 때 사래 들리거나 기침이 나는지 확인
                                    </p>
                                </div>
                                
                                <!-- 재활 필요 사항 -->
                                <div class="bg-white rounded-lg p-4 border-2 border-rose-200">
                                    <label class="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                                        ♿ 필요한 재활 치료 선택
                                        <button type="button" onclick="showHelp('rehab_types')" 
                                                class="ml-2 text-rose-600 hover:text-rose-800 text-lg">
                                            <i class="fas fa-question-circle"></i>
                                        </button>
                                    </label>
                                    <p class="text-xs text-gray-600 mb-3 bg-blue-50 rounded px-3 py-2">
                                        💡 환자분에게 필요한 재활 치료를 모두 선택해주세요 (중복 선택 가능)
                                    </p>
                                    
                                    <!-- 기본 재활 치료 -->
                                    <div class="mb-4">
                                        <h4 class="text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">1</span>
                                            기본 재활 치료
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_physical" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">💪 물리치료 (PT)</div>
                                                    <div class="text-xs text-gray-600">관절운동, 근력강화, 보행훈련</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_occupational" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">🖐️ 작업치료 (OT)</div>
                                                    <div class="text-xs text-gray-600">식사, 옷입기 등 일상생활 훈련</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <!-- 언어·인지 재활 -->
                                    <div class="mb-4">
                                        <h4 class="text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">2</span>
                                            언어·인지 재활
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-green-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_speech" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">🗣️ 언어치료 (ST)</div>
                                                    <div class="text-xs text-gray-600">말하기, 발음, 실어증 치료</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-green-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_swallowing" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">🍽️ 연하치료</div>
                                                    <div class="text-xs text-gray-600">삼킴장애 전문 치료</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-green-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_cognitive" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">🧠 인지재활</div>
                                                    <div class="text-xs text-gray-600">기억력, 주의력, 문제해결</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-green-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_psychological" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">💭 심리상담</div>
                                                    <div class="text-xs text-gray-600">우울증, 불안 상담</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <!-- 특수 재활 치료 -->
                                    <div class="mb-4">
                                        <h4 class="text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <span class="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">3</span>
                                            특수 재활 치료
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_robot" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">🤖 로봇재활</div>
                                                    <div class="text-xs text-gray-600">보행로봇, 상지로봇 훈련</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_vr" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">🥽 VR재활</div>
                                                    <div class="text-xs text-gray-600">가상현실 재활 치료</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_vestibular" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">🌀 전정재활</div>
                                                    <div class="text-xs text-gray-600">어지럼증, 균형장애 치료</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition">
                                                <input type="checkbox" name="rehab_lymphedema" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">💧 림프부종관리</div>
                                                    <div class="text-xs text-gray-600">암 수술 후 부종 치료</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <!-- 보조기구 -->
                                    <div>
                                        <h4 class="text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <span class="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">4</span>
                                            보조기구 필요 여부
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                                                <input type="checkbox" name="needs_prosthesis" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">🦿 의지·보조기</div>
                                                    <div class="text-xs text-gray-600">의족, 의수, AFO, KAFO 등</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                                                <input type="checkbox" name="needs_wheelchair" value="true" class="mt-1 mr-3 w-5 h-5">
                                                <div class="flex-1">
                                                    <div class="text-sm font-semibold">♿ 휠체어·보행보조기</div>
                                                    <div class="text-xs text-gray-600">휠체어, 워커, 지팡이 등</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 제출 버튼 -->
                        <button type="submit" 
                                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-bold text-xl shadow-2xl transform hover:scale-105">
                            <i class="fas fa-rocket mr-3 text-2xl"></i>
                            분석 시작하기
                        </button>
                        <p class="text-center text-gray-500 text-sm mt-3">
                            <span class="text-red-500">*</span> 표시는 필수 입력 항목입니다
                        </p>
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
                                <span id="patientNameDisplay"></span>님을 위한 경로를 추천해드려요
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                환자분의 상태를 분석한 결과에요. 함께 살펴볼까요?
                            </p>
                        </div>
                    </div>
                    <div id="pathwayContent"></div>
                    
                    <!-- 다음 단계 안내 -->
                    <div class="mt-6 bg-gradient-to-r from-wood-50 to-primary-50 border border-wood-300 rounded-lg p-4">
                        <p class="text-wood-900 text-center mb-3">
                            <i class="fas fa-lightbulb text-wood-500 mr-2"></i>
                            <strong class="text-primary-700">어떠세요?</strong> 
                            이제 비용을 함께 살펴볼까요?
                        </p>
                        <div class="flex space-x-3">
                            <button onclick="goToStep(3)" 
                                    class="flex-1 bg-primary-500 text-white py-4 px-6 rounded-lg hover:bg-primary-700 transition font-bold text-lg shadow-lg">
                                <i class="fas fa-hand-holding-usd mr-2"></i>
                                다음: 비용 미리 보기
                            </button>
                        </div>
                        <button onclick="goToStep(4)" 
                                class="mt-2 w-full bg-white border-2 border-primary-300 text-primary-700 py-2 px-4 rounded-lg hover:bg-primary-50 transition font-semibold text-sm">
                            <i class="fas fa-hospital mr-2"></i>
                            기관부터 먼저 볼래요
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
                                <i class="fas fa-piggy-bank text-wood-600 mr-2"></i>
                                걱정되는 비용, 투명하게 보여드려요
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                대략적인 금액이지만, 미리 준비하시는 데 도움이 될 거예요
                            </p>
                        </div>
                    </div>
                    <div id="costContent"></div>
                    
                    <!-- 다음 단계 안내 -->
                    <div class="mt-6 bg-gradient-to-r from-wood-100 to-primary-100 border border-wood-400 rounded-lg p-4">
                        <p class="text-wood-900 text-center mb-3">
                            <i class="fas fa-lightbulb text-wood-500 mr-2"></i>
                            <strong class="text-wood-700">비용을 확인하셨나요?</strong> 
                            이제 좋은 기관을 함께 골라봐요
                        </p>
                        <button onclick="goToStep(4)" 
                                class="w-full bg-wood-500 text-white py-4 px-6 rounded-lg hover:bg-wood-700 transition font-bold text-lg shadow-lg">
                            <i class="fas fa-building mr-2"></i>
                            다음: 기관 함께 골라보기
                        </button>
                        <button onclick="showDetailedCostCalculator()" 
                                class="mt-2 w-full bg-white border-2 border-primary-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-primary-50 transition font-semibold text-sm">
                            <i class="fas fa-chart-line mr-2"></i>
                            더 자세히 계산해볼까요? (선택)
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
                                <i class="fas fa-hospital-alt text-primary-600 mr-2"></i>
                                환자분께 맞는 기관을 찾아볼게요
                            </h2>
                            <p class="text-sm text-gray-500 mt-1">
                                가까운 곳부터, 조건에 맞는 곳까지 함께 살펴보아요
                            </p>
                        </div>
                    </div>
                    <div id="facilitiesContent"></div>
                    
                    <!-- 완료 안내 -->
                    <div class="mt-6 bg-gradient-to-r from-wood-100 to-wood-200 border border-wood-400 rounded-lg p-4">
                        <p class="text-wood-900 text-center mb-3">
                            <i class="fas fa-check-circle text-primary-600 mr-2"></i>
                            <strong class="text-wood-700">기관을 살펴보셨나요?</strong> 
                            마지막으로, 전원 준비 체크리스트도 확인해볼까요?
                        </p>
                        <button onclick="showChecklist()" 
                                class="w-full bg-wood-600 text-white py-4 px-6 rounded-lg hover:bg-wood-800 transition font-bold text-lg shadow-lg">
                            <i class="fas fa-clipboard-check mr-2"></i>
                            체크리스트 함께 확인하기
                        </button>
                        <p class="text-xs text-gray-500 text-center mt-3">
                            <i class="fas fa-heart mr-1 text-wood-500"></i>
                            빠뜨린 서류가 없도록 하나하나 체크해드려요
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
                <p class="text-gray-400">© 2025 똑순이. 중증환자를 간병하는 당신도 돌봄이 필요해요</p>
                <p class="text-sm text-gray-500 mt-2">우리 함께 가요 • 환자분의 최적 회복을 위한 동행</p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

export default app;
