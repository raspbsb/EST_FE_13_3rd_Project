import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function EmptyState({ message, description, buttonText, onClick }) {
  return (
    <Box
      sx={{
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        mt: 2,
        px: 2,
        textAlign: "center",
      }}
    >
      <Text component="p" variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
        {message}
      </Text>

      <Text component="p" variant="body2" color="text.secondary" sx={{ mb: buttonText ? 2.5 : 0 }}>
        {description}
      </Text>

      {buttonText && (
        <Button variant="outlined" onClick={onClick} size="small">
          {buttonText}
        </Button>
      )}
    </Box>
  );
}
