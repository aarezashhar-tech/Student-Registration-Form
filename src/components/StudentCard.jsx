import React from 'react';
import { useStudentContext } from '../context/StudentContext';

export default function StudentCard({ student }) {
  const { promptDeleteStudent } = useStudentContext();

  const formattedDate = student.dob
    ? new Date(student.dob).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <article className="student-card" aria-labelledby={`student_name_${student.id}`}>
      <div className="student-card-header">
        <div className="student-header-info">
          <h3 id={`student_name_${student.id}`} className="student-name">
            {student.fullName}
          </h3>
          <span className="student-reg-badge" title="Register Number">
            {student.registerNumber}
          </span>
        </div>

        <button
          type="button"
          onClick={() => promptDeleteStudent(student)}
          className="btn-icon-delete"
          aria-label={`Delete record for ${student.fullName}`}
          title={`Delete ${student.fullName}`}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>

      <div className="student-meta-badges">
        <span className="meta-badge dept-badge">{student.department}</span>
        <span className="meta-badge year-badge">{student.year}</span>
        <span className="meta-badge gender-badge">{student.gender}</span>
      </div>

      <div className="student-card-body">
        <div className="student-detail-row">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="detail-icon">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <a href={`mailto:${student.email}`} className="detail-link" title={`Email ${student.email}`}>
            {student.email}
          </a>
        </div>

        <div className="student-detail-row">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="detail-icon">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <a href={`tel:${student.phone}`} className="detail-link" title={`Call ${student.phone}`}>
            {student.phone}
          </a>
        </div>

        {formattedDate && (
          <div className="student-detail-row">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="detail-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="detail-text">DOB: {formattedDate}</span>
          </div>
        )}

        {student.address && (
          <div className="student-detail-row address-row">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="detail-icon">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="detail-text address-text">{student.address}</span>
          </div>
        )}
      </div>
    </article>
  );
}
