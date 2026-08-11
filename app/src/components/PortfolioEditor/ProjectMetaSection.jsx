/**
 * 참여 형태, 참여 규모, 진행 환경, 카테고리, 기술 스택 선택 섹션
 * @param {{ sectionCardSx: object, fieldLabelSx: object, formInputSx: object }} props - sectionCardSx: 섹션 외곽 카드 sx, fieldLabelSx: FieldLabel 공통 sx, formInputSx: Select 공통 sx
 * @returns {JSX.Element} 참여 정보 Select, 카테고리/기술 스택 선택 Select, 선택된 항목 Chip 목록
 */
import { useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  categoryOptions,
  participationScaleOptions,
  participationTypeOptions,
  progressEnvironmentOptions,
  techStackOptions,
} from "./portfolioEditorData";
import FieldLabel from "./FieldLabel";

const selectableCategoryOptions = categoryOptions.filter(option => option.value !== "search-web");
const selectableTechStackOptions = techStackOptions.filter(option => option.value !== "typing-vercel");

const initialSelectedCategories = selectableCategoryOptions.filter(option =>
  ["web", "frontend"].includes(option.value),
);
const initialSelectedTechStacks = selectableTechStackOptions.filter(option =>
  ["sass", "javascript", "react", "typescript", "next-js", "supabase"].includes(option.value),
);

function renderSelectMenuItems(options) {
  return options.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));
}

export default function ProjectMetaSection({ sectionCardSx, fieldLabelSx, formInputSx }) {
  const [selectedCategories, setSelectedCategories] = useState(initialSelectedCategories);
  const [selectedTechStacks, setSelectedTechStacks] = useState(initialSelectedTechStacks);
  const [techStackInputValue, setTechStackInputValue] = useState("");

  const handleAddCategory = category => {
    if (!category) return;

    setSelectedCategories(prev => {
      const exists = prev.some(item => item.value === category.value);

      if (exists) return prev;

      return [...prev, category];
    });
  };

  const handleDeleteCategory = categoryValue => {
    setSelectedCategories(prev => prev.filter(category => category.value !== categoryValue));
  };

  const handleAddTechStack = techStack => {
    if (!techStack) return;

    const nextTechStack =
      typeof techStack === "string"
        ? {
            value: techStack.trim().toLowerCase().replace(/\s+/g, "-"),
            label: techStack.trim(),
          }
        : techStack;

    if (!nextTechStack.label) return;

    setSelectedTechStacks(prev => {
      const exists = prev.some(
        item => item.value === nextTechStack.value || item.label.toLowerCase() === nextTechStack.label.toLowerCase(),
      );

      if (exists) return prev;

      return [...prev, nextTechStack];
    });
    setTechStackInputValue("");
  };

  const handleDeleteTechStack = techStackValue => {
    setSelectedTechStacks(prev => prev.filter(techStack => techStack.value !== techStackValue));
  };

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
            {selectedCategories.map(category => (
              <Chip
                className="portfolio-editor-category-chip"
                key={category.value}
                label={category.label}
                color="primary"
                size="small"
                clickable
                onDelete={() => handleDeleteCategory(category.value)}
              />
            ))}
          </Stack>
          <Autocomplete
            id="category"
            options={selectableCategoryOptions}
            value={null}
            getOptionLabel={option => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onChange={(_, selectedOption) => handleAddCategory(selectedOption)}
            renderInput={params => <TextField {...params} size="small" sx={formInputSx} />}
          />
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
            {selectedTechStacks.map(techStack => (
              <Chip
                className="portfolio-editor-tech-chip"
                key={techStack.value}
                label={techStack.label}
                size="small"
                clickable
                onDelete={() => handleDeleteTechStack(techStack.value)}
              />
            ))}
          </Stack>
          <Autocomplete
            freeSolo
            id="tech_stack"
            options={selectableTechStackOptions}
            value={null}
            inputValue={techStackInputValue}
            getOptionLabel={option => (typeof option === "string" ? option : option.label)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onInputChange={(_, value) => setTechStackInputValue(value)}
            onChange={(_, selectedOption) => handleAddTechStack(selectedOption)}
            renderInput={params => <TextField {...params} size="small" sx={formInputSx} />}
          />
        </FormControl>
      </Stack>
    </Paper>
  );
}
