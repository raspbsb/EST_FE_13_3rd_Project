/**
 * 프로젝트명, 기간, 배포 URL, 담당 역할, 저장소 URL, 프로젝트 설명 입력 섹션
 * @param {{ sectionCardSx: object, fieldLabelSx: object, formInputSx: object, projectDescription: string }} props - sectionCardSx: 섹션 외곽 카드 sx, fieldLabelSx: FieldLabel 공통 sx, formInputSx: OutlinedInput 공통 sx, projectDescription: 프로젝트 설명 입력 기본값
 * @returns {JSX.Element} 프로젝트 기본 정보 입력 폼 섹션
 */
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { CalendarIcon, ErrorCircleIcon } from "../../lib/icons";
import FieldLabel from "./FieldLabel";

export default function ProjectBasicInfoSection({ sectionCardSx, fieldLabelSx, formInputSx, projectDescription }) {
  return (
    <Box component="section" sx={sectionCardSx}>
      {/* 섹션 타이틀 */}
      <Box sx={{ mb: 3 }}>
        <Text component="h2" variant="h5" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ErrorCircleIcon fontSize="small" />
          프로젝트 기본 정보
        </Text>
      </Box>

      <Stack spacing={2}>
        <FormControl fullWidth required>
          <FieldLabel htmlFor="title" required sx={fieldLabelSx}>
            프로젝트명
          </FieldLabel>

          <OutlinedInput id="title" name="title" size="small" defaultValue="Portfolio+" sx={formInputSx} />
        </FormControl>

        {/* 기간/배포 그룹 */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", tablet: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box
            component="fieldset"
            sx={{ border: 0, p: 0, m: 0, minWidth: 0, display: "flex", flexDirection: "column" }}
          >
            <FieldLabel htmlFor="started_at" sx={fieldLabelSx}>
              프로젝트 기간
            </FieldLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                alignItems: "center",
                gap: 1,
              }}
            >
              <OutlinedInput
                id="started_at"
                name="started_at"
                inputProps={{ "aria-label": "프로젝트 시작일" }}
                size="small"
                defaultValue="2026/07/15"
                endAdornment={
                  <InputAdornment position="end">
                    <CalendarIcon />
                  </InputAdornment>
                }
                sx={formInputSx}
              />
              <Text color="text.secondary" textAlign="center">
                ~
              </Text>
              <OutlinedInput
                id="ended_at"
                name="ended_at"
                inputProps={{ "aria-label": "프로젝트 종료일" }}
                size="small"
                defaultValue="2026/08/21"
                endAdornment={
                  <InputAdornment position="end">
                    <CalendarIcon />
                  </InputAdornment>
                }
                sx={formInputSx}
              />
            </Box>
          </Box>
          <FormControl fullWidth required>
            <FieldLabel htmlFor="deploy_url" sx={fieldLabelSx}>
              배포 URL
            </FieldLabel>
            <OutlinedInput
              id="deploy_url"
              name="deploy_url"
              size="small"
              defaultValue="https://react-mission-eight.vercel.app/"
              sx={formInputSx}
            />
          </FormControl>
        </Box>

        {/* 역할/레포 그룹 */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", tablet: "1fr 1fr" }, gap: 2 }}>
          <FormControl fullWidth required>
            <FieldLabel htmlFor="author_role" sx={fieldLabelSx}>
              담당 역할
            </FieldLabel>

            <OutlinedInput
              id="author_role"
              name="author_role"
              size="small"
              defaultValue="서비스 기획 · 스토리보드 · 디자인 · 프론트엔드 개발"
              sx={formInputSx}
            />
          </FormControl>
          <FormControl fullWidth required>
            <FieldLabel htmlFor="repository_url" sx={fieldLabelSx}>
              GitHub 저장소 URL (저장소 분석 시 필수)
            </FieldLabel>

            <OutlinedInput
              id="repository_url"
              name="repository_url"
              size="small"
              defaultValue="https://github.com/alikerock/estfe13-react-bbs-server/blob/main/index.js"
              sx={formInputSx}
            />
          </FormControl>
        </Box>
        <FormControl fullWidth required>
          <FieldLabel htmlFor="description" required sx={fieldLabelSx}>
            프로젝트 설명
          </FieldLabel>

          <OutlinedInput
            id="description"
            name="description"
            size="small"
            multiline
            minRows={5}
            defaultValue={projectDescription}
            sx={formInputSx}
          />
        </FormControl>
      </Stack>
    </Box>
  );
}
