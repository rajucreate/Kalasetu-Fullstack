const listeners = new Set();

function extractMessage(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((item) => extractMessage(item)).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    const firstKey = Object.keys(value)[0];
    return extractMessage(value[firstKey]);
  }
  return '';
}

export function subscribeToGlobalErrors(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitGlobalError(message) {
  if (!message) return;
  listeners.forEach((listener) => listener(message));
}

export function normalizeApiError(error, fallback = 'Something went wrong. Please try again.') {
  const detailMessage = extractMessage(error?.response?.data?.detail);
  if (detailMessage) return detailMessage;

  if (error?.response?.data && typeof error.response.data === 'object') {
    const firstKey = Object.keys(error.response.data)[0];
    const normalized = extractMessage(error.response.data[firstKey]);
    if (normalized) return normalized;
  }

  if (error?.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }

  return error?.message || fallback;
}
