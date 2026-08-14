import { supabase } from "../utils/supabase";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "@mui/material/Container";

import ProfileHeader from "../components/mypage/ProfileHeader";
import ActivityStats from "../components/mypage/ActivityStats";
import ProfileNav from "../components/mypage/ProfileNav";
import MobileProfileNav from "../components/mypage/MobileProfileNav";

export default function MyPageLayout() {
  //프로필 상태 관리
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProfile = async () => {
      setLoading(true);

      // 현재 로그인한 사용자 가져오기
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("로그인 사용자 조회 실패:", authError);
        setProfile(null);
        setLoading(false);
        return;
      }

      // 로그인 사용자와 연결된 profile 조회
      const { data, error: profileError } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();

      if (profileError) {
        console.error("프로필 조회 실패:", profileError);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchMyProfile();
  }, []);

  if (loading) {
    return null;
  }

  if (!profile) {
    return <div>프로필 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <>
      <ProfileNav />

      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: "1272px",
          mx: "auto",
          py: 6,

          "@media (max-width: 767px)": {
            pb: 7,
          },
        }}
      >
        <ProfileHeader mode="mypage" profile={profile} onProfileUpdate={setProfile} />

        <ActivityStats profile={profile} />

        <Outlet context={{ profile }} />
      </Container>

      <MobileProfileNav />
    </>
  );
}
