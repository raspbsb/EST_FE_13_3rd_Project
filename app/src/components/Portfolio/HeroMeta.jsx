import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import { ViewsIcon, LikeIcon, LikeIconActive, StarIcon, StarIconActive } from "../icons";

export default function HeroMeta({}) {
  const isLiked = false;
  const isBookmarked = false;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Chip
        component={Link}
        to="/profiles/:userId"
        label="author"
        variant="outlined"
        avatar={<Avatar alt="author" />}
        clickable
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ViewsIcon fontSize="small" />
        <Text component={"span"} variant="body2">
          65535
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
          1972
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
  );
}
