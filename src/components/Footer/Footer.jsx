import React from 'react';
import { Link } from 'react-router-dom';
import SocialButton from '../SocialButton/SocialButton';
import styles from './Footer.module.css';

const EXPLORE_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'About Us',   to: '/about' },
  { label: 'Find a Pro', to: '/professionals' },
  { label: 'Contact Us', to: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy',       to: '/privacy' },
  { label: 'Terms & Conditions',   to: '/terms' },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* ── MAIN COLUMNS ROW ── */}
        <div className={styles.columnsRow}>

          {/* Column 1 — Explore */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>Explore</h3>
            <nav className={styles.linkList}>
              {EXPLORE_LINKS.map((link) => (
                <Link key={link.label} to={link.to} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 2 — Legal */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>Legal</h3>
            <nav className={styles.linkList}>
              {LEGAL_LINKS.map((link) => (
                <Link key={link.label} to={link.to} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Get Started */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>Get Started</h3>
            {/* <p className={styles.tagline}>
              Join the LHOK community of beauty professionals.
            </p> */}
            <Link to="/login" className={styles.ctaButton}>
              Start Lhoking
            </Link>
          </div>

          {/* Column 4 — Follow Us */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>Follow Us</h3>
            <div className={styles.socialRow}>
            <SocialButton 
              platform="instagram" 
              href="https://www.instagram.com/lhok.ca/" 
            />
            </div>
          </div>

        </div>

        {/* ── DIVIDER ── */}
        <div className={styles.divider} />

        {/* ── COPYRIGHT ── */}
        <p className={styles.copyright}>
          © {currentYear} LHOK Inc. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;