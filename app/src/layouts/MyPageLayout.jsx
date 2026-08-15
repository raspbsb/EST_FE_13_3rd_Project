import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "@mui/material/Container";

import ProfileHeader from "../components/mypage/ProfileHeader";
import ActivityStats from "../components/mypage/ActivityStats";
import ProfileNav from "../components/mypage/ProfileNav";
import MobileProfileNav from "../components/mypage/MobileProfileNav";

export default function MyPageLayout() {
  const { user } = useSelector(state => state.user);

  //프로필 상태 관리
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
