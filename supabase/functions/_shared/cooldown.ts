// 분석/초안 생성 요청에 서버 측 쿨타임을 강제하는 모듈.
// 클라이언트 버튼 비활성화만으로는 devtools/직접 API 호출로 우회할 수 있어, 여기서 한 번 더 막는다.
// project_id가 아니라 "사용자 + 액션(+ 저장소)" 기준으로 기록해서, 아직 저장 안 된 신규 프로젝트에서도 동일하게 적용된다.
// analyze는 "계정 + 저장소" 단위(다른 저장소를 분석하는 건 막지 않음), draft는 "계정" 단위(저장소가 없는 액션이라 repositoryUrl은 항상 "").

// 초안 생성은 분석과 달리 Alan 호출 1회짜리 단순 작업이라 쿨타임을 더 짧게 둔다.
const COOLDOWN_MS_BY_ACTION: Record<"analyze" | "draft", number> = {
  analyze: 30 * 60 * 1000,
  draft: 10 * 60 * 1000,
};

const ACTION_LABELS: Record<"analyze" | "draft", string> = {
  analyze: "재분석",
  draft: "재생성",
};

export class CooldownActiveError extends Error {
  remainingMs: number;

  constructor(remainingMs: number, action: "analyze" | "draft") {
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    super(`${ACTION_LABELS[action]}은 ${minutes}분 ${seconds}초 후에 가능합니다.`);
    this.remainingMs = remainingMs;
  }
}

// deno-lint-ignore no-explicit-any
export const assertCooldownReady = async (
  supabase: any,
  userId: string,
  action: "analyze" | "draft",
  repositoryUrl = "",
) => {
  const { data } = await supabase
    .from("ai_action_cooldowns")
    .select("last_requested_at")
    .eq("user_id", userId)
    .eq("action", action)
    .eq("repository_url", repositoryUrl)
    .maybeSingle();

  if (!data?.last_requested_at) return;

  const elapsed = Date.now() - new Date(data.last_requested_at).getTime();
  const remaining = COOLDOWN_MS_BY_ACTION[action] - elapsed;

  if (remaining > 0) {
    throw new CooldownActiveError(remaining, action);
  }
};

// deno-lint-ignore no-explicit-any
export const markCooldownStart = async (
  supabase: any,
  userId: string,
  action: "analyze" | "draft",
  repositoryUrl = "",
) => {
  await supabase.from("ai_action_cooldowns").upsert(
    { user_id: userId, action, repository_url: repositoryUrl, last_requested_at: new Date().toISOString() },
    { onConflict: "user_id,action,repository_url" },
  );
};
