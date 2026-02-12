# EAF Front 기술 문서 (전체 정리)

## 1. 문서 목적
이 문서는 현재 저장소의 프론트엔드 구현을 기준으로 API 연동, UI 동작, 변경 영향 범위를 한 번에 파악할 수 있도록 정리한 기준 문서입니다.

## 2. 시스템 개요
```text
사용자 브라우저
  -> EAF Front (Next.js/React)
  -> 예측/최적화 API 서버
```

- 프론트엔드는 입력값 편집, 요청 생성, 결과 시각화까지 담당합니다.
- 모델 추론/최적화 로직은 API 서버에 있습니다.

## 3. 프로젝트 구조와 책임
| 경로 | 역할 |
|---|---|
| `src/app/page.tsx` | 메인 화면, 상태 관리, 예측/최적화 이벤트 처리 |
| `src/lib/api.ts` | API 호출 함수(`getFeatures`, `predict`, `recommend`) |
| `src/lib/params.ts` | 입력 파라미터 스키마(min/max/step/mean/median) |
| `src/components/sliders-panel.tsx` | 슬라이더 카드 렌더링, 값 변경, fixed 토글 |
| `src/components/radial-result.tsx` | 결과 방사형 차트, 메트릭 값 목록 표시 |
| `src/components/ui/*` | 카드/스위치/슬라이더/차트 유틸 컴포넌트 |
| `src/app/layout.tsx` | 전역 폰트, Bootstrap + 글로벌 CSS 로딩 |
| `src/app/globals.css` | 테마 토큰, 색상/반경/기본 스타일 정의 |

## 4. 데이터 모델

### 4.1 입력 파라미터 정의 (`src/lib/params.ts`)
`ParamDefinition` 타입:
- `key`: API feature 키
- `min`, `max`, `step`: UI 슬라이더 제어 범위
- `mean`, `median`: 기본값/참고 통계치

현재 파라미터 개수는 `10`개입니다.

### 4.2 슬라이더 모델 (`src/components/sliders-panel.tsx`)
`SliderItem` 타입:
- `label`, `min`, `max`, `step`, `value`
- `fixed`: 최적화 탐색에서 고정 여부

### 4.3 결과 모델 (`src/components/radial-result.tsx`)
`MetricKey`:
- `melting_wattage`
- `refining_wattage`
- `wattage_tmp`
- `tot_result1`
- `tot_result4`

`ResultMetrics`: `Partial<Record<MetricKey, number>>`

## 5. API 계약 (프론트 기준)

API Base:
- `NEXT_PUBLIC_API_BASE`
- 미지정 시 `http://localhost:8000`

### 5.1 Feature 목록 조회
- Method/Path: `GET /predict/features`
- Response:
```json
{
  "features": ["feature_a", "feature_b"]
}
```
- 실패 시 `Error('Failed to load features')` 발생

### 5.2 예측
- Method/Path: `POST /predict`
- Request:
```json
{
  "features": {
    "feature_a": 1.23
  }
}
```
- Response:
```json
{
  "melting_wattage": 0,
  "refining_wattage": 0,
  "wattage_tmp": 0,
  "tot_result1": 0,
  "tot_result4": 0
}
```
- 실패 시 서버 응답 body를 콘솔 출력 후 `Error('Predict failed')` 발생

### 5.3 최적화
- Method/Path: `POST /recommend`
- Request:
```json
{
  "base_input": {
    "feature_a": 1.23
  },
  "search_space": {
    "feature_a": { "min": 0, "max": 10, "step": 1, "fixed": false }
  },
  "n_trials": 200,
  "early_stop_patience": 20,
  "timeout_seconds": 60,
  "objective_target": "wattage_tmp"
}
```
- Response:
```json
{
  "recommended_setting": { "feature_a": 2.0 },
  "melting_wattage": 0,
  "refining_wattage": 0,
  "wattage_tmp": 0,
  "tot_result1": 0,
  "tot_result4": 0,
  "objective_target": "wattage_tmp",
  "objective_value": 0,
  "num_candidates": 100,
  "num_trials": 200
}
```
- 실패 시 서버 응답 body를 콘솔 출력 후 `Error('Recommend failed')` 발생

## 6. UI 동작 명세

### 6.1 초기 로딩
1. `page.tsx` 마운트
2. `getFeatures()` 호출
3. 성공 시 `features` 상태 저장
4. 실패 시 에러를 콘솔에 기록하고 `features = []`로 저장

### 6.2 예측 버튼
1. 현재 슬라이더 값을 `payload`로 구성
2. feature 목록 기준으로 누락 키는 mean 또는 `0`으로 보완
3. `/predict` 호출
4. 성공 시 결과 카드/차트 갱신

### 6.3 최적화 버튼
1. 현재 슬라이더 값 + 각 슬라이더의 `fixed` 포함 search space 생성
2. `/recommend` 호출 (`n_trials = 200`)
3. 성공 시:
- 결과 표시
- objective 정보 표시
- `recommended_setting` 값을 슬라이더에 반영

### 6.4 화면 구성
- 상단 헤더 이미지
- 좌측: 결과 차트 + 실행 버튼
- 우측: 결과 수치 목록
- 하단: 슬라이더 카드 그리드

## 7. API 변경 시 영향 분석 가이드

API 변경은 아래 순서로 점검합니다.

1. `src/lib/api.ts` 타입과 요청 body 키 변경
2. `src/app/page.tsx`의 결과 상태 할당과 렌더 키 변경
3. `src/components/radial-result.tsx`의 `MetricKey`, `METRIC_LABELS`, 포맷터 변경
4. 필요 시 `src/lib/params.ts` 키셋 변경

체크리스트:
- 응답 필드 추가/삭제가 UI 타입에 반영됐는가
- snake_case/camelCase 매핑이 깨지지 않았는가
- 실패 메시지 처리 흐름이 유지되는가
- 추천 응답의 `recommended_setting` 키와 slider label이 동일한가

## 8. UI 변경 시 영향 분석 가이드

### 8.1 슬라이더/폼 변경
- `SliderItem` 타입 변경 여부
- `createSliders()` 기본값 정책 영향
- `search_space` 생성 로직 영향

### 8.2 결과 카드/차트 변경
- `MetricKey` 변경 시 타입 에러 확인
- 최대값(`METRIC_MAX`) 보정 필요 여부
- 숫자 포맷 규칙(`tot_result4` 소수점) 유지 여부

### 8.3 스타일 시스템 변경
- Bootstrap 클래스와 Tailwind 유틸 혼합 사용 충돌 점검
- `globals.css` 토큰 변경 시 카드/차트 색상 확인

## 9. 현재 코드 기준 특이사항
- 일부 텍스트가 깨진 문자열(인코딩 문제)로 보입니다. 버튼/라벨/메시지 문자열을 UTF-8 기준으로 점검하세요.
- 에디터 탭에 보이는 `src/components/ui/toggle.tsx`는 현재 저장소에 없고 실제 사용 컴포넌트는 `src/components/ui/switch.tsx`입니다.
- `src/components/ui/chart.tsx`의 `ChartStyle`은 설정값 대신 고정색(`red`)을 넣고 있어, 차트 테마 반영이 제한될 수 있습니다.

## 10. 운영 체크리스트
- `.env`의 `NEXT_PUBLIC_API_BASE`가 올바른 서버를 가리키는지 확인
- API 서버 CORS 허용 여부 확인
- 예측/최적화 실패 시 브라우저 콘솔의 status와 body 로그 확인
- 파라미터 추가/삭제 시 `params.ts`와 API feature 키를 같이 검증
