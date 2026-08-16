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

// 현재 로그인 계정에 GitHub id가 연동되어 있는지 확인
// GitHub 로그인으로 접속한 계정뿐 아니라, 이메일/구글/카카오/네이버로 로그인한 뒤
// GitHub을 별도로 연동(linkIdentity)한 계정도 true를 반환한다.
export const getIsGithubLinked = async () => {
  const { data, error } = await supabase.auth.getUserIdentities();

  if (error) throw error;

  return data.identities.some(identity => identity.provider === "github");
};

// 현재 로그인 계정에 GitHub id를 연동한다.
// 호출 즉시 브라우저가 GitHub 인증 페이지로 이동하고, 인증이 끝나면 redirectTo로 돌아온다.
export const linkGithubIdentity = async ({ redirectTo }) => {
  const { error } = await supabase.auth.linkIdentity({
    provider: "github",
    options: { redirectTo },
  });

  if (error) throw error;
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

// 수정 전 DB에 저장되어 있던 이미지 경로 목록을 가져온다.
// 이 목록과 현재 화면의 이미지 목록을 비교해서 삭제된 Storage 파일을 찾는다.
const getCurrentPortfolioImagePaths = async projectId => {
  const { data, error } = await supabase.from("portfolio_images").select("image_path").eq("project_id", projectId);

  if (error) throw error;

  return (data ?? []).map(image => image.image_path).filter(Boolean);
};

// 에디터 이미지 상태를 portfolio_images 테이블에 저장할 row 배열로 변환한다.
// 기존 이미지는 image_path를 그대로 사용하고, 새 이미지는 Storage에 업로드한 뒤 image_path를 만든다.
const createPortfolioImageRows = async ({ userId, projectId, images }) => {
  const imageRows = [];

  for (const image of images) {
    let imagePath = image.image_path;

    // 기존 DB 이미지가 아니라 새로 첨부한 파일이면 Storage에 업로드한다.
    if (!imagePath && image.file) {
      const extension = image.name.split(".").pop();
      imagePath = `${userId}/${projectId}/${image.order}-${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from(PORTFOLIO_IMAGE_BUCKET).upload(imagePath, image.file);

      if (uploadError) throw uploadError;
    }

    // 기존 이미지도 아니고 새 파일도 없으면 저장할 수 없으므로 건너뛴다.
    if (!imagePath) continue;

    imageRows.push({
      project_id: projectId,
      image_path: imagePath,
      display_order: image.order,
      is_thumbnail: image.is_thumbnail,
      alt_text: image.name,
    });
  }

  return imageRows;
};

// 현재 에디터 화면의 이미지 상태를 기준으로 portfolio_images 테이블을 다시 맞춘다.
// 삭제된 기존 이미지는 Storage에서도 제거한다.
export const replacePortfolioImages = async ({ userId, projectId, images }) => {
  const previousImagePaths = await getCurrentPortfolioImagePaths(projectId);

  const nextImageRows = await createPortfolioImageRows({
    userId,
    projectId,
    images,
  });

  // 정렬/대표 여부/삭제 상태를 한 번에 맞추기 위해 기존 row를 지우고 다시 넣는다.
  const { error: deleteError } = await supabase.from("portfolio_images").delete().eq("project_id", projectId);

  if (deleteError) throw deleteError;

  if (nextImageRows.length > 0) {
    const { error: insertError } = await supabase.from("portfolio_images").insert(nextImageRows);

    if (insertError) throw insertError;
  }

  // 화면에서 사라진 기존 이미지 경로는 Storage에서도 삭제한다.
  const nextImagePaths = new Set(nextImageRows.map(image => image.image_path));
  const removedImagePaths = previousImagePaths.filter(imagePath => !nextImagePaths.has(imagePath));

  if (removedImagePaths.length > 0) {
    const { error: removeError } = await supabase.storage.from(PORTFOLIO_IMAGE_BUCKET).remove(removedImagePaths);

    if (removeError) throw removeError;
  }
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

// portfolios 테이블의 기본 정보를 현재 payload.portfolio 기준으로 수정
// 정규화 테이블, 이미지, AI 데이터는 다음 단계에서 별도로 처리함
export const updatePortfolio = async ({ projectId, payload }) => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { projectId: null, needsLogin: true };
  }

  const { error } = await supabase
    .from("portfolios")
    .update(payload.portfolio)
    .eq("project_id", projectId)
    .eq("author_id", user.id);

  if (error) throw error;

  await replacePortfolioCategories({
    projectId,
    categories: payload.categories,
  });

  await replacePortfolioTechStacks({
    projectId,
    techStacks: payload.techStacks,
  });

  await replacePortfolioImages({
    userId: user.id,
    projectId,
    images: payload.images,
  });

  await upsertPortfolioAiCreated({
    projectId,
    aiAnalysis: payload.aiAnalysis,
    draftGuide: payload.draftGuide,
  });

  return { projectId, needsLogin: false };
};

// AI 분석 결과와 초안 생성 결과를 project_id 기준으로 수정하거나 새로 생성한다.
// 수정 페이지에서는 기존 AI row가 있을 수도 있고 없을 수도 있어서 upsert를 사용한다.
export const upsertPortfolioAiCreated = async ({ projectId, aiAnalysis, draftGuide }) => {
  const { error } = await supabase.from("portfolio_ai_created").upsert(
    {
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
    },
    {
      onConflict: "project_id",
    },
  );

  if (error) throw error;
};

// 현재 선택된 카테고리 목록으로 portfolio_categories 테이블을 다시 저장한다.
// 수정에서는 기존 연결 row를 지운 뒤 현재 화면 상태를 기준으로 재insert한다.
export const replacePortfolioCategories = async ({ projectId, categories }) => {
  const { error: deleteError } = await supabase.from("portfolio_categories").delete().eq("project_id", projectId);

  if (deleteError) throw deleteError;

  if (categories.length === 0) return;

  const { error: insertError } = await supabase.from("portfolio_categories").insert(
    categories.map(category => ({
      project_id: projectId,
      category: category.category_label,
    })),
  );

  if (insertError) throw insertError;
};

// 현재 선택된 기술스택 목록으로 portfolio_tech_stacks 테이블을 다시 저장
// 수정에서는 기존 연결 row를 지운 뒤 현재 화면 상태를 기준으로 insert
export const replacePortfolioTechStacks = async ({ projectId, techStacks }) => {
  const { error: deleteError } = await supabase.from("portfolio_tech_stacks").delete().eq("project_id", projectId);

  if (deleteError) throw deleteError;

  if (techStacks.length === 0) return;

  const { error: insertError } = await supabase.from("portfolio_tech_stacks").insert(
    techStacks.map(techStack => ({
      project_id: projectId,
      tech_stack: techStack.tech_stack_label,
    })),
  );

  if (insertError) throw insertError;
};
