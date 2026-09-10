import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Command } from 'lucide-react';
import { AccentSelector } from '../ui/AccentSelector';
import { useTheme } from '../../context/ThemeContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; path: string; badge?: string }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links }) => {
  const { toggleCommandMenu } = useTheme();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-sm flex justify-end" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Site navigation" className="w-full max-w-sm bg-[var(--bg-surface)] h-full p-6 flex flex-col justify-between border-l border-[var(--border-color)] animate-in slide-in-from-right duration-200" onMouseDown={(event) => event.stopPropagation()}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] flex items-center justify-center font-mono text-xs font-bold text-[var(--accent-color)]">
                R
              </div>
              <span className="font-display font-bold text-sm tracking-wider text-[var(--text-primary)]">
                RAHUL R
              </span>
            </div>
            <button
              onClick={onClose}
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-8 flex flex-col space-y-3">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-mono uppercase tracking-wider flex items-center justify-between rounded border transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-glow)] text-[var(--accent-color)] border-[var(--accent-color)] font-bold'
                      : 'border-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-secondary)]'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-[10px] bg-[var(--accent-color)] text-white font-bold rounded">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase">Accent Theme</span>
            <AccentSelector />
          </div>

          <button
            onClick={() => {
              onClose();
              toggleCommandMenu();
            }}
            type="button"
            className="w-full py-2.5 px-4 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] flex items-center justify-center gap-2 hover:border-[var(--accent-color)] transition-colors"
          >
            <Command className="w-4 h-4 text-[var(--accent-color)]" />
            <span>Open Command Palette ( / )</span>
          </button>

          <div className="text-[10px] font-mono text-[var(--text-muted)] text-center">
            RAHUL R © 2026 // AI × DATA × CODE
          </div>
        </div>
      </div>
    </div>
  );
};
