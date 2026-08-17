// Alan AI API 호출 모듈.
// ALAN_API_KEYS(콤마 구분 client_id 목록)를 앞에서부터 순서대로 시도한다.
// 하루 요청 한도(client_id당 100회)를 넘겨 실패하면 자동으로 다음 client_id로 넘어간다.

const ALAN_API_BASE = "https://kdt-api-function.azurewebsites.net";

// Alan AI 호출/응답 관련 에러
export class AlanApiError extends Error {}

const getAlanApiKeys = () =>
  (Deno.env.get("ALAN_API_KEYS") ?? "")
    .split(",")
    .map(key => key.trim())
    .filter(Boolean);

// content(질문)를 Alan AI에 보내고 응답 텍스트(answer 필드)를 받는다.
// 등록된 client_id를 순서대로 시도하고, 하나라도 성공하면 그 결과를 바로 반환한다.
export const callAlanAi = async (content: string) => {
  const apiKeys = getAlanApiKeys();

  if (apiKeys.length === 0) {
    throw new AlanApiError("ALAN_API_KEYS가 설정되지 않았습니다.");
  }

  let lastError: unknown;

  for (const clientId of apiKeys) {
    try {
      const url = new URL(`${ALAN_API_BASE}/api/v1/question`);

      url.searchParams.set("content", content);
      url.searchParams.set("client_id", clientId);

      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        lastError = new AlanApiError(`Alan AI 요청 실패 (${response.status})`);
        continue;
      }

      const data = await response.json();

      // 문서에는 응답 필드가 content로 나와있지만, 실제로는 answer로 온다 (직접 호출해서 확인함).
      if (typeof data.answer !== "string") {
        lastError = new AlanApiError("Alan AI 응답에 answer가 없습니다.");
        continue;
      }

      return data.answer;
    } catch (error) {
      // 네트워크 오류 등으로 이 client_id가 실패해도, 다음 client_id로 계속 시도한다.
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new AlanApiError("Alan AI 요청이 모두 실패했습니다.");
};

// Alan 응답은 "JSON만 출력하라"는 지시에도 불구하고 코드블록(```json ... ```)이나
// 앞뒤 설명 문장이 붙어서 올 수 있다. JSON으로 보이는 부분만 뽑아 안전하게 파싱한다.
export const parseAlanJson = (rawContent: string) => {
  const withoutFence = rawContent
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");
  const candidate =
    firstBrace >= 0 && lastBrace >= firstBrace ? withoutFence.slice(firstBrace, lastBrace + 1) : withoutFence;

  try {
    return JSON.parse(candidate);
  } catch {
    throw new AlanApiError("Alan AI 응답을 JSON으로 해석할 수 없습니다.");
  }
};
