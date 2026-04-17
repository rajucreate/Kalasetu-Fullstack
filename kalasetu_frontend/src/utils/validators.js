/**
 * Form validation utilities
 */

export const validators = {
  /**
   * Validate email format
   */
  email: (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!re.test(value)) return 'Invalid email format';
    return '';
  },

  /**
   * Validate password strength
   */
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  },

  /**
   * Validate password confirmation
   */
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  },

  /**
   * Validate required field
   */
  required: (value, fieldName = 'This field') => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return '';
  },

  /**
   * Validate minimum length
   */
  minLength: (value, min) => {
    if (!value) return '';
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return '';
  },

  /**
   * Validate phone number (Indian format)
   */
  phone: (value) => {
    const re = /^[6-9]\d{9}$/;
    if (!value) return 'Phone number is required';
    if (!re.test(value)) return 'Invalid phone number';
    return '';
  },

  /**
   * Validate URL
   */
  url: (value) => {
    if (!value) return '';
    try {
      new URL(value);
      return '';
    } catch {
      return 'Invalid URL';
    }
  },

  /**
   * Validate number
   */
  number: (value) => {
    if (!value) return '';
    if (isNaN(value)) return 'Must be a valid number';
    return '';
  },
};

/**
 * Validate entire form object
 */
export function validateForm(formData, rules) {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const error = rules[field](formData[field], formData);
    if (error) errors[field] = error;
  });
  return errors;
}
