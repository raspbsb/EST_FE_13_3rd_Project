import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar
        sx={{
          maxWidth: 1920,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 3 },
          position: "relative",
        }}
      >
        {/* 1. 좌측: 로고 (primary.main 색상 적용) */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ fontWeight: "bold", color: "primary.main", textDecoration: "none" }}
        >
          Portfolio+
        </Typography>

        {/* 2. 중앙: 네비게이션 4개 */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/explore" color="inherit">
            Explore
          </Button>
          <Button component={Link} to="/upload" color="inherit">
            Upload
          </Button>
          <Button component={Link} to="/mypage" color="inherit">
            MyPage
          </Button>
        </Box>

        {/* 3. 우측: 로그인 / 회원가입 (theme.js 의 primary, secondary 활용) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: "auto" }}>
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
