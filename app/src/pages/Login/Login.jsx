import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";
import styles from "./Login.module.css";
import { supabase } from "../../utils/supabase";

// assets
import heroImg from "../../assets/login-hero.png";
import googleBtn from "../../assets/Google-Button.png";
import kakaoBtn from "../../assets/Kakao-Button.png";
import discordBtn from "../../assets/Discord-Button.png";
import githubBtn from "../../assets/Github-Button.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // 서버/일반 에러
  const [error, setError] = useState("");

  // 필드별 유효성 에러
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // 로그인/회원가입 페이지에서는 footer 숨김 및 스크롤 잠금
    document.body.classList.add("hide-footer");
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("hide-footer");
      document.body.classList.remove("no-scroll");
    };
  }, []);

  // Email Validation 규칙
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = value => {
    if (!value) {
      setEmailError("이메일을 입력해 주세요.");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // 비밀번호 입력 여부만 검사
  const validatePassword = value => {
    if (!value) {
      setPasswordError("비밀번호를 입력해 주세요.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // 입력 핸들러: 변경 시 실시간 검사
  const handleEmailChange = e => {
    const v = e.target.value;
    setEmail(v);
    if (emailError) validateEmail(v);
  };

  const handlePasswordChange = e => {
    const v = e.target.value;
    setPassword(v);
    if (passwordError) validatePassword(v);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    // 필드 검증
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message || "로그인 중 오류가 발생했습니다.");
        return;
      }
      // 로그인 성공 시 리다이렉트
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async provider => {
    setError("");
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({ provider });
      if (oauthError) {
        setError(oauthError.message || "OAuth 로그인 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setError(err?.message || "OAuth 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box component="main" className={styles.container} role="main">
      <div className={styles.content}>
        {/* 왼쪽: 로그인 폼 영역 */}
        <div className={styles.left}>
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <Typography variant="h5" component="h1" className={styles.title}>
                로그인
              </Typography>

              <TextField
                label="Email address"
                variant="outlined"
                fullWidth
                className={styles.field}
                value={email}
                onChange={handleEmailChange}
                onBlur={() => validateEmail(email)}
                required
                type="email"
                autoComplete="email"
                error={!!emailError}
                helperText={emailError}
                slotProps={{
                  htmlInput: {
                    "aria-invalid": !!emailError,
                    "aria-describedby": emailError ? "email-error" : undefined,
                  },
                }}
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                className={styles.field}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => validatePassword(password)}
                required
                type="password"
                autoComplete="current-password"
                error={!!passwordError}
                helperText={passwordError}
                slotProps={{
                  htmlInput: {
                    "aria-invalid": !!passwordError,
                    "aria-describedby": passwordError ? "password-error" : undefined,
                  },
                }}
              />

              <FormControlLabel
                control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} color="primary" />}
                label="로그인 상태 유지"
                className={styles.remember}
              />

              {/* 서버/공통 에러 */}
              {error && (
                <Typography color="error" variant="body2" className={styles.error}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? "로딩..." : "로그인"}
              </Button>

              <Divider className={styles.divider} />

              {/* 소셜 로그인 버튼 */}
              <div className={styles.oauthRow} role="group" aria-label="소셜 로그인">
                <button
                  type="button"
                  className={styles.socialBtn}
                  aria-label="Sign in with Google"
                  onClick={() => handleOAuth("google")}
                >
                  <img src={googleBtn} alt="Google 로그인" className={styles.socialImg} />
                </button>

                <button
                  type="button"
                  className={styles.socialBtn}
                  aria-label="Sign in with Kakao"
                  onClick={() => handleOAuth("kakao")}
                >
                  <img src={kakaoBtn} alt="Kakao 로그인" className={styles.socialImg} />
                </button>

                <button
                  type="button"
                  className={styles.socialBtn}
                  aria-label="Sign in with Discord"
                  onClick={() => handleOAuth("discord")}
                >
                  <img src={discordBtn} alt="Discord 로그인" className={styles.socialImg} />
                </button>

                <button
                  type="button"
                  className={styles.socialBtn}
                  aria-label="Sign in with GitHub"
                  onClick={() => handleOAuth("github")}
                >
                  <img src={githubBtn} alt="GitHub 로그인" className={styles.socialImg} />
                </button>
              </div>

              <Typography variant="body2" className={styles.signupText}>
                아직 회원이 아니신가요?{" "}
                <Link to="/signup" className={styles.signupLink}>
                  회원가입
                </Link>
              </Typography>
            </form>
          </div>
        </div>

        {/* 오른쪽: 이미지 */}
        <div className={styles.right}>
          <img
            src={heroImg}
            alt="로그인 배경"
            className={styles.heroImage}
            onError={e => {
              if (e.currentTarget instanceof HTMLImageElement) {
                e.currentTarget.style.display = "none";
              }
            }}
          />
        </div>
      </div>
    </Box>
  );
}
