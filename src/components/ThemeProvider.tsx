import React, {createContext, useContext, useEffect, useState} from 'react';
import type {ThemePreference} from '../types/workout';
import {preferencesStorage} from '../services/storage';

interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: 'dark' | 'light';
  setTheme: (next: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyThemeToDom(resolved: 'dark' | 'light') {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? '#111413' : '#F5F7F6');
  }
}

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    return preferencesStorage.get().theme;
  });

  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(() =>
    resolveSystemTheme()
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light');
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme: 'dark' | 'light' =
    theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    applyThemeToDom(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (next: ThemePreference) => {
    setThemeState(next);
    const currentPrefs = preferencesStorage.get();
    preferencesStorage.save({...currentPrefs, theme: next});
  };

  return (
    <ThemeContext.Provider value={{theme, resolvedTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
