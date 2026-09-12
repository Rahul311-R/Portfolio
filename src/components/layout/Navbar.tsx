import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Command } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MotionToggle } from '../ui/MotionToggle';
import { AccentSelector } from '../ui/AccentSelector';
import { useTheme } from '../../context/ThemeContext';
import { MobileMenu } from './MobileMenu';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCommandMenu } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Experience', path: '/experience' },
    { name: 'Lab', path: '/lab' },
    { name: 'Resume', path: '/resume' },
    { name: 'Now', path: '/now' },
    { name: 'Uses', path: '/uses' },
    { name: 'Writing', path: '/writing' },
    { name: 'Reading', path: '/reading' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/85 backdrop-blur-xl border-b border-[var(--border-color)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded bg-[var(--bg-surface-secondary)] border border-[var(--accent-color)]/40 flex items-center justify-center font-mono text-xs font-bold text-[var(--accent-color)] group-hover:border-[var(--accent-color)] group-hover:shadow-[0_0_15px_var(--accent-glow)] transition-all">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm tracking-widest text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                RAHUL R
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-tight">
                AI × DATA × CODE
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all duration-200 relative ${
                    isActive
                      ? 'text-[var(--accent-color)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.name}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent-color)] shadow-[0_0_10px_var(--accent-color)]" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Controls & Command Menu Launcher */}
          <div className="hidden md:flex items-center space-x-2.5">
            <button
              onClick={toggleCommandMenu}
              type="button"
              className="px-2.5 py-1.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)] text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Open Command Menu (/)"
            >
              <Command className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="bg-[var(--bg-surface)] px-1 py-0.5 rounded text-[10px] border border-[var(--border-color)]">
                /
              </span>
            </button>

            <AccentSelector />
            <MotionToggle />
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <MotionToggle />
            <ThemeToggle />
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              type="button"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] hover:border-[var(--accent-color)] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Navigation */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
};
