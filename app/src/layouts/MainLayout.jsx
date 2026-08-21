import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer/Footer";

import Box from "@mui/material/Box";
import AuthProfileSync from "../contexts/AuthProfileSync";

export default function MainLayout() {
  // TODO: Supabase 인증 연동 후 isLoggedIn, avatarUrl을 실제 사용자 정보로 교체
  const isLoggedIn = false;
  const avatarUrl = "";

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Header isLoggedIn={isLoggedIn} avatarUrl={avatarUrl} />
      <AuthProfileSync />
      <main>
        <Outlet />
      </main>

      <Footer />
    </Box>
  );
}
