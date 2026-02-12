# EAF Front 파일 전수 기술문서 및 보고서

작성일: 2026-02-06  
대상 경로: `c:\Users\Admin\yebeen\eaf-front`

## 1. 문서 목적
이 문서는 `eaf-front` 저장소 내 파일을 기술문서/보고서 형태로 정리한 전수 인벤토리다.  
운영 시 계속 변하는 생성 산출물(`.next`)은 파일군 기준으로 해설하고, 전체 파일 경로 목록은 별도 인덱스 파일로 제공한다.

## 2. 범위와 집계 기준
- 포함: `.git`, `node_modules`를 제외한 저장소 내 전체 파일
- 전수 파일 경로 인덱스: `docs/all-files-index.tsv`
- 분류:
  - `source_or_config`: 사람이 유지보수하는 파일
  - `generated`: 빌드/개발 서버가 자동 생성하는 파일(`.next` 계열)
- `docs/all-files-index.tsv`는 생성 시점 스냅샷이며, 특히 `.next` 파일 수는 개발 서버 동작에 따라 수시로 변동될 수 있다.

## 3. 시스템/구조 요약
- 프레임워크: Next.js 16 (App Router), React 19, TypeScript
- UI: Tailwind CSS 4 + Bootstrap 5 + Radix/shadcn 컴포넌트
- 데이터 흐름:
  - `src/app/page.tsx`에서 입력 슬라이더 상태 관리
  - `src/lib/api.ts`로 `/predict`, `/recommend` 호출
  - `src/components/radial-result.tsx`에서 결과 시각화

## 4. 파일별 기술 정리 (유지보수 대상)

### Root
| 파일 | 역할 | 비고 |
|---|---|---|
| `.env` | 런타임 환경변수 정의 | 현재 `NEXT_PUBLIC_API_BASE_URL` 사용 |
| `.gitignore` | Git 추적 제외 규칙 | `.next`, `.env*`, `node_modules` 등 제외 |
| `all_feature_stats.json` | 전체 피처 통계 정의(평균/중앙값/범위) | `src/lib/params.ts`에서 로드 |
| `components.json` | shadcn/ui 설정 | alias, css 경로, 스타일 프리셋 정의 |
| `control_vars_stats.json` | 조절 가능한 제어 변수 통계 | 슬라이더 생성 기준 데이터(10개) |
| `eslint.config.mjs` | ESLint 설정 | Next Core Web Vitals + TypeScript preset |
| `next.config.ts` | Next.js 설정 엔트리 | 현재 커스텀 옵션 없음 |
| `next-env.d.ts` | Next 타입 참조 파일 | 자동 생성/관리 파일, 수동 편집 비권장 |
| `package-lock.json` | npm lock 파일 | 의존성 버전 고정(자동 생성) |
| `package.json` | 프로젝트 메타/스크립트/의존성 | `dev`, `build`, `start`, `lint` 정의 |
| `postcss.config.mjs` | PostCSS 설정 | `@tailwindcss/postcss` 플러그인 사용 |
| `prettier.config.js` | 코드 포맷팅 규칙 | single quote, trailing comma 등 지정 |
| `README.md` | 프로젝트 사용 안내 | 실행/환경변수/주요 파일 안내 |
| `tsconfig.json` | TypeScript 컴파일 설정 | `@/* -> src/*` 경로 별칭 포함 |

### VS Code
| 파일 | 역할 | 비고 |
|---|---|---|
| `.vscode/settings.json` | 워크스페이스 IDE 설정 | 현재 빈 JSON 객체 |

### Docs
| 파일 | 역할 | 비고 |
|---|---|---|
| `docs/api-ui-change-template.md` | API/UI 변경 기록 템플릿 | 변경 목적, 영향, 롤백, 체크리스트 포함 |
| `docs/technical-spec.md` | 기술 명세 문서 | API 계약, UI 동작, 영향 분석 가이드 |
| `docs/all-files-index.tsv` | 전체 파일 경로 인덱스 | 경로/바이트/분류(`source_or_config`/`generated`) |
| `docs/repository-file-report.md` | 본 보고서 | 파일 전수 기술 정리 문서 |

### Public Assets
| 파일 | 역할 | 비고 |
|---|---|---|
| `public/file.svg` | 아이콘 에셋 | 정적 리소스 |
| `public/globe.svg` | 아이콘 에셋 | 정적 리소스 |
| `public/next.svg` | 아이콘 에셋 | 정적 리소스 |
| `public/vercel.svg` | 아이콘 에셋 | 정적 리소스 |
| `public/window.svg` | 아이콘 에셋 | 정적 리소스 |

