import { useState, useEffect, useRef, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

/**
 * Custom hook to bind React state to localStorage with optional debounced writing
 * and autosave status reporting.
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - Fallback initial value
 * @param {number} debounceMs - Debounce interval in ms for writes (0 for immediate)
 * @returns {[any, Function, { isSaved: boolean, lastSaved: Date | null, clear: Function }]}
 */
export function useLocalStorage(key, initialValue, debounceMs = 0) {
  // Lazy initialize state safely from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    return getStorageItem(key, initialValue);
  });

  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const timeoutRef = useRef(null);

  // Keep a ref of latest value to avoid stale closure issues
  const valueRef = useRef(storedValue);
  valueRef.current = storedValue;

  const persistToStorage = useCallback((val) => {
    setStorageItem(key, val);
    setIsSaved(true);
    setLastSaved(new Date());
  }, [key]);

  // Setter function that updates state immediately and schedules/executes persistence
  const setValue = useCallback((valueOrFn) => {
    setStoredValue((prev) => {
      const nextValue = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      
      setIsSaved(false);

      if (debounceMs > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          persistToStorage(nextValue);
        }, debounceMs);
      } else {
        persistToStorage(nextValue);
      }

      return nextValue;
    });
  }, [debounceMs, persistToStorage]);

  // Cleanup timeout on unmount or key change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        // Persist immediately on unmount so changes are never lost
        persistToStorage(valueRef.current);
      }
    };
  }, [persistToStorage]);

  // Force clear utility
  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStoredValue(initialValue);
    setStorageItem(key, initialValue);
    setIsSaved(true);
    setLastSaved(null);
  }, [key, initialValue]);

  return [storedValue, setValue, { isSaved, lastSaved, clear }];
}
