import { useState } from 'react';
import TagChip from '../TagChip';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Text from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormLabel from '@mui/material/FormLabel';

import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';

export default function EditDialog({ open, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // 소개글 글자 수 상태관리
  const [bio, setBio] = useState('');
  // 기술 스택 상태관리
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  // 스택 입력값
  const handleSkillChange = e => {
    setSkillInput(e.target.value);
  };

  //엔터 누르면 chip 추가
  const handleSkillKeyDown = e => {
    if (e.key !== 'Enter') return;

    e.preventDefault();

    const value = skillInput.trim();

    if (!value) return;

    // 중복 방지
    if (skills.includes(value)) {
      setSkillInput('');
      return;
    }

    setSkills(prev => [...prev, value]);
    setSkillInput('');
  };

  //chip 삭제
  const handleDeleteSkill = skill => {
    setSkills(prev => prev.filter(item => item !== skill));
  };

  // 폼 전송 이벤트 (MUI 예제 임시로 복붙)
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);
    onClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='프로필 수정 모달'
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {'프로필 수정'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit} id='profile-form' variant='subtitle2'>
          <Stack spacing={2}>
            <Box>
              <FormLabel required>이름</FormLabel>
              <TextField label='이름' placeholder='이름을 작성해주세요.' fullWidth required />
            </Box>

            <Box>
              <FormLabel required>직군</FormLabel>
              <TextField label='직군' placeholder='직군을 입력해주세요.' fullWidth required />
            </Box>

            <Box>
              <FormLabel>소개글</FormLabel>
              <TextField
                label='소개글'
                placeholder='소개글을 입력해주세요. (최대 100자)'
                multiline
                rows={5}
                inputProps={{ maxLength: 100 }}
                fullWidth
                value={bio}
                onChange={e => setBio(e.target.value)}
                inputProps={{
                  maxLength: 100,
                }}
              />
              <Text variant='caption' align='right' sx={{ display: 'block' }}>
                {bio.length}/100
              </Text>
            </Box>

            <Box>
              <FormLabel sx={{ p: '10px' }}>기술 스택</FormLabel>
              <TextField
                label='기술 스택'
                placeholder='기술을 입력하고 엔터를 눌러주세요.'
                fullWidth
                value={skillInput}
                onChange={handleSkillChange}
                onKeyDown={handleSkillKeyDown}
              />
              <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap' sx={{ pt: '10px' }}>
                {skills.map(skill => (
                  <TagChip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill)} />
                ))}
              </Stack>
            </Box>

            <Box>
              <FormLabel>이메일</FormLabel>
              <TextField label='이메일' placeholder='이메일을 작성해주세요.' fullWidth />
            </Box>

            <Box>
              <FormLabel>개인 사이트</FormLabel>
              <Stack direction='row' spacing={2}>
                <TextField label='개인 사이트1' placeholder='사이트 URL을 입력해주세요.' fullWidth />
                <TextField label='개인 사이트2' placeholder='사이트 URL을 입력해주세요.' fullWidth />
              </Stack>
            </Box>

            {/* 활동 내역 공개 여부 */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '56px',
                  bgcolor: '#fff',
                  border: '1px solid #f0f0f0',
                }}
              >
                <FormControlLabel control={<Switch />} label='활동 내역 비공개 설정' />
                <LockIcon color='primary' />
              </Box>
            </Box>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button variant='contained' type='submit' form='profile-form' onClick={onClose} autoFocus>
          적용하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// 기존 프로필 내용 불러오기
// 입력값 저장
// 적용 버튼 클릭하면 수정된 데이터 화면에 출력

// 기술 스택 항목 공통 컴포넌트로 분리