### App
| 파일 | 역할 | 비고 |
|---|---|---|
| `src/app/favicon.ico` | 파비콘 | 브라우저 탭 아이콘 |
| `src/app/globals.css` | 글로벌 스타일/테마 토큰 | Tailwind theme 변수, light/dark 컬러 토큰 |
| `src/app/image.png` | 상단 헤더 이미지 | `page.tsx`에서 import해 렌더링 |
| `src/app/layout.tsx` | 루트 레이아웃 | 폰트(Geist), Bootstrap CSS, 전역 CSS 로드 |
| `src/app/page.tsx` | 메인 화면/상태/이벤트 로직 | feature 로드, 예측/최적화 호출, 결과 반영 |

### Components
| 파일 | 역할 | 비고 |
|---|---|---|
| `src/components/radial-result.tsx` | 결과 카드/방사형 차트 UI | 지표 라벨/최댓값/표시 포맷 포함 |
| `src/components/sliders-panel.tsx` | 슬라이더/고정 스위치 패널 UI | 값 변경 및 fixed 토글 이벤트 전달 |

### UI Primitives
| 파일 | 역할 | 비고 |
|---|---|---|
| `src/components/ui/card.tsx` | 카드 레이아웃 컴포넌트 | Header/Content/Footer 등 슬롯 제공 |
| `src/components/ui/chart.tsx` | Recharts 공통 래퍼 | 차트 컨테이너/툴팁/범례 유틸 제공 |
| `src/components/ui/label.tsx` | 라벨 컴포넌트 | Radix Label 래핑 |
| `src/components/ui/slider.tsx` | 슬라이더 컴포넌트 | Radix Slider 래핑 |
| `src/components/ui/switch.tsx` | 토글 스위치 컴포넌트 | Radix Switch 래핑 |

### Lib
| 파일 | 역할 | 비고 |
|---|---|---|
| `src/lib/api.ts` | API 클라이언트 함수 | `getFeatures`, `predict`, `recommend` |
| `src/lib/params.ts` | 파라미터 정의/검증 로직 | JSON 통계 파일 로드, 조절 키 집합 구성 |
| `src/lib/utils.ts` | 공통 유틸 | `cn`(clsx + twMerge) |

## 5. 생성 산출물(`.next`) 보고
- 성격: Next 개발/빌드 시 자동 생성되는 런타임/캐시/번들 파일
- 유지보수 원칙: 수동 수정 금지, 필요 시 삭제 후 재생성
- 주요 하위 구조:
  - `.next/dev/*`: 개발 서버 산출물(HMR, dev cache, logs)
  - `.next/server/*`: 서버 번들/매니페스트
  - `.next/static/*`: 정적 JS/CSS/media 번들
  - `.next/cache/*`: webpack/turbopack 캐시
  - `.next/types/*`: 타입 산출물
  - `.next/diagnostics/*`: 빌드 진단 정보

자세한 파일 목록은 `docs/all-files-index.tsv`에서 `category=generated`로 필터링해 확인한다.

## 6. 기술 점검 결과 (핵심 이슈)
1. 환경변수 키 불일치 가능성  
   - `.env`는 `NEXT_PUBLIC_API_BASE_URL`을 사용 중이나, `src/lib/api.ts`는 `NEXT_PUBLIC_API_BASE`를 읽는다.  
   - 현재 상태에서는 API_BASE가 기본값(`http://localhost:8000`)으로 폴백될 가능성이 있다.

2. 차트 색상 설정 로직 고정값 사용  
   - `src/components/ui/chart.tsx`의 `ChartStyle`에서 색상이 `'red'`로 하드코딩되어 있다.  
   - config 기반 색상 매핑 의도와 다르게 동작할 수 있다.

3. 문서/코드 스냅샷 분리 관리 필요  
   - `.next` 파일은 개발 서버 실행 상태에 따라 수시로 바뀐다.  
   - 운영 문서는 `source_or_config` 중심으로 유지하고, 생성 파일은 인덱스 기반 추적이 적절하다.

## 7. 권장 운영 방식
1. 파일 기준 문서화는 `docs/repository-file-report.md`를 기준 문서로 유지한다.
2. 전수 파일 목록은 필요 시 `docs/all-files-index.tsv`를 재생성해 최신화한다.
3. 배포/운영 관점 점검은 `source_or_config`만 대상으로 수행하고 `.next`는 캐시/산출물로 취급한다.
