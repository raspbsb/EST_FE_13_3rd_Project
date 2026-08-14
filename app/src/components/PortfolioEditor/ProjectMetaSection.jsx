/**
 * 참여 형태, 참여 규모, 진행 환경, 카테고리, 기술 스택 선택 섹션
 * @param {{ sectionCardSx: object, fieldLabelSx: object, formInputSx: object }} props - sectionCardSx: 섹션 외곽 카드 sx, fieldLabelSx: FieldLabel 공통 sx, formInputSx: Select 공통 sx
 * @returns {JSX.Element} 참여 정보 Select, 카테고리/기술 스택 선택 Select, 선택된 항목 Chip 목록
 */
import { memo, useCallback, useMemo, useState } from "react";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
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
  environmentOptions,
  scaleOptions,
  techStackOptions,
  typeOptions,
} from "../../constants/portfolioOptions";
import FieldLabel from "./FieldLabel";
import PortfolioMetaChip from "./PortfolioMetaChip";

const selectableCategoryOptions = categoryOptions.filter(option => option.value !== "search-web");
const selectableTechStackOptions = techStackOptions;
const filterTechStackOptions = createFilterOptions();
const selectMenuProps = {
  disableScrollLock: true,
  slotProps: {
    root: {
      sx: {
        zIndex: 1200,
      },
    },
  },
};

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
  projectType,
  teamSize,
  environment,
  categories,
  techStacks,
  handleFormChange,
  handleAddCategory,
  handleDeleteCategory,
  handleAddTechStack,
  handleDeleteTechStack,
  maxCategoryCount,
  maxTechStackCount,
  formErrors = {},
}) {
  const [techStackInputValue, setTechStackInputValue] = useState("");
  const [categoryInputValue, setCategoryInputValue] = useState("");

  const handleCategoryChange = useCallback(
    (_, selectedOption) => {
      handleAddCategory(selectedOption);
      setCategoryInputValue("");
    },
    [handleAddCategory],
  );

  const handleTechStackChange = useCallback(
    (_, selectedOption) => {
      handleAddTechStack(selectedOption);
      setTechStackInputValue("");
    },
    [handleAddTechStack],
  );

  const handleFilterTechStackOptions = useCallback((options, params) => {
    const filteredOptions = filterTechStackOptions(options, params);
    const inputValue = params.inputValue.trim();
    const hasSameOption = options.some(option => option.label.toLowerCase() === inputValue.toLowerCase());

    if (inputValue && !hasSameOption) {
      filteredOptions.unshift({
        value: inputValue.toLowerCase().replace(/\s+/g, "-"),
        label: `직접 입력 중: ${inputValue}`,
        inputValue,
      });
    }

    return filteredOptions;
  }, []);

  const stackSx = useMemo(
    () => ({
      mb: 1,
      width: "100%",
      minWidth: 0,
      maxWidth: "100%",
      overflow: "hidden",
      flexWrap: "wrap",
    }),
    [],
  );

  const isCategoryLimitReached = categories.length >= maxCategoryCount;
  const isTechStackLimitReached = techStacks.length >= maxTechStackCount;

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
              value={projectType}
              onChange={handleFormChange}
              MenuProps={selectMenuProps}
              inputProps={{ "aria-label": "참여 형태" }}
              sx={formInputSx}
            >
              {renderSelectMenuItems(typeOptions)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FieldLabel sx={fieldLabelSx}>참여 규모</FieldLabel>
            <Select
              id="team_size"
              name="team_size"
              size="small"
              value={teamSize}
              onChange={handleFormChange}
              MenuProps={selectMenuProps}
              inputProps={{ "aria-label": "참여 규모" }}
              sx={formInputSx}
            >
              {renderSelectMenuItems(scaleOptions)}
            </Select>
          </FormControl>
        </Box>

        <FormControl fullWidth>
          <FieldLabel sx={fieldLabelSx}>진행 환경</FieldLabel>
          <Select
            id="environment"
            name="environment"
            size="small"
            value={environment}
            onChange={handleFormChange}
            MenuProps={selectMenuProps}
            inputProps={{ "aria-label": "진행 환경" }}
            sx={formInputSx}
          >
            {renderSelectMenuItems(environmentOptions)}
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
              id="category-feedback"
              className={`portfolio-editor-meta-limit-text${
                formErrors.categories ? " portfolio-editor-meta-limit-text--error" : ""
              }`}
              component="span"
              sx={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "1.5px",
                lineHeight: "16px",
                whiteSpace: "nowrap",
              }}
            >
              {formErrors.categories || "최소 1, 최대 5"}
            </Text>
          </Box>
          <Stack direction="row" className="portfolio-editor-meta-chip-list" useFlexGap sx={stackSx}>
            {categories.map(category => (
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
            renderInput={params => (
              <TextField
                {...params}
                size="small"
                sx={formInputSx}
                inputProps={{
                  ...params.inputProps,
                  "aria-label": "카테고리 추가",
                  "aria-invalid": Boolean(formErrors.categories),
                  "aria-describedby": "category-feedback",
                }}
              />
            )}
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
              id="tech-stack-feedback"
              className={`portfolio-editor-meta-limit-text${
                formErrors.tech_stacks ? " portfolio-editor-meta-limit-text--error" : ""
              }`}
              component="span"
              sx={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "1.5px",
                lineHeight: "16px",
                whiteSpace: "nowrap",
              }}
            >
              {formErrors.tech_stacks || "최소 1, 최대 8"}
            </Text>
          </Box>
          <Stack direction="row" className="portfolio-editor-meta-chip-list" useFlexGap sx={stackSx}>
            {techStacks.map(techStack => (
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
            filterOptions={handleFilterTechStackOptions}
            getOptionLabel={option => (typeof option === "string" ? option : option.label)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onInputChange={(_, value, reason) => {
              if (reason === "input") setTechStackInputValue(value);
              if (reason === "clear") setTechStackInputValue("");
            }}
            onChange={handleTechStackChange}
            renderInput={params => (
              <TextField
                {...params}
                size="small"
                sx={formInputSx}
                inputProps={{
                  ...params.inputProps,
                  "aria-label": "기술 스택 추가",
                  "aria-invalid": Boolean(formErrors.tech_stacks),
                  "aria-describedby": "tech-stack-feedback",
                }}
              />
            )}
          />
        </FormControl>
      </Stack>
    </Paper>
  );
}

export default memo(ProjectMetaSection);
