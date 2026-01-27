# 하이브리브 (Hi-BREAV) - 재활·요양 전원 의사결정 지원 플랫폼

## 프로젝트 개요
하이브리브는 암·뇌졸중 등 중증질환 환자 가족이 급성기 이후 재활·요양 단계로 전원할 때 겪는 의사결정 혼란을 해결하는 디지털 플랫폼입니다.

**핵심 가치**: 정보 제공이 아닌 실행 가능한 의사결정 지원

## 공개 URL
- **개발 서버**: https://3000-i4obuq255igd4vdlqtq14-a402f90a.sandbox.novita.ai
- **API 엔드포인트**: https://3000-i4obuq255igd4vdlqtq14-a402f90a.sandbox.novita.ai/api
- **현재 버전**: v1.3 (2026-01-27)

## 최근 업데이트 (v1.3)
### 🎯 UX/UI 대폭 개선
- **환자 등록 우선 플로우**: 첫 화면에서 바로 환자 정보 입력 가능
- **명확한 단계별 안내**: 각 단계마다 큰 "다음" 버튼과 컬러풀한 안내 박스
- **자동 플로우**: 등록 완료 후 1.5초 후 자동으로 경로 추천 화면 이동
- **웰컴 메시지 강화**: 4단계 프로세스를 시각적으로 명확하게 표현
- **버튼 디자인 개선**: 그라데이션 배경 및 명확한 액션 구분

## 기술 스택
- **Backend**: Hono (Cloudflare Workers)
- **Frontend**: Vanilla JavaScript + Tailwind CSS
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages

## 현재 구현된 기능

### ✅ 완료된 기능
1. **환자 관리**
   - 환자 등록 (진단명, ADL 점수, GCS 의식 평가, 보험 정보 등)
   - 환자 목록 조회 및 상세 정보 보기
   - 중증도 자동 분류 (ADL 점수 기반)
   - **v1.3: 환자 등록 우선 플로우**
     - 첫 화면에서 바로 환자 정보 입력 시작
     - 등록 후 자동으로 맞춤 경로 추천 표시
     - 명확한 단계별 안내 및 버튼 개선
   - **v1.2: Glasgow Coma Scale (GCS) 의식 상태 평가**
     - 표준화된 3영역 평가 (눈 뜨기/언어/운동 반응)
     - 실시간 총점 계산 및 중증도 표시
     - 상세 평가 가이드 및 의학적 해석
   - **v1.1: 사용자 친화적 입력 가이드**
     - ADL 점수 평가 가이드 (간단 평가 방법 포함)
     - 건강보험 유형 설명 (직장/지역/의료급여)
     - 장기요양등급 상세 안내 (신청 방법 포함)
     - 발병일 입력 가이드
     - 슬라이더 UI로 직관적인 ADL 점수 입력

2. **경로 추천 엔진**
   - 환자 상태 기반 자동 경로 생성
   - 중증도별 맞춤 전원 경로 (경증/중등도/중증)
   - 단계별 예상 기간, 치료 목표, 비용 제시
   - 장기요양등급 신청 타이밍 알림

3. **비용 계산기**
   - 기관 유형별 비용 시뮬레이션
   - 건강보험/장기요양보험 본인부담금 계산
   - 월별 현금흐름 시각화
   - 오차 범위 (±15%) 제시

4. **기관 찾기**
   - 재활병원/요양병원/요양원 데이터베이스
   - 기관 유형별 필터링
   - 평균 비용, 병상 수, 대기 기간 정보
   - 위치, 전문 진료과, 재활 프로그램 정보

5. **전원 체크리스트**
   - 전원 유형별 자동 체크리스트 생성
   - 카테고리별 항목 분류 (서류/검사/행정/기타)
   - 진행률 시각화
   - 항목별 완료 상태 관리

6. **간병 스케줄러 (부분 구현)**
   - 간병인/가족 일정 등록 및 조회
   - 간병 공백 구간 자동 감지
   - 일정 수정 및 삭제 기능

## 주요 API 엔드포인트

### 환자 관리
- `GET /api/patients` - 환자 목록 조회
- `GET /api/patients/:id` - 환자 상세 조회
- `POST /api/patients` - 환자 등록
- `PUT /api/patients/:id` - 환자 정보 수정

### 기관 관리
- `GET /api/facilities` - 기관 목록 조회
- `GET /api/facilities/:id` - 기관 상세 조회
- `GET /api/facilities/search` - 기관 검색 (필터링)

### 비용 계산
- `POST /api/costs/calculate` - 비용 계산
- `GET /api/costs/patient/:patientId` - 환자별 시뮬레이션 이력
- `POST /api/costs/compare` - 여러 시나리오 비교

### 체크리스트
- `GET /api/checklists/patient/:patientId` - 환자별 체크리스트 조회
- `POST /api/checklists/generate` - 체크리스트 자동 생성
- `PUT /api/checklists/:id/complete` - 항목 완료 처리

