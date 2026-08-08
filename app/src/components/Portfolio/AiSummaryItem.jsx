import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function AiSummaryItem({ label = "", children }) {
  return (
    <>
      <Text component={"dt"} variant="h6" color="primary">
        {label}
      </Text>

      <Box
        component={"dd"}
        sx={{
          mt: 0.5,
          px: 1.5,
          py: 1.5,
          mb: 2,
          maxHeight: "500px",
          borderStyle: "solid",
          borderWidth: "1px 1px 1px 8px",
          borderColor: "primary.main",
          borderRadius: "4px",
          overflowY: "scroll",
          scrollbarWidth: "none",
        }}
      >
        <Text variant="body1">{children}</Text>
      </Box>
    </>
  );
}
