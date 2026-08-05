import ProfileNav from '../components/mypage/ProfileNav';
import ProfileHeader from '../components/mypage/ProfileHeader';
import ActivityStats from '../components/mypage/ActivityStats';
import MyProjects from '../components/mypage/MyProjects';
import BookmarkSection from '../components/mypage/BookmarkSection';
import ContactSection from '../components/mypage/ContactSection';

export default function Profile({ mode }) {
  return (
    <>
      {mode === 'mypage' && <ProfileNav />}

      <main>
        <ProfileHeader mode={mode} />

        <ActivityStats />

        <MyProjects />

        {mode === 'mypage' && (
          <>
            <BookmarkSection />
            <ContactSection />
          </>
        )}
      </main>
    </>
  );
}
