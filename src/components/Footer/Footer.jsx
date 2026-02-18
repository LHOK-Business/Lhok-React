import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

// Flat array — one row of links, no columns
const FOOTER_LINKS = [
  { label: 'Home',                  to: '/' },
  { label: 'About Us',              to: '/about' },
  { label: 'Privacy Policy',        to: '/privacy' },
  { label: 'Terms and Conditions',  to: '/terms' },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* ── LINKS ROW ─────────────────────────────────────── */}
        {/* justify-content: space-evenly in CSS spreads these across the full width */}
        <nav className={styles.navRow}>
          {FOOTER_LINKS.map((link) => (
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className={styles.navLink}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navLink}
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* ── COPYRIGHT ─────────────────────────────────────── */}
        <p className={styles.copyright}>
          © {currentYear} LHOK. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;