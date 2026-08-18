import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography as MuiTypography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

import { HEADER_AUTH_PATHS, HEADER_NAV_ITEMS } from "../../constants/header";
import styles from "./Header.module.css";

/**
 * Header with hover / click profile menu
 */
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = ["/", "/gallery", "/portfolios/new", "/mypage"].includes(location.pathname)
    ? location.pathname
    : false;

  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // anchor for menu
  const menuOpen = Boolean(anchorEl);
  const avatarBtnRef = useRef(null);

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
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.displayName ||
    user?.email ||
    "User";
  const displayEmail = user?.email || "";

  // open menu (hover or click)
  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  // close menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // onAuthStateChange will clear user and menu; optionally navigate home
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      handleCloseMenu();
    }
  };

  const handleSettings = () => {
    handleCloseMenu();
    navigate("/settings");
  };

  const handleProfile = () => {
    handleCloseMenu();
    navigate("/mypage");
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar disableGutters sx={{ maxWidth: 1272, width: "100%", mx: "auto", position: "relative" }}>
        {/* 1. 좌측: 로고 */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ fontWeight: "bold", color: "primary.main", textDecoration: "none", ml: 2 }}
        >
          Portfolio+
        </Typography>

        {/* 2. 중앙: Tabs */}
        <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Tabs value={currentTab} textColor="primary" indicatorColor="primary">
            <Tab disableRipple label="Home" component={Link} to="/" value="/" />
            <Tab disableRipple label="Gallery" component={Link} to="/gallery" value="/gallery" />
            <Tab disableRipple label="Upload" component={Link} to="/portfolios/new" value="/portfolios/new" />
            <Tab disableRipple label="MyPage" component={Link} to="/mypage" value="/mypage" />
          </Tabs>
        </Box>

        {/* 3. 우측: 로그인 / 회원가입 또는 프로필 + 메뉴 */}
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1, pr: 2 }}>
          {isLoggedIn ? (
            <>
              <IconButton
                ref={avatarBtnRef}
                aria-controls={menuOpen ? "profile-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
                onClick={e => (menuOpen ? handleCloseMenu() : handleOpenMenu(e))}
                onMouseEnter={handleOpenMenu}
                size="large"
                sx={{ p: 0 }}
              >
                {avatarUrl ? (
                  <Avatar src={avatarUrl} alt="프로필" sx={{ width: 40, height: 40 }} />
                ) : (
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <AccountCircleIcon />
                  </Avatar>
                )}
              </IconButton>

              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
                MenuListProps={{
                  onMouseLeave: handleCloseMenu,
                  "aria-labelledby": "profile-avatar",
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1,
                    minWidth: 220,
                    borderRadius: 1,
                    overflow: "hidden",
                  },
                }}
              >
                {/* Top user info */}
                <Box sx={{ px: 2, py: 1.25 }}>
                  <MuiTypography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {displayName}
                  </MuiTypography>
                  {displayEmail && (
                    <MuiTypography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                      {displayEmail}
                    </MuiTypography>
                  )}
                </Box>

                <Divider />

                <MenuItem onClick={handleSettings}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <PersonOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleSignOut}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Sign Out</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to={HEADER_AUTH_PATHS.login} variant="outlined" color="primary">
                로그인
              </Button>
              <Button component={Link} to={HEADER_AUTH_PATHS.signup} variant="contained" color="primary">
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
