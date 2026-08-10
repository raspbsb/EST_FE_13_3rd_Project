import { Outlet, useParams } from 'react-router-dom';

import Container from '@mui/material/Container';

import ProfileHeader from '../components/mypage/ProfileHeader';
import ActivityStats from '../components/mypage/ActivityStats';

export default function PublicProfileLayout() {
  const { userId } = useParams();

  //임시데이터
  const profile = {
    avatar_path: null,
    user_name: 'User Name',
    user_category: 'Frontend Developer',
    bio: 'Crafting highly performant, accessible, and delightful web experiences. Specializing in modern React ecosystems and scalable design systems for creative professionals.',
    skills: ['React', 'TypeScript', 'Next.js'],
    email: 'portfolio@gmail.com',
    github_url: 'https://www.linkedin.com/in/portfolioplus/',
    url2: '',
  };

  return (
    <>
      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: '1272px',
          mx: 'auto',
        }}
      >
        <ProfileHeader mode="public" profile={profile} />

        <ActivityStats />

        <Outlet />
      </Container>
    </>
  );
}
