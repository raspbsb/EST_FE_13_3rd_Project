import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import EditIcon from "@mui/icons-material/Edit";
import ViewsIcon from "@mui/icons-material/VisibilityOutlined";
import LikeIcon from "@mui/icons-material/FavoriteBorder";
import LikeIconActive from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/StarBorder";
import StarIconActive from "@mui/icons-material/Star";
import LinkIcon from "@mui/icons-material/Link";
import CodeIcon from "@mui/icons-material/Code";
import AiIcon from "@mui/icons-material/AutoAwesome";
import EmailIcon from "@mui/icons-material/EmailOutlined";

export default function DescriptionSection({}) {
  return (
    <Box component={"section"}>
      <Text component={"h2"} variant="h4">
        프로젝트 설명
      </Text>
      <Box>
        <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
      </Box>
    </Box>
  );
}
