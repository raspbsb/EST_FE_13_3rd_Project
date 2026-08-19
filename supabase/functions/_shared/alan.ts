// Alan AI API 호출 모듈.
// ALAN_API_KEYS(콤마 구분 client_id 목록)를 앞에서부터 순서대로 시도한다.
// 하루 요청 한도(client_id당 100회)를 넘겨 실패하면 자동으로 다음 client_id로 넘어간다.

const ALAN_API_BASE = "https://kdt-api-function.azurewebsites.net";
// Alan AI가 응답을 너무 오래 끌면(관측상 무한정 대기) Edge Function 자체 실행 시간 제한(546)에 걸리므로,
// client_id 하나당 이 시간을 넘기면 포기하고 다음 client_id로 넘어간다.
const ALAN_REQUEST_TIMEOUT_MS = 30000;

// ALAN_API_KEYS에 등록한 client_id 순서와 동일한 순서로 맞춘 이름 목록.
// 어떤 client_id가 실제로 쓰였는지 로그/응답에는 이름만 노출하고, client_id 원본 값은 노출하지 않는다.
const ALAN_API_KEY_NAMES = ["배정호", "유태구", "맹예진", "강채희", "오예은"];

// 배정호/유태구/맹예진/강채희 키가 하루 한도 소진(HTTP 401)으로 계속 실패하는 게 관측돼서,
// 지금 유일하게 살아있는 오예은 키를 맨 앞으로 옮긴다. (env의 ALAN_API_KEYS 순서는 그대로 두고, 시도 순서만 재배치)
const ALAN_KEY_TRY_ORDER = [4, 1, 2, 3, 0];

// Alan AI 호출/응답 관련 에러
export class AlanApiError extends Error {}

const getAlanApiKeys = () =>
  (Deno.env.get("ALAN_API_KEYS") ?? "")
    .split(",")
    .map(key => key.trim())
    .filter(Boolean);

// 파싱된 JSON 결과에서 keys 중 하나라도 내용이 있으면 true. 프롬프트가 "근거 부족하면 빈 문자열/배열로 출력"을
// 지시하고 있어서 필드 하나하나의 비어있음은 정상일 수 있지만, 전부 다 비어있으면 소진/오류로 본다.
export const hasAnyContent = (parsed: unknown, keys: string[]) => {
  if (!parsed || typeof parsed !== "object") return false;

  const record = parsed as Record<string, unknown>;

  return keys.some(key => {
    const value = record[key];

    if (Array.isArray(value)) return value.length > 0;

    return typeof value === "string" && value.trim().length > 0;
  });
};

// content(질문)를 Alan AI에 보내고 { answer, keyName }을 받는다.
// 등록된 client_id를 ALAN_KEY_TRY_ORDER 순서대로 시도하고, 하나라도 성공하면 그 결과와 함께 실제로 성공한 client_id의 이름을 반환한다.
// validateJson을 주면 응답이 JSON으로 해석되는지 + 그 결과가 통과하는지까지 확인하고,
// 실패하면(소진된 키가 엉뚱한 텍스트나 텅 빈 JSON을 돌려주는 경우 등) 다음 키로 넘어간다.
export const callAlanAi = async (
  content: string,
  { validateJson }: { validateJson?: (parsed: unknown) => boolean } = {},
) => {
  const apiKeys = getAlanApiKeys();

  if (apiKeys.length === 0) {
    throw new AlanApiError("ALAN_API_KEYS가 설정되지 않았습니다.");
  }

  let lastError: unknown;

  for (const index of ALAN_KEY_TRY_ORDER) {
    if (index >= apiKeys.length) continue;

    const clientId = apiKeys[index];
    const keyName = ALAN_API_KEY_NAMES[index] ?? `client_id ${index + 1}번`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ALAN_REQUEST_TIMEOUT_MS);

    // 개발 확인용 콘솔 : 이번 요청이 어떤 client_id(이름)로 시도되는지 확인 (100회 소진 여부 추적용)
    console.log(`[Alan] 시도: ${keyName}`);

    try {
      const url = new URL(`${ALAN_API_BASE}/api/v1/question`);

      url.searchParams.set("content", content);
      url.searchParams.set("client_id", clientId);

      const response = await fetch(url, { method: "GET", signal: controller.signal });

      if (!response.ok) {
        console.log(`[Alan] 실패: ${keyName} - HTTP ${response.status}`);
        lastError = new AlanApiError(`Alan AI 요청 실패 (${response.status})`);
        continue;
      }

      const data = await response.json();

      // 문서에는 응답 필드가 content로 나와있지만, 실제로는 answer로 온다 (직접 호출해서 확인함).
      if (typeof data.answer !== "string") {
        console.log(`[Alan] 실패: ${keyName} - answer 없음`);
        lastError = new AlanApiError("Alan AI 응답에 answer가 없습니다.");
        continue;
      }

      // 소진된 키가 200 OK로 안내 문구 같은 일반 텍스트나 텅 빈 JSON을 돌려주는 경우가 있어서,
      // 검증 함수가 있으면 JSON으로 읽히는지 + 내용이 있는지까지 확인하고 아니면 다음 키로 넘어간다.
      if (validateJson) {
        let parsed: unknown;

        try {
          parsed = parseAlanJson(data.answer);
        } catch {
          console.log(`[Alan] 실패: ${keyName} - JSON 아님 (소진 추정)`);
          lastError = new AlanApiError("Alan AI 응답을 JSON으로 해석할 수 없습니다.");
          continue;
        }

        if (!validateJson(parsed)) {
          console.log(`[Alan] 실패: ${keyName} - 결과 내용 비어있음 (소진 추정)`);
          lastError = new AlanApiError("Alan AI 응답 내용이 비어 있습니다.");
          continue;
        }
      }

      console.log(`[Alan] 성공: ${keyName}`);

      return { answer: data.answer, keyName };
    } catch (error) {
      // 타임아웃(AbortError)이든 네트워크 오류든, 이 client_id가 실패해도 다음 client_id로 계속 시도한다.
      const isTimeout = error instanceof Error && error.name === "AbortError";

      console.log(`[Alan] 실패: ${keyName} - ${isTimeout ? "타임아웃" : error instanceof Error ? error.message : "알 수 없는 오류"}`);

      lastError = isTimeout
        ? new AlanApiError("AI 분석 서버의 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.")
        : error;
    } finally {
      clearTimeout(timeoutId);
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
