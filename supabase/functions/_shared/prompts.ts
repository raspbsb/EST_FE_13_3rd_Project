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

// "너는 ~ 도우미다" 같은 자기소개 문구를 넣으면 AI가 declaredRole에 그 문구를 그대로 가져다 쓰는
// 문제가 있어서, 자기소개 없이 "정리하는 프로그램"으로만 지칭하고 declaredRole 출처를 명시한다.
const FORM_CONTEXT_INSTRUCTION = `아래는 사용자가 직접 입력하거나 선택한 프로젝트 정보다. 이 정보를 정리해 JSON으로 출력하라.
실제 구현 여부는 판단하지 말고, 사용자가 입력한 의도만 정리하라.
declaredRole에는 아래 "담당역할:" 줄의 값을 그대로 옮겨 적어라. 다른 문구로 대체하지 마라.
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

// 배치 개수 상한. 최근/최초/중간/최근이어서, 최대 4개까지만 만든다.
const COMMIT_BATCH_MAX_COUNT = 4;

const commitLine = (commit: PromptCommit) => `- ${commit.title} (${commit.author}, ${commit.date.slice(0, 10)})`;
const commitLineLength = (commit: PromptCommit) => commitLine(commit).length + 1;

// index를 증가시키며(최근→오래된 방향) boundExclusive 직전까지, charBudget을 넘기지 않는 선에서 그리디하게 채운다.
const fillForward = (commits: PromptCommit[], fromIndex: number, boundExclusive: number, charBudget: number) => {
  const lines: string[] = [];
  let used = COMMIT_BATCH_INSTRUCTION.length;
  let index = fromIndex;

  while (index < boundExclusive && index < commits.length) {
    const length = commitLineLength(commits[index]);

    if (used + length > charBudget) break;

    lines.push(commitLine(commits[index]));
    used += length;
    index += 1;
  }

  return { lines, nextIndex: index };
};

// index를 감소시키며(오래된→최근 방향) boundExclusive 직전까지, charBudget을 넘기지 않는 선에서 그리디하게 채운다.
const fillBackward = (commits: PromptCommit[], fromIndex: number, boundExclusive: number, charBudget: number) => {
  const lines: string[] = [];
  let used = COMMIT_BATCH_INSTRUCTION.length;
  let index = fromIndex;

  while (index > boundExclusive && index >= 0) {
    const length = commitLineLength(commits[index]);

    if (used + length > charBudget) break;

    lines.unshift(commitLine(commits[index]));
    used += length;
    index -= 1;
  }

  return { lines, nextIndex: index };
};

const toCommitBatchPrompt = (lines: string[]) => `${COMMIT_BATCH_INSTRUCTION}\n${lines.join("\n")}`;

// 커밋 목록(최신순 정렬)을 최근/최초/중간/최근이어서 순서로 최대 4개 배치로 나눠 프롬프트를 만든다.
// 이미 다른 배치가 담은 커밋과는 겹치지 않는다. 커밋이 적으면 앞쪽 배치에서 이미 다 담겨 자동으로 배치 수가 줄어든다.
export const createCommitBatchPrompts = (commits: PromptCommit[]) => {
  if (commits.length === 0) return [];

  const batches: string[] = [];

  // 배치 A: 최근 커밋(index 0)부터 채운다.
  const recentFill = fillForward(commits, 0, commits.length, AI_PROMPT_BUDGET);

  batches.push(toCommitBatchPrompt(recentFill.lines));

  const frontCursor = recentFill.nextIndex;

  // 전부 다 담겼으면 여기서 끝난다.
  if (frontCursor >= commits.length) return batches;

  // 배치 B: 가장 오래된 커밋부터 역순으로 채운다. frontCursor보다 앞(더 최근 쪽)으로는 넘어오지 않는다.
  const oldestFill = fillBackward(commits, commits.length - 1, frontCursor - 1, AI_PROMPT_BUDGET);
  let backCursor = commits.length;

  if (oldestFill.lines.length > 0 && batches.length < COMMIT_BATCH_MAX_COUNT) {
    batches.push(toCommitBatchPrompt(oldestFill.lines));
    backCursor = oldestFill.nextIndex + 1;
  }

  // 배치 C: frontCursor~backCursor 사이가 남아있으면, 그 구간의 중앙을 기준으로 앞뒤 절반씩 채운다.
  let middleStartIndex = backCursor;

  if (frontCursor < backCursor - 1 && batches.length < COMMIT_BATCH_MAX_COUNT) {
    const middleIndex = frontCursor + Math.floor((backCursor - frontCursor) / 2);
    const halfBudget =
      COMMIT_BATCH_INSTRUCTION.length + Math.floor((AI_PROMPT_BUDGET - COMMIT_BATCH_INSTRUCTION.length) / 2);

    // 중앙 커밋 기준 뒤(최근 방향) 절반, 앞(오래된 방향) 절반을 각각 채워 하나로 합친다.
    const forwardHalf = fillForward(commits, middleIndex, backCursor, halfBudget);
    const backwardHalf = fillBackward(commits, middleIndex - 1, frontCursor - 1, halfBudget);
    const middleLines = [...backwardHalf.lines, ...forwardHalf.lines];

    if (middleLines.length > 0) {
      batches.push(toCommitBatchPrompt(middleLines));
      middleStartIndex = backwardHalf.nextIndex + 1;
    }
  }

  // 배치 D: frontCursor부터 이어서 채우되, 중간 배치(C)가 이미 담은 구간 전까지만 채운다.
  if (frontCursor < middleStartIndex && batches.length < COMMIT_BATCH_MAX_COUNT) {
    const secondRecentFill = fillForward(commits, frontCursor, middleStartIndex, AI_PROMPT_BUDGET);

    if (secondRecentFill.lines.length > 0) {
      batches.push(toCommitBatchPrompt(secondRecentFill.lines));
    }
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

const FINAL_MERGE_INSTRUCTION = `아래 세 분석 결과만 근거로 포트폴리오 분석 JSON을 작성하라. 추측 금지, 원본 데이터 재분석 금지.
커밋 수만으로 기여도·실력을 평가하지 마라. projectStructure는 [구조 분석 결과]를 반드시 반영하라.
technicalFeatures는 기술 이름 나열 대신 [구조 분석 결과]의 실제 구현 방식(라우팅/상태관리/API연동 등)을 설명하라.
analyzedRole·participationDetails는 자연스러운 문장으로 풀어써라.
analysisEvidence는 [커밋 분석 결과]·[구조 분석 결과]에서만 뽑고(최대 10개, 전역적인 근거 우선), 각 항목은 {"value":"","label":"12자 이내","description":""} 형태로, 실제 파일·커밋 근거를 써라.
근거 부족한 항목은 빈 문자열/배열로. 설명 없이 JSON만 출력하라.

