import { useSelector } from "react-redux";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function DescriptionSection({}) {
  const { data } = useSelector(state => state.portfolio);

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
          maxHeight: "600px",
          overflowY: "scroll",
          scrollbarWidth: "none",
        }}
      >
        <Text variant="body1">{data?.description}</Text>
      </Box>
    </Box>
  );
}
