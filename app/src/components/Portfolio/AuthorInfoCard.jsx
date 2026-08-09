import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MuiLink from "@mui/material/Link";

import { EmailIcon, CodeIcon, LinkIcon } from "../../lib/icons";

import AuthorInfoCardContact from "./AuthorInfoCardContact";

export default function AuthorInfoCard({}) {
  const { data, status, error } = useSelector(state => state.portfolio);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 3,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "divider",
        borderRadius: "12px",
        bgcolor: "surface",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: "128px", height: "128px" }} alt="author" />
        <Text component={"h3"} variant="h5">
          author
        </Text>
        <Text component={"p"} variant="subtitle1">
          Frontend Developer
        </Text>
      </Box>
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
        <AuthorInfoCardContact href={"portfoliop@gmail.com"} email icon={<EmailIcon />} />
        <AuthorInfoCardContact href={"https://github.com/portfolioplus"} icon={<CodeIcon />} />
        <AuthorInfoCardContact href={"https://www.linkedin.com/in/portfolioplus/"} />
      </List>
    </Box>
  );
}
