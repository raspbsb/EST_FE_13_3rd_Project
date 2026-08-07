import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { EmailIcon, CodeIcon, LinkIcon } from "../../lib/icons";

export default function AuthorInfoCard({}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, position: "relative" }}>
      <Avatar sx={{ width: "128px", height: "128px" }} alt="author" />
      <Text component={"h3"} variant="h5">
        author
      </Text>
      <Text component={"p"} variant="subtitle1">
        Frontend Developer
      </Text>
      <Button
        component={Link}
        to="/profiles/:userId"
        sx={{ position: "absolute", top: "16px", right: "16px" }}
        color="secondary"
        variant="contained"
      >
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
  );
}
