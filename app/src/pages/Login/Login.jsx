import React, { useState } from "react";
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

// 이미지 버튼 / hero import (assets 경로: app/src/assets/)
import heroImg from "../../assets/login-hero.png";
import googleBtn from "../../assets/Google-Button.png";
import kakaoBtn from "../../assets/Kakao-Button.png";
import naverBtn from "../../assets/Naver-Button.png";
import githubBtn from "../../assets/Github-Button.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      // result shape: { data, error }
      if (result?.error) {
        setError(result.error.message || "로그인 중 오류가 발생했습니다.");
        return;
      }
      // 로그인 성공 시 리다이렉트 (원하면 상태 저장/헤더 갱신 추가)
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
      const result = await supabase.auth.signInWithOAuth({ provider });
      if (result?.error) {
        setError(result.error.message || "OAuth 로그인 중 오류가 발생했습니다.");
      }
      // 대부분 OAuth는 Supabase가 브라우저 리다이렉트를 수행합니다.
    } catch (err) {
      setError(err?.message || "OAuth 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box component="main" className={styles.container}>
      <div className={styles.content}>
        {/* 왼쪽: 로그인 폼 영역 */}
        <div className={styles.left}>
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Typography variant="h5" component="h1" className={styles.title}>
                로그인
              </Typography>

              <TextField
                label="Email address"
                variant="outlined"
                fullWidth
                className={styles.field}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                type="email"
                autoComplete="email"
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                className={styles.field}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                type="password"
                autoComplete="current-password"
              />

              <FormControlLabel
                control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} color="primary" />}
                label="로그인 상태 유지"
                className={styles.remember}
              />

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

              {/* 소셜 로그인 버튼: 이미지 원형 버튼으로 대체, 가운데 정렬 */}
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
                  aria-label="Sign in with Naver"
                  onClick={() => handleOAuth("naver")}
                >
                  <img src={naverBtn} alt="Naver 로그인" className={styles.socialImg} />
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

        {/* 오른쪽: 이미지 (컨테이너 내부에 머무름) */}
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
