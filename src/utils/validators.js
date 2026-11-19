/**
 * Form field validation rules and friendly error messages.
 * Designed to provide immediate, clear feedback to students.
 */

export const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Artificial Intelligence and Data Science',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering'
];

export const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
];

export const GENDERS = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say'
];

/**
 * Validates a single field value.
 * @param {string} fieldName - Field name key.
 * @param {any} value - Field input value.
 * @param {Array} existingStudents - Current list of students for duplicate check.
 * @param {string|null} currentStudentId - Current student ID if editing (optional).
 * @returns {string|null} - Error message string or null if valid.
 */
export function validateField(fieldName, value, existingStudents = [], currentStudentId = null) {
  const val = typeof value === 'string' ? value.trim() : value;

  switch (fieldName) {
    case 'fullName':
      if (!val) return 'Enter your full name';
      if (val.length < 2) return 'Name must be at least 2 characters';
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Name should only contain letters and spaces';
      return null;

    case 'registerNumber':
      if (!val) return 'Enter your register number';
      if (!/^[a-zA-Z0-9_-]{4,20}$/.test(val)) {
        return 'Register number must be 4–20 alphanumeric characters';
      }
      // Check for duplicate register numbers (case-insensitive)
      if (existingStudents && existingStudents.length > 0) {
        const isDuplicate = existingStudents.some(
          student =>
            student.id !== currentStudentId &&
            student.registerNumber?.trim().toLowerCase() === val.toLowerCase()
        );
        if (isDuplicate) {
          return 'This register number is already registered';
        }
      }
      return null;

    case 'department':
      if (!val) return 'Please select a department';
      if (!DEPARTMENTS.includes(val)) return 'Select a valid department';
      return null;

    case 'year':
      if (!val) return 'Please select your year of study';
      if (!YEARS.includes(val)) return 'Select a valid year';
      return null;

    case 'email':
      if (!val) return 'Enter your email address';
      // Standard email regex
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return 'Enter a valid email address';
      }
      return null;

    case 'phone':
      if (!val) return 'Enter a 10-digit phone number';
      // Normalize: strip dashes, spaces, and optional +91 prefix
      const cleanPhone = val.replace(/[\s-]/g, '').replace(/^(\+91|0)/, '');
      if (!/^\d{10}$/.test(cleanPhone)) {
        return 'Enter a 10-digit phone number';
      }
      return null;

    case 'dob':
      if (!val) return 'Select your date of birth';
      const birthDate = new Date(val);
      const today = new Date();
      if (isNaN(birthDate.getTime())) return 'Enter a valid date';
      if (birthDate >= today) return 'Date of birth cannot be in the future';
      
      // Reasonable student age check (between 14 and 80 years old)
      const ageDiffMs = today.getTime() - birthDate.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 14) return 'Student must be at least 14 years old';
      if (age > 80) return 'Please check the year entered';
      return null;

    case 'gender':
      if (!val) return 'Please select your gender';
      if (!GENDERS.includes(val)) return 'Select a valid gender';
      return null;

    case 'address':
      if (val && val.length > 300) return 'Address cannot exceed 300 characters';
      return null;

    default:
      return null;
  }
}

/**
 * Validates the entire form and returns an object of errors.
 * @param {Object} formData
 * @param {Array} existingStudents
 * @returns {Object} errors - Map of field names to error messages.
 */
export function validateForm(formData, existingStudents = []) {
  const errors = {};
  const fields = [
    'fullName',
    'registerNumber',
    'department',
    'year',
    'email',
    'phone',
    'dob',
    'gender',
    'address'
  ];

  for (const field of fields) {
    const error = validateField(field, formData[field], existingStudents);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}
