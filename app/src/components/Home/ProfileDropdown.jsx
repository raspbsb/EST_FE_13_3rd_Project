import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";

import { Box, Typography, Avatar, Popover, Button, IconButton } from "@mui/material";

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.auth?.user);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleNavigateMyPage = () => {
    handleCloseMenu();
    navigate("/mypage");
  };

  const handleSignOut = async () => {
    handleCloseMenu();
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err.message);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "inline-block" }}>
      <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
        <Avatar
          src={user?.user_metadata?.avatar_url || user?.avatar_url}
          alt={user?.user_metadata?.full_name || "User Profile"}
          sx={{ width: 48, height: 48 }}
        >
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </Avatar>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        SlotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width: "140px",
              padding: "16px 12px",
              borderRadius: "12px",
              boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.12)",
              border: "1px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              backgroundColor: "#FFFFFF",
            },
          },
        }}
      >
        <Avatar
          src={user?.user_metadata?.avatar_url || user?.avatar_url}
          sx={{ width: 48, height: 48, mb: 1 }}
        >
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            fontSize: "0.75rem",
            mb: 1.5,
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User Name"}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={handleNavigateMyPage}
          sx={{
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            fontSize: "0.725rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "6px",
            py: 0.5,
            mb: 0.75,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#1D4ED8",
              boxShadow: "none",
            },
          }}
        >
          MyPage
        </Button>
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={handleSignOut}
          sx={{
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            fontSize: "0.725rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "6px",
            py: 0.5,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#DC2626",
              boxShadow: "none",
            },
          }}
        >
          Sign Out
        </Button>
      </Popover>
    </Box>
  );
}