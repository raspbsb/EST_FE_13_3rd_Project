// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { AlanApiError, callAlanAi, parseAlanJson } from "../_shared/alan.ts";
import { collectGithubRepositoryData, GithubApiError, GithubRepositoryUrlError } from "../_shared/github.ts";
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
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async req => {
    let repositoryUrl: string | undefined;
    let formData: PortfolioFormContext | undefined;

    // 요청 본문이 JSON 형식이 아니면 500이 아니라 400으로 명확히 구분한다.
    try {
      ({ repositoryUrl, formData } = await req.json());
    } catch {
      return Response.json({ error: "요청 본문이 올바른 JSON 형식이 아닙니다." }, { status: 400 });
    }

    // repositoryUrl이 없으면 GitHub API까지 가지 않고 여기서 바로 끝낸다.
    if (!repositoryUrl || typeof repositoryUrl !== "string") {
      return Response.json({ error: "repositoryUrl이 필요합니다." }, { status: 400 });
    }

    const githubToken = Deno.env.get("GITHUB_TOKEN");

    // 개발 확인용 콘솔 : 어떤 저장소 URL로 요청이 들어왔는지 확인
    console.log("[analyze] repositoryUrl:", repositoryUrl);

    if (!githubToken) {
      return Response.json({ error: "GITHUB_TOKEN이 설정되지 않았습니다." }, { status: 500 });
    }

    try {
      const githubData = await collectGithubRepositoryData(repositoryUrl, githubToken);

      // 개발 확인용 콘솔 : GitHub에서 실제로 수집된 데이터 형태 확인
      console.log("[analyze] githubData:", JSON.stringify(githubData, null, 2));

      const formContextPrompt = createFormContextPrompt(formData ?? {});
      const commitBatchPrompts = createCommitBatchPrompts(githubData.commits);
      const structurePrompt = createStructurePrompt({
        fileTree: githubData.fileTree,
        languages: githubData.languages,
        readme: githubData.readme,
      });

      // 개발 확인용 콘솔 : 실제로 Alan AI에 보낼 프롬프트가 900자 예산 안에서 잘 조립됐는지 확인
      console.log("[analyze] formContextPrompt:", formContextPrompt);
      console.log("[analyze] commitBatchPrompts:", commitBatchPrompts);
      console.log("[analyze] structurePrompt:", structurePrompt);

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

      console.log("[analyze] formSummary:", formSummary);
      console.log("[analyze] commitSummaries:", commitSummaries);
      console.log("[analyze] structureSummary:", structureSummary);

      const commitSummaryText = commitSummaries
        .map((summary, index) => `[커밋 분석 ${index + 1}]\n${summary}`)
        .join("\n\n");

      // 위 세 결과를 취합해 최종 JSON 생성 요청
      const finalMergePrompt = createFinalMergePrompt({
        formSummary,
        commitSummary: commitSummaryText,
        structureSummary,
      });

      console.log("[analyze] finalMergePrompt:", finalMergePrompt);

      const finalResult = await callAlanAi(finalMergePrompt);
      const aiAnalysisResult = parseAlanJson(finalResult.answer);

      // 이번 요청에서 실제로 어떤 client_id(이름)가 몇 번 쓰였는지 집계. 하루 100회 한도 소진 여부를 가늠하는 용도.
      const alanKeyNames = [formResult.keyName, ...commitResults.map(result => result.keyName), structureResult.keyName, finalResult.keyName];
      const alanUsage = Object.entries(
        alanKeyNames.reduce((acc, name) => {
          acc[name] = (acc[name] ?? 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      ).map(([keyName, callCount]) => ({ keyName, callCount }));

      console.log("[analyze] aiAnalysisResult:", aiAnalysisResult);
      console.log("[analyze] alanUsage:", alanUsage);

      return Response.json({ githubData, aiAnalysisResult, alanUsage });
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
