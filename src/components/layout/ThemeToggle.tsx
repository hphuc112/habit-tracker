'use client';

import { useEffect, useState } from 'react';

function applyTheme(nextTheme: 'dark' | 'light') {
  document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  document.documentElement.style.colorScheme = nextTheme;
  window.localStorage.setItem('theme', nextTheme);
}

function readThemeFromDocument(): 'dark' | 'light' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readThemeFromDocument());
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      return nextTheme;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="border-border bg-accent hover:bg-secondary/30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition"
      aria-label={
        mounted
          ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
          : 'Toggle color mode'
      }
    >
      {!mounted ? (
        <span className="h-4 w-4" aria-hidden />
      ) : theme === 'dark' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
