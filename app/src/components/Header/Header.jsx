import { Link, NavLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { HEADER_AUTH_PATHS, HEADER_NAV_ITEMS } from "../../constants/header";
import styles from "./Header.module.css";

function Header({ isLoggedIn = false, avatarUrl = "", avatarAlt = "프로필" }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Portfolio+ 홈">
          Portfolio+
        </Link>

        <div className={styles.right}>
          <nav aria-label="주요 메뉴">
            <ul className={styles.navList}>
              {HEADER_NAV_ITEMS.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                    }
                    end={item.path === "/"}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {isLoggedIn ? (
            <Link to="/mypage" className={styles.avatarLink} aria-label="마이페이지">
              <Avatar src={avatarUrl || undefined} alt={avatarAlt} className={styles.avatar} />
            </Link>
          ) : (
            <div className={styles.authActions}>
              <Link to={HEADER_AUTH_PATHS.login} className={styles.loginButton}>
                로그인
              </Link>
              <Link to={HEADER_AUTH_PATHS.signup} className={styles.signupButton}>
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
