// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { AlanApiError, callAlanAi, hasAnyContent, parseAlanJson } from "../_shared/alan.ts";
import { assertCooldownReady, CooldownActiveError, markCooldownStart } from "../_shared/cooldown.ts";
import {
  collectGithubRepositoryData,
  GithubApiError,
  GithubRepositoryUrlError,
  parseGithubRepositoryUrl,
} from "../_shared/github.ts";
import {
  createCommitBatchPrompts,
  createFinalMergePrompt,
  createFormContextPrompt,
  createStructurePrompt,
  type PortfolioFormContext,
} from "../_shared/prompts.ts";

// GitHub 저장소 URL과 사용자 입력 폼 데이터를 받아 GitHub 데이터를 수집하고,
// 폼/커밋/구조 프롬프트를 Alan AI에 순서대로 보낸 뒤, 그 결과를 다시 최종 취합 프롬프트로 보내
// 화면에 반영할 수 있는 최종 분석 결과(JSON)를 만들어 반환한다.
// CORS(OPTIONS 처리, Allow-Origin/Headers/Methods)는 withSupabase가 기본으로 처리해준다.
export default {
  fetch: withSupabase({ auth: ["user", "publishable", "secret"] }, async (req, ctx) => {
    let repositoryUrl: string | undefined;
    let portfolioId: string | undefined;
    let githubUsername: string | undefined;
    let formData: PortfolioFormContext | undefined;

    // 요청 본문이 JSON 형식이 아니면 500이 아니라 400으로 명확히 구분한다.
    try {
      ({ repositoryUrl, portfolioId, githubUsername, formData } = await req.json());
    } catch {
      return Response.json({ error: "요청 본문이 올바른 JSON 형식이 아닙니다." }, { status: 400 });
    }

    // repositoryUrl이 없으면 GitHub API까지 가지 않고 여기서 바로 끝낸다.
    if (!repositoryUrl || typeof repositoryUrl !== "string") {
      return Response.json({ error: "repositoryUrl이 필요합니다." }, { status: 400 });
    }

    // auth: ["user", ...]라서 유효한 JWT가 오면 ctx.userClaims에 즉시(네트워크 호출 없이) 채워진다.
    // publishable/secret 키로만 온 요청은 userClaims가 없으므로 로그인 필요로 거부한다.
    const userId = ctx.userClaims?.id;

    if (!userId) {
      return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    // 프론트 라우트 가드를 devtools로 우회해서 남의 portfolioId로 직접 요청해도,
    // 이 포트폴리오의 작성자가 아니면 여기서 막는다.
    if (portfolioId) {
      const { data: portfolio, error: portfolioError } = await ctx.supabase
        .from("portfolios")
        .select("author_id")
        .eq("project_id", portfolioId)
        .maybeSingle();

      if (portfolioError) throw portfolioError;

      if (!portfolio || portfolio.author_id !== userId) {
        return Response.json({ error: "수정 권한이 없는 포트폴리오입니다." }, { status: 403 });
      }
    }

    // 프론트에서도 같은 검증을 하지만, devtools로 우회할 수 있으니 서버에서도 한 번 더 확인한다.
    // 저장소 URL의 소유자(owner)가 연동된 GitHub 계정과 다르면 분석을 거부한다.
    try {
      const { owner } = parseGithubRepositoryUrl(repositoryUrl);

      if (!githubUsername || owner.toLowerCase() !== githubUsername.toLowerCase()) {
        return Response.json(
          { error: "입력한 GitHub 저장소 주소가 연동된 계정 소유가 아닙니다." },
          { status: 403 },
        );
      }
    } catch (error) {
      if (error instanceof GithubRepositoryUrlError) {
        return Response.json({ error: error.message }, { status: 400 });
      }

      throw error;
    }

    // 클라이언트 버튼 비활성화를 우회해도(devtools 등) 서버에서 한 번 더 쿨타임을 강제한다.
    // "계정 + 포트폴리오" 단위라, 같은 저장소라도 다른 포트폴리오에서 분석하는 건 막지 않는다.
    // 수정(edit) 페이지는 project_id로 구분하고, 아직 project_id가 없는 등록(신규) 페이지는 저장소 URL로 구분한다.
    const cooldownScope = portfolioId ? `portfolio:${portfolioId}` : repositoryUrl;

    try {
      await assertCooldownReady(ctx.supabase, userId, "analyze", cooldownScope);
    } catch (error) {
      if (error instanceof CooldownActiveError) {
        return Response.json({ error: error.message }, { status: 429 });
      }

      throw error;
    }

    const githubToken = Deno.env.get("GITHUB_TOKEN");

    if (!githubToken) {
      return Response.json({ error: "GITHUB_TOKEN이 설정되지 않았습니다." }, { status: 500 });
    }

    try {
      const githubData = await collectGithubRepositoryData(repositoryUrl, githubToken, githubUsername);

      const formContextPrompt = createFormContextPrompt(formData ?? {});
      const commitBatchPrompts = createCommitBatchPrompts(githubData.commits);
      const structurePrompt = createStructurePrompt({
        fileTree: githubData.fileTree,
        languages: githubData.languages,
        readme: githubData.readme,
      });

      // 폼/커밋(최대 4배치)/구조 분석 요청은 서로 결과가 필요 없는 독립적인 요청이라 동시에 보낸다.
      // Alan AI 호출 1건이 ~30초 걸려서, 순서대로 기다리면 7번 × 30초로 너무 오래 걸린다.
      const [formResult, commitResults, structureResult] = await Promise.all([
        callAlanAi(formContextPrompt),
        Promise.all(commitBatchPrompts.map(prompt => callAlanAi(prompt))),
        callAlanAi(structurePrompt),
      ]);

      const formSummary = formResult.answer;
      const commitSummaries = commitResults.map(result => result.answer);
      const structureSummary = structureResult.answer;

      const commitSummaryText = commitSummaries
        .map((summary, index) => `[커밋 분석 ${index + 1}]\n${summary}`)
        .join("\n\n");

      // 위 세 결과를 취합해 최종 JSON 생성 요청
      const finalMergePrompt = createFinalMergePrompt({
        formSummary,
        commitSummary: commitSummaryText,
        structureSummary,
      });

      const finalResult = await callAlanAi(finalMergePrompt, {
        validateJson: parsed =>
          hasAnyContent(parsed, [
            "projectSummary",
            "mainFeatures",
            "technicalFeatures",
            "projectStructure",
            "analyzedRole",
            "participationDetails",
          ]),
      });
      const aiAnalysisResult = parseAlanJson(finalResult.answer);

      // 이번 요청에서 실제로 어떤 client_id(이름)가 몇 번 쓰였는지 집계. 하루 100회 한도 소진 여부를 가늠하는 용도.
      const alanKeyNames = [formResult.keyName, ...commitResults.map(result => result.keyName), structureResult.keyName, finalResult.keyName];
      const alanUsage = Object.entries(
        alanKeyNames.reduce((acc, name) => {
          acc[name] = (acc[name] ?? 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      ).map(([keyName, callCount]) => ({ keyName, callCount }));

      // 분석 완료 시각은 클라이언트 시계가 아니라 서버 시계 기준으로 내려준다.
      // 프론트에서 이 값을 기준으로 재분석 쿨타임을 계산한다.
      const analyzedAt = new Date().toISOString();

      // 성공했을 때만 쿨타임을 시작시킨다 (실패한 시도까지 쿨타임을 소모시키지 않기 위해).
      await markCooldownStart(ctx.supabase, userId, "analyze", cooldownScope);

      return Response.json({ githubData, aiAnalysisResult, alanUsage, analyzedAt });
    } catch (error) {
      if (error instanceof GithubRepositoryUrlError) {
        return Response.json({ error: error.message }, { status: 400 });
      }

      if (error instanceof GithubApiError) {
        return Response.json({ error: error.message }, { status: error.status });
      }

      if (error instanceof AlanApiError) {
        return Response.json({ error: error.message }, { status: 502 });
      }

      console.error(error);

      return Response.json({ error: "GitHub 데이터 수집 또는 AI 분석 중 오류가 발생했습니다." }, { status: 500 });
    }
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Run `supabase functions serve --env-file ./supabase/.env.local`
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --header 'Content-Type: application/json' \
    --data '{"repositoryUrl":"https://github.com/raspbsb/EST_FE_13_3rd_Project"}'

*/
