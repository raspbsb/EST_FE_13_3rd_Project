/**
 * 프로젝트명, 기간, 배포 URL, 담당 역할, 저장소 URL, 프로젝트 설명 입력 섹션
 * @param {{ sectionCardSx: object, fieldLabelSx: object, formInputSx: object, formData: object, handleFormChange: Function }} props
 * @returns {JSX.Element} 프로젝트 기본 정보 입력 폼 섹션
 */
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { ErrorCircleIcon } from "../../lib/icons";
import FieldLabel from "./FieldLabel";
import { memo, useCallback, useEffect, useState } from "react";

function ProjectBasicInfoSection({
  sectionCardSx,
  fieldLabelSx,
  formInputSx,
  title,
  startedAt,
  endedAt,
  deployUrl,
  authorRole,
  repositoryUrl,
  description,
  handleFormChange,
}) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localDeployUrl, setLocalDeployUrl] = useState(deployUrl);
  const [localAuthorRole, setLocalAuthorRole] = useState(authorRole);
  const [localRepositoryUrl, setLocalRepositoryUrl] = useState(repositoryUrl);
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    setLocalDeployUrl(deployUrl);
  }, [deployUrl]);

  useEffect(() => {
    setLocalAuthorRole(authorRole);
  }, [authorRole]);

  useEffect(() => {
    setLocalRepositoryUrl(repositoryUrl);
  }, [repositoryUrl]);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  const commitField = useCallback(
    (name, value) => {
      handleFormChange({
        target: {
          name,
          value,
        },
      });
    },
    [handleFormChange],
  );

  // 해당 폼의 키값(stated_at, ended_at)과 해당 폼에 찍힌 날짜를 변환해서 PortfolioEditor.jsx로 올려보내 변수에 저장함
  const handleDateChange = useCallback(
    (name, nextDate) => {
      handleFormChange({
        target: {
          name,
          value: nextDate ? nextDate.format("YYYY-MM-DD") : "",
        },
      });
      // console.log(nextDate ? nextDate.format("YYYY-MM-DD") : ""); // 2026-08-11
    },
    [handleFormChange],
  );

  return (
    <Box component="section" sx={sectionCardSx}>
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

          <OutlinedInput
            id="title"
            name="title"
            size="small"
            value={localTitle}
            onChange={event => setLocalTitle(event.target.value)}
            onBlur={() => commitField("title", localTitle)}
            sx={formInputSx}
          />
        </FormControl>

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

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <DatePicker
                  value={startedAt ? dayjs(startedAt) : null}
                  format="YYYY.MM.DD"
                  onChange={nextDate => handleDateChange("started_at", nextDate)}
                  slotProps={{
                    textField: {
                      id: "started_at",
                      size: "small",
                      fullWidth: true,
                      sx: formInputSx,
                    },
                    htmlInput: {
                      name: "started_at",
                      "aria-label": "프로젝트 시작일",
                    },
                  }}
                />

                <Text color="text.secondary" sx={{ textAlign: "center" }}>
                  ~
                </Text>

                <DatePicker
                  value={endedAt ? dayjs(endedAt) : null}
                  minDate={startedAt ? dayjs(startedAt) : undefined}
                  format="YYYY.MM.DD"
                  onChange={nextDate => handleDateChange("ended_at", nextDate)}
                  slotProps={{
                    textField: {
                      id: "ended_at",
                      size: "small",
                      fullWidth: true,
                      sx: formInputSx,
                    },
                    htmlInput: {
                      name: "ended_at",
                      "aria-label": "프로젝트 종료일",
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>

          <FormControl fullWidth required>
            <FieldLabel htmlFor="deploy_url" sx={fieldLabelSx}>
              배포 URL
            </FieldLabel>
            <OutlinedInput
              id="deploy_url"
              name="deploy_url"
              size="small"
              value={localDeployUrl}
              onChange={event => setLocalDeployUrl(event.target.value)}
              onBlur={() => commitField("deploy_url", localDeployUrl)}
              sx={formInputSx}
            />
          </FormControl>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", tablet: "1fr 1fr" }, gap: 2 }}>
          <FormControl fullWidth required>
            <FieldLabel htmlFor="author_role" sx={fieldLabelSx}>
              담당 역할
            </FieldLabel>

            <OutlinedInput
              id="author_role"
              name="author_role"
              size="small"
              value={localAuthorRole}
              onChange={event => setLocalAuthorRole(event.target.value)}
              onBlur={() => commitField("author_role", localAuthorRole)}
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
              value={localRepositoryUrl}
              onChange={event => setLocalRepositoryUrl(event.target.value)}
              onBlur={() => commitField("repository_url", localRepositoryUrl)}
              sx={formInputSx}
            />
          </FormControl>
        </Box>

        <FormControl fullWidth required>
          <FieldLabel htmlFor="description" required sx={fieldLabelSx}>
            프로젝트 설명
          </FieldLabel>

          <OutlinedInput
            className="portfolio-editor-description-input"
            id="description"
            name="description"
            size="small"
            multiline
            minRows={5}
            value={localDescription}
            onChange={event => setLocalDescription(event.target.value)}
            onBlur={() => commitField("description", localDescription)}
            sx={formInputSx}
          />
        </FormControl>
      </Stack>
    </Box>
  );
}

export default memo(ProjectBasicInfoSection);
