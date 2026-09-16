import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';

/**
 * Renders UI inside the providers the app's components depend on
 * (ThemeContext powers useReducedMotion/theme across the UI kit).
 */
export function renderWithProviders(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}
