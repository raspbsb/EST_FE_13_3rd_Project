import { supabase } from '../utils/supabase';
import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import ProfileHeader from '../components/mypage/ProfileHeader';
import ActivityStats from '../components/mypage/ActivityStats';

export default function PublicProfileLayout() {
  const { userId } = useParams();

  const [profile, setPeofile] = useState(null);
  const [loading, setLoading] = useState(true);

  //profiles 데이터 조회
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();

      if (error) {
        console.error('프로필 조회 실패:', error);
        setProfile(null);
      } else {
        setPeofile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  //로딩 화면
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return <div>프로필을 찾을 수 없습니다.</div>;
  }

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
