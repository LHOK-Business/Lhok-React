// REUSABLE FORM INPUT COMPONENT
// Props:
//   label       → text shown above the input (required)
//   id          → links the label to the input for accessibility (required)
//   type        → "text" | "email" | "tel" | "password" etc (default: "text")
//   value       → controlled value from parent state (required)
//   onChange    → function to update parent state (required)
//   placeholder → ghost text inside the input (optional)
//   required    → marks field as required (default: false)
//   error       → error message string to show below input (optional)

import React from 'react';
import styles from './FormInput.module.css';

function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
}) {
  return (
    <div className={styles.fieldWrapper}>

      {/* Label sits above the input */}
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      {/* The actual input */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />

      {/* Error message — only renders if error prop is passed */}
      {error && <p className={styles.errorText}>{error}</p>}

    </div>
  );
}

export default FormInput;