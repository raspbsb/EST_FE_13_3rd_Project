import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function DescriptionSection({}) {
  return (
    <Box component={"section"}>
      <Text component={"h2"} variant="h4">
        프로젝트 설명
      </Text>
      <Box>
        <Text variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
      </Box>
    </Box>
  );
}
