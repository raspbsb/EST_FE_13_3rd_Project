import React from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { PersonOutlinedIcon, ShareIcon, EmailIcon } from "../../lib/icons";
import styles from "./Footer.module.css";

const iconButtonStyle = {
  backgroundColor: "#ffffff",
  color: "#333333",
  "&:hover": {
    backgroundColor: "#f0f0f0",
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
              <PersonOutlinedIcon />
            </IconButton>

            <IconButton aria-label="공유" sx={iconButtonStyle}>
              <ShareIcon />
            </IconButton>

            <IconButton aria-label="이메일" sx={iconButtonStyle}>
              <EmailIcon />
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
