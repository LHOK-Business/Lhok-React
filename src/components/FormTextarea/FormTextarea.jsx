// REUSABLE TEXTAREA COMPONENT
// Props:
//   label       → text shown above the textarea
//   id          → links label to textarea for accessibility
//   value       → controlled value from parent state
//   onChange    → function to update parent state
//   placeholder → ghost text inside
//   required    → marks field as required (default: false)
//   error       → error message string (optional)
//   maxLength   → character limit (default: 500)
//   rows        → visible height in lines (default: 6)

import React from 'react';
import styles from './FormTextarea.module.css';

function FormTextarea({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  maxLength = 500,
  rows = 6,
}) {
  return (
    <div className={styles.fieldWrapper}>

      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        rows={rows}
        className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
      />

      {/* Character counter + error row */}
      <div className={styles.footer}>
        {error
          ? <p className={styles.errorText}>{error}</p>
          : <span />
        }
        <span className={styles.charCount}>
          {value.length}/{maxLength} characters
        </span>
      </div>

    </div>
  );
}

export default FormTextarea;