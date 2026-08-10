/**
 * 참여 형태, 참여 규모, 진행 환경, 카테고리, 기술 스택 선택 섹션
 * @param {{ sectionCardSx: object, fieldLabelSx: object, formInputSx: object }} props - sectionCardSx: 섹션 외곽 카드 sx, fieldLabelSx: FieldLabel 공통 sx, formInputSx: Select 공통 sx
 * @returns {JSX.Element} 참여 정보 Select, 카테고리/기술 스택 선택 Select, 선택된 항목 Chip 목록
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

const selectedCategoryLabels = ["Web", "Frontend"];
const selectedTechStackLabels = ["Sass", "javaScript", "React", "TypeScript", "Next.js", "Supabase"];

function renderSelectMenuItems(options) {
  return options.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));
}

export default function ProjectMetaSection({ sectionCardSx, fieldLabelSx, formInputSx }) {
  return (
    <Paper elevation={0} sx={sectionCardSx}>
      <Stack spacing={2}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <FormControl fullWidth>
            <FieldLabel sx={fieldLabelSx}>참여 형태</FieldLabel>
            <Select id="project_type" name="project_type" size="small" defaultValue="team" sx={formInputSx}>
              {renderSelectMenuItems(participationTypeOptions)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FieldLabel sx={fieldLabelSx}>참여 규모</FieldLabel>
            <Select id="team_size" name="team_size" size="small" defaultValue="small-team" sx={formInputSx}>
              {renderSelectMenuItems(participationScaleOptions)}
            </Select>
          </FormControl>
        </Box>

        <FormControl fullWidth>
          <FieldLabel sx={fieldLabelSx}>진행 환경</FieldLabel>
          <Select id="environment" name="environment" size="small" defaultValue="course" sx={formInputSx}>
            {renderSelectMenuItems(progressEnvironmentOptions)}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <FieldLabel required sx={fieldLabelSx}>
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
            {selectedCategoryLabels.map(chip => (
              <Chip key={chip} label={chip} color="primary" size="small" sx={{ fontWeight: 700 }} />
            ))}
          </Stack>
          <Select size="small" defaultValue="search-web" sx={formInputSx}>
            {renderSelectMenuItems(categoryOptions)}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <FieldLabel required sx={fieldLabelSx}>
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
            {selectedTechStackLabels.map(chip => (
              <Chip key={chip} label={chip} size="small" sx={{ bgcolor: "#ededed", color: "#212121" }} />
            ))}
          </Stack>
          <Select size="small" defaultValue="typing-vercel" sx={formInputSx}>
            {renderSelectMenuItems(techStackOptions)}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
