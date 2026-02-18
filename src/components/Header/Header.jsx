/*
  Header.jsx
  ══════════════════════════════════════════════════════════════
  LHOK site header — fixed purple gradient bar with:
    - Logo (left)
    - Nav links with pill hover effect (center)
    - Login button (right)
    - Hamburger menu on mobile

  Depends on: Header.module.css, index.css variables
  ══════════════════════════════════════════════════════════════
*/

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

import logo from '../../assets/lhoklogo.png';


/* ── NAV ITEMS ────────────────────────────────────────────────
   Update labels and paths to match your real pages.
   Order here = order in the header.
   ────────────────────────────────────────────────────────────*/
const NAV_ITEMS = [
  { label: 'Contact Us',              to: '/contact' },
  { label: 'Available Professionals', to: '/professionals' },
];


function Header() {
  // Tracks whether the mobile hamburger menu is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /*
    getNavLinkClass is passed to NavLink's className prop.
    NavLink calls it automatically with { isActive: true/false }
    depending on whether its `to` path matches the current URL.

    When active: apply both .navLink and .navLinkActive
    When not:    apply just .navLink
  */
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? `${styles.navLink} ${styles.navLinkActive}`
      : styles.navLink;

  const getMobileNavLinkClass = ({ isActive }) =>
    isActive
      ? `${styles.mobileNavLink} ${styles.navLinkActive}`
      : styles.mobileNavLink;

  return (
    /*
      <> ... </> is a React Fragment — lets us return two sibling
      elements (header + mobile menu) without adding an extra div to the DOM.
    */
    <>
      <header className={styles.header}>
        <div className={styles.container}>

          {/* ── LOGO ────────────────────────────────────────── */}
          {/*
            Link wraps the logo so clicking it navigates home.
            Once you have your logo file in assets/:
              Replace the text "LHOK" with:
              <img src={logo} alt="LHOK" className={styles.logoImage} />
          */}

          <Link to="/" className={styles.logoLink}>
            {/* Swap this <span> for your <img> once you import the logo */}
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


          {/* ── DESKTOP NAV ─────────────────────────────────── */}
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              /*
                NavLink vs Link:
                  Link      — just navigates, no active state awareness
                  NavLink   — same as Link, but knows if its path is active
                              so we can style the current page differently
              */
              <NavLink
                key={item.label}
                to={item.to}
                className={getNavLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>


          {/* ── LOGIN BUTTON ─────────────────────────────────── */}
          {/*
            Using <Link> here because Login is a navigation action.
            If you later build a modal login instead, swap this for
            a <button onClick={openLoginModal}>.
          */}
          <Link to="/login" className={styles.loginButton}>
            Login
          </Link>


          {/* ── HAMBURGER (mobile only) ──────────────────────── */}
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {/* Three lines = hamburger icon, styled purely in CSS */}
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

        </div>
      </header>


      {/* ── MOBILE MENU ───────────────────────────────────────
          Only renders when isMobileMenuOpen is true.
          `&&` means: "if left side is true, render right side"

          It sits directly below the fixed header in the DOM.
          Because the header is fixed, this menu naturally appears
          under it at the top of the scrollable page area.
          ────────────────────────────────────────────────────*/}
      {isMobileMenuOpen && (
        <nav
          className={styles.mobileMenu}
          style={{ marginTop: 'var(--header-height)' }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={getMobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)} // close menu on navigate
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            to="/login"
            className={styles.mobileLoginButton}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
        </nav>
      )}
    </>
  );
}

export default Header;