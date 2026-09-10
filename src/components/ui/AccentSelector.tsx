import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useTheme, ACCENT_OPTIONS } from '../../context/ThemeContext';
import type { Accent } from '../../context/ThemeContext';

export const AccentSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { accent, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        aria-label="Change Accent Color"
        title="Change Accent Color"
        aria-expanded={open}
        className="p-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] flex items-center gap-1.5"
      >
        <Palette className="w-4 h-4 text-[var(--accent-color)]" />
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ backgroundColor: 'var(--accent-color)' }}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl rounded-md z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-mono text-[var(--text-muted)] tracking-wider uppercase border-b border-[var(--border-color)] mb-1">
            ACCENT SYSTEM
          </div>
          {ACCENT_OPTIONS.map((option) => {
            const isSelected = accent === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setAccent(option.id as Accent);
                  setOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs font-mono flex items-center justify-between hover:bg-[var(--bg-surface-secondary)] transition-colors ${
                  isSelected ? 'text-[var(--accent-color)] font-bold' : 'text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: option.darkHex }}
                  />
                  <span>{option.name}</span>
                </div>
                {isSelected && <span className="text-[10px] uppercase">ACTIVE</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
