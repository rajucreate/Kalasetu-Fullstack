/**
 * Application constants and configuration
 */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  ARTISAN: 'ARTISAN',
  BUYER: 'BUYER',
  CONSULTANT: 'CONSULTANT',
};

export const ROLE_DISPLAY_NAMES = {
  ADMIN: 'Administrator',
  ARTISAN: 'Artisan',
  BUYER: 'Buyer',
  CONSULTANT: 'Cultural Consultant',
};

export const PRODUCT_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MARKETPLACE: '/marketplace',
  PRODUCT_DETAIL: '/products/:id',
  ARTISAN_PROFILE: '/artisan/:id',
  CONSULTANT_DASHBOARD: '/consultant/dashboard',
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    REFRESH: '/auth/refresh/',
    CURRENT_USER: '/auth/current-user/',
    UPDATE_PROFILE: '/auth/update-profile/',
  },
  PRODUCTS: {
    LIST: '/products/',
    DETAIL: '/products/:id/',
    CREATE: '/products/',
    UPDATE: '/products/:id/',
    DELETE: '/products/:id/',
    MY_PRODUCTS: '/products/my-products/',
    PENDING: '/products/pending-verification/',
    VERIFY: '/products/:id/verify/',
  },
  ARTISANS: {
    LIST: '/artisans/',
    DETAIL: '/artisans/:id/',
  },
  STORIES: {
    LIST: '/stories/',
    DETAIL: '/stories/:id/',
    CREATE: '/stories/',
    UPDATE: '/stories/:id/',
    DELETE: '/stories/:id/',
    MY_STORIES: '/stories/my-stories/',
  },
  CONSULTANT: {
    PENDING_PRODUCTS: '/consultant/pending-products/',
    VERIFY_PRODUCT: '/consultant/verify-product/',
  },
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  ITEMS_PER_PAGE: 12,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The resource you are looking for was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'You have been logged in successfully.',
  LOGOUT_SUCCESS: 'You have been logged out.',
  PRODUCT_CREATED: 'Product created successfully.',
  PRODUCT_UPDATED: 'Product updated successfully.',
  PRODUCT_DELETED: 'Product deleted successfully.',
  PRODUCT_VERIFIED: 'Product verified successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
};
