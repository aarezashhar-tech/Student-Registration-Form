import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';

export const INITIAL_DRAFT = {
  fullName: '',
  registerNumber: '',
  department: '',
  year: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: ''
};

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  // Theme state: defaults to 'light', persists across sessions
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'light');

  // Synchronize theme with HTML document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  // Saved students list: persists immediately to localStorage
  const [students, setStudents] = useLocalStorage(STORAGE_KEYS.STUDENTS, [], 0);

  // Form draft state: debounced by 350ms to prevent storage thrashing
  const [draft, setDraft, { isSaved: isDraftSaved, lastSaved: lastDraftSaved, clear: clearDraftStorage }] =
    useLocalStorage(STORAGE_KEYS.DRAFT, INITIAL_DRAFT, 350);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Confirm delete dialog state
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    student: null
  });

  // Display a toast message
  const showToast = useCallback((message, type = 'success', action = null, duration = 5000) => {
    setToast({
      id: Date.now(),
      message,
      type,
      action,
      duration
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Update a single draft field or entire draft
  const updateDraft = useCallback((field, value) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value
    }));
  }, [setDraft]);

  // Reset draft to initial empty state
  const resetDraft = useCallback(() => {
    clearDraftStorage();
  }, [clearDraftStorage]);

  // Add a newly registered student
  const addStudent = useCallback((formData) => {
    const newStudent = {
      id: `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...formData,
      fullName: formData.fullName.trim(),
      registerNumber: formData.registerNumber.trim().toUpperCase(),
      createdAt: new Date().toISOString()
    };

    setStudents((prev) => [newStudent, ...prev]);
    resetDraft();
    showToast(`Successfully registered ${newStudent.fullName}!`, 'success');
    return newStudent;
  }, [setStudents, resetDraft, showToast]);

  // Open the deletion confirmation modal
  const promptDeleteStudent = useCallback((student) => {
    setConfirmDeleteModal({
      isOpen: true,
      student
    });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setConfirmDeleteModal({
      isOpen: false,
      student: null
    });
  }, []);

  // Confirm deletion and provide 5-second undo toast
  const confirmDeleteStudent = useCallback(() => {
    const target = confirmDeleteModal.student;
    if (!target) return;

    // Find original index to restore exact position if undone
    const originalIndex = students.findIndex((s) => s.id === target.id);

    // Remove from students
    setStudents((prev) => prev.filter((s) => s.id !== target.id));
    closeDeleteModal();

    // Show toast with 5s Undo option
    showToast(
      `Deleted ${target.fullName}'s record.`,
      'info',
      {
        label: 'Undo',
        onClick: () => {
          setStudents((prev) => {
            const copy = [...prev];
            if (originalIndex >= 0 && originalIndex <= copy.length) {
              copy.splice(originalIndex, 0, target);
            } else {
              copy.unshift(target);
            }
            return copy;
          });
          showToast(`Restored ${target.fullName}'s record.`, 'success', null, 3000);
        }
      },
      5000
    );
  }, [confirmDeleteModal, students, setStudents, closeDeleteModal, showToast]);

  const value = useMemo(
    () => ({
      students,
      draft,
      isDraftSaved,
      lastDraftSaved,
      theme,
      toast,
      confirmDeleteModal,
      toggleTheme,
      updateDraft,
      setDraft,
      resetDraft,
      addStudent,
      promptDeleteStudent,
      closeDeleteModal,
      confirmDeleteStudent,
      showToast,
      hideToast
    }),
    [
      students,
      draft,
      isDraftSaved,
      lastDraftSaved,
      theme,
      toast,
      confirmDeleteModal,
      toggleTheme,
      updateDraft,
      setDraft,
      resetDraft,
      addStudent,
      promptDeleteStudent,
      closeDeleteModal,
      confirmDeleteStudent,
      showToast,
      hideToast
    ]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
}
