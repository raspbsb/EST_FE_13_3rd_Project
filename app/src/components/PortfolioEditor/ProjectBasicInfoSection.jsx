/**
 * 프로젝트명, 기간, 배포 URL, 담당 역할, 저장소 URL, 프로젝트 설명 입력 섹션
 * @param {{ sectionCardSx: object, fieldLabelSx: object, formInputSx: object, handleFormChange: Function }} props
 * @returns {JSX.Element} 프로젝트 기본 정보 입력 폼 섹션
 */
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { memo, useCallback, useEffect, useState } from "react";
import { ErrorCircleIcon } from "../../lib/icons";
import BasicInfoTextField from "./BasicInfoTextField";
import FieldLabel from "./FieldLabel";

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
  formErrors = {},
  handleFormChange,
}) {
  const [localStartedAt, setLocalStartedAt] = useState(startedAt);
  const [localEndedAt, setLocalEndedAt] = useState(endedAt);

  useEffect(() => {
    setLocalStartedAt(startedAt);
    setLocalEndedAt(endedAt);
  }, [startedAt, endedAt]);

  const handleTextFieldValueCommit = useCallback(
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

  // 해당 폼의 키값(started_at, ended_at)과 해당 폼에 찍힌 날짜를 변환해서 PortfolioEditor.jsx로 올려보내 변수에 저장함
  const handleDateChange = useCallback(
    (name, nextDate) => {
      const value = nextDate ? nextDate.format("YYYY-MM-DD") : "";

      if (name === "started_at") {
        setLocalStartedAt(value);
      }

      if (name === "ended_at") {
        setLocalEndedAt(value);
      }

      handleFormChange({
        target: {
          name,
          value,
        },
      });
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
        <BasicInfoTextField
          id="title"
          name="title"
          label="프로젝트명"
          value={title}
          required
          feedback={formErrors.title}
          fieldLabelSx={fieldLabelSx}
          formInputSx={formInputSx}
          onValueCommit={handleTextFieldValueCommit}
        />

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
                  value={localStartedAt ? dayjs(localStartedAt) : null}
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
                  value={localEndedAt ? dayjs(localEndedAt) : null}
                  minDate={localStartedAt ? dayjs(localStartedAt) : undefined}
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

          <BasicInfoTextField
            id="deploy_url"
            name="deploy_url"
            label="배포 URL"
            value={deployUrl}
            fieldLabelSx={fieldLabelSx}
            formInputSx={formInputSx}
            onValueCommit={handleTextFieldValueCommit}
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", tablet: "1fr 1fr" }, gap: 2 }}>
          <BasicInfoTextField
            id="author_role"
            name="author_role"
            label="담당 역할"
            value={authorRole}
            fieldLabelSx={fieldLabelSx}
            formInputSx={formInputSx}
            onValueCommit={handleTextFieldValueCommit}
          />

          <BasicInfoTextField
            id="repository_url"
            name="repository_url"
            label="GitHub 저장소 URL (저장소 분석 시 필수)"
            value={repositoryUrl}
            feedback={formErrors.repository_url}
            fieldLabelSx={fieldLabelSx}
            formInputSx={formInputSx}
            onValueCommit={handleTextFieldValueCommit}
          />
        </Box>

        <BasicInfoTextField
          id="description"
          name="description"
          label="프로젝트 설명"
          value={description}
          required
          feedback={formErrors.description}
          fieldLabelSx={fieldLabelSx}
          formInputSx={formInputSx}
          className="portfolio-editor-description-input"
          multiline
          minRows={5}
          onValueCommit={handleTextFieldValueCommit}
        />
      </Stack>
    </Box>
  );
}

export default memo(ProjectBasicInfoSection);
