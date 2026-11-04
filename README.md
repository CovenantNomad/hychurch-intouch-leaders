This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## PWA

- 프로덕션 빌드에서만 서비스 워커를 등록합니다. 로컬 확인은 `npm run build` 후 `npm run start`로 진행합니다.
- HTTPS 배포 또는 localhost에서 홈 화면 설치를 지원합니다. 설치 방법은 설정 화면에 안내합니다.
- 오프라인 안내 HTML과 공개 아이콘만 캐시합니다. 로그인, 셀원 정보, 출석, 주문, GraphQL 및 Firestore 응답은 서비스 워커 캐시에 저장하지 않습니다.
- 오프라인에서는 새 페이지 접근 시 안내 화면을 표시합니다. 출석·주문의 오프라인 저장, 자동 재전송은 지원하지 않습니다.
- 기존 탭을 강제로 새로고침하지 않습니다. 서비스 워커 업데이트는 기존 앱 탭을 모두 닫은 후 다시 열면 적용됩니다.
- `public/offline.html` 또는 캐시 대상 아이콘을 변경하면 `public/sw.js`의 캐시 버전도 올립니다.
- 캐시 정책 및 매니페스트 검증: `npm run test:pwa` (Node 내장 테스트 사용, 패키지 추가 없음).
- 배포 후 Android Chrome 설치, iOS Safari의 홈 화면 추가, 독립 실행, 오프라인 재실행, 온라인 복귀를 실제 기기에서 확인합니다.
- Vercel은 기존 Next.js 빌드 설정을 사용합니다. 별도 플러그인이나 운영 Secret 추가는 필요하지 않습니다.

## Getting Started

### 자동 검증 (GitHub Actions)

- `develop`에 push하거나 `master` 대상 PR을 생성·갱신·다시 열면 `.github/workflows/ci.yml`이 실행됩니다.
- Node.js 24에서 `npm ci`로 lockfile 그대로 설치한 뒤 아래 네 검사를 실행합니다. 한 검사가 실패해도 나머지 검사 결과를 확인할 수 있으며 전체 CI는 실패로 남습니다.
- `npm run typecheck`: TypeScript 검사
- `npm run lint:ci`: 소스·테스트·서비스 워커 ESLint 검사 (경고도 실패)
- `npm test`: 운영 API/DB를 사용하지 않는 자동화 테스트
- `npm run build`: 테스트용 환경변수로 프로덕션 빌드 검증
- CI에는 운영 Secret을 등록하지 않습니다. 빌드 산출물은 배포하지 않으며, 실제 운영 환경변수·연동 동작 검증을 대체하지 않습니다.
- `@types/node`는 기존 lockfile과 TypeScript 4.9 검증 환경의 `18.11.19`를 유지합니다. 실행용 Node.js 24와 타입 선언 버전은 별개이며, 타입 업그레이드는 TypeScript 업그레이드와 함께 검토합니다.
- 개발 흐름은 `develop` 작업·push → CI 확인 → `master` PR → CI 확인·리뷰 → 병합입니다. 운영 배포는 기존 Vercel의 `master` 연결을 사용합니다.
- 병합을 강제로 차단하려면 별도로 GitHub 브랜치 보호에서 `TypeScript, ESLint, tests and build`를 필수 검사로 지정해야 합니다. 워크플로 자체는 브랜치 보호 설정을 변경하지 않습니다.

### 회귀 검사

`npm test`는 PWA와 셀모임 제출·인증 초기화·로그아웃·평가서 예외·예배 ID 경계 테스트를 실행합니다.
`npm run test:regressions`로 업무 로직 검사만 실행할 수 있습니다.
기존 TypeScript 변환기와 Node 내장 테스트를 사용하며, 외부 모듈은 명시적인 Mock만 허용합니다.
운영 API/DB에 연결하지 않습니다. React 렌더링, 실제 Firestore 트랜잭션·Rules 검증을 대체하지 않습니다.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
