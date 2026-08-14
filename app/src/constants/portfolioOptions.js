/**
 * 화면에서 데이터를 반복 렌더링하기 위한 데이터
 * 사용자 액션으로 변하지 않는 고정 선택지 모음
 * 각 배열은 ProjectMetaSection에서 Select의 MenuItem 목록을 map으로 생성
 */

const sortByLabel = selectOptions =>
  [...selectOptions].sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase(), "en"));

// ProjectMetaSection의 "참여 형태" Select 고정 옵션 목록
export const typeOptions = [
  { value: "personal", label: "개인" },
  { value: "team", label: "팀" },
  { value: "open-source", label: "오픈소스" },
  { value: "community", label: "커뮤니티" },
];

// GitHub AI 분석 근거 개발용 임시 데이터
// 실제 백엔드 연결 후에는 저장소 분석 응답으로 생성된 evidence 목록으로 교체
export const evidenceTabs = [
  {
    value: "project-structure",
    label: "프로젝트 구조",
    description:
      "app/src/pages와 app/src/components가 페이지 단위와 기능 단위로 분리되어 있어, 라우팅 화면과 재사용 UI의 책임이 비교적 명확합니다. PortfolioEditor.jsx는 등록/수정 화면의 상태를 소유하고, ProjectBasicInfoSection, ImageAttachmentSection, ProjectMetaSection, GithubAiAnalysisSection으로 입력 영역을 나누어 관리합니다. 이 구조를 기준으로 프로젝트는 단일 페이지가 아니라 이미지 첨부, 메타데이터 입력, AI 분석 결과 표시가 결합된 복합 편집 화면으로 판단했습니다.",
  },
  {
    value: "commit-history",
    label: "커밋 기록",
    description:
      "커밋 흐름은 이미지 첨부, 드래그 정렬, 칩 스타일, 날짜 선택, 임시저장처럼 사용자 입력 흐름을 단계적으로 보강하는 방향으로 이어졌습니다. 기능별 변경이 페이지 전체 리팩터링보다 작은 단위로 누적되어 있어, 등록/수정 페이지의 핵심 UX를 먼저 완성하고 이후 백엔드 저장 로직으로 확장하는 작업 방식으로 해석했습니다.",
  },
  {
    value: "package-json",
    label: "package.json",
    description:
      "package.json의 의존성에는 React, MUI, MUI X Date Pickers, dnd-kit, Supabase 클라이언트가 포함되어 있습니다. 이를 통해 UI는 MUI 컴포넌트를 중심으로 구성되고, 날짜 입력은 DatePicker, 이미지 순서 변경은 dnd-kit, 향후 저장과 인증은 Supabase 연동을 전제로 설계된 프로젝트로 분석했습니다.",
  },
  {
    value: "app-entry",
    label: "App.jsx",
    description:
      "App.jsx의 라우트 구성을 기준으로 Home, Gallery, Portfolio, MyPage, Upload/Edit 흐름이 분리되어 있습니다. 등록/수정 페이지는 전체 서비스 안에서 작품 데이터를 생성하거나 갱신하는 진입점이며, 상세 페이지와 갤러리에서 소비될 포트폴리오 데이터를 준비하는 역할로 판단했습니다.",
  },
  {
    value: "src-files",
    label: "src 내부 파일",
    description:
      "src/components/PortfolioEditor 내부 파일들은 기본 정보, 이미지 첨부, 메타 정보, AI 분석 결과, 초안 가이드, 하단 액션바처럼 편집 화면의 섹션 단위로 분리되어 있습니다. 이 파일 구성을 근거로 프로젝트의 구현 범위는 단순 입력 폼보다 넓고, 이미지 관리와 AI 보조 작성까지 포함한 포트폴리오 편집 워크플로우로 분석했습니다.",
  },
];

