# Gonggomoon v2

채용 공고 URL을 기반으로 사용자의 경험과 매칭되는 포트폴리오 전략을 만들기 위한 Next.js 프론트엔드 프로젝트입니다. 현재는 메인 레이아웃, 홈 입력 화면, 사이드바/하단 내비게이션, 설정 모달, 공통 UI 컴포넌트 기반 구조가 먼저 잡혀 있습니다.

## 기술 스택

- Next.js `16.2.9` App Router
- React `19.2.4`
- TypeScript `strict`
- Tailwind CSS v4
- shadcn/ui 스타일의 공통 UI 컴포넌트
- Radix UI, lucide-react, sonner
- TanStack Query v5
- pnpm `10.30.3`

## 실행

```bash
pnpm install
pnpm dev
```

주요 스크립트:

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm start    # 빌드 결과 실행
pnpm lint     # ESLint
```

## 폴더 구조

이 프로젝트는 `src` 아래에서 `app`, `features`, `shared`를 기준으로 나눕니다. 새 최상위 아키텍처 폴더는 만들지 않고, 기존 세 영역 중 가장 적절한 위치에 코드를 추가합니다.

```text
src
├─ app
│  ├─ (auth)
│  │  └─ naver/callback/page.tsx
│  ├─ (main)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ experience/page.tsx
│  │  └─ strategy/[strategyId]
│  │     ├─ select/page.tsx
│  │     ├─ analyze/page.tsx
│  │     └─ result/page.tsx
│  ├─ globals.css
│  └─ layout.tsx
├─ features
│  ├─ auth
│  ├─ experience
│  ├─ job-posting
│  └─ strategy
├─ shared
│  ├─ api
│  ├─ assets
│  ├─ components
│  ├─ constants
│  ├─ hooks
│  └─ lib
└─ proxy.ts
```

## 라우팅 구조

`src/app`은 URL, 레이아웃, 페이지 엔트리만 담당합니다. 실제 화면 조각과 도메인 로직은 가능하면 `features` 또는 `shared`에 둡니다.

| 경로                             | 파일                                                    | 현재 상태                       |
| -------------------------------- | ------------------------------------------------------- | ------------------------------- |
| `/`                              | `src/app/(main)/page.tsx`                               | 채용 공고 URL 입력 홈 화면 연결 |
| `/experience`                    | `src/app/(main)/experience/page.tsx`                    | 파일만 생성됨                   |
| `/strategy/[strategyId]/analyze` | `src/app/(main)/strategy/[strategyId]/analyze/page.tsx` | 파일만 생성됨                   |
| `/strategy/[strategyId]/select`  | `src/app/(main)/strategy/[strategyId]/select/page.tsx`  | 파일만 생성됨                   |
| `/strategy/[strategyId]/result`  | `src/app/(main)/strategy/[strategyId]/result/page.tsx`  | 파일만 생성됨                   |
| `/naver/callback`                | `src/app/(auth)/naver/callback/page.tsx`                | 파일만 생성됨                   |

`(main)`과 `(auth)`는 Next.js route group입니다. URL에는 포함되지 않고, 라우트 묶음과 레이아웃 분리에만 사용합니다.

## 레이아웃

- `src/app/layout.tsx`: 전역 루트 레이아웃입니다. Pretendard 로컬 폰트, 전역 CSS, Sonner Toaster를 설정합니다.
- `src/app/(main)/layout.tsx`: 로그인 이후 주요 앱 화면 레이아웃입니다. 데스크톱 사이드바, 모바일 하단 내비게이션, 푸터를 감쌉니다.
- `src/shared/components/layout/MainSidebar.tsx`: 데스크톱 사이드바와 접힘 상태 UI를 담당합니다.
- `src/shared/components/layout/MainBottomNavigation.tsx`: 모바일 하단 내비게이션과 메뉴 시트를 담당합니다.
- `src/shared/components/layout/MainFooter.tsx`: 약관/개인정보 모달을 여는 푸터입니다.

## Feature 구조

각 feature는 같은 기본 구조를 따릅니다.

```text
features/{domain}
├─ actions.ts
├─ queries.ts
├─ types.ts
└─ components
   ├─ sections
   └─ ui
