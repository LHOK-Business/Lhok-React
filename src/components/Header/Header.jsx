import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import styles from './Header.module.css';
import logo from '../../assets/lhoklogo.png';

const NAV_ITEMS = [
  { label: 'Contact Us',              to: '/contact' },
  { label: 'Professionals', to: '/professionals' },
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Listen to Firebase auth state — runs once on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); // cleanup on unmount
  }, []);

  // Pull initials from displayName or email fallback
  const getInitials = (user) => {
    if (user.displayName) {
      const parts = user.displayName.trim().split(' ');
      return parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  const getMobileNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.mobileNavLink} ${styles.navLinkActive}` : styles.mobileNavLink;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>

          {/* ── LOGO ── */}
          <Link to="/" className={styles.logoLink}>
            <span style={{
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: 'var(--font-size-subheading)',
              color: 'var(--color-white)',
              letterSpacing: '0.15em',
            }}>
              <img src={logo} alt="LHOK" className={styles.logoImage} />
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.label} to={item.to} className={getNavLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ── LOGIN or AVATAR ── */}
          {currentUser ? (
            // Logged in — show initials circle linking to /profile
            <Link to="/Dashboard" className={styles.avatarButton}>
              {getInitials(currentUser)}
            </Link>
          ) : (
            // Logged out — show Login button
            <Link to="/login" className={styles.loginButton}>
              Login
            </Link>
          )}

          {/* ── HAMBURGER ── */}
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {isMobileMenuOpen && (
        <nav className={styles.mobileMenu} style={{ marginTop: 'var(--header-height)' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={getMobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          {currentUser ? (
            <Link
              to="/profile"
              className={styles.mobileLoginButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {getInitials(currentUser)} — My Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className={styles.mobileLoginButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

export default Header;