import React from 'react';
import { StudentProvider } from './context/StudentContext';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import StudentList from './components/StudentList';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';

export default function App() {
  return (
    <StudentProvider>
      <div className="app-container">
        {/* College Header */}
        <Header />

        {/* Responsive Content Grid: Form (left) + Enrolled List (right) */}
        <main className="main-content">
          <div className="content-grid">
            <RegistrationForm />
            <StudentList />
          </div>
        </main>

        {/* Global Dialogs & Alerts */}
        <ConfirmDialog />
        <Toast />
      </div>
    </StudentProvider>
  );
}
