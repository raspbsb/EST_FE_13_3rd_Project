import { cloneElement, memo } from "react";
import ListItem from "@mui/material/ListItem";
import MuiLink from "@mui/material/Link";

import { LinkIcon } from "../../lib/icons";

function AuthorInfoCardContact({ href, icon = <LinkIcon />, email }) {
  const renderedIcon = cloneElement(icon, { fontSize: "small", sx: { mr: 1 } });

  if (!href) {
    return <></>;
  }

  return (
    <ListItem>
      {renderedIcon}
      <MuiLink
        href={email ? `mailto:${href}` : href}
        target="_blank"
        rel="noopener noreferrer"
        color="textPrimary"
        variant="body2"
        noWrap
      >
        {href}
      </MuiLink>
    </ListItem>
  );
}

export default memo(AuthorInfoCardContact);
