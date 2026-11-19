import React from 'react';

/**
 * Accessible form field wrapper providing label, input element,
 * required indicator, and validation error messages.
 */
export default function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  options = [],
  rows = 3,
  autoComplete,
  hint,
  disabled = false
}) {
  const fieldId = id || `field_${name}`;
  const errorId = `${fieldId}_error`;
  const hintId = `${fieldId}_hint`;

  return (
    <div className={`form-field-group ${error ? 'has-error' : ''}`}>
      <label htmlFor={fieldId} className="form-label">
        <span>{label}</span>
        {required ? (
          <span className="required-marker" aria-label="required" title="Required field">
            *
          </span>
        ) : (
          <span className="optional-marker">(optional)</span>
        )}
      </label>

      {type === 'select' ? (
        <div className="select-wrapper">
          <select
            id={fieldId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className="form-control form-select"
          >
            <option value="">{placeholder || `-- Select ${label} --`}</option>
            {options.map((opt) => {
              const optionValue = typeof opt === 'string' ? opt : opt.value;
              const optionLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
          <span className="select-arrow" aria-hidden="true">▼</span>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          id={fieldId}
          name={name}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className="form-control form-textarea"
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className="form-control form-input"
        />
      )}

      {hint && !error && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="field-error" role="alert">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
