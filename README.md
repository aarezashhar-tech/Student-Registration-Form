# Mohamed Sathak A.J. College of Engineering - Student Registration Web App

A clean, responsive, and accessible Student Registration web application built with **React**, **Vite**, and **vanilla CSS (CSS variables)** with zero external UI dependencies.

---

## 🚀 Features

- **College Header**: Centered, responsive branding for *Mohamed Sathak A.J. College of Engineering* with a theme toggle.
- **Comprehensive Form Fields**: Full Name, Register Number, Department, Year of Study, Email, Phone Number, Date of Birth, Gender, and Address (optional).
- **Live Validation & Duplicate Prevention**:
  - Instant, friendly feedback on keystroke and blur (e.g., *"Enter a 10-digit phone number"*).
  - Strict duplicate Register Number prevention against existing records (case-insensitive).
- **Persistent Autosave**:
  - Debounced autosave (350ms) to browser `localStorage`.
  - Half-filled forms survive page refreshes, browser crashes, or closed tabs.
  - Live *"Draft saved"* status indicator.
- **Enrolled Registry & Search**:
  - Responsive two-column desktop grid and mobile-first stacked cards from 360px+.
  - Live search filtering by student name, register number, or department.
  - Contextual empty states for both an empty registry and zero search matches.
- **Safe Deletion with 5-Second Undo**:
  - Accessible confirmation dialog: *"Delete [Name]'s record? This can't be undone."*
  - 5-second undo toast allows instant restoration of deleted records.
- **Dark Mode Support**:
  - Light mode by default; dark mode toggle persisted in `localStorage`.
  - Contrast ratios meet or exceed WCAG 2.1 AA (at least 4.5:1 for normal text).
- **Robust Storage Layer**:
  - Safe parsing handles empty or corrupted `localStorage` without crashing the application.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: Vanilla CSS with modern CSS Variables (no Tailwind, Bootstrap, or component libraries)
- **State Management**: React Context API + Custom Hooks (`useLocalStorage`)
- **Storage**: Browser `localStorage` (100% client-side, offline-capable)

---

## 📁 Project Structure

```text
Student Registration form/
├── index.html                   # HTML5 application shell & favicon
├── package.json                 # Scripts and dependencies
├── vite.config.js               # Vite configuration (port 3000)
├── README.md                    # Project documentation
├── PRD.md                       # Product Requirements Document
├── DESIGN.md                    # UI/UX & Architecture Design System
└── src/
    ├── App.jsx                  # Main container layout
    ├── main.jsx                 # React root DOM mount point
    ├── components/
    │   ├── ConfirmDialog.jsx    # Accessible modal for deletion confirmation
    │   ├── EmptyState.jsx       # Contextual empty state graphics & text
    │   ├── FormField.jsx        # Reusable accessible input/select/textarea
    │   ├── Header.jsx           # College title and theme switch
    │   ├── RegistrationForm.jsx # Registration form with live validation & autosave
    │   ├── StudentCard.jsx      # Individual enrolled student record card
    │   ├── StudentList.jsx      # Student registry grid and search filter
    │   └── Toast.jsx            # Toast alert with 5s countdown Undo action
    ├── context/
    │   └── StudentContext.jsx   # Global state for students, draft, modal & toast
    ├── hooks/
    │   └── useLocalStorage.js   # Synchronized debounced localStorage hook
    ├── styles/
    │   ├── components.css       # Component-specific styles
    │   ├── global.css           # Reset, typography, and responsive grid
    │   └── variables.css        # CSS variables, 8px spacing, light/dark themes
    └── utils/
        ├── storage.js           # Resilient storage accessors & debounce helper
        └── validators.js        # Form validation rules & duplicate checks
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Installation

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000` (or `http://localhost:5173`).

### 3. Production Build

```bash
npm run build
npm run preview
```

---

## 💾 Where is the Data Stored?

All data is stored directly in your browser's **`localStorage`**:

| Storage Key | Content | Purpose |
| :--- | :--- | :--- |
| `msajce_students_records_v1` | Array of enrolled student objects | Persistent records; never lost on refresh |
| `msajce_registration_draft_v1` | Form input values | Autosaved half-filled draft; cleared on submit |
| `msajce_theme_preference_v1` | `'light'` or `'dark'` | User's active theme preference |

### How to Inspect the Stored Data

1. Open the application in Google Chrome or Microsoft Edge.
2. Press **`F12`** (or right-click anywhere and choose **Inspect**).
3. Navigate to the **Application** tab (in Firefox, **Storage**).
4. In the left sidebar, expand **Local Storage** > click `http://localhost:3000`.
5. You can view, edit, or delete the stored JSON data in real time.

---

## 🧪 Testing Checklist

- [ ] **Autosave**: Partially fill the form, reload the page, and verify the fields remain populated.
- [ ] **Validation**: Submit an empty form; check that required fields are outlined in red and keyboard focus moves to the first invalid field.
- [ ] **Duplicate Prevention**: Register a student with roll number `311820103001`. Try typing `311820103001` again in the form and verify the duplicate error prevents submission.
- [ ] **Search**: Use the search box to filter by student name, roll number, or department. Verify the empty state when no matches exist.
- [ ] **Delete & Undo**: Delete a student record, verify the confirmation dialog, confirm deletion, and click **Undo** within 5 seconds to verify full restoration.
- [ ] **Theme Switch**: Toggle between Light and Dark mode; verify that contrast remains crisp and accessible.
