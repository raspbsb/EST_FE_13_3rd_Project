// 포트폴리오 등록/수정에 필요한 Supabase DB 요청을 모아둔 서비스 모듈

import { supabase } from "../utils/supabase";

// 포트폴리오 버킷 지정
const PORTFOLIO_IMAGE_BUCKET = "portfolio_images";

/**
 * 현재 로그인한 Supabase Auth 사용자를 조회하는 함수
 */
export const getAuthenticatedUser = async () => {
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData.user) return null;

  return authData.user;
};

/**
 * portfolios 테이블에 기본 포트폴리오 정보를 저장하고 생성된 project_id를 반환하는 함수
 */
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

/**
 * 선택된 카테고리 목록을 포트폴리오 연결 테이블에 저장하는 함수
 */
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

/**
 * 선택된 기술 스택 목록을 포트폴리오 연결 테이블에 저장하는 함수
 */
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

/**
 * 첨부 이미지를 Supabase Storage에 업로드하고 portfolio_images 테이블에 이미지 메타데이터를 저장하는 함수
 */
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

/**
 * AI 분석 결과와 초안 생성 데이터를 portfolio_ai_created 테이블에 저장하는 함수
 */
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

/**
 * payload를 기반으로 포트폴리오 등록에 필요한 Supabase insert를 순서대로 실행하는 함수
 */
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
