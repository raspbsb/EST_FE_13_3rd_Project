import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../utils/supabase";

export default function useNotifications() {
  const { user } = useSelector(state => state.user);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 문자열 변환
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

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);

      try {
        if (!user?.id) {
          setNotifications([]);
          return;
        }

        // ---------------- 받은 메시지 조회 ----------------
        const { data: messages, error: messageError } = await supabase
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

        if (messageError) {
          throw messageError;
        }

        const formattedMessages = (messages ?? []).map(message => ({
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

        // ---------------- 내가 받은 좋아요 조회 ----------------
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

        // ---------------- 좋아요 중복 제거 ----------------
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

        // ---------------- 최신순 정렬 ----------------
        const allNotifications = [...formattedMessages, ...uniqueLikes].sort(
          (a, b) => new Date(b.createdAtRaw) - new Date(a.createdAtRaw),
        );

        setNotifications(allNotifications);
      } catch (error) {
        console.error("알림 조회 실패:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  // 메시지 읽음 처리
  const handleMessageRead = messageId => {
    setNotifications(prev => prev.map(item => (item.id === messageId ? { ...item, isRead: true } : item)));
  };

  // 메시지 삭제
  const handleMessageDelete = messageId => {
    setNotifications(prev => prev.filter(item => item.id !== messageId));
  };

  return {
    notifications,
    loading,
    handleMessageRead,
    handleMessageDelete,
  };
}
