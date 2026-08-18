// 인증(로그인/계정 연동) 관련 Supabase Auth 요청을 모아둔 서비스 모듈

import { supabase } from "../utils/supabase";

// 현재 로그인 계정에 GitHub id가 연동되어 있는지 확인
// GitHub 로그인으로 접속한 계정뿐 아니라, 이메일/구글/카카오/네이버로 로그인한 뒤
// GitHub을 별도로 연동(linkIdentity)한 계정도 true를 반환한다.
export const getIsGithubLinked = async () => {
  const { data, error } = await supabase.auth.getUserIdentities();

  if (error) throw error;

  return data.identities.some(identity => identity.provider === "github");
};

// 현재 로그인 계정에 연동된 GitHub 사용자명을 가져온다. 연동 안 돼 있으면 null.
// 저장소 분석 시 "입력한 저장소 URL의 소유자 = 연동된 본인 계정"인지 확인하는 용도로 쓴다.
export const getLinkedGithubUsername = async () => {
  const { data, error } = await supabase.auth.getUserIdentities();

  if (error) throw error;

  const githubIdentity = data.identities.find(identity => identity.provider === "github");

  return githubIdentity?.identity_data?.user_name ?? githubIdentity?.identity_data?.preferred_username ?? null;
};

// 현재 로그인 계정에 GitHub id를 연동한다.
// 호출 즉시 브라우저가 GitHub 인증 페이지로 이동하고, 인증이 끝나면 redirectTo로 돌아온다.
export const linkGithubIdentity = async ({ redirectTo }) => {
  const { error } = await supabase.auth.linkIdentity({
    provider: "github",
    options: { redirectTo },
  });

  if (error) throw error;
};
