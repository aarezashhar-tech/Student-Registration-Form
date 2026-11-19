/**
 * Resilient localStorage utility.
 * Protects against corrupted storage, quota exceeded, private browsing restrictions,
 * and handles JSON parsing errors safely without crashing the UI.
 */

export const STORAGE_KEYS = {
  STUDENTS: 'msajce_students_records_v1',
  DRAFT: 'msajce_registration_draft_v1',
  THEME: 'msajce_theme_preference_v1'
};

/**
 * Safely retrieve and parse a JSON item from localStorage.
 * @param {string} key
 * @param {any} fallback
 * @returns {any}
 */
export function getStorageItem(key, fallback = null) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined || raw.trim() === '') {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] Error parsing localStorage key "${key}". Resetting to fallback.`, err);
    // If the data was corrupted JSON, clear the corrupted entry so subsequent operations succeed
    try {
      window.localStorage.removeItem(key);
    } catch (_) {
      // Ignore removal failure
    }
    return fallback;
  }
}

/**
 * Safely stringify and write an item to localStorage.
 * @param {string} key
 * @param {any} value
 * @returns {boolean} True if successfully stored
 */
export function setStorageItem(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.error(`[storage] Failed to write key "${key}" to localStorage.`, err);
    return false;
  }
}

/**
 * Safely remove an item from localStorage.
 * @param {string} key
 */
export function removeStorageItem(key) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.error(`[storage] Failed to remove key "${key}".`, err);
  }
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait = 400) {
  let timeoutId;
  function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return debounced;
}
