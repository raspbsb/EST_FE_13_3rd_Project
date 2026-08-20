// Supabase Edge Function 호출 에러에서 실제 서버 메시지를 최대한 뽑아내는 함수.
// supabase.functions.invoke()가 non-2xx 응답을 받으면 error.message는
// "Edge Function returned a non-2xx status code" 같은 의미 없는 문구로 고정되고,
// 실제 서버가 보낸 에러 메시지(예: Alan AI 실패 사유)는 error.context(Response)에 JSON으로 들어있다.
export const getEdgeFunctionErrorMessage = async error => {
  if (error?.context && typeof error.context.json === "function") {
    try {
      const body = await error.context.json();

      if (body?.error) return body.error;
    } catch {
      // 응답 본문이 JSON이 아니면 아래 기본 메시지로 폴백한다.
    }
  }

  return error?.message ?? "알 수 없는 오류가 발생했습니다.";
};
