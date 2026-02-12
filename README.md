# EAF Front

전기로(EAF) 공정 입력값을 조정해 예측과 최적화를 수행하는 Next.js 프론트엔드입니다.

## 빠른 시작
```bash
npm install
npm run dev
```

기본 접속 주소: `http://localhost:3000`

## 환경 변수
`.env` 파일에 API 서버 주소를 설정합니다.

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

설정하지 않으면 기본값 `http://localhost:8000`을 사용합니다.

## 기술 스택
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4 + Bootstrap 5
- shadcn/ui + Radix UI
- Recharts

## 문서
- 전체 기술 문서: `docs/technical-spec.md`
- API/UI 변경 템플릿: `docs/api-ui-change-template.md`

## 주요 파일
- 화면 진입/상태 관리: `src/app/page.tsx`
- API 클라이언트: `src/lib/api.ts`
- 파라미터 정의: `src/lib/params.ts`
- 슬라이더 패널: `src/components/sliders-panel.tsx`
- 결과 시각화: `src/components/radial-result.tsx`
