import MyProjectsSection from '../components/mypage/MyProjectsSection';
import BookmarkSection from '../components/mypage/BookmarkSection';
import ContactSection from '../components/mypage/ContactSection';

import Container from '@mui/material/Container';

export default function Profile({ mode }) {
  return (
    <main>
      <MyProjectsSection mode={mode} />

      {mode === 'mypage' && (
        <Container sx={{ display: 'flex', gap: 3, justifyContent: 'center' }} disableGutters>
          <BookmarkSection />
          <ContactSection />
        </Container>
      )}
    </main>
  );
}
