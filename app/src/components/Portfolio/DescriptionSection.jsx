import Text from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

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
