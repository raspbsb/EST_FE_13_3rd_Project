import ProfileAvatar from './ProfileAvatar';
import TagChip from '../TagChip';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Text from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';

export default function ProfileHeader({ mode }) {
  const skills = ['React', 'TypeScript', 'Supabase', 'Tailwind', 'Next.js'];

  const image = null;

  //수정 모달 함수 띄우기
  const handleEdit = () => {};

  return (
    <Box component='section' sx={{ display: 'flex', gap: 2 }}>
      {/* 프로필 이미지 업로드 */}
      <ProfileAvatar />

      {/* 프로필 info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Text variant='h4' fontWeight={700}>
            User Name
          </Text>
          {mode === 'mypage' && (
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <Text variant='h6'>Frontend Developer</Text>
        <Text variant='body1'>
          Crafting highly performant, accessible, and delightful web experiences. Specializing in modern React
          ecosystems and scalable design systems for creative professionals.
        </Text>

        {/* 기술 스택 */}
        <Stack direction='row' spacing={1} useFlexGap flexwrap='wrap' color='primary'>
          {skills.map(skill => (
            <TagChip key={skill} label={skill} />
          ))}
        </Stack>

        {/* 컨택 URL */}
        <List sx={{ display: 'inline-flex', paddingTop: 2, gap: 3 }}>
          <ListItem sx={{ padding: 0, width: 'auto' }}>
            <EmailIcon fontSize='small' />
            <Text component={'a'} href={null} variant='Subtitle1'>
              portfoliop@gmail.com
            </Text>
          </ListItem>
          <ListItem sx={{ padding: 0, width: 'auto' }}>
            <LinkIcon fontSize='small' />
            <Text component={'a'} href={null} variant='Subtitle1'>
              https://www.linkedin.com/in/portfolioplus/
            </Text>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