// ProjectMetaSection의 "참여 규모" Select 고정 옵션 목록
export const scaleOptions = [
  { value: "solo", label: "개인 (1명)" },
  { value: "small-team", label: "소규모 팀 (2~5명)" },
  { value: "medium-team", label: "중규모 팀 (6~10명)" },
  { value: "department", label: "부서·대회·협업 프로젝트 (11~30명)" },
  { value: "large-org", label: "대규모 조직 프로젝트 (31~100명)" },
  { value: "large-community", label: "대규모·커뮤니티 프로젝트 (101명 이상)" },
  { value: "unknown", label: "확인하기 어려움" },
];

// ProjectMetaSection의 "진행 환경" Select 고정 옵션 목록
export const environmentOptions = [
  { value: "personal", label: "개인 활동" },
  { value: "course", label: "교육 과정" },
  { value: "work", label: "사내·실무" },
  { value: "freelance", label: "외주·프리랜스" },
  { value: "hackathon", label: "해커톤·공모전" },
];

// ProjectMetaSection의 "카테고리" 검색/추가 Select 고정 후보 목록
const categorySelectCandidateOptions = [
  { value: "ai-data", label: "AI & Data" },
  { value: "algorithm", label: "Algorithm" },
  { value: "backend", label: "Backend" },
  { value: "blockchain", label: "Blockchain" },
  { value: "cloud-devops", label: "Cloud & DevOps" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "data-visualization", label: "Data Visualization" },
  { value: "design", label: "Design" },
  { value: "desktop-app", label: "Desktop App" },
  { value: "frontend", label: "Frontend" },
  { value: "game", label: "Game" },
  { value: "iot", label: "IoT" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "open-source", label: "Open Source" },
  { value: "productivity", label: "Productivity" },
  { value: "web", label: "Web" },
];

export const categoryOptions = [
  { value: "search-web", label: "검색 중: Web" },
  ...sortByLabel(categorySelectCandidateOptions),
];

// ProjectMetaSection의 "기술 스택" 직접 입력/추가 Select 고정 후보 목록
const techStackSelectCandidateOptions = [
  { value: "angular", label: "Angular" },
  { value: "aws", label: "AWS" },
  { value: "css", label: "CSS" },
  { value: "django", label: "Django" },
  { value: "docker", label: "Docker" },
  { value: "emotion", label: "Emotion" },
  { value: "express", label: "Express" },
  { value: "fastapi", label: "FastAPI" },
  { value: "figma", label: "Figma" },
  { value: "firebase", label: "Firebase" },
  { value: "github", label: "Github" },
  { value: "go", label: "Go" },
  { value: "graphql", label: "GraphQL" },
  { value: "html", label: "HTML" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
  { value: "jest", label: "Jest" },
  { value: "kotlin", label: "Kotlin" },
  { value: "mongodb", label: "MongoDB" },
  { value: "mui", label: "MUI" },
  { value: "mysql", label: "MySQL" },
  { value: "nestjs", label: "NestJS" },
  { value: "netlify", label: "Netlify" },
  { value: "next-js", label: "Next.js" },
  { value: "node-js", label: "Node.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "playwright", label: "Playwright" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "python", label: "Python" },
  { value: "react", label: "React" },
  { value: "react-router", label: "React Router" },
  { value: "redis", label: "Redis" },
  { value: "redux-toolkit", label: "Redux Toolkit" },
  { value: "rest-api", label: "REST API" },
  { value: "sass", label: "Sass" },
  { value: "spring-boot", label: "Spring Boot" },
  { value: "storybook", label: "Storybook" },
  { value: "styled-components", label: "styled-components" },
  { value: "supabase", label: "Supabase" },
  { value: "svelte", label: "Svelte" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "tailwind-css", label: "Tailwind CSS" },
  { value: "tanstack-query", label: "TanStack Query" },
  { value: "typescript", label: "TypeScript" },
  { value: "vercel", label: "Vercel" },
  { value: "vite", label: "Vite" },
  { value: "vitest", label: "Vitest" },
  { value: "vue-js", label: "Vue.js" },
  { value: "webpack", label: "Webpack" },
  { value: "websocket", label: "WebSocket" },
  { value: "zustand", label: "Zustand" },
];

export const techStackOptions = sortByLabel(techStackSelectCandidateOptions);
