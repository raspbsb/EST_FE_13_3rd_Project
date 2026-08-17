// GitHub REST API에서 저장소 분석에 필요한 데이터를 수집하는 모듈
// analyze Edge Function에서 사용. AI 프롬프트 구성은 이 모듈의 책임이 아니다.

const GITHUB_API_BASE = "https://api.github.com";
const USER_AGENT = "portfolio-plus-analyze";

// 커밋 제목 추출 시 자를 최대 길이 (GitHub 커밋 제목 관례인 72자 기준)
const COMMIT_TITLE_MAX_LENGTH = 72;
// 파일 트리에서 남길 최대 경로 개수
const FILE_TREE_MAX_COUNT = 30;
// 커밋 목록에서 가져올 개수 (GitHub REST 페이지당 최대값)
const COMMIT_FETCH_COUNT = 100;
// 컨트리뷰터 목록에서 가져올 개수
const CONTRIBUTOR_FETCH_COUNT = 10;
// README 전처리 단계에서 남길 최대 글자 수. AI 전송용 절단은 이후 프롬프트 조립 단계에서 별도로 처리한다.
const README_MAX_LENGTH = 2000;

// 저장소 URL 형식이 올바르지 않을 때 던지는 에러
export class GithubRepositoryUrlError extends Error {}

