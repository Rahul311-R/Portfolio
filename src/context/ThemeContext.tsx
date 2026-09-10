import React, { createContext, useContext, useEffect, useState } from 'react';
import { soundFx } from '../utils/audio';

export type Theme = 'dark' | 'light';
export type Accent = 'violet' | 'cyan' | 'lime' | 'orange';

export interface AccentOption {
  id: Accent;
  name: string;
  darkHex: string;
  lightHex: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: 'violet', name: 'Violet', darkHex: '#8B5CF6', lightHex: '#6D28D9' },
  { id: 'cyan', name: 'Cyan', darkHex: '#22D3EE', lightHex: '#087F9C' },
  { id: 'lime', name: 'Lime', darkHex: '#84CC16', lightHex: '#4D7C0F' },
  { id: 'orange', name: 'Orange', darkHex: '#F97316', lightHex: '#C2410C' }
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  scanlinesEnabled: boolean;
  setScanlinesEnabled: (enabled: boolean) => void;
  toggleScanlines: () => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
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

  const [accent, setAccentState] = useState<Accent>(() => {
    const savedAccent = localStorage.getItem('rahul_portfolio_accent') as Accent;
    return savedAccent && ['violet', 'cyan', 'lime', 'orange'].includes(savedAccent)
      ? savedAccent
      : 'violet';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const savedSound = localStorage.getItem('rahul_portfolio_sound');
    return savedSound !== null ? JSON.parse(savedSound) : true;
  });

  const [scanlinesEnabled, setScanlinesEnabledState] = useState<boolean>(() => {
    const savedScanlines = localStorage.getItem('rahul_portfolio_scanlines');
    return savedScanlines !== null ? JSON.parse(savedScanlines) : false;
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  useEffect(() => {
    soundFx.enabled = soundEnabled;
    localStorage.setItem('rahul_portfolio_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('rahul_portfolio_scanlines', JSON.stringify(scanlinesEnabled));
  }, [scanlinesEnabled]);

  // System reduced motion listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

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

  // Update CSS variables for chosen accent
  useEffect(() => {
    const root = document.documentElement;
    const accentConfig = ACCENT_OPTIONS.find((a) => a.id === accent) || ACCENT_OPTIONS[0];
    const accentHex = theme === 'dark' ? accentConfig.darkHex : accentConfig.lightHex;
    
    root.style.setProperty('--accent-color', accentHex);
    root.style.setProperty('--accent-glow', `${accentHex}44`);
    localStorage.setItem('rahul_portfolio_accent', accent);
  }, [accent, theme]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const toggleTheme = () => {
    soundFx.playClick();
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  const setAccent = (newAccent: Accent) => {
    soundFx.playClick();
    setAccentState(newAccent);
  };
  const toggleSound = () => {
    setSoundEnabledState((prev) => !prev);
  };
  const toggleScanlines = () => {
    soundFx.playClick();
    setScanlinesEnabledState((prev) => !prev);
  };
  const toggleCommandMenu = () => {
    soundFx.playClick();
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
        soundFx.playClick();
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
        accent,
        setAccent,
        soundEnabled,
        setSoundEnabled: setSoundEnabledState,
        toggleSound,
        scanlinesEnabled,
        setScanlinesEnabled: setScanlinesEnabledState,
        toggleScanlines,
        reducedMotion,
        setReducedMotion,
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
