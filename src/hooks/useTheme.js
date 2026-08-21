import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'stayscout-theme';

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    // Private mode / blocked site data — fall back to system.
    return null;
  }
}

/**
 * Theme with three states: 'light', 'dark', or null (follow the OS).
 * The chosen value is stamped on <html data-theme> so CSS can override the
 * prefers-color-scheme default in both directions.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readStored);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');

    try {
      if (theme) localStorage.setItem(STORAGE_KEY, theme);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Persisting is a convenience; ignore failures.
    }
  }, [theme]);

  const isDark = theme ? theme === 'dark' : systemDark;
  const toggle = useCallback(() => setTheme(isDark ? 'light' : 'dark'), [isDark]);

  return { isDark, toggle };
}
