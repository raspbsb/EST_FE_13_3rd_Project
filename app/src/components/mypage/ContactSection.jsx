import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ContactCard from "./ContactCard";
import ContactDialog from "./ContactDialog";
import MessageDialog from "./MessageDialog";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function ContactSection() {
  // user 가져오기
  const { user } = useSelector(state => state.user);

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

  // 현재 로그인한 유저가 받은 알람 데이터 조회
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);

      try {
        if (!user?.id) {
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
          createdAtRaw: message.created_at,
        }));

        // 내가 받은 좋아요 조회
        const { data: likes, error: likeError } = await supabase
          .from("portfolio_likes")
          .select(
            `
            project_id,
            user_id,
            created_at,
            portfolios!inner (
              project_id,
              title,
              author_id
            ),
            profiles!likes_user_id_fkey (
              user_name
            )
          `,
          )
          .eq("portfolios.author_id", user.id)
          .order("created_at", { ascending: false });

        if (likeError) {
          throw likeError;
        }

        console.log("받은 좋아요:", likes);

        const formattedLikes = (likes ?? []).map(like => ({
          id: `like-${like.project_id}-${like.user_id}`,
          type: "like",
          sender: like.profiles?.user_name ?? "알 수 없는 사용자",
          projectId: like.project_id,
          projectTitle: like.portfolios?.title ?? "프로젝트",
          isRead: true,
          createdAt: formatTime(like.created_at),
          createdAtRaw: like.created_at,
        }));

        // 중복 있을 경우 가장 최근 생성된 좋아요를 남기기
        const uniqueLikesMap = new Map();

        for (const like of formattedLikes) {
          const existing = uniqueLikesMap.get(like.id);

          if (!existing || new Date(like.createdAtRaw) > new Date(existing.createdAtRaw)) {
            uniqueLikesMap.set(like.id, like);
          }
        }

        // 좋아요 중복 방지
        const uniqueLikes = Array.from(uniqueLikesMap.values());

        const allNotifications = [...formattedMessages, ...uniqueLikes].sort(
          (a, b) => new Date(b.createdAtRaw) - new Date(a.createdAtRaw),
        );

        setNotifications(allNotifications);
      } catch (error) {
        console.error("받은 메시지 조회 실패:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user?.id]);

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
        <ContactDialog
          open={openContact}
          onClose={() => setOpenContact(false)}
          contacts={notifications}
          onMessageClick={handleMessageClick}
        />
      </Box>
      {loading ? (
        <Text>관심 & 연락을 불러오는 중...</Text>
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
