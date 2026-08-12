/**
 * 참여 형태, 참여 규모, 진행 환경, 카테고리, 기술 스택 선택 섹션
 * @param {{ sectionCardSx: object, fieldLabelSx: object, formInputSx: object }} props - sectionCardSx: 섹션 외곽 카드 sx, fieldLabelSx: FieldLabel 공통 sx, formInputSx: Select 공통 sx
 * @returns {JSX.Element} 참여 정보 Select, 카테고리/기술 스택 선택 Select, 선택된 항목 Chip 목록
 */
import { memo, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  categoryOptions,
  participationScaleOptions,
  participationTypeOptions,
  progressEnvironmentOptions,
  techStackOptions,
} from "./portfolioEditorData";
import FieldLabel from "./FieldLabel";
import PortfolioMetaChip from "./PortfolioMetaChip";

const selectableCategoryOptions = categoryOptions.filter(option => option.value !== "search-web");
const selectableTechStackOptions = techStackOptions.filter(option => option.value !== "typing-vercel");

function renderSelectMenuItems(options) {
  return options.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));
}

function ProjectMetaSection({
  sectionCardSx,
  fieldLabelSx,
  formInputSx,
  formData,
  handleFormChange,
  handleAddCategory,
  handleDeleteCategory,
  handleAddTechStack,
  handleDeleteTechStack,
  maxCategoryCount,
  maxTechStackCount,
}) {
  const [techStackInputValue, setTechStackInputValue] = useState("");
  const [categoryInputValue, setCategoryInputValue] = useState("");

  const handleCategoryChange = (_, selectedOption) => {
    handleAddCategory(selectedOption);
    setCategoryInputValue("");
  };

  const handleTechStackChange = (_, selectedOption) => {
    handleAddTechStack(selectedOption);
    setTechStackInputValue("");
  };

  const stackSx = {
    mb: 1,
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
    flexWrap: "wrap",
  };

  const isCategoryLimitReached = formData.categories.length >= maxCategoryCount;
  const isTechStackLimitReached = formData.tech_stacks.length >= maxTechStackCount;

  return (
    <Paper elevation={0} sx={sectionCardSx}>
      <Stack spacing={2}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <FormControl fullWidth>
            <FieldLabel sx={fieldLabelSx}>참여 형태</FieldLabel>
            <Select
              id="project_type"
              name="project_type"
              size="small"
              value={formData.project_type}
              onChange={handleFormChange}
              sx={formInputSx}
            >
              {renderSelectMenuItems(participationTypeOptions)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FieldLabel sx={fieldLabelSx}>참여 규모</FieldLabel>
            <Select
              id="team_size"
              name="team_size"
              size="small"
              value={formData.team_size}
              onChange={handleFormChange}
              sx={formInputSx}
            >
              {renderSelectMenuItems(participationScaleOptions)}
            </Select>
          </FormControl>
        </Box>

        <FormControl fullWidth>
          <FieldLabel sx={fieldLabelSx}>진행 환경</FieldLabel>
          <Select
            id="environment"
            name="environment"
            size="small"
            value={formData.environment}
            onChange={handleFormChange}
            sx={formInputSx}
          >
            {renderSelectMenuItems(progressEnvironmentOptions)}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <Box
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <FieldLabel required sx={{ ...fieldLabelSx, mb: 0 }}>
              카테고리
            </FieldLabel>

            <Text
              className="portfolio-editor-meta-limit-text"
              component="span"
              sx={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "1.5px",
                lineHeight: "16px",
                whiteSpace: "nowrap",
              }}
            >
              최소 1, 최대 5
            </Text>
          </Box>
          <Stack direction="row" className="portfolio-editor-meta-chip-list" useFlexGap sx={stackSx}>
            {formData.categories.map(category => (
              <PortfolioMetaChip
                variant="category"
                key={category.value}
                label={category.label}
                onDelete={() => handleDeleteCategory(category.value)}
              />
            ))}
          </Stack>
          <Autocomplete
            className="portfolio-editor-meta-autocomplete"
            id="category"
            options={selectableCategoryOptions}
            value={null}
            inputValue={categoryInputValue}
            disabled={isCategoryLimitReached}
            getOptionLabel={option => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onInputChange={(_, value, reason) => {
              if (reason === "input") setCategoryInputValue(value);
              if (reason === "clear") setCategoryInputValue("");
            }}
            onChange={handleCategoryChange}
            renderInput={params => <TextField {...params} size="small" sx={formInputSx} />}
          />
        </FormControl>

        <FormControl fullWidth required>
          <Box
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <FieldLabel required sx={{ ...fieldLabelSx, mb: 0 }}>
              기술 스택
            </FieldLabel>

            <Text
              className="portfolio-editor-meta-limit-text"
              component="span"
              sx={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "1.5px",
                lineHeight: "16px",
                whiteSpace: "nowrap",
              }}
            >
              최소 1, 최대 8
            </Text>
          </Box>
          <Stack direction="row" className="portfolio-editor-meta-chip-list" useFlexGap sx={stackSx}>
            {formData.tech_stacks.map(techStack => (
              <PortfolioMetaChip
                variant="tech"
                key={techStack.value}
                label={techStack.label}
                onDelete={() => handleDeleteTechStack(techStack.value)}
              />
            ))}
          </Stack>
          <Autocomplete
            className="portfolio-editor-meta-autocomplete"
            freeSolo
            id="tech_stack"
            options={selectableTechStackOptions}
            value={null}
            inputValue={techStackInputValue}
            disabled={isTechStackLimitReached}
            getOptionLabel={option => (typeof option === "string" ? option : option.label)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onInputChange={(_, value, reason) => {
              if (reason === "input") setTechStackInputValue(value);
              if (reason === "clear") setTechStackInputValue("");
            }}
            onChange={handleTechStackChange}
            renderInput={params => <TextField {...params} size="small" sx={formInputSx} />}
          />
        </FormControl>
      </Stack>
    </Paper>
  );
}

export default memo(ProjectMetaSection);
