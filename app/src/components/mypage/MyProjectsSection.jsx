import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

import ProjectCard from '../ProjectCard';

import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function MyProjectsSection({ mode }) {
  const { userId } = useParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const outletContext = useOutletContext();
  const profile = outletContext?.profile;

  // supabase portfolios 테이블 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('portfolios')
        .select(
          `
            *,
            portfolio_images (
              image_id,
              image_path,
              display_order,
              is_thumbnail,
              alt_text
            ),
            portfolio_tech_stacks (
              tech_stack
            )
          `,
        )
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
    <Box component="section">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {mode === 'mypage' ? (
          <>
            <Text component="h2" variant="h6">
              내 프로젝트
            </Text>
            <Link component="a" href="/mypage/projects" underline="hover" variant="subtitle2">
              View all
            </Link>
          </>
        ) : (
          <Text component="h2" variant="h6">
            {profile?.user_name}의 프로젝트
          </Text>
        )}
      </Box>
      <List>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
            mt: 1,
          }}
        >
          {projects.map(project => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </Box>
      </List>
    </Box>
  );
}
