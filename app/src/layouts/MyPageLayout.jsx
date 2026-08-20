import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useNotifications from "../hooks/useNotifications";
import { supabase } from "../utils/supabase";

import Container from "@mui/material/Container";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Stack } from "@mui/material";

import ProfileHeader from "../components/mypage/ProfileHeader";
import ActivityStats from "../components/mypage/ActivityStats";
import ProfileNav from "../components/mypage/ProfileNav";
import MobileProfileNav from "../components/mypage/MobileProfileNav";

export default function MyPageLayout() {
  const { user } = useSelector(state => state.user);

  //프로필 상태 관리
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const notificationState = useNotifications();

  //Redux에서 profile이 들어오면 local state에 넣기
  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Supabase profiles 테이블에서 현재 로그인한 유저의 프로필 조회
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();

      if (error) {
        console.error("프로필 조회 실패:", error);
      }

      // DB에 데이터가 있으면 넣고, 없으면 기본 객체 생성
      setProfile(data || { user_id: user.id, is_public: true });
      setLoading(false);
    }

    fetchProfile();
  }, [user?.id]);

  if (loading) {
    return null;
  }

  if (!profile) {
    return (
      <div>
        <Text color="text.primary">프로필 정보를 불러올 수 없습니다.</Text>
        <Link
          href="/login"
          underline="hover"
          sx={{
            display: "flex",
            mt: 1,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          로그인 하기
        </Link>
      </div>
    );
  }

  return (
    <>
      <ProfileNav notificationState={notificationState} />

      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: "1272px",
          mx: "auto",

          px: {
            mobile: 2,
            tablet: 3,
            desktop: 0,
          },

          py: {
            mobile: 3,
            tablet: 4,
            desktop: 6,
          },

          pb: {
            mobile: 10,
            tablet: 7,
            desktop: 6,
          },
        }}
      >
        <Stack>
          <ProfileHeader mode="mypage" profile={profile} onProfileUpdate={setProfile} />

          <ActivityStats profile={profile} />

          <Outlet context={{ profile, notificationState }} />
        </Stack>
      </Container>

      <MobileProfileNav notificationState={notificationState} />
    </>
  );
}
