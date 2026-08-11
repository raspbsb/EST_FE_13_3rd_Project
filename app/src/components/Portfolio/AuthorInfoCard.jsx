import { Link } from "react-router-dom";

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
  const { data, status } = useSelector(state => state.portfolio);
  const author = data?.profiles;

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
        <Avatar
          src={author?.avatar_path ?? "."}
          alt={author?.user_name ?? "-"}
          sx={{ width: "128px", height: "128px" }}
        />
        <Text component={"h3"} variant="h5">
          {author?.user_name ?? "-"}
        </Text>
        <Text component={"p"} variant="subtitle1">
          {author?.user_category ?? ""}
        </Text>
      </Box>
      <Button
        component={Link}
        to={`/profiles/${author?.user_id ?? ""}`}
        sx={{ position: "absolute", top: "16px", right: "16px" }}
        color="secondary"
        variant="contained"
      >
        View Profile
      </Button>
      <List sx={{ maxWidth: "100%" }}>
        {author?.email && <AuthorInfoCardContact href={author?.email} email icon={<EmailIcon />} />}
        {author?.github_url && <AuthorInfoCardContact href={author?.github_url} icon={<CodeIcon />} />}
        {author?.url2 && <AuthorInfoCardContact href={author?.url2} />}
      </List>
    </Box>
  );
}
