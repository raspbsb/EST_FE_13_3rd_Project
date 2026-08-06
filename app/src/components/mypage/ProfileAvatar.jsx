import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

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

{
  /* 프로필 이미지 업로드 */
}
export default function ProfileAvatar() {
  const image = null;

  return (
    <Box
      sx={{
        width: '191px',
        height: '192px',
        position: 'relative',
      }}
    >
      {image ? (
        <Box
          component='img'
          src={''}
          alt='프로필 이미지'
          sx={{
            width: '191px',
            height: '192px',
            borderRadius: '50%',
            border: '1px solid #e0e0e0',
            objectFit: 'cover',
          }}
        />
      ) : (
        <AccountCircleIcon
          sx={{
            width: '191px',
            height: '192px',
            borderRadius: '50%',
            border: '1px solid #e0e0e0',
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
  );
}
