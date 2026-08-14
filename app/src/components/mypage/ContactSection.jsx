import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";

import ContactCard from "./ContactCard";
import ContactDialog from "./ContactDialog";
import MessageDialog from "./MessageDialog";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function ContactSection() {
  //알람 상태 관리
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // dialog 상태 관리
  const [openContact, setOpenContact] = useState(false); //view all 클릭 시 띄우는 dialog
  const [openMessage, setOpenMessage] = useState(false); // 메세지 dialog
  const [selectedMessage, setSelectedMessage] = useState(null);

  // 문자열 변환 함수
  const formatTime = dateString => {
    const date = new Date(dateString);
    const now = new Date();

    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString("ko-KR");
  };

  // 현재 로그인한 유저가 받은 메시지 조회
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);

      try {
        // 현재 로그인한 사용자
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          setNotifications([]);
          return;
        }

        // 받은 메시지 조회
        const { data, error } = await supabase
          .from("messages")
          .select(
            `
          id,
          sender_id,
          receiver_id,
          content,
          is_read,
          created_at,
          profiles!messages_sender_id_fkey (
            user_name,
            user_category,
            avatar_path
          )
        `,
          )
          .eq("receiver_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        console.log("받은 메시지:", data);

        const formattedMessages = (data ?? []).map(message => ({
          id: message.id,
          type: "message",
          sender: message.profiles?.user_name ?? "알 수 없는 사용자",
          job: message.profiles?.user_category ?? "",
          senderId: message.sender_id,
          content: message.content,
          isRead: message.is_read,
          createdAt: formatTime(message.created_at),
        }));

        setNotifications(formattedMessages);
      } catch (error) {
        console.error("받은 메시지 조회 실패:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // 메세지 클릭 (item 저장 -> dialog 오픈)
  const handleMessageClick = item => {
    setSelectedMessage(item);
    setOpenMessage(true);
  };
  // 메세지 읽음 처리
  const handleMessageRead = messageId => {
    setNotifications(prev => prev.map(item => (item.id === messageId ? { ...item, isRead: true } : item)));
  };
  // 메세지 삭제
  const handleMessageDelete = messageId => {
    setNotifications(prev => prev.filter(item => item.id !== messageId));
  };

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text variant="h6">관심 & 연락</Text>
        <Link component="button" underline="hover" variant="subtitle2" onClick={() => setOpenContact(true)}>
          View all
        </Link>
        {/* Dialog 컴포넌트*/}
        <ContactDialog open={openContact} onClose={() => setOpenContact(false)} />
      </Box>
      <List>
        {notifications.map(item => (
          <ContactCard key={item.id} item={item} onMessageClick={handleMessageClick} />
        ))}
      </List>
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
