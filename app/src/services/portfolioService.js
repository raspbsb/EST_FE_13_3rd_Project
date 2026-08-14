// 포트폴리오 등록/수정에 필요한 Supabase DB 요청을 모아둔 서비스 모듈

import { supabase } from "../utils/supabase";

// 포트폴리오 이미지 파일을 저장하는 Supabase Storage 버킷 이름
const PORTFOLIO_IMAGE_BUCKET = "portfolio_images";

// 현재 브라우저 세션의 Supabase Auth 사용자를 조회하고, 로그인 상태가 아니면 null을 반환
export const getAuthenticatedUser = async () => {
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData.user) return null;

  return authData.user;
};

// portfolios 테이블에 기본 정보를 먼저 저장하고, 하위 테이블 연결에 사용할 project_id를 반환
const insertPortfolio = async ({ authorId, portfolio }) => {
  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      author_id: authorId,
      ...portfolio,
    })
    .select("project_id")
    .single();

  if (error) throw error;

  return data.project_id;
};

// 선택된 카테고리 칩 목록을 portfolio_categories 정규화 테이블에 일괄 저장
const insertPortfolioCategories = async ({ projectId, categories }) => {
  if (categories.length === 0) return;

  const { error } = await supabase.from("portfolio_categories").insert(
    categories.map(category => ({
      project_id: projectId,
      category: category.category_label,
    })),
  );

  if (error) throw error;
};

// 선택된 기술 스택 칩 목록을 portfolio_tech_stacks 정규화 테이블에 일괄 저장
const insertPortfolioTechStacks = async ({ projectId, techStacks }) => {
  if (techStacks.length === 0) return;

  const { error } = await supabase.from("portfolio_tech_stacks").insert(
    techStacks.map(techStack => ({
      project_id: projectId,
      tech_stack: techStack.tech_stack_label,
    })),
  );

  if (error) throw error;
};

// 첨부 파일을 Storage에 업로드하고, 렌더링에 필요한 경로/정렬/대표 여부를 portfolio_images에 저장
const insertPortfolioImages = async ({ userId, projectId, images }) => {
  if (images.length === 0) return;

  const uploadedImages = [];

  for (const image of images) {
    const extension = image.name.split(".").pop();
    const imagePath = `${userId}/${projectId}/${image.order}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from(PORTFOLIO_IMAGE_BUCKET).upload(imagePath, image.file);

    if (uploadError) throw uploadError;

    uploadedImages.push({
      project_id: projectId,
      image_path: imagePath,
      display_order: image.order,
      is_thumbnail: image.is_thumbnail,
      alt_text: image.name,
    });
  }

  const { error } = await supabase.from("portfolio_images").insert(uploadedImages);

  if (error) throw error;
};

// AI 분석 결과와 초안 생성 결과를 portfolio_ai_created 테이블에 저장
const insertPortfolioAiCreated = async ({ projectId, aiAnalysis, draftGuide }) => {
  const { error } = await supabase.from("portfolio_ai_created").insert({
    project_id: projectId,
    project_summary: aiAnalysis.project_summary,
    main_features: aiAnalysis.main_features,
    technical_features: aiAnalysis.technical_features,
    project_structure: aiAnalysis.project_structure,
    analyzed_role: aiAnalysis.analyzed_role,
    participation_details: aiAnalysis.participation_details,
    analysis_limitation: aiAnalysis.analysis_limitation,
    analysis_evidence: aiAnalysis.analysis_evidence,
    github_analyzed_at: aiAnalysis.analyzed_at,
    draft_source_content: draftGuide.original_description,
    generated_content: draftGuide.ai_draft_description,
    ai_short_summary: draftGuide.ai_short_summary,
    draft_generated_at: draftGuide.generated_at,
  });

  if (error) throw error;
};

// 인증 사용자 확인 후 portfolios와 하위 정규화 테이블 등록 작업을 순서대로 실행
export const createPortfolio = async ({ payload }) => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { projectId: null, needsLogin: true };
  }

  const projectId = await insertPortfolio({
    authorId: user.id,
    portfolio: payload.portfolio,
  });

  await insertPortfolioCategories({
    projectId,
    categories: payload.categories,
  });

  await insertPortfolioTechStacks({
    projectId,
    techStacks: payload.techStacks,
  });

  await insertPortfolioImages({
    userId: user.id,
    projectId,
    images: payload.images,
  });

  await insertPortfolioAiCreated({
    projectId,
    aiAnalysis: payload.aiAnalysis,
    draftGuide: payload.draftGuide,
  });

  return { projectId, needsLogin: false };
};
