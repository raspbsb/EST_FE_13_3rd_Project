import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";

import { LinkIcon, CodeIcon } from "../../lib/icons";

import HeroSpecsItem from "./HeroSpecsItem";

export default function HeroSpecs({}) {
  return (
    <Grid component={"dl"} container rowSpacing={1} columnSpacing={1} columns={8} sx={{ alignItems: "center" }}>
      <HeroSpecsItem label="카테고리">
        <Stack component={"ul"} direction="row" sx={{ gap: 1, overflow: "scroll", scrollbarWidth: "none" }}>
          <Chip component={"li"} label="Lorem Ipsum" />
          <Chip component={"li"} label="Dolor Sit Amet" />
          <Chip component={"li"} label="Consectetur" />
          <Chip component={"li"} label="Adipisicing" />
          <Chip component={"li"} label="Elit" />
        </Stack>
      </HeroSpecsItem>

      <HeroSpecsItem label="기술 스택">
        <Stack component={"ul"} direction="row" sx={{ gap: 1, overflow: "scroll", scrollbarWidth: "none" }}>
          <Chip component={"li"} label="HTML" />
          <Chip component={"li"} label="CSS" />
          <Chip component={"li"} label="JavaScript" />
          <Chip component={"li"} label="React" />
          <Chip component={"li"} label="TypeScript" />
        </Stack>
      </HeroSpecsItem>

      <HeroSpecsItem label="배포 링크">
        <LinkIcon />
        <Text variant="body1">https://deploy-url.com/project</Text>
      </HeroSpecsItem>

      <HeroSpecsItem label="Repo 주소">
        <CodeIcon />
        <Text variant="body1">https://github.com/author/project</Text>
      </HeroSpecsItem>

      <HeroSpecsItem label="담당 역할" size={3}>
        <Text variant="body1">Frontend Lead</Text>
      </HeroSpecsItem>

      <HeroSpecsItem label="프로젝트 형태" size={3}>
        <Text variant="body1">Team Project</Text>
      </HeroSpecsItem>
    </Grid>
  );
}
