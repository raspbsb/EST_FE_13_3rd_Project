import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import { ViewsIcon, LikeIcon, LikeIconActive, StarIcon, StarIconActive } from "../../lib/icons";

export default function HeroMeta({}) {
  const { data, status } = useSelector(state => state.portfolio);
  const author = data?.profiles;

  // liked, bookmarked 테이블 준비중
  const isLiked = false;
  const isBookmarked = false;

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
            0
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
