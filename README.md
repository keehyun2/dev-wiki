## 로컬 개발

### 전제 조건

- Node.js 20+
- npm

### 설치

```bash
npm install
```

### 로컬 빌드

```bash
npm run build
```

빌드 결과는 `public/` 폴더에 생성됩니다.

### 로컬 서버 (미리보기)

```bash
npm run serve
```

http://localhost:8080에서 접속할 수 있습니다.

## 프로젝트 구조

```
my-ai-wiki/
├── content/           # 위키 컨텐츠 (마크다운)
│   ├── concepts/      # 개념 페이지 (여러 문서를 종합)
│   ├── explorations/  # 탐색 페이지 (분석, 비교 결과)
│   ├── summaries/     # 요약 페이지 (문서 요약)
│   └── sources/       # 원본 문서 (.json, .md)
├── quartz/            # Quartz 소스 코드
├── public/            # 빌드 결과물 (git 제외)
├── package.json       # 프로젝트 설정
├── quartz.config.ts   # Quartz 설정
└── netlify.toml       # Netlify 배포 설정
```

## 컨텐츠 추가

새 페이지를 추가하려면 `content/` 폴더에 마크다운 파일을 생성하세요:

- **요약 페이지**: `content/summaries/` - 문서 요약
- **개념 페이지**: `content/concepts/` - 여러 문서를 종합한 개념 설명
- **탐색 페이지**: `content/explorations/` - 분석 결과, 비교

## 배포

### Netlify

이 프로젝트는 Netlify에 자동 배포됩니다. GitHub에 push하면:

1. Netlify가 `npm run build` 실행
2. `public/` 폴더 배포

### 수동 배포

```bash
npx netlify deploy --prod --dir=public
```

## 커밋 메시지 규칙

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 업데이트
- `refactor:` 코드 리팩토링
- `chore:` 기타 변경사항

## Quartz 설정

Quartz 설정은 `quartz.config.ts`에서 수정할 수 있습니다:

- **페이지 제목**: `pageTitle`
- **테마**: `theme.colors`
- **플러그인**: `plugins` 섹션
- **무시 패턴**: `ignorePatterns`

자세한 설정 방법: https://quartz.jzhao.xyz/configuration

## 라이선스

MIT
