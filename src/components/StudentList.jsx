import React, { useState, useMemo } from 'react';
import StudentCard from './StudentCard';
import EmptyState from './EmptyState';
import { useStudentContext } from '../context/StudentContext';

export default function StudentList() {
  const { students } = useStudentContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students by name or register number (case-insensitive)
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.trim().toLowerCase();
    return students.filter(
      (student) =>
        student.fullName?.toLowerCase().includes(query) ||
        student.registerNumber?.toLowerCase().includes(query) ||
        student.department?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <section className="surface-card student-list-section" aria-labelledby="list-heading">
      <div className="section-header list-section-header">
        <div className="list-title-group">
          <h2 id="list-heading" className="section-title">
            Enrolled Students
          </h2>
          <span className="count-badge" aria-label={`${students.length} total students enrolled`}>
            {students.length} {students.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {/* Search & Filter Bar */}
        {students.length > 0 && (
          <div className="search-box-wrapper">
            <label htmlFor="student-search-input" className="sr-only">
              Search by student name or register number
            </label>
            <div className="search-input-container">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                id="student-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, roll no, or department..."
                className="search-input"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="search-clear-btn"
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* List Content */}
      <div className="list-content-area">
        {students.length === 0 ? (
          <EmptyState isSearching={false} />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            isSearching={true}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />
        ) : (
          <div className="students-cards-grid" role="feed" aria-busy="false">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
