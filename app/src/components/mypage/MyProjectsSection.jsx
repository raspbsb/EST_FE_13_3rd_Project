import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function MyProjectsSection({ mode }) {
  const { userId } = useParams();

  const { profile } = useOutletContext();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // supabase portfolios 테이블 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('author_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('프로젝트 조회 실패', error);
        setLoading(false);
        return;
      }

      setProjects(data);
      setLoading(false);
    };
    fetchProducts();
  }, [userId]);

  return (
    <Box component="section" sx={{}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {mode === 'mypage' ? (
          <>
            <Text component="h2" variant="h6">
              내 프로젝트
            </Text>
            <Link component="button" href="/mypage/projects" underline="hover" variant="subtitle2">
              View all
            </Link>
          </>
        ) : (
          <Text component="h2" variant="h6">
            {profile.user_name}의 프로젝트
          </Text>
        )}
      </Box>
      <List>
        {projects.map(project => (
          <Box key={project.project_id}>
            <Text>{project.title}</Text>
            <Text>{project.summary}</Text>
          </Box>
        ))}
      </List>
    </Box>
  );
}
