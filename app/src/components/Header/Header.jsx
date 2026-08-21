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
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

import { HEADER_AUTH_PATHS, HEADER_NAV_ITEMS } from "../../constants/header";
import styles from "./Header.module.css";

/**
 * Responsive Header:
 * - Desktop: logo left, tabs centered, avatar right
 * - Mobile: hamburger left, logo centered, avatar right
 *
 * Profile displayName: prefer profiles.user_name (from Redux). Fallbacks to user metadata or email.
 * Avatar URL resolution priority:
 *  1) profiles.avatar_path (Redux) -> getPublicUrl
 *  2) auth.user.user_metadata fields (avatar_url/avatar/picture)
 *  3) fallback avatar graphic
 */
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentTab = ["/", "/gallery", "/portfolios/new", "/mypage"].includes(location.pathname)
    ? location.pathname
    : false;

  // auth user from supabase
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // profile menu anchor
  const menuOpen = Boolean(anchorEl);
  const avatarBtnRef = useRef(null);

  // mobile nav menu
  const [mobileNavAnchor, setMobileNavAnchor] = useState(null);
  const mobileNavOpen = Boolean(mobileNavAnchor);

  // Redux stored profile (should be filled by fetchUser in app startup)
  const reduxUser = useSelector(state => state.user.user);
  const profileFromStore = reduxUser?.profile ?? null;

  // subscribe to auth once to populate user state
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        const u = data?.user ?? null;
        setUser(u);
        // don't set avatarUrl directly here; rely on profileFromStore or metadata in separate effect
      } catch (err) {
        console.error("Header getUser error:", err);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // Resolve avatar URL: prefer profiles.avatar_path (Redux) then auth metadata
  useEffect(() => {
    let mounted = true;

    async function resolveAvatarUrl() {
      try {
        // 1) profile avatar path from profiles table (Redux)
        const avatarPath = profileFromStore?.avatar_path;
        if (avatarPath) {
          // getPublicUrl (works for public bucket)
          try {
            const { data } = supabase.storage.from("profile_avatars").getPublicUrl(avatarPath);
            if (mounted && data?.publicUrl) {
              setAvatarUrl(data.publicUrl);
              return;
            }
            // If no publicUrl, try signed url as fallback (optional)
            const { data: signed, error: signError } = await supabase.storage
              .from("profile_avatars")
              .createSignedUrl(avatarPath, 60); // 60s signed url
            if (mounted && signed?.signedUrl && !signError) {
              setAvatarUrl(signed.signedUrl);
              return;
            }
          } catch (e) {
            console.warn("Failed to resolve avatar from storage:", e);
          }
        }

        // 2) fallback to auth user metadata fields
        const metaUrl =
          user?.user_metadata?.avatar_url || user?.user_metadata?.avatar || user?.user_metadata?.picture || "";
        if (mounted) setAvatarUrl(metaUrl || "");
      } catch (err) {
        console.error("resolve avatar url error:", err);
        if (mounted) setAvatarUrl("");
      }
    }

    resolveAvatarUrl();

    return () => {
      mounted = false;
    };
  }, [profileFromStore?.avatar_path, user]);

  const isLoggedIn = !!user;

  // displayName resolution: profiles.user_name (Redux) preferred
  const displayName =
    profileFromStore?.user_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.displayName ||
    user?.email ||
    "User";
  const displayEmail = user?.email || "";

  // Profile menu handlers
  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
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

  // Mobile nav handlers
  const openMobileNav = event => {
    setMobileNavAnchor(event.currentTarget);
  };
  const closeMobileNav = () => {
    setMobileNavAnchor(null);
  };
  const handleMobileNavClick = path => {
    closeMobileNav();
    navigate(path);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar
        disableGutters
        sx={{ maxWidth: 1272, width: "100%", mx: "auto", position: "relative", px: { xs: 1, sm: 2 } }}
      >
        {isMobile ? (
          // Mobile layout: hamburger | centered logo | avatar
          <>
            <IconButton aria-label="menu" onClick={openMobileNav} size="large" sx={{ ml: 1 }}>
              <MenuIcon />
            </IconButton>

            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ fontWeight: "bold", color: "primary.main", textDecoration: "none" }}
              >
                Portfolio+
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
              {isLoggedIn ? (
                <IconButton
                  ref={avatarBtnRef}
                  aria-controls={menuOpen ? "profile-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? "true" : undefined}
                  onClick={e => (menuOpen ? handleCloseMenu() : handleOpenMenu(e))}
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
              ) : (
                <>
                  <Button
                    component={Link}
                    to={HEADER_AUTH_PATHS.login}
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    로그인
                  </Button>
                  <Button component={Link} to={HEADER_AUTH_PATHS.signup} variant="contained" color="primary">
                    회원가입
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile nav menu */}
            <Menu
              anchorEl={mobileNavAnchor}
              open={mobileNavOpen}
              onClose={closeMobileNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              {HEADER_NAV_ITEMS.map(item => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleMobileNavClick(item.path)}
                  component={Link}
                  to={item.path}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          // Desktop layout
          <>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ fontWeight: "bold", color: "primary.main", textDecoration: "none", ml: 2 }}
            >
              Portfolio+
            </Typography>

            <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              <Tabs value={currentTab} textColor="primary" indicatorColor="primary">
                <Tab disableRipple label="Home" component={Link} to="/" value="/" />
                <Tab disableRipple label="Gallery" component={Link} to="/gallery" value="/gallery" />
                <Tab disableRipple label="Upload" component={Link} to="/portfolios/new" value="/portfolios/new" />
                <Tab disableRipple label="MyPage" component={Link} to="/mypage" value="/mypage" />
              </Tabs>
            </Box>

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
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
