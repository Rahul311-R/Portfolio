import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AudioToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { soundEnabled, toggleSound } = useTheme();

  return (
    <button
      onClick={toggleSound}
      type="button"
      aria-label={`Turn Sound Effects ${soundEnabled ? 'Off' : 'On'}`}
      title={`Sound FX: ${soundEnabled ? 'ENABLED' : 'DISABLED'}`}
      className={`p-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${className}`}
    >
      {soundEnabled ? (
        <Volume2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
      )}
    </button>
  );
};
