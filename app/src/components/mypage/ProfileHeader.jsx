import { styled } from '@mui/material/styles';
import theme from '../../styles/theme';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Text from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ProfileHeader({ mode }) {
  const skills = ['React', 'TypeScript', 'Supabase', 'Tailwind', 'Next.js'];

  const image = null;

  //수정 모달 함수 띄우기
  const handleEdit = () => {};

  //프로필 이미지 업로드 부분 컴포넌트 분리 할 예정.
  //프로필 임시데이터 하나 생성하기.

  return (
    <Box component='section' sx={{ display: 'flex', gap: 2 }}>
      {/* 프로필 이미지 업로드 */}
      <Box
        sx={{
          position: 'relative',
          height: '191px',
        }}
      >
        {image ? (
          <Box
            component='img'
            src={''}
            alt='프로필 이미지'
            sx={{
              width: 191,
              height: '191',
              borderRadius: 9999,
              border: '1px solid #aaa', //색상 나중에 수정
              objectFit: 'cover',
            }}
          />
        ) : (
          <AccountCircleIcon
            sx={{
              width: 191,
              height: 191,
            }}
          />
        )}

        {/* <img src='' alt='' /> */}
        <IconButton
          component='label'
          aria-label='add Profile image'
          sx={{
            width: 45,
            height: 45,
            background: '#fff',
            border: '1px solid #aaa', //색상 나중에 수정
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
        >
          <VisuallyHiddenInput type='file' onChange={event => console.log(event.target.files)} multiple />
          <AddAPhotoIcon />
        </IconButton>
      </Box>

      {/* 프로필 info */}
      <Box>
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
          {skills.map(s => (
            <Chip
              key={s}
              label={s}
              variant='caption'
              color='primary'
              sx={{
                borderRadius: '12px',
                height: 30,
              }}
            />
          ))}
        </Stack>

        {/* 컨택 URL */}
        <List sx={{ display: 'inline-flex', paddingTop: 2, gap: 3 }}>
          <ListItem sx={{ padding: 0 }}>
            <EmailIcon fontSize='small' />
            <Text component={'a'} href={null} variant='Subtitle1'>
              portfoliop@gmail.com
            </Text>
          </ListItem>
          <ListItem sx={{ padding: 0 }}>
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
