import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import { ViewsIcon, LikeIcon, LikeIconActive, StarIcon, StarIconActive } from "../../lib/icons";
import { fetchLikes } from "./portfolioSlice";
import { toUrl } from "../../services/toUrl";

export default function HeroMeta({}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status } = useSelector(state => state.user);
  const { data, likes } = useSelector(state => state.portfolio);
  const author = data?.profiles;

  useEffect(() => {
    setIsLiked(data?.portfolio_likes?.some(l => l.user_id === user?.id) ?? false);
    setIsBookmarked(data?.bookmarks?.some(b => b.user_id === user?.id) ?? false);
  }, [user, data?.project_id]);

  const handleLikeBtn = async () => {
    if (status !== "succeeded") return;
    if (!user) {
      // 로그인 필요 문구 출력
      alert("로그인이 필요합니다!");
      navigate("/login");
      return;
    }
    if (isLiked) {
      // 좋아요 제거
      const { error } = await supabase
        .schema("public")
        .from("portfolio_likes")
        .delete()
        .eq("project_id", data.project_id)
        .eq("user_id", user.id)
        .select("*", { count: "exact", head: true })
        .eq("project_id", data.project_id);
      if (error) {
        console.warn("좋아요 제거 실패!: ", error);
        return;
      }
      dispatch(fetchLikes(data.project_id));
      setIsLiked(false);
    } else {
      // 좋아요 추가
      const { error } = await supabase
        .schema("public")
        .from("portfolio_likes")
        .insert({ project_id: data.project_id, user_id: user.id });
      if (error) {
        console.warn("좋아요 추가 실패!: ", error);
        return;
      }
      dispatch(fetchLikes(data.project_id));
      setIsLiked(true);
    }
  };
  const handleBookmarkBtn = async () => {
    if (status !== "succeeded") return;
    if (!user) {
      // 로그인 필요 문구 출력
      alert("로그인이 필요합니다!");
      navigate("/login");
      return;
    }
    if (isBookmarked) {
      // 북마크 제거
      if (confirm("정말로 북마크를 취소하시겠습니까?")) {
        const { error } = await supabase
          .schema("public")
          .from("bookmarks")
          .delete()
          .eq("project_id", data.project_id)
          .eq("user_id", user.id);
        if (error) {
          console.warn("북마크 제거 실패!: ", error);
          return;
        }
        setIsBookmarked(false);
      }
    } else {
      // 북마크 추가
      const { error } = await supabase
        .schema("public")
        .from("bookmarks")
        .insert({ project_id: data.project_id, user_id: user.id });
      if (error) {
        console.warn("북마크 추가 실패!: ", error);
        return;
      }
      setIsBookmarked(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { mobile: "column", tablet: "row", desktop: "row" },
        alignItems: { mobile: "start", tablet: "center", desktop: "center" },
        gap: { mobile: 0.5, tablet: 2, desktop: 3 },
      }}
    >
      <Chip
        component={Link}
        to={`/profiles/${author?.user_id ?? ""}`}
        label={author?.user_name ?? "-"}
        variant="outlined"
        avatar={<Avatar src={toUrl("profile_avatars", author?.avatar_path)} alt={author?.user_name ?? "-"} />}
        clickable
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { mobile: 1, tablet: 1.5, desktop: 2 },
          alignSelf: { mobile: "end", tablet: "unset", desktop: "unset" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ViewsIcon fontSize="small" />
          <Text component={"span"} variant="body2">
            {data?.view_count ?? 0}
          </Text>
        </Box>
        <Button
          color="secondary"
          variant="contained"
          startIcon={isLiked ? <LikeIconActive /> : <LikeIcon />}
          aria-pressed={isLiked}
          onClick={handleLikeBtn}
        >
          <Text component={"span"} variant="body2">
            {likes ?? 0}
          </Text>
        </Button>
        <Button
          color="secondary"
          variant="contained"
          startIcon={isBookmarked ? <StarIconActive /> : <StarIcon />}
          aria-pressed={isBookmarked}
          onClick={handleBookmarkBtn}
        >
          <Text component={"span"} variant="body2">
            북마크
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
