import React, { useEffect, useState } from 'react';
import { useStudentContext } from '../context/StudentContext';

/**
 * Toast notification component.
 * Displays success / info alerts and provides an "Undo" action for 5 seconds.
 */
export default function Toast() {
  const { toast, hideToast } = useStudentContext();
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!toast) return;

    const duration = toast.duration || 5000;
    const initialSeconds = Math.ceil(duration / 1000);
    setTimeLeft(initialSeconds);

    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <aside className="toast-wrapper" aria-live="assertive" role="alert">
      <div className={`toast-card toast-${toast.type || 'info'}`}>
        <div className="toast-icon" aria-hidden="true">
          {toast.type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          )}
        </div>

        <div className="toast-message-body">
          <p className="toast-message-text">{toast.message}</p>
          {toast.action && (
            <span className="toast-timer-subtext">Undo available for {timeLeft}s</span>
          )}
        </div>

        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action.onClick();
              hideToast();
            }}
            className="toast-action-btn"
          >
            {toast.action.label || 'Undo'}
          </button>
        )}

        <button
          type="button"
          onClick={hideToast}
          className="toast-close-btn"
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </aside>
  );
}
