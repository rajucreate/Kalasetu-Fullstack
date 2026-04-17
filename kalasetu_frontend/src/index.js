/**
 * Central export file for all utilities, hooks, and constants
 * Use: import { useAuth, formatPrice, validators } from '@/utils'
 */

// Hooks
export { useAuth } from '../hooks/useAuth';
export { useFetch, useForm } from '../hooks/useFetch';

// Utilities
export {
  formatPrice,
  formatDate,
  truncateText,
  getRoleDisplay,
  hasRole,
  getErrorMessage,
} from './helpers';

export { storage } from './storage';
export { validators, validateForm } from './validators';

// Constants
export {
  USER_ROLES,
  ROLE_DISPLAY_NAMES,
  PRODUCT_STATUS,
  ROUTES,
  API_ENDPOINTS,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './constants';
