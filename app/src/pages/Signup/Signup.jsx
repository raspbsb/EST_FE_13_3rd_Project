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

import heroImg from "../../assets/login-hero.png";

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
    terms: `[서비스명] 서비스 이용약관

제1조 (목적)
본 약관은 [서비스명](이하 "회사")이 제공하는 서비스의 이용조건 및 절차, 회원과 회사 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (회원가입 및 계정)
1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의함으로써 회원가입을 신청합니다.
2. 회원은 본인의 계정 정보(이메일, 비밀번호 등)에 대한 관리 책임이 있으며, 이를 타인에게 양도하거나 대여할 수 없습니다.

제3조 (서비스의 제공 및 변경)
1. 회사는 이용자에게 안정적인 서비스를 제공하기 위해 최선을 다합니다.
2. 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장 등의 사유가 발생한 경우 서비스 제공이 일시적으로 중단될 수 있습니다.

제4조 (이용자의 의무)
이용자는 타인의 정보 도용, 회사의 업무 방해, 제3자의 저작권 침해 등 부당한 행위를 하여서는 안 됩니다.

제5조 (계약 해지 및 이용 제한)
회원은 언제든지 회원탈퇴를 신청할 수 있으며, 약관을 위반한 경우 서비스 이용이 제한될 수 있습니다.`,
    privacy: `개인정보 수집 및 이용 동의

1. 수집하는 개인정보 항목
- 필수항목: 이메일 주소, 비밀번호, 닉네임
- 자동수집항목: IP 주소, 쿠키, 방문 일시, 서비스 이용 기록

2. 개인정보의 수집 및 이용 목적
- 회원 가입 의사 확인 및 본인 식별·인증
- 회원 자격 유지·관리 및 부정 이용 방지
- 고지사항 전달 및 고객 문의 응대

3. 개인정보의 보유 및 이용 기간
- 원칙적으로 회원 탈퇴 시 지체 없이 파기합니다.
- 단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 법령에서 정한 기간 동안 보관합니다.

4. 동의 거부 권리 및 불이익
이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 단, 필수항목 동의 거부 시 회원가입 및 서비스 이용이 제한됩니다.`,
    marketing: `마케팅 정보 수신 동의 (선택)

1. 수집 및 이용 목적
- 신규 기능 및 서비스 안내
- 이벤트, 프로모션 정보 제공 및 맞춤형 혜택 안내
- 서비스 참여 기회 제공 및 통계 분석

2. 수집 항목
- 이메일 주소, 닉네임

3. 보유 및 이용 기간
- 회원 탈퇴 시 또는 마케팅 동의 철회 시까지

4. 동의 거부 권리
선택 항목에 동의하지 않으셔도 기본 서비스 이용이 가능하며, 언제든지 마이페이지에서 동의를 철회할 수 있습니다.`,
    push: `푸시 알림 수신 동의 (선택)

1. 알림 목적
- 서비스 주요 활동(댓글, 좋아요, 알림 메시지 등) 실시간 안내
- 이벤트 및 혜택 관련 정보 즉시 발송

2. 수신 채널
- 웹 브라우저 푸시 알림 및 모바일 앱 알림

3. 동의 철회
설정 페이지 또는 브라우저/기기 알림 설정에서 언제든지 알림 수신을 켜거나 끌 수 있습니다.`,
  };

  // onChange handler for ProfileAvatar -> receives File or null
  function handleProfileAvatarChange(fileOrNull) {
    // fileOrNull === null means deletion requested
    setAvatarFile(fileOrNull ?? null);
  }

  return (
    <Box component="main" className={styles.container}>
      <div className={styles.content}>
        {/* LEFT: 좌측 영역에 formCard를 가운데 정렬 */}
        <div className={styles.left}>
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
                  value={email || ""}
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
                  value={nickname || ""}
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
                  value={password || ""}
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
                  value={passwordConfirm || ""}
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

                <Typography variant="body2" className={styles.loginText}>
                  이미 계정이 있으신가요?{" "}
                  <Link to="/login" className={styles.loginLink}>
                    로그인
                  </Link>
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
                      control={
                        <Checkbox checked={agreeMarketing} onChange={e => setAgreeMarketing(e.target.checked)} />
                      }
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
                    <TextField multiline rows={5} fullWidth value={bio || ""} onChange={e => setBio(e.target.value)} />
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
                    value={techInput || ""}
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
        </div>

        {/* RIGHT: 우측 고정 히어로 이미지 (formCard 높이와 무관하게 고정) */}
        <div className={styles.right}>
          <img
            src={heroImg}
            alt="회원가입 히어로"
            className={styles.heroImage}
            onError={e => {
              if (e.currentTarget instanceof HTMLImageElement) e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      <TermsDialog
        open={openTermsDialog.open}
        onClose={() => setOpenTermsDialog({ open: false, title: "", content: "" })}
        title={openTermsDialog.title}
        content={openTermsDialog.content}
      />
    </Box>
  );
}
