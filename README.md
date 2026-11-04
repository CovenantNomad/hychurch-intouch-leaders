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
