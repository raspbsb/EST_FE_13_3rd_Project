import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";
import styles from "./Login.module.css";

export default function Login() {
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
      console.log("로그인폼 제출:", { email, password, remember });
      await new Promise(r => setTimeout(r, 700));
    } catch (err) {
      setError(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="main" className={styles.container}>
      <div className={styles.content}>
        <Paper elevation={1} className={styles.left}>
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

            <Typography variant="body2" className={styles.signupText}>
              아직 회원이 아니신가요?{" "}
              <Link to="/signup" className={styles.signupLink}>
                회원가입
              </Link>
            </Typography>
          </form>
        </Paper>

        <div className={styles.right}>
          <div className={styles.hero} role="img" aria-label="login illustration" />
        </div>
      </div>
    </Box>
  );
}
