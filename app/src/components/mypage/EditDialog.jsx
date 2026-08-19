import { supabase } from "../../utils/supabase";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/userSlice";

import TagChip from "../TagChip";
import { techStackOptions } from "../../constants/portfolioOptions";

import { CloseIcon, LockIcon } from "../../lib/icons";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Text from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormLabel from "@mui/material/FormLabel";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const filterTechStackOptions = createFilterOptions();

export default function EditDialog({ open, onClose, profile, onProfileUpdate }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  //Edit dialog form 관리
  const [form, setForm] = useState({
    user_name: "",
    user_category: "",
    bio: "",
    skills: [],
    email: "",
    github_url: "",
    url2: "",
    is_public: true,
  });

  // 기술 스택 입력값
  const [skillInputValue, setSkillInputValue] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        user_name: profile.user_name ?? "",
        user_category: profile.user_category ?? "",
        bio: profile.bio ?? "",
        skills: profile.skills ?? [],
        email: profile.email ?? "",
        github_url: profile.github_url ?? "",
        url2: profile.url2 ?? "",
        is_public: profile.is_public,
      });
      setSkillInputValue("");
    }
  }, [open, profile]);

  // 기술 스택 Autocomplete 검색 결과
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

  // 기술 스택 선택 / 직접 입력
  const handleSkillChange = (_, selectedOption) => {
    if (!selectedOption) return;

    const value =
      typeof selectedOption === "string"
        ? selectedOption.trim()
        : selectedOption.inputValue?.trim() || selectedOption.label;

    if (!value) return;

    // 중복 방지
    if (form.skills.some(skill => skill.toLowerCase() === value.toLowerCase())) {
      setSkillInputValue("");
      return;
    }

    setForm(prev => ({
      ...prev,
      skills: [...prev.skills, value],
    }));

    setSkillInputValue("");
  };

  //chip 삭제
  const handleDeleteSkill = skill => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(item => item !== skill),
    }));
  };

  //활동내역 이벤트
  const handlePublicChange = e => {
    setForm(prev => ({
      ...prev,
      is_public: !e.target.checked,
    }));
  };

  // 입력값 변경
  const handleChange = e => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 전송 이벤트
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          user_name: form.user_name,
          user_category: form.user_category,
          bio: form.bio,
          skills: form.skills,
          email: form.email,
          github_url: form.github_url,
          url2: form.url2,
          is_public: form.is_public,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // local profile 업데이트
      onProfileUpdate(data);
      // local profile 업데이트
      dispatch(updateProfile(data));

      onClose();
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      setSnackbar({
        open: true,
        message: "프로필 수정에 실패했습니다.",
        severity: "error",
      });
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="프로필 수정 모달"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {"프로필 수정"}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit} id="profile-form" variant="subtitle2">
          <Stack spacing={2}>
            <Box>
              <FormLabel required>이름</FormLabel>
              <TextField
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
                placeholder="이름을 작성해주세요."
                fullWidth
                required
              />
            </Box>

            <Box>
              <FormLabel required>직군</FormLabel>
              <TextField
                name="user_category"
                value={form.user_category}
                onChange={handleChange}
                placeholder="직군을 입력해주세요."
                fullWidth
                required
              />
            </Box>

            <Box>
              <FormLabel>소개글</FormLabel>
              <TextField
                placeholder="소개글을 입력해주세요. (최대 100자)"
                multiline
                rows={5}
                fullWidth
                name="bio"
                value={form.bio}
                onChange={handleChange}
                slotProps={{
                  htmlInput: {
                    maxLength: 100,
                  },
                }}
              />
              <Text variant="caption" align="right" sx={{ display: "block" }}>
                {form.bio.length}/100
              </Text>
            </Box>

            <Box>
              <FormLabel>기술 스택</FormLabel>

              <Autocomplete
                freeSolo
                options={techStackOptions}
                value={null}
                inputValue={skillInputValue}
                filterOptions={handleFilterTechStackOptions}
                getOptionLabel={option => (typeof option === "string" ? option : option.label)}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onInputChange={(_, value, reason) => {
                  if (reason === "input") {
                    setSkillInputValue(value);
                  }

                  if (reason === "clear") {
                    setSkillInputValue("");
                  }
                }}
                onChange={handleSkillChange}
                renderInput={params => (
                  <TextField {...params} placeholder="기술 스택을 검색하거나 직접 입력하세요." fullWidth />
                )}
              />
              <Stack direction="row" spacing={1} useFlexGap flexwrap="wrap" sx={{ pt: "10px" }}>
                {form.skills.map(skill => (
                  <TagChip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill)} />
                ))}
              </Stack>
            </Box>

            <Box>
              <FormLabel>이메일</FormLabel>
              <TextField
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일을 작성해주세요."
                fullWidth
              />
            </Box>

            <Box>
              <FormLabel>개인 사이트</FormLabel>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="사이트1"
                  name="github_url"
                  value={form.github_url}
                  onChange={handleChange}
                  placeholder="사이트를 입력해주세요."
                  fullWidth
                />
                <TextField
                  label="사이트2"
                  name="url2"
                  value={form.url2}
                  onChange={handleChange}
                  placeholder="사이트를 입력해주세요."
                  fullWidth
                />
              </Stack>
            </Box>

            {/* 활동 내역 공개 여부 */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "56px",
                  bgcolor: "#fff",
                  border: "1px solid #f0f0f0",
                }}
              >
                <FormControlLabel
                  control={<Switch checked={!form.is_public} onChange={handlePublicChange} />}
                  label="활동내역 비공개"
                />
                <LockIcon color="primary" />
              </Box>
            </Box>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" type="submit" form="profile-form" autoFocus>
          적용하기
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar(prev => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() =>
            setSnackbar(prev => ({
              ...prev,
              open: false,
            }))
          }
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
