import { Link } from "react-router-dom";

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

export default function AuthorInfoSection({}) {
  return (
    <Box component={"section"}>
      <Text component={"h2"} variant="h4">
        작성자 정보
      </Text>
      <Box>
        <Text component={"h3"} variant="h5">
          author
        </Text>
        <Text component={"p"} variant="subtitle1">
          Frontend Developer
        </Text>
        <Button component={Link} to="/profiles/:userId" color="secondary" variant="contained">
          View Profile
        </Button>
        <List>
          <ListItem>
            <EmailIcon fontSize="small" />
            <Text variant="body2">Email</Text>
          </ListItem>
          <ListItem>
            <CodeIcon fontSize="small" />
            <Text variant="body2">GitHub</Text>
          </ListItem>
          <ListItem>
            <LinkIcon fontSize="small" />
            <Text variant="body2">Linkedin</Text>
          </ListItem>
        </List>
      </Box>
      <Box>
        <Box>
          <Text component={"h3"} variant="h5">
            author의 다른 프로젝트
          </Text>
          <Text component={Link} to="/profiles/:userId">
            View all 4
          </Text>
        </Box>
        <Box component={"ul"}>
          <Box component={"li"}>
            <Box component={"article"}></Box>
          </Box>
          <Box component={"li"}>
            <Box component={"article"}></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
