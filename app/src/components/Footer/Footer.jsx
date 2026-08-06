import React from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import styles from "./Footer.module.css";

const PersonOutlineIcon = props => (
  <SvgIcon {...props}>
    <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </SvgIcon>
);

const ShareIcon = props => (
  <SvgIcon {...props}>
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </SvgIcon>
);

const EmailOutlinedIcon = props => (
  <SvgIcon {...props}>
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
  </SvgIcon>
);

const iconButtonStyle = {
  backgroundColor: "#ffffff",
  color: "#333333", // 아이콘 기본 색상 (필요시 변경)
  "&:hover": {
    backgroundColor: "#f0f0f0", // 마우스 올렸을 때 색상
  },
  padding: "8px",
};

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.logo}>Portfolio+</div>
          <p className={styles.description}>
            당신의 창의적인 커리어를 AI와 함께 완성하세요.
            <br />
            직관적인 관리와 전문적인 분석을 제공합니다.
          </p>

          <div className={styles.social}>
            <IconButton aria-label="프로필" sx={iconButtonStyle}>
              <PersonOutlineIcon />
            </IconButton>

            <IconButton aria-label="공유" sx={iconButtonStyle}>
              <ShareIcon />
            </IconButton>

            <IconButton aria-label="이메일" sx={iconButtonStyle}>
              <EmailOutlinedIcon />
            </IconButton>
          </div>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>제품</h4>
            <ul className={styles.colList}>
              <li>
                <Link to="/privacy" className={styles.colLink}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={styles.colLink}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>지원</h4>
            <ul className={styles.colList}>
              <li>
                <Link to="/help" className={styles.colLink}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className={styles.colLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>소셜</h4>
            <ul className={styles.colList}>
              <li>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.colLink}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.colLink}>
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copy}>© 2026 My Page. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
