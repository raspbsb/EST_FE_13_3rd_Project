import MyProjectsSection from '../components/mypage/MyProjectsSection';
import BookmarkSection from '../components/mypage/BookmarkSection';
import ContactSection from '../components/mypage/ContactSection';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function Profile({ mode }) {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
      }}
    >
      <MyProjectsSection mode={mode} />

      {mode === 'mypage' && (
        <Container sx={{ display: 'flex', gap: 3, justifyContent: 'center' }} disableGutters>
          <BookmarkSection />
          <ContactSection />
        </Container>
      )}
    </Box>
  );
}
