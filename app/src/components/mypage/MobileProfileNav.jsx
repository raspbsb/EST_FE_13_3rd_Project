import { NavLink } from "react-router-dom";
import { useState } from "react";

import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

import styles from "./MobileProfileNav.module.css";
import ContactDialog from "./ContactDialog";

import { WorkIcon, BookmarkIcon, NotificationsIcon, PersonIcon } from "../../lib/icons";

export default function MobileProfileNav() {
  const [openContact, setOpenContact] = useState(false);

  return (
    <>
      <Box component="nav" className={styles.nav} aria-label="모바일 마이페이지 메뉴">
        <NavLink to="/mypage/projects" className={styles.item} disabledPadding>
          <WorkIcon />
          <Text component="span">내 프로젝트</Text>
        </NavLink>

        <NavLink to="/mypage/collections" className={styles.item}>
          <BookmarkIcon />
          <Text component="span">북마크</Text>
        </NavLink>

        {/* 알림 클릭 → ContactDialog */}
        <button type="button" className={styles.item} onClick={() => setOpenContact(true)}>
          <NotificationsIcon />
          <Text component="span">알림</Text>
        </button>

        <NavLink to="/mypage" className={styles.item}>
          <PersonIcon />
          <Text component="span">프로필</Text>
        </NavLink>
      </Box>

      <ContactDialog open={openContact} onClose={() => setOpenContact(false)} />
    </>
  );
}