// GitHub API 요청 자체가 실패했을 때 던지는 에러. status로 원인을 구분한다.
export class GithubApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// GitHub 저장소 URL에서 owner/repo만 추출한다.
// /tree/main, /blob/main/..., 쿼리스트링, 마지막 슬래시, .git 접미사를 모두 허용한다.
export const parseGithubRepositoryUrl = (repositoryUrl: string) => {
  const text = String(repositoryUrl ?? "").trim();
  const match = text.match(/^https:\/\/github\.com\/([^/\s]+)\/([^/\s?#]+)/i);

  if (!match) {
    throw new GithubRepositoryUrlError("올바른 GitHub 저장소 URL이 아닙니다.");
  }

  const [, owner, repoWithSuffix] = match;
  const repo = repoWithSuffix.replace(/\.git$/i, "");

  return { owner, repo };
};

const createGithubHeaders = (token: string, accept?: string) => ({
  Authorization: `Bearer ${token}`,
  "User-Agent": USER_AGENT,
  "X-GitHub-Api-Version": "2022-11-28",
  Accept: accept ?? "application/vnd.github+json",
});

// GitHub API 공통 요청 함수. 404는 "데이터 없음"으로 취급해 null을 반환하고,
// 나머지 실패 응답은 GithubApiError로 던져서 analyze index.ts에서 상태코드별로 분기할 수 있게 한다.
const requestGithubApi = async (path: string, token: string, accept?: string) => {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: createGithubHeaders(token, accept),
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new GithubApiError(`GitHub API 요청 실패: ${path} (${response.status})`, response.status);
  }

  return response;
};

const fetchRepositoryMetadata = async (owner: string, repo: string, token: string) => {
  const response = await requestGithubApi(`/repos/${owner}/${repo}`, token);

  if (!response) {
    throw new GithubApiError("존재하지 않는 GitHub 저장소입니다.", 404);
  }

  const data = await response.json();

  return {
    fullName: data.full_name as string,
    description: (data.description ?? "") as string,
    defaultBranch: data.default_branch as string,
    isPrivate: Boolean(data.private),
    stargazersCount: data.stargazers_count as number,
  };
};

// application/vnd.github.raw 로 요청하면 base64 디코딩 없이 원문 텍스트를 바로 받을 수 있다.
const fetchReadmeText = async (owner: string, repo: string, token: string) => {
  const response = await requestGithubApi(`/repos/${owner}/${repo}/readme`, token, "application/vnd.github.raw");

  if (!response) return "";

  const text = await response.text();

  return text.slice(0, README_MAX_LENGTH);
};

const fetchLanguages = async (owner: string, repo: string, token: string) => {
  const response = await requestGithubApi(`/repos/${owner}/${repo}/languages`, token);

  if (!response) return {};

  return response.json();
};

// 병합 커밋처럼 실제 작업 내용을 담고 있지 않은 커밋 제목을 걸러낸다.
const isMeaningfulCommitTitle = (title: string) => {
  if (!title) return false;

  return !/^merge (pull request|branch)/i.test(title);
};

// 커밋 목록을 가져와 제목 1줄만 남기고, 병합/중복 커밋을 제외해 분석에 쓸 수 있는 형태로 정리한다.
const fetchCommits = async (owner: string, repo: string, token: string) => {
  const response = await requestGithubApi(`/repos/${owner}/${repo}/commits?per_page=${COMMIT_FETCH_COUNT}`, token);

  if (!response) return [];

  const commits = await response.json();
  const seenTitles = new Set<string>();
  const normalizedCommits = [];

  for (const commit of commits) {
    const rawMessage: string = commit.commit?.message ?? "";
    const title = rawMessage.split("\n")[0].trim().slice(0, COMMIT_TITLE_MAX_LENGTH);

    if (!isMeaningfulCommitTitle(title)) continue;
    if (seenTitles.has(title)) continue;

    seenTitles.add(title);
    normalizedCommits.push({
      title,
      author: commit.commit?.author?.name ?? commit.author?.login ?? "",
      date: commit.commit?.author?.date ?? "",
    });
  }

  return normalizedCommits;
};

// 프로젝트 구조 분석에서 우선적으로 봐야 할 진입/구성 파일 경로 패턴
const IMPORTANT_PATH_PATTERNS = [
  /^package\.json$/,
  /^readme(\.[a-z]+)?$/i,
  /src\/(main|index|app)\.(jsx?|tsx?)$/i,
  /src\/pages\//i,
  /src\/components\//i,
  /src\/routes\//i,
  /src\/hooks\//i,
  /src\/services\//i,
  /src\/store\//i,
  /src\/lib\//i,
  /src\/utils\//i,
];

// 파일 트리 전체를 다 보내지 않고, 프로젝트 구조 파악에 의미 있는 경로만 우선 추려서 최대 개수만큼 반환한다.
const fetchFileTree = async (owner: string, repo: string, defaultBranch: string, token: string) => {
  const response = await requestGithubApi(`/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, token);

  if (!response) return [];

  const data = await response.json();
  const blobPaths: string[] = (data.tree ?? [])
    .filter((item: { type: string }) => item.type === "blob")
    .map((item: { path: string }) => item.path);

  const importantPaths = blobPaths.filter(path => IMPORTANT_PATH_PATTERNS.some(pattern => pattern.test(path)));
  const selectedPaths = importantPaths.length > 0 ? importantPaths : blobPaths;

  return selectedPaths.slice(0, FILE_TREE_MAX_COUNT);
};

const fetchContributors = async (owner: string, repo: string, token: string) => {
  const response = await requestGithubApi(
    `/repos/${owner}/${repo}/contributors?per_page=${CONTRIBUTOR_FETCH_COUNT}`,
    token,
  );

  if (!response) return [];

  const data = await response.json();

  return data.map((contributor: { login: string; contributions: number }) => ({
    login: contributor.login,
    contributions: contributor.contributions,
  }));
};

// GitHub 저장소 URL 하나로 분석에 필요한 데이터를 한 번에 수집한다.
// 프롬프트 조립(900자 예산 배분 등)은 이 함수의 반환값을 받는 쪽에서 처리한다.
export const collectGithubRepositoryData = async (repositoryUrl: string, token: string) => {
  const { owner, repo } = parseGithubRepositoryUrl(repositoryUrl);
  const repository = await fetchRepositoryMetadata(owner, repo, token);

  const [readme, languages, commits, fileTree, contributors] = await Promise.all([
    fetchReadmeText(owner, repo, token),
    fetchLanguages(owner, repo, token),
    fetchCommits(owner, repo, token),
    fetchFileTree(owner, repo, repository.defaultBranch, token),
    fetchContributors(owner, repo, token),
  ]);

  return { owner, repo, repository, readme, languages, commits, fileTree, contributors };
};
