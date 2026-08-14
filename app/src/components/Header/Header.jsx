import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const currentTab = ["/", "/gallery", "/portfolios/new", "/mypage"].includes(location.pathname)
    ? location.pathname
    : false;

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
          sx={{ fontWeight: "bold", color: "primary.main", textDecoration: "none" }}
        >
          Portfolio+
        </Typography>

        {/* 2. 중앙: 기본 MUI Tabs (Ripple 효과만 깔끔하게 제거) */}
        <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Tabs value={currentTab} textColor="primary" indicatorColor="primary">
            <Tab disableRipple label="Home" component={Link} to="/" value="/" />
            <Tab disableRipple label="Gallery" component={Link} to="/gallery" value="/gallery" />
            <Tab disableRipple label="Upload" component={Link} to="/portfolios/new" value="/portfolios/new" />
            <Tab disableRipple label="MyPage" component={Link} to="/mypage" value="/mypage" />
          </Tabs>
        </Box>

        {/* 3. 우측: 로그인 / 회원가입 */}
        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button component={Link} to="/login" variant="outlined" color="primary">
            로그인
          </Button>
          <Button component={Link} to="/signup" variant="contained" color="primary">
            회원가입
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
