import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  User,
  FolderGit2,
  Briefcase,
  FlaskConical,
  FileText,
  Mail,
  Sun,
  Moon,
  X,
  Clock,
  Settings,
  PenTool,
  BookOpen
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const CommandMenu: React.FC = () => {
  const { commandMenuOpen, setCommandMenuOpen, theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { id: 'home', label: 'Go Home', icon: Home, action: () => navigate('/') },
    { id: 'about', label: 'Go About', icon: User, action: () => navigate('/about') },
    { id: 'projects', label: 'Go Projects', icon: FolderGit2, action: () => navigate('/projects') },
    { id: 'experience', label: 'Go Experience', icon: Briefcase, action: () => navigate('/experience') },
    { id: 'lab', label: 'Go Lab (Creative Coding)', icon: FlaskConical, action: () => navigate('/lab') },
    { id: 'resume', label: 'Go Resume', icon: FileText, action: () => navigate('/resume') },
    { id: 'now', label: 'Go Now', icon: Clock, action: () => navigate('/now') },
    { id: 'uses', label: 'Go Uses', icon: Settings, action: () => navigate('/uses') },
    { id: 'writing', label: 'Go Writing', icon: PenTool, action: () => navigate('/writing') },
    { id: 'reading', label: 'Go Reading', icon: BookOpen, action: () => navigate('/reading') },
    { id: 'contact', label: 'Go Contact', icon: Mail, action: () => navigate('/contact') },
    {
      id: 'theme',
      label: `Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Theme`,
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme()
    }
  ];

  const filteredActions = actions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (commandMenuOpen) inputRef.current?.focus();
  }, [commandMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandMenuOpen) return;

      if (e.key === 'Escape') {
        setCommandMenuOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % (filteredActions.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].action();
          setCommandMenuOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandMenuOpen, filteredActions, selectedIndex, setCommandMenuOpen]);

  if (!commandMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onMouseDown={() => setCommandMenuOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--border-color)]">
          <Search className="w-5 h-5 text-[var(--accent-color)] mr-3" />
          <input
            type="text"
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to page..."
            className="w-full bg-transparent text-sm font-mono text-[var(--text-primary)] focus:outline-none placeholder-[var(--text-muted)]"
            autoFocus
          />
          <button
            onClick={() => setCommandMenuOpen(false)}
            type="button"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredActions.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs font-mono text-[var(--text-muted)]">
              No matching commands found.
            </div>
          ) : (
            filteredActions.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setCommandMenuOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent-glow)] text-[var(--accent-color)] border-l-2 border-[var(--accent-color)] font-bold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-[var(--accent-color)] uppercase">Press Enter ↵</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[var(--bg-surface-secondary)] border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>•</span>
            <span>↵ Select</span>
            <span>•</span>
            <span>ESC Close</span>
          </div>
          <div>RAHUL R COMMAND SYSTEM</div>
        </div>
      </div>
    </div>
  );
};
