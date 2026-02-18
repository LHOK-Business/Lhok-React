/*
  Footer.jsx
  ══════════════════════════════════════════════════════════════
  LHOK site footer — flipped purple gradient with:
    - Nav link columns (left)
    - Copyright (right)

  Removed from original design: Internal Links, Admin Approval buttons
  Depends on: Footer.module.css, index.css variables
  ══════════════════════════════════════════════════════════════
*/

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';


/* ── NAV COLUMNS DATA ─────────────────────────────────────────
   Each object is one column. `links` is the list of items in it.
   To add a column: add another object to this array.
   To add a link:   add to the `links` array inside a column.

   `to`   = internal page (uses React Router <Link>)
   `href` = external site (uses plain <a> tag)
   ────────────────────────────────────────────────────────────*/
const FOOTER_COLUMNS = [
  {
    id: 'pages',
    links: [
      { label: 'Home',     to: '/' },
      { label: 'About Us', to: '/about' },
    ],
  },
  {
    id: 'legal',
    links: [
      { label: 'Privacy Policy',     to: '/privacy' },
      { label: 'Terms and Conditions', to: '/terms' },
    ],
  },
];


function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* ── NAV COLUMNS ───────────────────────────────────── */}
        <div className={styles.navColumns}>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.id} className={styles.navColumn}>
              {column.links.map((link) => (
                /*
                  Conditional rendering based on link type:
                  Internal link (has `to`) → use React Router <Link>
                  External link (has `href`) → use plain <a>
                */
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
            </div>
          ))}
        </div>

        {/* ── COPYRIGHT ─────────────────────────────────────── */}
        {/*
          currentYear is calculated dynamically at the top of this
          component so you never have to manually update it.
        */}
        <p className={styles.copyright}>
          © {currentYear} LHOK. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;