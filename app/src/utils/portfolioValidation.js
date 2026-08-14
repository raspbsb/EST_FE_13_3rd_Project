// 포트폴리오 에디터 폼 검증 모듈

// AI 사용자 입력 폼 분석 요청 전에 확인할 최소 입력 조건
const AI_FORM_VALIDATION_LIMITS = {
  title: 50,
  descriptionMin: 20,
  descriptionMax: 900,
};

// GitHub API 수집 기준이 되는 저장소 URL 형식인지 확인하는 함수
const isGithubRepositoryUrl = value => {
  const text = String(value ?? "").trim();

  return /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/.test(text);
};

// 필드별 검증 메시지를 라벨 오른쪽에 표시하기 위한 빈 오류 객체를 생성하는 함수
export const createEmptyFormErrors = () => ({
  title: "",
  description: "",
  repository_url: "",
  categories: "",
  tech_stacks: "",
});

// 저장소 분석 버튼 실행 전에 프로젝트명, 설명 길이, GitHub 저장소 URL을 검증하는 함수
export const validateAiFormFieldErrors = formData => {
  const errors = createEmptyFormErrors();
  const title = formData.title.trim();
  const description = formData.description.trim();

  if (!title) {
    errors.title = "입력 필요";
  } else if (title.length > AI_FORM_VALIDATION_LIMITS.title) {
    errors.title = `${AI_FORM_VALIDATION_LIMITS.title}자 이내`;
  }

  if (description.length < AI_FORM_VALIDATION_LIMITS.descriptionMin) {
    errors.description = `${AI_FORM_VALIDATION_LIMITS.descriptionMin}자 이상`;
  } else if (description.length > AI_FORM_VALIDATION_LIMITS.descriptionMax) {
    errors.description = `${AI_FORM_VALIDATION_LIMITS.descriptionMax}자 이내`;
  }

  if (!isGithubRepositoryUrl(formData.repository_url)) {
    errors.repository_url = "GitHub URL 필요";
  }

  return errors;
};

// 초안 생성 버튼 실행 전에 AI 초안 생성에 필요한 프로젝트 설명 길이를 검증하는 함수
export const validateDraftGuideFieldErrors = formData => {
  const errors = createEmptyFormErrors();
  const description = formData.description.trim();

  if (description.length < AI_FORM_VALIDATION_LIMITS.descriptionMin) {
    errors.description = `${AI_FORM_VALIDATION_LIMITS.descriptionMin}자 이상`;
  } else if (description.length > AI_FORM_VALIDATION_LIMITS.descriptionMax) {
    errors.description = `${AI_FORM_VALIDATION_LIMITS.descriptionMax}자 이내`;
  }

  return errors;
};

// 작성/수정 완료 제출 전에 필수 입력값과 카테고리·기술 스택 최소 선택 개수를 검증하는 함수
export const validateSubmitFieldErrors = formData => {
  const errors = validateDraftGuideFieldErrors(formData);
  const title = formData.title.trim();

  if (!title) {
    errors.title = "입력 필요";
  } else if (title.length > AI_FORM_VALIDATION_LIMITS.title) {
    errors.title = `${AI_FORM_VALIDATION_LIMITS.title}자 이내`;
  }

  if (formData.categories.length === 0) {
    errors.categories = "최소 1개 필요";
  }

  if (formData.tech_stacks.length === 0) {
    errors.tech_stacks = "최소 1개 필요";
  }

  return errors;
};

// 필드별 오류 객체 안에 하나라도 표시할 검증 메시지가 있는지 확인하는 함수
export const hasFormErrors = errors => Object.values(errors).some(Boolean);

// alert에 먼저 보여줄 대표 검증 메시지를 필드 우선순위에 따라 반환하는 함수
export const getFirstFormErrorMessage = errors => {
  if (errors.title) return `프로젝트명: ${errors.title}`;
  if (errors.description) return `프로젝트 설명: ${errors.description}`;
  if (errors.repository_url) return `GitHub 저장소 URL: ${errors.repository_url}`;
  if (errors.categories) return `카테고리: ${errors.categories}`;
  if (errors.tech_stacks) return `기술 스택: ${errors.tech_stacks}`;

  return "";
};
