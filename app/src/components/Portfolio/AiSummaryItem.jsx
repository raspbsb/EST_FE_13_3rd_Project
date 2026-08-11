import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styles from "./AiSummaryItem.module.css";

export default function AiSummaryItem({ label = "", children }) {
  return (
    <>
      <Text component={"dt"} variant="h6" color="primary">
        {label}
      </Text>

      <Box component={"dd"} className={`${styles["ai-summary-item"]}`}>
        <Text variant="body1">{children}</Text>
      </Box>
    </>
  );
}
