import { supabase } from "../utils/supabase";
import { useEffect, useState, useRef } from "react";
import { Outlet, useParams } from "react-router-dom";

import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import ProfileHeader from "../components/mypage/ProfileHeader";
import ActivityStats from "../components/mypage/ActivityStats";

export default function PublicProfileLayout() {
  const { userId } = useParams();

  const [profile, setPeofile] = useState(null);
  const [loading, setLoading] = useState(true);

  const countedUserId = useRef(false);

  //profiles 데이터 조회
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single();

      if (error) {
        console.error("프로필 조회 실패:", error);
        setProfile(null);
        setLoading(false);
        return;
      }
      // 프로필 조회수 중복 증가 방지 / 같은 프로필은 한 번만 조회수 증가
      if (countedUserId.current !== userId) {
        countedUserId.current = userId;

        const { error: viewError } = await supabase.rpc("increment_profile_view", {
          p_user_id: userId,
        });

        if (viewError) {
          console.error("프로필 조회수 증가 실패:", viewError);
        }
      }

      // 증가된 조회수를 화면 데이터에도 반영
      setPeofile({
        ...data,
        profile_view: (data.profile_view ?? 0) + 1,
      });

      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  //로딩 화면
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return <Box sx={{ py: 10 }}>프로필을 찾을 수 없습니다.</Box>;
  }

  return (
    <>
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
        <ProfileHeader mode="public" profile={profile} />

        <ActivityStats mode="public" profile={profile} />

        <Outlet context={{ profile }} />
      </Container>
    </>
  );
}
