import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function DescriptionSection({}) {
  return (
    <Box component={"section"}>
      <Text component={"h2"} variant="h4" sx={{ fontWeight: "700" }}>
        프로젝트 설명
      </Text>
      <Box
        sx={{
          p: 3,
          mt: 2,
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "divider",
          borderRadius: "12px",
          bgcolor: "surface",
          minHeight: "192px",
          maxHeight: "400px",
        }}
      >
        <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
      </Box>
    </Box>
  );
}
