import { cloneElement } from "react";
import ListItem from "@mui/material/ListItem";
import MuiLink from "@mui/material/Link";

import { LinkIcon } from "../../lib/icons";

export default function AuthorInfoCardContact({ href, icon = <LinkIcon />, email }) {
  const renderedIcon = cloneElement(icon, { fontSize: "small", sx: { mr: 1 } });

  return (
    <ListItem>
      {renderedIcon}
      <MuiLink href={email ? `mailto:${href}` : href} color="textPrimary" variant="body2" noWrap>
        {href}
      </MuiLink>
    </ListItem>
  );
}
