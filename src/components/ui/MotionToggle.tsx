import React from 'react';
import { Pause, Play } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const MotionToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { reducedMotion, toggleReducedMotion } = useTheme();

  return (
    <button
      onClick={toggleReducedMotion}
      type="button"
      aria-pressed={reducedMotion}
      aria-label={reducedMotion ? 'Enable animations' : 'Reduce animations'}
      title={reducedMotion ? 'Enable animations' : 'Reduce animations'}
      className={`relative inline-flex items-center justify-center p-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${
        reducedMotion
          ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] text-[var(--accent-color)]'
          : 'border-[var(--border-color)] bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]'
      } ${className}`}
    >
      {reducedMotion ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
    </button>
  );
};