```

- `actions.ts`: Server Action을 둡니다. 클라이언트 컴포넌트 또는 서버 컴포넌트가 호출하는 서버 측 진입점입니다.
- `queries.ts`: TanStack Query query option, query key, 클라이언트 조회 훅 성격의 코드를 둡니다.
- `types.ts`: 해당 도메인에서만 쓰는 타입을 둡니다.
- `components/sections`: 페이지 단위에 가까운 큰 화면 섹션을 둡니다.
- `components/ui`: 해당 feature에서만 쓰는 작은 UI 컴포넌트를 둡니다.

현재 구현된 feature:

- `job-posting`: 홈 화면의 채용 공고 URL 입력 섹션과 URL 입력 폼이 구현되어 있습니다.
- `auth`: 사용자 설정/로그아웃/회원탈퇴 흐름을 담은 설정 모달이 구현되어 있습니다.
- `experience`: 경험 등록 모달 테스트 컴포넌트가 있습니다.
- `strategy`: 폴더와 진입 파일만 준비되어 있습니다.

## Shared 구조

`shared`는 여러 feature에서 재사용되는 코드만 둡니다.

- `shared/components/ui`: shadcn/ui 계열 공통 UI 컴포넌트입니다. `components.json`의 alias도 이 경로를 바라봅니다.
- `shared/components/layout`: 앱 전체 레이아웃 컴포넌트입니다.
- `shared/api/http.ts`: 백엔드 API 호출을 모으는 공통 HTTP wrapper 위치입니다.
- `shared/constants/mock.ts`: 현재 사이드바, 사용자, 최근 전략 목록에 쓰는 임시 mock 데이터입니다.
- `shared/hooks/use-mobile.ts`: 모바일 여부 판단 훅입니다.
- `shared/lib/cn.ts`: className 병합 유틸입니다.
- `shared/assets`: 로고 이미지와 Pretendard 폰트 등 정적 자산입니다.

## 데이터 흐름 원칙

기본 데이터 흐름은 다음 순서를 따릅니다.

1. Client Component에서 TanStack Query를 사용하거나, Server Component인 `page.tsx`가 Server Action을 호출합니다.
2. Server Action은 `features/{domain}/actions.ts`에 둡니다.
3. Server Action은 `shared/api/http.ts`의 공통 API wrapper를 통해 백엔드와 통신합니다.

일반적인 앱 데이터 통신을 위해 `app/api` Route Handler를 새로 만들지 않습니다. 명시적으로 필요한 경우가 아니라면 Server Action을 우선 사용합니다.

## 스타일 시스템

- 전역 토큰은 `src/app/globals.css`의 CSS variables와 Tailwind v4 `@theme inline`에 정의되어 있습니다.
- 공통 UI는 `src/shared/components/ui`를 먼저 확인하고 재사용합니다.
- 아이콘은 `lucide-react`를 사용하며, 아이콘 컴포넌트 사용시 Icon까지 표기된 컴포넌트로 사용합니다.
- 폰트는 `src/shared/assets/fonts/PretendardVariable.woff2`를 `next/font/local`로 로드합니다.
- 경로 alias는 `@/*`가 `src/*`를 가리킵니다.

## 네이밍 규칙

- 폴더명: kebab-case, 가능하면 짧은 단어
- 파일명: PascalCase
- React 컴포넌트: PascalCase
- 함수/변수: camelCase
- 타입/인터페이스: PascalCase

예외적으로 Next.js 파일 규칙인 `page.tsx`, `layout.tsx`, `globals.css`, `proxy.ts`는 프레임워크 규칙을 따릅니다.

## 새 화면 추가 방법

1. `src/app`에 라우트 엔트리인 `page.tsx`를 만듭니다.
2. 화면의 실제 구현은 관련 `features/{domain}/components/sections`에 둡니다.
3. 작은 도메인 전용 UI는 `features/{domain}/components/ui`에 둡니다.
4. 여러 feature가 공유하면 `shared/components/ui` 또는 `shared/components/layout`로 올립니다.
5. 서버 통신이 필요하면 `features/{domain}/actions.ts`에서 Server Action을 만들고 `shared/api/http.ts`를 통해 호출합니다.

## Next.js 16 주의사항

이 프로젝트는 Next.js 16을 사용합니다. 기존 Next.js 지식과 다른 부분이 있을 수 있으므로 라우팅, Server Action, Proxy, 캐싱 관련 코드를 수정하기 전에는 로컬 문서를 먼저 확인합니다.

```text
node_modules/next/dist/docs/
```

특히 다음 문서를 우선 확인하면 됩니다.

- `01-app/01-getting-started/02-project-structure.md`
- `01-app/01-getting-started/07-mutating-data.md`
- `01-app/01-getting-started/16-proxy.md`

## 현재 진행 상태와 TODO

완료된 기반 작업:

- Next.js App Router 기반 프로젝트 구조 생성
- Tailwind CSS v4 전역 토큰 및 공통 UI 컴포넌트 구성
- 메인 앱 레이아웃, 데스크톱 사이드바, 모바일 하단 내비게이션 구성
- 홈 화면의 채용 공고 URL 입력 UI 구성
- 설정 모달과 푸터 약관 모달 기반 구성
- feature별 `actions.ts`, `queries.ts`, `types.ts` 자리 마련

남은 작업:

- `shared/api/http.ts` 공통 API wrapper 구현
- 각 feature의 Server Action, query, type 실제 구현
- `/experience`, `/strategy/[strategyId]/*`, `/naver/callback` 페이지 구현
- mock 데이터를 실제 인증/전략/경험 데이터로 교체
- 현재 일부 UI 문자열의 한글 인코딩 깨짐 수정
- 비어 있는 파일과 테스트용 컴포넌트 정리
- 빌드/린트가 통과하도록 기존 TSX 문법 오류 정리
