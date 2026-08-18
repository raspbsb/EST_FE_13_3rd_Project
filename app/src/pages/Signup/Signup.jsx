import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TermsDialog from "./TermsDialog";
import styles from "./Signup.module.css";
import { supabase } from "../../utils/supabase";
import ProfileAvatar from "../../components/mypage/ProfileAvatar"; // 재사용

/**
 * 3-step Signup (updated: use ProfileAvatar for avatar handling)
 */
export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step1
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  // Step2 agreements
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agree14, setAgree14] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [agreePush, setAgreePush] = useState(false);

  const [openTermsDialog, setOpenTermsDialog] = useState({ open: false, title: "", content: "" });

  // Step3 additional
  const [avatarFile, setAvatarFile] = useState(null); // File received from ProfileAvatar.onChange
  const [bio, setBio] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techStacks, setTechStacks] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  const NICK_MIN = 2;
  const NICK_MAX = 20;

  function validateStep1Fields() {
    let ok = true;
    if (!email || !emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      ok = false;
    } else setEmailError("");

    const nickLen = nickname.trim().length;
    if (!nickname || nickLen < NICK_MIN || nickLen > NICK_MAX) {
      setNicknameError(`닉네임은 ${NICK_MIN}~${NICK_MAX}자 사이여야 합니다.`);
      ok = false;
    } else setNicknameError("");

    if (!password || !passwordRegex.test(password)) {
      setPasswordError("비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자로 입력해 주세요.");
      ok = false;
    } else setPasswordError("");

    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호 확인이 일치하지 않습니다.");
      ok = false;
    } else setPasswordConfirmError("");

    return ok;
  }

  function handleToggleAll(checked) {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgree14(checked);
    setAgreeMarketing(checked);
    setAgreePush(checked);
  }

  function handleTechKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = techInput.trim();
      if (!v) return;
      if (!techStacks.includes(v)) setTechStacks(s => [...s, v]);
      setTechInput("");
    }
  }
  function removeTech(tag) {
    setTechStacks(s => s.filter(t => t !== tag));
  }

  function goNext() {
    if (step === 1) {
      if (!validateStep1Fields()) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!(agreeTerms && agreePrivacy && agree14)) {
        setFormError("필수 약관에 모두 동의해야 다음 단계로 진행할 수 있습니다.");
        return;
      }
      setFormError("");
      setStep(3);
      return;
    }
  }
  function goPrev() {
    setFormError("");
    setStep(s => Math.max(1, s - 1));
  }

  // final submit: sign up + upload avatar (if provided) + insert profiles row
  async function handleSignup() {
    setFormError("");
    if (submitting) return;
    setSubmitting(true);

    try {
      const { data, error: signError } = await supabase.auth.signUp({ email, password });
      if (signError) throw signError;

      const userId = data?.user?.id ?? null;
      if (!userId) {
        // If email confirmation flow prevents immediate user creation, redirect to login
        navigate("/login", { replace: true });
        return;
      }

      let avatarPath = null;
      if (avatarFile) {
        const extension = avatarFile.name.split(".").pop();
        const filePath = `${userId}/avatar_${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("profile_avatars")
          .upload(filePath, avatarFile, { cacheControl: "3600", upsert: true });
        if (!uploadError) avatarPath = filePath;
      }

      const profileRow = {
        user_id: userId,
        user_name: nickname, // ensure non-null for profiles.user_name
        avatar_path: avatarPath,
        user_category: null,
        skills: techStacks,
        bio: bio || null,
        email,
        is_public: Boolean(isPublic),
        github_url: null,
        profile_view: 0,
        url2: null,
      };

      // const { error: profileError } = await supabase.from("profiles").insert(profileRow);
      // if (profileError) throw profileError;

      // signup complete -> redirect to login
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("signup failed", err);
      setFormError(err?.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const TERMS_TEXT = {
    terms: "이용약관 상세 내용 예시입니다.\n여기에 실제 약관 텍스트를 넣으세요.",
    privacy: "개인정보 수집 및 이용 동의 상세 내용 예시입니다.",
    marketing: "마케팅 동의 상세 내용 예시입니다.",
    push: "푸시 알림 수신 동의 상세 내용 예시입니다.",
  };

  // onChange handler for ProfileAvatar -> receives File or null
  function handleProfileAvatarChange(fileOrNull) {
    // fileOrNull === null means deletion requested
    setAvatarFile(fileOrNull ?? null);
  }

  return (
    <Box component="main" className={styles.container}>
      <div className={styles.content}>
        <div className={styles.formCard}>
          {/* Title + Stepper inside the FormCard */}
          <Typography variant="h5" component="h1" sx={{ textAlign: "center", mb: 2 }}>
            회원가입
          </Typography>

          <div className={styles.stepper} role="tablist" aria-label="회원가입 단계">
            <div className={`${styles.step} ${step === 1 ? styles.stepActive : ""}`}>
              <div className={styles.stepCircle}>1</div>
              <div>정보 입력</div>
            </div>
            <div className={`${styles.step} ${step === 2 ? styles.stepActive : ""}`}>
              <div className={styles.stepCircle}>2</div>
              <div>약관 동의</div>
            </div>
            <div className={`${styles.step} ${step === 3 ? styles.stepActive : ""}`}>
              <div className={styles.stepCircle}>3</div>
              <div>추가 정보</div>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className={styles.formColumn}>
              <TextField
                label="Email address"
                variant="outlined"
                fullWidth
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => {
                  if (!email || !emailRegex.test(email)) setEmailError("올바른 이메일 형식이 아닙니다.");
                  else setEmailError("");
                }}
                error={!!emailError}
                helperText={emailError}
                required
              />

              <TextField
                label="Nickname"
                variant="outlined"
                fullWidth
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                onBlur={() => {
                  const len = nickname.trim().length;
                  if (len < NICK_MIN || len > NICK_MAX)
                    setNicknameError(`닉네임은 ${NICK_MIN}~${NICK_MAX}자 사이여야 합니다.`);
                  else setNicknameError("");
                }}
                error={!!nicknameError}
                helperText={nicknameError}
                required
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => {
                  if (!passwordRegex.test(password))
                    setPasswordError("비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자로 입력해 주세요.");
                  else setPasswordError("");
                }}
                error={!!passwordError}
                helperText={passwordError}
                required
              />

              <TextField
                label="Password (confirm)"
                variant="outlined"
                fullWidth
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                onBlur={() => {
                  if (password !== passwordConfirm) setPasswordConfirmError("비밀번호 확인이 일치하지 않습니다.");
                  else setPasswordConfirmError("");
                }}
                error={!!passwordConfirmError}
                helperText={passwordConfirmError}
                required
              />

              <Button variant="contained" color="primary" onClick={goNext}>
                다음
              </Button>

              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                이미 계정이 있으신가요? <Link to="/login">로그인</Link>
              </Typography>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className={styles.formColumn}>
              <Box className={styles.agreeBox}>
                <div className={styles.agreeRow}>
                  <FormControlLabel
                    control={<Checkbox checked={agreeAll} onChange={e => handleToggleAll(e.target.checked)} />}
                    label={<strong>전체 동의</strong>}
                  />
                </div>

                <div className={styles.agreeRow}>
                  <FormControlLabel
                    control={<Checkbox checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />}
                    label="이용약관 동의 (필수)"
                  />
                  <Button
                    onClick={() => setOpenTermsDialog({ open: true, title: "이용약관", content: TERMS_TEXT.terms })}
                  >
                    &gt;
                  </Button>
                </div>

                <div className={styles.agreeRow}>
                  <FormControlLabel
                    control={<Checkbox checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)} />}
                    label="개인정보 수집 및 이용 동의 (필수)"
                  />
                  <Button
                    onClick={() =>
                      setOpenTermsDialog({
                        open: true,
                        title: "개인정보 수집 및 이용 동의",
                        content: TERMS_TEXT.privacy,
                      })
                    }
                  >
                    &gt;
                  </Button>
                </div>

                <div className={styles.agreeRow}>
                  <FormControlLabel
                    control={<Checkbox checked={agree14} onChange={e => setAgree14(e.target.checked)} />}
                    label="만 14세 이상입니다. (필수)"
                  />
                  <Button
                    onClick={() =>
                      setOpenTermsDialog({
                        open: true,
                        title: "만 14세 이상 동의",
                        content: "만 14세 이상 확인 약관 내용",
                      })
                    }
                  >
                    &gt;
                  </Button>
                </div>

                <div className={styles.agreeRow}>
                  <FormControlLabel
                    control={<Checkbox checked={agreeMarketing} onChange={e => setAgreeMarketing(e.target.checked)} />}
                    label="마케팅 정보 수신 동의 (선택)"
                  />
                  <Button
                    onClick={() =>
                      setOpenTermsDialog({ open: true, title: "마케팅 수신 동의", content: TERMS_TEXT.marketing })
                    }
                  >
                    &gt;
                  </Button>
                </div>

                <div className={styles.agreeRow}>
                  <FormControlLabel
                    control={<Checkbox checked={agreePush} onChange={e => setAgreePush(e.target.checked)} />}
                    label="푸시 알림 수신 동의 (선택)"
                  />
                  <Button
                    onClick={() =>
                      setOpenTermsDialog({ open: true, title: "푸시 알림 동의", content: TERMS_TEXT.push })
                    }
                  >
                    &gt;
                  </Button>
                </div>
              </Box>

              {formError && <Typography color="error">{formError}</Typography>}

              <div className={styles.actions}>
                <Button variant="outlined" onClick={goPrev}>
                  이전
                </Button>
                <Button variant="contained" color="primary" onClick={goNext}>
                  다음
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className={styles.formColumn}>
              <div className={styles.row}>
                <div className={styles.leftCol}>
                  <Typography variant="subtitle1">프로필 이미지 (선택)</Typography>
                  <Box sx={{ mt: 1 }}>
                    {/* ProfileAvatar 재사용: editable=true -> 내부에서 파일 선택/미리보기/삭제 동작을 제공 */}
                    <ProfileAvatar avatarPath={null} editable={true} onChange={handleProfileAvatarChange} />
                  </Box>
                </div>

                <div className={styles.rightCol}>
                  <Typography variant="subtitle1">소개 (선택)</Typography>
                  <TextField multiline rows={5} fullWidth value={bio} onChange={e => setBio(e.target.value)} />
                  <FormHelperText>{bio.length}/100</FormHelperText>
                </div>
              </div>

              <div>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  기술 스택 (선택)
                </Typography>
                <TextField
                  placeholder="기술을 입력하고 엔터를 눌러 추가하세요."
                  fullWidth
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {techStacks.map(t => (
                    <Chip key={t} label={t} onDelete={() => removeTech(t)} />
                  ))}
                </Stack>
              </div>

              <div>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  활동 내역 공개 여부
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <Box className={styles.radioCard}>
                    <FormControlLabel
                      control={<Checkbox checked={isPublic} onChange={() => setIsPublic(true)} />}
                      label="전체 공개"
                    />
                    <FormHelperText>모든 사용자가 내 활동 내역을 볼 수 있습니다.</FormHelperText>
                  </Box>
                  <Box className={styles.radioCard} sx={{ borderColor: "#dcdcdc" }}>
                    <FormControlLabel
                      control={<Checkbox checked={!isPublic} onChange={() => setIsPublic(false)} />}
                      label="비공개"
                    />
                    <FormHelperText>나만 볼 수 있으며, 추후 변경 가능합니다</FormHelperText>
                  </Box>
                </Box>
              </div>

              {formError && <Typography color="error">{formError}</Typography>}

              <div className={styles.actions}>
                <Button variant="outlined" onClick={goPrev}>
                  이전
                </Button>
                <Button variant="contained" color="primary" onClick={handleSignup} disabled={submitting}>
                  {submitting ? "가입 중..." : "가입"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <TermsDialog
          open={openTermsDialog.open}
          onClose={() => setOpenTermsDialog({ open: false, title: "", content: "" })}
          title={openTermsDialog.title}
          content={openTermsDialog.content}
        />
      </div>
    </Box>
  );
}
