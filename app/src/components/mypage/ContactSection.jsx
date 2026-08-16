import { useState } from "react";
import useNotifications from "../../hooks/useNotifications";

import ContactCard from "./ContactCard";
import ContactDialog from "./ContactDialog";
import MessageDialog from "./MessageDialog";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function ContactSection() {
  // hook 호출
  const { notifications, loading, handleMessageRead, handleMessageDelete } = useNotifications();

  // dialog 상태 관리
  const [openContact, setOpenContact] = useState(false); //view all 클릭 시 띄우는 dialog
  const [openMessage, setOpenMessage] = useState(false); // 메세지 dialog
  const [selectedMessage, setSelectedMessage] = useState(null);

  // 메세지 클릭 (item 저장 -> dialog 오픈)
  const handleMessageClick = item => {
    setSelectedMessage(item);
    setOpenMessage(true);
  };

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text component="h3" variant="h6">
          관심 & 연락
        </Text>
        <Link component="button" underline="hover" variant="subtitle2" onClick={() => setOpenContact(true)}>
          View all
        </Link>
        {/* Dialog 컴포넌트*/}
        <ContactDialog
          open={openContact}
          onClose={() => setOpenContact(false)}
          contacts={notifications}
          onMessageClick={handleMessageClick}
        />
      </Box>
      {loading ? (
        <Text component="p">관심 & 연락을 불러오는 중...</Text>
      ) : (
        <List>
          {notifications.map(item => (
            <ContactCard key={item.id} item={item} onMessageClick={handleMessageClick} />
          ))}
        </List>
      )}
      <MessageDialog
        open={openMessage}
        onClose={() => setOpenMessage(false)}
        message={selectedMessage}
        onMessageRead={handleMessageRead}
        onMessageDelete={handleMessageDelete}
      />
    </Box>
  );
}
