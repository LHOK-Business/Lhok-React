// Landing.jsx
// Home / Landing page
// Mobile-first responsive layout

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

// Import images (adjust paths as needed)
import img1 from '../../assets/image1.jpg';
import img2 from '../../assets/image2.jpg';
import img3 from '../../assets/image3.jpg';
import img4 from '../../assets/image4.jpg';

function Landing() {
  const imageGridRef = useRef(null);

  // ── CAROUSEL EFFECT (React version of your vanilla JS) ──
  useEffect(() => {
    const imageGrid = imageGridRef.current;

    if (!imageGrid) return;

    const images = Array.from(imageGrid.querySelectorAll('img'));

    if (images.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = styles.scrollWrapper;

    // Add originals
    images.forEach(img => {
      wrapper.appendChild(img.cloneNode(true));
    });

    // Duplicate for seamless loop
    images.forEach(img => {
      const clone = img.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(clone);
    });

    imageGrid.innerHTML = '';
    imageGrid.appendChild(wrapper);

  }, []);

  return (
    <main className={styles.page}>
      
      <div className={styles.container}>

        {/* ── LEFT SIDE (TEXT) ── */}
        <div className={styles.textSection}>
          <h1>Join Lhok Today</h1>

          <ul className={styles.textList}>
            <li>Welcome to Lhok!</li>
            <li>More than a platform, Lhok is a community.</li>
            <li>Connecting beauty professionals across the GTA.</li>
            <li>Collaborate, grow, and succeed together.</li>
            <li>Build your presence and connect with clients.</li>
            <li>Join the community and grow with us.</li>
          </ul>

          <Link to="/login" className={styles.ctaButton}>
            Join Lhok
          </Link>
        </div>

        {/* ── RIGHT SIDE (CAROUSEL) ── */}
        <div className={styles.carouselSection}>
          <div className={styles.imageGrid} ref={imageGridRef}>
            <img src={img1} alt="Beauty service 1" />
            <img src={img2} alt="Beauty service 2" />
            <img src={img3} alt="Beauty service 3" />
            <img src={img4} alt="Beauty service 4" />
          </div>
        </div>

      </div>

    </main>
  );
}

export default Landing;