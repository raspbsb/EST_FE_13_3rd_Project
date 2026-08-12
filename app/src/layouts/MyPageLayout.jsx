import { Outlet } from 'react-router-dom';

import Container from '@mui/material/Container';

import ProfileHeader from '../components/mypage/ProfileHeader';
import ActivityStats from '../components/mypage/ActivityStats';
import ProfileNav from '../components/mypage/ProfileNav';
import { useState } from 'react';

export default function MyPageLayout() {
  //프로필 상태 관리
  const [profile, setProfile] = useState({
    user_id: '',
    avatar_path: '',
    user_name: 'User Name',
    user_category: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'Supabase', 'Tailwind', 'Next.js'],
    bio: 'Crafting highly performant, accessible, and delightful web experiences. Specializing in modern React ecosystems and scalable design systems for creative professionals.',
    email: 'portfolio@gmail.com',
    is_public: true,
    github_url: 'https://github.com/portfolio',
    url2: '',
    profile_view: 0,
  });

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
          py: 6,
        }}
      >
        <ProfileHeader mode="mypage" profile={profile} onProfileUpdate={setProfile} />

        <ActivityStats />

        <Outlet context={{ profile }} />
      </Container>
    </>
  );
}
