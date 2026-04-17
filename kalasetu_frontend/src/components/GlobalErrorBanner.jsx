import { useEffect, useState } from 'react';
import { subscribeToGlobalErrors } from '../services/errorService';
import '../styles/global-error.css';

export function GlobalErrorBanner() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToGlobalErrors((errorMessage) => {
      setMessage(errorMessage);
    });

    return unsubscribe;
  }, []);

  if (!message) return null;

  return (
    <div className="global-error-banner" role="alert">
      <span>{message}</span>
      <button
        type="button"
        className="global-error-close"
        aria-label="Dismiss error"
        onClick={() => setMessage('')}
      >
        ×
      </button>
    </div>
  );
}