### 간병 스케줄
- `GET /api/schedules/patient/:patientId` - 환자별 스케줄 조회
- `POST /api/schedules` - 스케줄 추가
- `PUT /api/schedules/:id` - 스케줄 수정
- `DELETE /api/schedules/:id` - 스케줄 삭제

## 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 데이터베이스 초기화
```bash
# 마이그레이션 적용
npm run db:migrate:local

# 샘플 데이터 삽입
npm run db:seed
```

### 3. 빌드
```bash
npm run build
```

### 4. 개발 서버 실행
```bash
# PM2로 실행 (권장)
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox
```

### 5. 서비스 확인
```bash
# 로컬에서 접속
curl http://localhost:3000

# 헬스 체크
curl http://localhost:3000/api/health
```

## 데이터베이스 관리

```bash
# 로컬 DB 리셋 (마이그레이션 + 시드 재실행)
npm run db:reset

# 로컬 DB 콘솔
npm run db:console:local

# SQL 직접 실행 예시
npx wrangler d1 execute webapp-production --local --command="SELECT * FROM patients"
```

## 프로덕션 배포

### 1. Cloudflare API 키 설정
```bash
# setup_cloudflare_api_key 툴 사용 (샌드박스 환경)
```

### 2. D1 데이터베이스 생성
```bash
npx wrangler d1 create webapp-production
```

### 3. wrangler.jsonc 업데이트
생성된 database_id를 wrangler.jsonc에 입력

### 4. 프로덕션 마이그레이션
```bash
npm run db:migrate:prod
```

### 5. 배포
```bash
npm run deploy:prod
```

## 아직 구현되지 않은 기능

### 🚧 추가 개발 필요
1. **사용자 인증 및 권한 관리**
   - 회원가입/로그인 기능
   - 환자-보호자 관계 설정
   - 다중 보호자 간 정보 공유

2. **서류 관리 고도화**
   - 파일 업로드 기능 (Cloudflare R2 연동)
   - OCR 기반 서류 자동 분류
   - PDF 패키지 생성 및 다운로드

3. **간병 스케줄러 개선**
   - 캘린더 UI 추가
   - 반복 일정 처리
   - 간병인 구인 정보 연동
   - 응급 상황 대응 가이드

4. **알림 시스템**
   - 전원 D-day 카운트다운
   - 미완료 항목 푸시 알림
   - 스케줄 리마인더

5. **데이터 시각화**
   - 비용 트렌드 차트
   - 회복 진행도 그래프
   - 경로별 비교 시각화

6. **외부 API 연동**
   - 건강보험심사평가원 API
   - 국민건강보험공단 API
   - 지도 API (네이버/카카오)
   - 실시간 병상 정보

## 추천 다음 단계

1. **사용자 인증 시스템 구축** (우선순위: 높음)
   - Auth0 또는 Clerk 연동
   - 환자-보호자 관계 설정

2. **파일 업로드 기능** (우선순위: 높음)
   - Cloudflare R2 설정
   - 서류 업로드 UI
   - 파일 미리보기

3. **실시간 알림 시스템** (우선순위: 중간)
   - 이메일 알림 (SendGrid)
   - SMS 알림 (Twilio)

4. **데이터 시각화 개선** (우선순위: 중간)
   - Chart.js 또는 D3.js 활용
   - 대시보드 강화

5. **모바일 최적화** (우선순위: 낮음)
   - 반응형 디자인 개선
   - PWA 변환

## 프로젝트 구조
```
webapp/
├── src/
│   ├── index.tsx           # 메인 애플리케이션
│   ├── types.ts            # TypeScript 타입 정의
│   └── routes/
│       ├── patients.ts     # 환자 관리 API
│       ├── facilities.ts   # 기관 관리 API
│       ├── costs.ts        # 비용 계산 API
│       ├── checklists.ts   # 체크리스트 API
│       └── schedules.ts    # 스케줄 API
├── public/
│   └── static/
│       └── app.js          # 프론트엔드 JavaScript
├── migrations/
│   └── 0001_initial_schema.sql  # DB 스키마
├── seed.sql                # 샘플 데이터
├── ecosystem.config.cjs    # PM2 설정
├── wrangler.jsonc          # Cloudflare 설정
└── package.json            # 의존성 및 스크립트
```

## 샘플 데이터
기본적으로 다음 샘플 데이터가 포함되어 있습니다:
- 3명의 환자 (뇌졸중, 암 환자 등)
- 8개의 재활/요양 기관 (서울/수도권)
- 경로 추천 예시
- 비용 시뮬레이션 예시
- 체크리스트 템플릿

## 라이선스
MIT License

## 문의
- 프로젝트: 하이브리브 (Hi-BREAV)
- 목적: 재활·요양 전원 의사결정 지원
