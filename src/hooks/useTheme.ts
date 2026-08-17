import { useCallback, useEffect, useState } from 'react';
import { loadState, saveState } from '../lib/storage';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'taskdeck.theme';

interface ThemeControls {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Manage the active color theme, persisting the choice and reflecting it on
 * the document root via the data-theme attribute the CSS variables key off.
 */
export function useTheme(): ThemeControls {
  const [theme, setTheme] = useState<Theme>(() =>
    loadState<Theme>(STORAGE_KEY, 'light')
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveState(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}
