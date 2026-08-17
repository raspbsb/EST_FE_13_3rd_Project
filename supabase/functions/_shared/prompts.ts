// Alan AI에 보낼 프롬프트를 조립하는 모듈. 한글 기준 900자 예산 안에서 고정 필드를 먼저 채우고,
// 남는 공간을 유동적인 텍스트(설명, README, 파일 목록 등)에 배분한다.
// 이 모듈은 프롬프트 "문자열"만 만든다. 실제 Alan AI 호출/응답 처리는 다른 모듈의 책임이다.

// 요청 1회당 허용하는 최대 글자 수 (Alan AI content 제한 ~1000자보다 여유 있게 설정)
const AI_PROMPT_BUDGET = 900;

// DB 저장용 원본은 자르지 않고, AI 프롬프트에 넣을 때만 절단한다. 잘렸다는 표시로 말줄임표를 붙인다.
const truncateForPrompt = (value: unknown, maxLength: number) => {
  const text = String(value ?? "").trim();

  if (maxLength <= 0) return "";
  if (text.length <= maxLength) return text;

  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
};

// ── 1. 사용자 입력 폼 분석 프롬프트 ──────────────────────────────

const FORM_CONTEXT_INSTRUCTION = `너는 GitHub 프로젝트 분석 도우미다.
아래 내용은 사용자가 직접 입력하거나 선택한 정보다. 실제 구현 여부는 판단하지 말고, 사용자가 입력한 의도와 역할만 정리하라.
설명은 글자 수 제한으로 일부만 제공될 수 있다. 제공되지 않은 내용을 추측하지 마라.
정보가 부족한 항목은 빈 문자열 또는 빈 배열로 출력하라.
설명 없이 유효한 JSON만 출력하라.

출력 형식:
{"userIntentSummary":"","declaredRole":"","declaredProjectType":"","declaredTechStacks":[],"declaredCategories":[],"notes":[]}`;

// 프로젝트 설명 최소/최대 보장 길이. 다른 필드가 짧으면 설명에 더 많은 공간을 준다.
const MIN_DESCRIPTION_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 500;

export interface PortfolioFormContext {
  title?: string;
  description?: string;
  author_role?: string;
  project_type?: string;
  team_size?: string;
  environment?: string;
  categories?: { label: string }[];
  tech_stacks?: { label: string }[];
}

// 사용자 입력 폼 데이터를 900자 예산 안에서 프롬프트 문자열로 조립한다.
export const createFormContextPrompt = (formData: PortfolioFormContext) => {
  const categories = (formData.categories ?? []).map(item => item.label).join(", ");
  const techStacks = (formData.tech_stacks ?? []).map(item => item.label).join(", ");

  const fixedLines = [
    `프로젝트명:${truncateForPrompt(formData.title, 50)}`,
    `담당역할:${truncateForPrompt(formData.author_role, 80)}`,
    `참여형태:${formData.project_type ?? ""}`,
    `참여규모:${formData.team_size ?? ""}`,
    `진행환경:${formData.environment ?? ""}`,
    `카테고리:${categories}`,
    `기술스택:${techStacks}`,
  ].join("\n");

  const descriptionPrefix = "프로젝트설명:";
  const headerLength = FORM_CONTEXT_INSTRUCTION.length + fixedLines.length + descriptionPrefix.length + 4;
  const remainingLength = AI_PROMPT_BUDGET - headerLength;
  const descriptionLimit = Math.min(MAX_DESCRIPTION_LENGTH, Math.max(MIN_DESCRIPTION_LENGTH, remainingLength));
  const description = truncateForPrompt(formData.description, descriptionLimit);

  const prompt = [FORM_CONTEXT_INSTRUCTION, "", fixedLines, `${descriptionPrefix}${description}`].join("\n");

  // 선택값이 예상보다 길어 예산을 넘기는 극단적인 경우를 대비한 최종 안전장치.
  // 설명이 맨 뒤에 있어서, 넘치면 설명 쪽만 더 잘린다.
  return truncateForPrompt(prompt, AI_PROMPT_BUDGET);
};

// ── 2. 커밋 이력 분석 프롬프트 (여러 개로 배치) ──────────────────

const COMMIT_BATCH_INSTRUCTION = `너는 GitHub 커밋 이력을 분석하는 도우미다.
아래 커밋 제목은 최근 작업 흐름의 참고 자료일 뿐, 전체 기여도나 실력을 의미하지 않는다.
커밋 수만으로 기여도나 실력을 단정하지 마라.
확인되지 않은 내용은 추측하지 마라.
설명 없이 유효한 JSON만 출력하라.

출력 형식:
{"recentWorks":[],"commitEvidence":[],"limitations":[]}

커밋 목록:`;

interface PromptCommit {
  title: string;
  author: string;
  date: string;
}

