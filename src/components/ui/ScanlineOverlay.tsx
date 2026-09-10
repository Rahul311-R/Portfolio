import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ScanlineOverlay: React.FC = () => {
  const { scanlinesEnabled } = useTheme();

  if (!scanlinesEnabled) return null;

  return <div className="scanline-effect" aria-hidden="true" />;
};
