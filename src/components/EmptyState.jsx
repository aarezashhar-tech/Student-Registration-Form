import React from 'react';

/**
 * Friendly empty state display for empty student list or no search matches.
 */
export default function EmptyState({ isSearching = false, searchQuery = '', onClearSearch }) {
  return (
    <div className="empty-state-container" role="status">
      <div className="empty-state-icon">
        {isSearching ? (
          <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        ) : (
          <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )}
      </div>

      <h3 className="empty-state-title">
        {isSearching ? 'No Matching Students Found' : 'No Students Registered Yet'}
      </h3>

      <p className="empty-state-description">
        {isSearching ? (
          <>
            No records matched <span className="highlight-query">"{searchQuery}"</span>. Check the spelling or clear the filter.
          </>
        ) : (
          'The registry is currently empty. Complete the form to register the first student.'
        )}
      </p>

      {isSearching && onClearSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="btn btn-secondary empty-action-btn"
        >
          Clear Search
        </button>
      )}
    </div>
  );
}