// 커밋 목록을 900자 예산 안에 들어가는 만큼씩 나눠서 여러 개의 프롬프트로 만든다.
// 커밋이 많으면 배치 개수가 늘어나고, 적으면 1개로 끝난다.
export const createCommitBatchPrompts = (commits: PromptCommit[]) => {
  const batches: string[] = [];
  let currentLines: string[] = [];
  let currentLength = COMMIT_BATCH_INSTRUCTION.length;

  for (const commit of commits) {
    const line = `- ${commit.title} (${commit.author}, ${commit.date.slice(0, 10)})`;
    const nextLength = currentLength + line.length + 1;

    // 현재 배치에 더 담으면 예산을 넘기고, 이미 담긴 커밋이 있으면 배치를 마감하고 새로 시작한다.
    if (nextLength > AI_PROMPT_BUDGET && currentLines.length > 0) {
      batches.push(`${COMMIT_BATCH_INSTRUCTION}\n${currentLines.join("\n")}`);
      currentLines = [line];
      currentLength = COMMIT_BATCH_INSTRUCTION.length + line.length + 1;
      continue;
    }

    currentLines.push(line);
    currentLength = nextLength;
  }

  if (currentLines.length > 0) {
    batches.push(`${COMMIT_BATCH_INSTRUCTION}\n${currentLines.join("\n")}`);
  }

  return batches;
};

// ── 3. 프로젝트 구조 분석 프롬프트 ──────────────────────────────

const STRUCTURE_INSTRUCTION = `너는 GitHub 프로젝트 구조를 분석하는 도우미다.
파일명만 보고 기능 구현 여부를 확정하지 마라.
README의 설명과 실제 코드에서 확인되는 구현을 구분하라.
확인되지 않은 내용은 추측하지 마라.
설명 없이 유효한 JSON만 출력하라.

출력 형식:
{"structureSummary":"","detectedFeatures":[],"technicalFeatures":[],"evidenceFiles":[],"limitations":[]}`;

// README에 항상 최소한의 공간을 남겨두기 위한 예약 길이 (파일 목록이 아무리 길어도 이만큼은 비워둔다)
const STRUCTURE_README_RESERVE = 150;

interface PortfolioStructureContext {
  fileTree: string[];
  languages: Record<string, number>;
  readme: string;
}

// 파일 트리/언어/README를 900자 예산 안에서 프롬프트 문자열로 조립한다.
// 파일 목록을 예산이 허용하는 만큼 먼저 채우고, README는 남은 공간만큼만 넣는다.
export const createStructurePrompt = ({ fileTree, languages, readme }: PortfolioStructureContext) => {
  const languageLine = `언어:${Object.keys(languages ?? {}).join(", ")}`;
  const headerText = [STRUCTURE_INSTRUCTION, "", languageLine, "파일구조:"].join("\n");

  const filePathLines: string[] = [];
  let usedLength = headerText.length;

  for (const path of fileTree ?? []) {
    const line = `- ${path}`;

    if (usedLength + line.length + 1 > AI_PROMPT_BUDGET - STRUCTURE_README_RESERVE) break;

    filePathLines.push(line);
    usedLength += line.length + 1;
  }

  const readmePrefix = "README:";
  const readmeLimit = AI_PROMPT_BUDGET - usedLength - readmePrefix.length - 2;
  const readmeText = truncateForPrompt(readme, readmeLimit);

  const prompt = [headerText, filePathLines.join("\n"), `${readmePrefix}${readmeText}`].join("\n");

  return truncateForPrompt(prompt, AI_PROMPT_BUDGET);
};

// ── 4. 최종 취합 프롬프트 ────────────────────────────────────────

const FINAL_MERGE_INSTRUCTION = `너는 GitHub 저장소와 사용자 입력을 종합해 포트폴리오 분석 결과를 작성하는 도우미다.
아래 세 가지 분석 결과만 근거로 삼아라. 원본 데이터로 되돌아가 다시 분석하지 마라.
확인되지 않은 내용은 추측하지 마라.
커밋 수와 코드 변경량만으로 기여도, 실력, 코드 품질을 평가하지 마라.
근거가 부족한 항목은 빈 문자열 또는 빈 배열로 출력하라.
마크다운이나 부가 설명 없이 유효한 JSON만 출력하라.

출력 형식:
{"projectSummary":"","mainFeatures":"","technicalFeatures":"","projectStructure":"","analyzedRole":"","participationDetails":"","analysisLimitation":"","analysisEvidence":[]}`;

interface FinalMergeInput {
  formSummary: string;
  commitSummary: string;
  structureSummary: string;
}

// 폼/커밋/구조 3개 분석 결과(Alan AI 응답)를 받아 최종 JSON 생성용 프롬프트로 조립한다.
export const createFinalMergePrompt = ({ formSummary, commitSummary, structureSummary }: FinalMergeInput) => {
  const prompt = [
    FINAL_MERGE_INSTRUCTION,
    "",
    `[사용자 입력 분석 결과]\n${formSummary}`,
    `[커밋 분석 결과]\n${commitSummary}`,
    `[구조 분석 결과]\n${structureSummary}`,
  ].join("\n\n");

  return truncateForPrompt(prompt, AI_PROMPT_BUDGET);
};
