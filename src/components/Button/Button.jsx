// REUSABLE BUTTON COMPONENT
// Props:
//   label    → the text shown on the button (required)
//   onClick  → function to call when clicked (optional)
//   type     → "button" | "submit" | "reset"  (default: "button")
//              "submit" is used inside forms to trigger form submission
//   disabled → true/false — grays out and blocks clicks (default: false)

import React from 'react';
import styles from './Button.module.css';

function Button({ label, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles.button}
    >
      {label}
    </button>
  );
}

export default Button;