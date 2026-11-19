import React, { useState, useEffect, useRef } from 'react';
import FormField from './FormField';
import { useStudentContext } from '../context/StudentContext';
import {
  DEPARTMENTS,
  YEARS,
  GENDERS,
  validateField,
  validateForm
} from '../utils/validators';

export default function RegistrationForm() {
  const {
    draft,
    updateDraft,
    resetDraft,
    addStudent,
    students,
    isDraftSaved,
    lastDraftSaved
  } = useStudentContext();

  // Track touched state for live validation UX
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live validation whenever draft or student list changes
  useEffect(() => {
    const newErrors = {};
    Object.keys(draft).forEach((key) => {
      // Validate if field has been touched or has content
      if (touched[key] || draft[key]) {
        const error = validateField(key, draft[key], students);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    setErrors(newErrors);
  }, [draft, touched, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateDraft(name, value);

    // Live validate on keystroke for this field
    const error = validateField(name, value, students);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value, students);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(draft).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrors = validateForm(draft, students);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first error field for accessibility
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(`field_${firstErrorField}`);
      if (element) {
        element.focus();
      }
      setIsSubmitting(false);
      return;
    }

    // Submit valid student
    addStudent(draft);
    setTouched({});
    setErrors({});
    setIsSubmitting(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear the form draft?')) {
      resetDraft();
      setTouched({});
      setErrors({});
    }
  };

  // Determine autosave indicator text
  const hasDraftContent = Object.values(draft).some((val) => Boolean(val && val.trim?.()));

  return (
    <section className="surface-card form-section" aria-labelledby="form-heading">
      <div className="section-header">
        <div>
          <h2 id="form-heading" className="section-title">New Student Registration</h2>
          <p className="section-description">Fill out the details below to enroll a student.</p>
        </div>

        {/* Autosave Status Indicator */}
        <div className="autosave-status" aria-live="polite">
          {!hasDraftContent ? (
            <span className="autosave-idle">All changes saved</span>
          ) : isDraftSaved ? (
            <span className="autosave-saved" title="Draft saved in browser localStorage">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Draft saved</span>
            </span>
          ) : (
            <span className="autosave-saving">
              <span className="saving-spinner" aria-hidden="true"></span>
              <span>Saving draft...</span>
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="registration-form">
        <div className="form-grid">
          {/* Full Name */}
          <FormField
            id="field_fullName"
            name="fullName"
            label="Full Name"
            placeholder="e.g. Aarez Mohammed"
            value={draft.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fullName}
            required
            autoComplete="name"
          />

          {/* Register Number */}
          <FormField
            id="field_registerNumber"
            name="registerNumber"
            label="Register Number"
            placeholder="e.g. 311820104001"
            value={draft.registerNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.registerNumber}
            required
            autoComplete="off"
            hint="Unique college roll or registration ID"
          />

          {/* Department */}
          <FormField
            id="field_department"
            name="department"
            label="Department"
            type="select"
            options={DEPARTMENTS}
            value={draft.department}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.department}
            required
            placeholder="Select Department"
          />

          {/* Year */}
          <FormField
            id="field_year"
            name="year"
            label="Year of Study"
            type="select"
            options={YEARS}
            value={draft.year}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.year}
            required
            placeholder="Select Year"
          />

          {/* Email */}
          <FormField
            id="field_email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="student@msajce-edu.in"
            value={draft.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
            autoComplete="email"
          />

          {/* Phone */}
          <FormField
            id="field_phone"
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="e.g. 9876543210"
            value={draft.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            required
            autoComplete="tel"
            hint="10-digit mobile number"
          />

          {/* Date of Birth */}
          <FormField
            id="field_dob"
            name="dob"
            label="Date of Birth"
            type="date"
            value={draft.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.dob}
            required
          />

          {/* Gender */}
          <FormField
            id="field_gender"
            name="gender"
            label="Gender"
            type="select"
            options={GENDERS}
            value={draft.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.gender}
            required
            placeholder="Select Gender"
          />

          {/* Address (Optional, full span) */}
          <div className="grid-full-width">
            <FormField
              id="field_address"
              name="address"
              label="Permanent Address"
              type="textarea"
              rows={2}
              placeholder="Door No, Street name, City, State, PIN code"
              value={draft.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
              required={false}
              autoComplete="street-address"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          {hasDraftContent && (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Clear Form
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary submit-btn"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <span>Register Student</span>
          </button>
        </div>
      </form>
    </section>
  );
}
