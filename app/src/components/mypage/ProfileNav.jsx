import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";

import ContactDialog from "./ContactDialog";
import MessageDialog from "./MessageDialog";
import styles from "./ProfileNav.module.css";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function ProfileNav() {
  const { notifications, handleMessageRead, handleMessageDelete } = useNotifications();
  const location = useLocation();

  const [openContact, setOpenContact] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openMessage, setOpenMessage] = useState(false);

  // 현재 URL에 따라 선택된 탭 결정
  const getTabValue = () => {
    if (location.pathname === "/mypage") return 0;
    if (location.pathname === "/mypage/projects") return 1;
    if (location.pathname.startsWith("/mypage/collections")) return 2;
    return false;
  };

  const handleMessageClick = item => {
    setSelectedMessage(item);
    setOpenMessage(true);
  };

  return (
    <>
      <Box className={styles.desktopNav}>
        <Tabs
          value={getTabValue()}
          textColor="text.primary"
          indicatorColor="primary"
          aria-label="마이페이지 메뉴"
          sx={{
            "& .MuiTabs-flexContainer": {
              gap: 2,
            },

            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              typography: "h6",
              py: 0,
            },
          }}
        >
          <Tab label="Profile" component={NavLink} to="/mypage" />
          <Tab label="My Projects" component={NavLink} to="/mypage/projects" />
          <Tab label="Bookmarks" component={NavLink} to="/mypage/collections" />
          {/* 컨택 클릭 시 모달 띄우기 */}
          <Tab label="Interest & Contact" onClick={() => setOpenContact(true)} />
        </Tabs>
        {/* Dialog 컴포넌트*/}
        <ContactDialog
          open={openContact}
          onClose={() => setOpenContact(false)}
          contacts={notifications}
          onMessageClick={handleMessageClick}
        />
      </Box>
      <MessageDialog
        open={openMessage}
        onClose={() => setOpenMessage(false)}
        message={selectedMessage}
        onMessageRead={handleMessageRead}
        onMessageDelete={handleMessageDelete}
      />
    </>
  );
}
