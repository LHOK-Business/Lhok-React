// REUSABLE DROPDOWN COMPONENT
// Props:
//   label    → text shown above the dropdown
//   id       → links label to select for accessibility
//   value    → controlled value from parent state
//   onChange → function to update parent state
//   options  → array of { value, label } objects
//   required → marks field as required (default: false)
//   error    → error message string (optional)

import React from 'react';
import styles from './FormSelect.module.css';

function FormSelect({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  error = '',
}) {
  return (
    <div className={styles.fieldWrapper}>

      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`${styles.select} ${error ? styles.selectError : ''}`}
      >
        {/* Default empty option */}
        <option value="">Select a subject</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className={styles.errorText}>{error}</p>}

    </div>
  );
}

export default FormSelect;