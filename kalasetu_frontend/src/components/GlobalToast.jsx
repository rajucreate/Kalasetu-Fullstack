import { useEffect, useRef, useState } from 'react';
import { subscribeToToasts } from '../services/toastService';
import '../styles/toast.css';

const TOAST_TIMEOUT = 2200;

export function GlobalToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((payload) => {
      setToast(payload);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setToast(null);
      }, TOAST_TIMEOUT);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!toast?.message) return null;

  return (
    <div className={`global-toast ${toast.type === 'error' ? 'error' : 'success'}`} role="status" aria-live="polite">
      <span>{toast.message}</span>
      <button type="button" aria-label="Close toast" onClick={() => setToast(null)}>
        ×
      </button>
    </div>
  );
}
