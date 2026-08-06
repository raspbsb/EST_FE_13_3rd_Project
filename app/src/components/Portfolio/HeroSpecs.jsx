import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import { LinkIcon, CodeIcon } from "../../lib/icons";

export default function HeroSpecs({}) {
  return (
    <Box component={"dl"}>
      <Text component={"dt"} variant="subtitle1">
        카테고리
      </Text>
      <Box component={"dd"}>
        <Stack component={"ul"} direction="row" sx={{ gap: 1, overflow: "scroll", scrollbarWidth: "none" }}>
          <Chip component={"li"} label="Lorem" />
          <Chip component={"li"} label="Ipsum" />
          <Chip component={"li"} label="Dolor" />
          <Chip component={"li"} label="Sit" />
          <Chip component={"li"} label="Amet" />
          <Chip component={"li"} label="Consectetur" />
          <Chip component={"li"} label="Adipisicing" />
          <Chip component={"li"} label="Elit" />
        </Stack>
      </Box>

      <Text component={"dt"} variant="subtitle1">
        기술 스택
      </Text>
      <Box component={"dd"}>
        <Stack component={"ul"} direction="row" sx={{ gap: 1, overflow: "scroll", scrollbarWidth: "none" }}>
          <Chip component={"li"} label="HTML" />
          <Chip component={"li"} label="CSS" />
          <Chip component={"li"} label="JavaScript" />
          <Chip component={"li"} label="React" />
          <Chip component={"li"} label="Next.js" />
          <Chip component={"li"} label="TypeScript" />
        </Stack>
      </Box>

      <Text component={"dt"} variant="subtitle1">
        배포 링크
      </Text>
      <Box component={"dd"}>
        <LinkIcon />
        <Text variant="body1">https://deploy-url.com/project</Text>
      </Box>

      <Text component={"dt"} variant="subtitle1">
        Repo 주소
      </Text>
      <Box component={"dd"}>
        <CodeIcon />
        <Text variant="body1">https://github.com/author/project</Text>
      </Box>

      <Text component={"dt"} variant="subtitle1">
        담당 역할
      </Text>
      <Box component={"dd"}>
        <Text variant="body1">Frontend Lead</Text>
      </Box>

      <Text component={"dt"} variant="subtitle1">
        프로젝트 형태
      </Text>
      <Box component={"dd"}>
        <Text variant="body1">Team Project</Text>
      </Box>
    </Box>
  );
}
