// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { AlanApiError, callAlanAi, parseAlanJson } from "../_shared/alan.ts";
import { assertCooldownReady, CooldownActiveError, markCooldownStart } from "../_shared/cooldown.ts";
import { createDraftGuidePrompt, type DraftGuideFormContext } from "../_shared/prompts.ts";

// 사용자가 입력한 프로젝트 정보(주로 기존 설명)를 받아 Alan AI에 초안 생성 프롬프트를 보내고,
// 다듬어진 프로젝트 설명 초안과 한 줄 요약을 JSON으로 만들어 반환한다.
// CORS(OPTIONS 처리, Allow-Origin/Headers/Methods)는 withSupabase가 기본으로 처리해준다.
export default {
  fetch: withSupabase({ auth: ["user", "publishable", "secret"] }, async (req, ctx) => {
    let formData: DraftGuideFormContext | undefined;

    // 요청 본문이 JSON 형식이 아니면 500이 아니라 400으로 명확히 구분한다.
    try {
      ({ formData } = await req.json());
    } catch {
      return Response.json({ error: "요청 본문이 올바른 JSON 형식이 아닙니다." }, { status: 400 });
    }

    if (!formData || typeof formData.description !== "string" || !formData.description.trim()) {
      return Response.json({ error: "description이 필요합니다." }, { status: 400 });
    }

    // auth: ["user", ...]라서 유효한 JWT가 오면 ctx.userClaims에 즉시(네트워크 호출 없이) 채워진다.
    const userId = ctx.userClaims?.id;

    if (!userId) {
      return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    // 클라이언트 버튼 비활성화를 우회해도(devtools 등) 서버에서 한 번 더 쿨타임을 강제한다.
    try {
      await assertCooldownReady(ctx.supabase, userId, "draft");
    } catch (error) {
      if (error instanceof CooldownActiveError) {
        return Response.json({ error: error.message }, { status: 429 });
      }

      throw error;
    }

    try {
      const draftGuidePrompt = createDraftGuidePrompt(formData);
      const result = await callAlanAi(draftGuidePrompt);
      const draftGuideResult = parseAlanJson(result.answer);

      // 초안 생성 완료 시각은 클라이언트 시계가 아니라 서버 시계 기준으로 내려준다.
      // 프론트에서 이 값을 기준으로 재생성 쿨타임을 계산한다.
      const generatedAt = new Date().toISOString();

      // 성공했을 때만 쿨타임을 시작시킨다 (실패한 시도까지 쿨타임을 소모시키지 않기 위해).
      await markCooldownStart(ctx.supabase, userId, "draft");

      return Response.json({
        draftGuideResult,
        alanUsage: [{ keyName: result.keyName, callCount: 1 }],
        generatedAt,
      });
    } catch (error) {
      if (error instanceof AlanApiError) {
        return Response.json({ error: error.message }, { status: 502 });
      }

      console.error(error);

      return Response.json({ error: "초안 생성 중 오류가 발생했습니다." }, { status: 500 });
    }
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Run `supabase functions serve --env-file ./supabase/.env.local`
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/draft' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --header 'Content-Type: application/json' \
    --data '{"formData":{"title":"Portfolio+","description":"..."}}'

*/
