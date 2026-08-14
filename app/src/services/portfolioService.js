// 포트폴리오 등록/수정에 필요한 Supabase DB 요청을 모아둔 서비스 모듈

import { supabase } from "../utils/supabase";

// 현재 로그인한 Supabase Auth 사용자를 조회하는 함수
export const getAuthenticatedUser = async () => {
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData.user) return null;

  return authData.user;
};

// portfolios 테이블에 기본 포트폴리오 정보를 저장하고 생성된 project_id를 반환하는 함수
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

// 선택된 카테고리 목록을 포트폴리오 연결 테이블에 저장하는 함수
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

// 선택된 기술 스택 목록을 포트폴리오 연결 테이블에 저장하는 함수
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

// payload를 기반으로 포트폴리오 등록에 필요한 Supabase insert를 순서대로 실행하는 함수
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

  return { projectId, needsLogin: false };
};
