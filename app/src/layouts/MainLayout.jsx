import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  // TODO: Supabase 인증 연동 후 isLoggedIn, avatarUrl을 실제 사용자 정보로 교체
  const isLoggedIn = false;
  const avatarUrl = "";

  return (
    <>
      <Header isLoggedIn={isLoggedIn} avatarUrl={avatarUrl} />

      <main>
        <Outlet />
      </main>

      <footer>Footer</footer>
    </>
  );
}
