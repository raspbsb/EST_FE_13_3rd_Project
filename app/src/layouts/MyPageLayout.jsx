import { Outlet } from 'react-router-dom';

import Container from '@mui/material/Container';
import ProfileHeader from '../components/mypage/ProfileHeader';
import ActivityStats from '../components/mypage/ActivityStats';
import ProfileNav from '../components/mypage/ProfileNav';

export default function MyPageLayout() {
  return (
    <>
      <ProfileNav />
      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: '1272px',
          mx: 'auto',
        }}
      >
        <ProfileHeader mode="mypage" />
        <ActivityStats />

        <Outlet />
      </Container>
    </>
  );
}
