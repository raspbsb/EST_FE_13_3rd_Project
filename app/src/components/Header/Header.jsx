import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, Avatar, IconButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

/**
 * Header
 * - 중앙 Tabs 레이아웃 유지
 * - 우측: 로그인/회원가입 또는 로그인 시 아바타 + 로그아웃 버튼 표시
 * - Supabase auth 상태를 구독하여 로그인/로그아웃 시 자동 갱신
 */
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = ["/", "/gallery", "/portfolios/new", "/mypage"].includes(location.pathname)
    ? location.pathname
    : false;

  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        const u = data?.user ?? null;
        setUser(u);
        const url = u?.user_metadata?.avatar_url || u?.user_metadata?.avatar || u?.user_metadata?.picture || "";
        setAvatarUrl(url || "");
      } catch (err) {
        console.error("Header getUser error:", err);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      const url = u?.user_metadata?.avatar_url || u?.user_metadata?.avatar || u?.user_metadata?.picture || "";
      setAvatarUrl(url || "");
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const isLoggedIn = !!user;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("Sign out error:", error);
        // optionally show a UI toast here
      } else {
        // onAuthStateChange will update header state; navigate to home
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar
        disableGutters
        sx={{
          maxWidth: 1272,
          width: "100%",
          mx: "auto",
          px: { xs: 2, tablet: 3, desktop: 0 },
          position: "relative",
        }}
      >
        {/* 1. 좌측: 로고 */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ fontWeight: "bold", color: "primary.main", textDecoration: "none", ml: 2 }}
        >
          Portfolio+
        </Typography>

        {/* 중앙: Tabs */}
        <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Tabs value={currentTab} textColor="primary" indicatorColor="primary">
            <Tab disableRipple label="Home" component={Link} to="/" value="/" />
            <Tab disableRipple label="Gallery" component={Link} to="/gallery" value="/gallery" />
            <Tab disableRipple label="Upload" component={Link} to="/portfolios/new" value="/portfolios/new" />
            <Tab disableRipple label="MyPage" component={Link} to="/mypage" value="/mypage" />
          </Tabs>
        </Box>

        {/* 우측: 로그인 / 회원가입 또는 프로필 + 로그아웃 */}
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1, pr: 2 }}>
          {isLoggedIn ? (
            <>
              <IconButton component={Link} to="/mypage" aria-label="마이페이지" size="large" sx={{ p: 0 }}>
                {avatarUrl ? (
                  <Avatar src={avatarUrl} alt="프로필" sx={{ width: 40, height: 40 }} />
                ) : (
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <AccountCircleIcon />
                  </Avatar>
                )}
              </IconButton>

              <Button
                onClick={handleSignOut}
                variant="outlined"
                color="primary"
                size="small"
                disabled={signingOut}
                sx={{ textTransform: "none", ml: 0.5 }}
              >
                {signingOut ? "로그아웃..." : "로그아웃"}
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" variant="outlined" color="primary">
                로그인
              </Button>
              <Button component={Link} to="/signup" variant="contained" color="primary">
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
