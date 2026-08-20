import { memo } from "react";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import styles from "./AiSummaryItem.module.css";

function AiSummaryItem({ label = "", caption = "", children }) {
  return (
    <Grid component={"div"} size={{ mobile: 2, tablet: 1, desktop: 1 }}>
      <Box component={"dt"} className={`${styles["ai-summary-item-title"]}`}>
        {label && (
          <Text component={"p"} variant="h6" color="primary">
            {label}
          </Text>
        )}
        {caption && (
          <Text component={"p"} variant="caption" color="textSecondary" noWrap>
            {caption}
          </Text>
        )}
      </Box>

      <Box component={"dd"} className={`${styles["ai-summary-item"]}`}>
        <Text variant="body1">{children}</Text>
      </Box>
    </Grid>
  );
}

export default memo(AiSummaryItem);
