const listeners = new Set();

export function subscribeToToasts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitToast(message, type = 'success') {
  if (!message) return;
  listeners.forEach((listener) => listener({ message, type }));
}
