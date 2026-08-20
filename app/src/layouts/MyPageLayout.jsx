import { useSelector } from "react-redux";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import useNotifications from "../hooks/useNotifications";
import { supabase } from "../utils/supabase";

import Container from "@mui/material/Container";
import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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

  // 로그인하지 않은 상태
  if (user === null) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            textAlign: "center",
            bgcolor: "#fff",
            border: "1px solid secondary.main",
            borderRadius: 3,
            px: {
              mobile: 3,
              tablet: 5,
              desktop: 6,
            },
            py: {
              mobile: 5,
              tablet: 6,
              desktop: 7,
            },
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 3,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#eef4ff",
              color: "primary.main",
              fontSize: 30,
            }}
          >
            👤
          </Box>

          <Text
            component="h1"
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            로그인이 필요합니다
          </Text>

          <Text
            component="p"
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              mb: 4,
              wordBreak: "keep-all",
            }}
          >
            마이페이지의 프로젝트, 북마크, 프로필 정보를
            <br />
            확인하려면 로그인해주세요.
          </Text>

          <Stack
            direction={{ mobile: "column", tablet: "row" }}
            spacing={1.5}
            sx={{
              justifyContent: "center",
            }}
          >
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              fullWidth
              sx={{
                maxWidth: {
                  tablet: 160,
                },
                py: 1.2,
                fontWeight: 600,
              }}
            >
              로그인
            </Button>

            <Button
              component={RouterLink}
              to="/signup"
              variant="outlined"
              fullWidth
              sx={{
                maxWidth: {
                  tablet: 160,
                },
                py: 1.2,
                fontWeight: 600,
              }}
            >
              회원가입
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  // 로그인했지만 profile 정보가 없는 상태
  if (!profile) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 420,
          }}
        >
          <Text component="h1" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            프로필 정보를 불러올 수 없습니다.
          </Text>

          <Text component="p" variant="body2" color="text.secondary">
            잠시 후 다시 시도해주세요.
          </Text>
        </Box>
      </Box>
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
