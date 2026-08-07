import { Outlet } from 'react-router-dom';

import ProfileHeader from '../components/mypage/ProfileHeader';
import ActivityStats from '../components/mypage/ActivityStats';
import ProfileNav from '../components/mypage/ProfileNav';

export default function MyPageLayout() {
  return (
    <>
      <ProfileNav />
      <ProfileHeader mode='mypage' />
      <ActivityStats />

      <Outlet />
    </>
  );
}
