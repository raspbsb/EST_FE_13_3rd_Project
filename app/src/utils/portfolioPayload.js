// 서버로 보낼 데이터 최종 통합

// 백엔드 저장용 payload에서 빈 문자열을 null로 통일하고 문자열 앞뒤 공백을 제거하는 함수
const toNullableText = value => {
  const text = String(value ?? "").trim();

  return text || null;
};

// 프론트 formData의 기본 프로젝트 정보를 portfolios 테이블에 저장하기 좋은 형태로 변환하는 함수
const createPortfolioData = formData => ({
  title: formData.title.trim(),
  summary: toNullableText(formData.summary),
  description: formData.description.trim(),
  started_at: toNullableText(formData.started_at),
  ended_at: toNullableText(formData.ended_at),
  deploy_url: toNullableText(formData.deploy_url),
  repository_url: toNullableText(formData.repository_url),
  project_type: toNullableText(formData.project_type),
  team_size: toNullableText(formData.team_size),
  author_role: toNullableText(formData.author_role),
  environment: toNullableText(formData.environment),
  is_public: Boolean(formData.is_public),
});

// 선택된 카테고리 칩 배열을 카테고리 연결 테이블에 반복 저장하기 좋은 배열로 변환하는 함수
const createCategoryData = categories =>
  categories.map(category => ({
    category_value: category.value,
    category_label: category.label,
  }));

// 선택/직접 입력한 기술 스택 칩 배열을 기술 스택 연결 테이블에 반복 저장하기 좋은 배열로 변환하는 함수
const createTechStackData = techStacks =>
  techStacks.map(techStack => ({
    tech_stack_value: techStack.value,
    tech_stack_label: techStack.label,
  }));

// 첨부 이미지 상태에서 미리보기용 값을 제외하고 Storage 업로드와 이미지 테이블 저장에 필요한 값만 추출하는 함수
const createImageData = images =>
  images.map(image => ({
    file: image.file,
    name: image.name,
    size: image.size,
    type: image.type,
    order: image.order,
    is_thumbnail: Boolean(image.isThumbnail),
  }));

// 화면 표시용 AI 분석 결과 객체를 DB 컬럼명에 맞는 snake_case 구조로 변환하는 함수
const createAiAnalysisData = aiAnalysisResult => ({
  project_summary: toNullableText(aiAnalysisResult.projectSummary),
  main_features: toNullableText(aiAnalysisResult.mainFeatures),
  technical_features: toNullableText(aiAnalysisResult.technicalFeatures),
  project_structure: toNullableText(aiAnalysisResult.projectStructure),
  analyzed_role: toNullableText(aiAnalysisResult.analyzedRole),
  participation_details: toNullableText(aiAnalysisResult.participationDetails),
  analysis_limitation: toNullableText(aiAnalysisResult.analysisLimitation),
  analysis_evidence: aiAnalysisResult.analysisEvidence ?? null,
  analyzed_at: toNullableText(aiAnalysisResult.analyzedAt),
});

// AI 초안 생성 섹션의 현재 내용, 추천 초안, 한 줄 요약을 저장용 구조로 변환하는 함수
const createDraftGuideData = draftGuide => ({
  original_description: toNullableText(draftGuide.originalDescription),
  ai_draft_description: toNullableText(draftGuide.aiDraftDescription),
  ai_short_summary: toNullableText(draftGuide.aiShortSummary),
  generated_at: toNullableText(draftGuide.generatedAt),
});

// 제출 시점의 프론트 상태들을 백엔드 저장 흐름에서 사용할 최종 payload 객체로 통합하는 함수
export const createPortfolioPayload = ({ formData, aiAnalysisResult, draftGuide }) => ({
  portfolio: createPortfolioData(formData),
  categories: createCategoryData(formData.categories),
  techStacks: createTechStackData(formData.tech_stacks),
  images: createImageData(formData.images),
  aiAnalysis: createAiAnalysisData(aiAnalysisResult),
  draftGuide: createDraftGuideData(draftGuide),
});
