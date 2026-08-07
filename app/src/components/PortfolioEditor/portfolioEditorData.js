/**
 * 화면에서 데이터를 반복 렌더링하기 위한 데이터
 * 사용자 액션으로 변하지 않는 고정 선택지 모음
 * 각 배열은 ProjectMetaSection에서 Select의 MenuItem 목록을 map으로 생성
 */

const sortOptionsByLabel = options => [...options].sort((a, b) => a.label.localeCompare(b.label, "en"));

// ProjectMetaSection의 "참여 형태" Select 고정 옵션 목록
export const participationTypeOptions = [
  { value: "personal", label: "개인" },
  { value: "team", label: "팀" },
  { value: "open-source", label: "오픈소스" },
  { value: "community", label: "커뮤니티" },
];

// ProjectMetaSection의 "참여 규모" Select 고정 옵션 목록
export const participationScaleOptions = [
  { value: "solo", label: "개인 (1명)" },
  { value: "small-team", label: "소규모 팀 (2~5명)" },
  { value: "medium-team", label: "중규모 팀 (6~10명)" },
  { value: "department", label: "부서·대회·협업 프로젝트 (11~30명)" },
  { value: "large-org", label: "대규모 조직 프로젝트 (31~100명)" },
  { value: "large-community", label: "대규모·커뮤니티 프로젝트 (101명 이상)" },
  { value: "unknown", label: "확인하기 어려움" },
];

// ProjectMetaSection의 "진행 환경" Select 고정 옵션 목록
export const progressEnvironmentOptions = [
  { value: "personal", label: "개인 활동" },
  { value: "course", label: "교육 과정" },
  { value: "work", label: "사내·실무" },
  { value: "freelance", label: "외주·프리랜스" },
  { value: "hackathon", label: "해커톤·공모전" },
];

// ProjectMetaSection의 "카테고리" 검색/추가 Select 고정 후보 목록
const categoryCandidateOptions = [
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
  ...sortOptionsByLabel(categoryCandidateOptions),
];

// ProjectMetaSection의 "기술 스택" 직접 입력/추가 Select 고정 후보 목록
const techStackCandidateOptions = [
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

export const techStackOptions = [
  { value: "typing-vercel", label: "직접 입력 중: Vercel" },
  ...sortOptionsByLabel(techStackCandidateOptions),
];
