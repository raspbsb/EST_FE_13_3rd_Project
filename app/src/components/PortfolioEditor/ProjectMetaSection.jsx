/**
 * 참여 형태, 참여 규모, 진행 환경, 카테고리, 기술 스택 선택 섹션
 * @param {{ cardSx: object, labelSx: object, inputSx: object }} props - 공통 카드/라벨/셀렉트 스타일 객체
 * @returns {JSX.Element} 데이터 배열을 map으로 렌더링한 선택 폼, 칩 목록
 */
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import {
  categoryOptions,
  participationScaleOptions,
  participationTypeOptions,
  progressEnvironmentOptions,
  techStackOptions,
} from "./portfolioEditorData";
import FieldLabel from "./FieldLabel";

const categoryChips = ["Web", "Frontend"];
const techStackChips = ["Sass", "javaScript", "React", "TypeScript", "Next.js", "Supabase"];

function renderOptions(options) {
  return options.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));
}

export default function ProjectMetaSection({ cardSx, labelSx, inputSx }) {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Stack spacing={2}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <FormControl fullWidth>
            <FieldLabel sx={labelSx}>참여 형태</FieldLabel>
            <Select size="small" defaultValue="team" sx={inputSx}>
              {renderOptions(participationTypeOptions)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FieldLabel sx={labelSx}>참여 규모</FieldLabel>
            <Select size="small" defaultValue="small-team" sx={inputSx}>
              {renderOptions(participationScaleOptions)}
            </Select>
          </FormControl>
        </Box>

        <FormControl fullWidth>
          <FieldLabel sx={labelSx}>진행 환경</FieldLabel>
          <Select size="small" defaultValue="course" sx={inputSx}>
            {renderOptions(progressEnvironmentOptions)}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <FieldLabel required sx={labelSx}>
            카테고리
          </FieldLabel>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{
              mb: 1,
              maxWidth: "100%",
              overflow: "hidden",
              "& .MuiChip-root": { maxWidth: "100%" },
            }}
          >
            {categoryChips.map(chip => (
              <Chip key={chip} label={chip} color="primary" size="small" sx={{ fontWeight: 700 }} />
            ))}
          </Stack>
          <Select size="small" defaultValue="search-web" sx={inputSx}>
            {renderOptions(categoryOptions)}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <FieldLabel required sx={labelSx}>
            기술 스택
          </FieldLabel>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{
              mb: 1,
              maxWidth: "100%",
              overflow: "hidden",
              "& .MuiChip-root": { maxWidth: "100%" },
            }}
          >
            {techStackChips.map(chip => (
              <Chip key={chip} label={chip} size="small" sx={{ bgcolor: "#ededed", color: "#212121" }} />
            ))}
          </Stack>
          <Select size="small" defaultValue="typing-vercel" sx={inputSx}>
            {renderOptions(techStackOptions)}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
