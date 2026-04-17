/**
 * Common utility functions
 */

/**
 * Format price to currency format
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}

/**
 * Format date to readable format
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get role display name
 */
export function getRoleDisplay(role) {
  const roles = {
    ADMIN: 'Administrator',
    ARTISAN: 'Artisan',
    BUYER: 'Buyer',
    CONSULTANT: 'Cultural Consultant',
  };
  return roles[role] || role;
}

/**
 * Check if user has required role
 */
export function hasRole(user, requiredRole) {
  if (!user) return false;
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  return user.role === requiredRole;
}

/**
 * Get error message from API response
 */
export function getErrorMessage(error) {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data) {
    const errors = error.response.data;
    if (typeof errors === 'string') return errors;
    const firstKey = Object.keys(errors)[0];
    if (Array.isArray(errors[firstKey])) {
      return errors[firstKey][0];
    }
    return errors[firstKey];
  }
  return error.message || 'An error occurred';
}
