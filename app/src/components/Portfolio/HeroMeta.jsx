import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import { ViewsIcon, LikeIcon, LikeIconActive, StarIcon, StarIconActive } from "../../lib/icons";

export default function HeroMeta({}) {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data, status } = useSelector(state => state.portfolio);
  const author = data?.profiles;

  async function fetchUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.warn(error);
      return;
    }
    console.log(user);
    setUser(user);
    setIsLiked(data?.portfolio_likes?.some(l => l?.user_id === user?.id) ?? false);
    setIsBookmarked(data?.bookmarks?.some(b => b?.user_id === user?.id) ?? false);
  }
  useEffect(() => {
    fetchUser();
  }, [data]);

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
        avatar={<Avatar src={author?.avatar_path ?? "."} alt={author?.user_name ?? "-"} />}
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
          onClick={() => {}}
        >
          <Text component={"span"} variant="body2">
            {data?.portfolio_likes?.length ?? 0}
          </Text>
        </Button>
        <Button
          color="secondary"
          variant="contained"
          startIcon={isBookmarked ? <StarIconActive /> : <StarIcon />}
          aria-pressed={isBookmarked}
          onClick={() => {}}
        >
          <Text component={"span"} variant="body2">
            북마크
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
