import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useNotifications from "../hooks/useNotifications";

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
    if (user?.profile) {
      setProfile(user.profile);
      setLoading(false);
    } else if (user === null) {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

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
