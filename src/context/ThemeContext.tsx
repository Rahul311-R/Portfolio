import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  toggleReducedMotion: () => void;
  motionSource: 'system' | 'manual';
  commandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  toggleCommandMenu: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('rahul_portfolio_theme') as Theme;
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const [motionSource, setMotionSource] = useState<'system' | 'manual'>(() => {
    return localStorage.getItem('rahul_portfolio_motion') !== null ? 'manual' : 'system';
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    const saved = localStorage.getItem('rahul_portfolio_motion');
    if (saved !== null) return saved === 'reduced';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // System reduced motion listener — only applies while the user
  // hasn't chosen a manual preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('rahul_portfolio_motion') === null) {
        setReducedMotionState(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setReducedMotion = (val: boolean) => {
    setMotionSource('manual');
    setReducedMotionState(val);
    localStorage.setItem('rahul_portfolio_motion', val ? 'reduced' : 'full');
  };

  const toggleReducedMotion = () => {
    setReducedMotionState((prev) => {
      const next = !prev;
      setMotionSource('manual');
      localStorage.setItem('rahul_portfolio_motion', next ? 'reduced' : 'full');
      return next;
    });
  };

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('rahul_portfolio_theme', theme);
  }, [theme]);

  // Brand accent is a fixed design token (see index.css) — no runtime swapping.

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  const toggleCommandMenu = () => {
    setCommandMenuOpen((prev) => !prev);
  };

  // Global Keyboard listener for Command Menu `/`
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        setCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        reducedMotion,
        setReducedMotion,
        toggleReducedMotion,
        motionSource,
        commandMenuOpen,
        setCommandMenuOpen,
        toggleCommandMenu
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
