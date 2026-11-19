import React, { useEffect, useRef } from 'react';
import { useStudentContext } from '../context/StudentContext';

/**
 * Accessible confirmation modal dialog for deleting student records.
 * Prompts user with "Delete [Name]'s record? This can't be undone."
 * Traps keyboard focus and supports ESC to dismiss.
 */
export default function ConfirmDialog() {
  const { confirmDeleteModal, closeDeleteModal, confirmDeleteStudent } = useStudentContext();
  const { isOpen, student } = confirmDeleteModal;

  const dialogRef = useRef(null);
  const cancelBtnRef = useRef(null);

  // Focus trap & ESC key listener
  useEffect(() => {
    if (!isOpen) return;

    // Focus cancel button by default for safety against accidental deletion
    const timer = setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDeleteModal();
      }

      // Trap focus inside modal
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDeleteModal]);

  if (!isOpen || !student) {
    return null;
  }

  // Exact prompt format: "Delete Aarez's record? This can't be undone."
  const studentName = student.fullName || 'this student';

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeDeleteModal();
        }
      }}
      role="presentation"
    >
      <div
        className="modal-container surface-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        ref={dialogRef}
      >
        <div className="modal-header">
          <div className="modal-icon-badge" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h2 id="dialog-title" className="modal-title">
            Confirm Deletion
          </h2>
        </div>

        <div className="modal-body">
          <p id="dialog-description" className="modal-text">
            Delete <strong>{studentName}</strong>'s record? This can't be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={closeDeleteModal}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDeleteStudent}
            className="btn btn-danger"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}
