import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { EmailIcon, CodeIcon, LinkIcon } from "../icons";

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
            <Text component={"a"} href={null} variant="body2">
              portfoliop@gmail.com
            </Text>
          </ListItem>
          <ListItem>
            <CodeIcon fontSize="small" />
            <Text component={"a"} href={null} variant="body2">
              https://github.com/portfolioplus
            </Text>
          </ListItem>
          <ListItem>
            <LinkIcon fontSize="small" />
            <Text component={"a"} href={null} variant="body2">
              https://www.linkedin.com/in/portfolioplus/
            </Text>
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