출력 형식:
{"projectSummary":"","mainFeatures":"","technicalFeatures":"","projectStructure":"","analyzedRole":"","participationDetails":"","analysisLimitation":"","analysisEvidence":[{"value":"","label":"","description":""}]}`;

interface FinalMergeInput {
  formSummary: string;
  commitSummary: string;
  structureSummary: string;
}

// 폼/커밋/구조 3개 분석 결과(Alan AI 응답)를 받아 최종 JSON 생성용 프롬프트로 조립한다.
// 셋을 이어붙인 뒤 통째로 자르면(예전 방식) 맨 뒤에 오는 구조 분석 결과가 통째로 잘려나갈 수 있어서,
// 세 요약을 각각 개별적으로 절단해 셋 다 최소한의 공간을 보장받게 한다.
export const createFinalMergePrompt = ({ formSummary, commitSummary, structureSummary }: FinalMergeInput) => {
  const sectionLabels = {
    form: "[사용자 입력 분석 결과]\n",
    commit: "[커밋 분석 결과]\n",
    structure: "[구조 분석 결과]\n",
  };

  const fixedLength =
    FINAL_MERGE_INSTRUCTION.length +
    sectionLabels.form.length +
    sectionLabels.commit.length +
    sectionLabels.structure.length +
    8; // 섹션 구분 줄바꿈 여유

  const availableForSections = Math.max(0, AI_PROMPT_BUDGET - fixedLength);
  const perSectionBudget = Math.floor(availableForSections / 3);

  const formText = truncateForPrompt(formSummary, perSectionBudget);
  const commitText = truncateForPrompt(commitSummary, perSectionBudget);
  const structureText = truncateForPrompt(structureSummary, perSectionBudget);

  const prompt = [
    FINAL_MERGE_INSTRUCTION,
    "",
    `${sectionLabels.form}${formText}`,
    `${sectionLabels.commit}${commitText}`,
    `${sectionLabels.structure}${structureText}`,
  ].join("\n\n");

  // 위에서 섹션별로 이미 절단했지만, 라벨/줄바꿈 여유 계산이 어긋나는 극단적인 경우를 대비한 최종 안전장치.
  return truncateForPrompt(prompt, AI_PROMPT_BUDGET);
};

// ── 5. 초안 가이드 생성 프롬프트 ──────────────────────────────

// 사용자가 입력한 정보만 근거로 삼고, 없는 기능/기술을 지어내지 않도록 명시한다.
const DRAFT_GUIDE_INSTRUCTION = `아래는 사용자가 작성한 프로젝트 정보다. 이 정보를 바탕으로 포트폴리오용 프로젝트 설명 초안과 한 줄 요약을 작성하라.
기존설명에 없는 기능이나 기술을 새로 지어내지 마라. 기존설명을 다듬고 문장을 자연스럽게 보완하는 데 집중하라.
draftDescription은 200자 이상 500자 이내로 작성하라.
shortSummary는 40자 이내로, 프로젝트를 한 문장으로 소개하는 문구로 작성하라.
설명 없이 유효한 JSON만 출력하라.

출력 형식:
{"draftDescription":"","shortSummary":""}`;

export interface DraftGuideFormContext {
  title?: string;
  description?: string;
  author_role?: string;
  project_type?: string;
  categories?: { label: string }[];
  tech_stacks?: { label: string }[];
}

// 사용자 입력 폼 데이터(주로 기존 설명)를 900자 예산 안에서 초안 생성 프롬프트로 조립한다.
export const createDraftGuidePrompt = (formData: DraftGuideFormContext) => {
  const categories = (formData.categories ?? []).map(item => item.label).join(", ");
  const techStacks = (formData.tech_stacks ?? []).map(item => item.label).join(", ");

  const fixedLines = [
    `프로젝트명:${truncateForPrompt(formData.title, 50)}`,
    `담당역할:${truncateForPrompt(formData.author_role, 80)}`,
    `참여형태:${formData.project_type ?? ""}`,
    `카테고리:${categories}`,
    `기술스택:${techStacks}`,
  ].join("\n");

  const descriptionPrefix = "기존설명:";
  const headerLength = DRAFT_GUIDE_INSTRUCTION.length + fixedLines.length + descriptionPrefix.length + 4;
  const descriptionLimit = Math.max(0, AI_PROMPT_BUDGET - headerLength);
  const description = truncateForPrompt(formData.description, descriptionLimit);

  const prompt = [DRAFT_GUIDE_INSTRUCTION, "", fixedLines, `${descriptionPrefix}${description}`].join("\n");

  return truncateForPrompt(prompt, AI_PROMPT_BUDGET);
};
