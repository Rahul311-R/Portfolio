import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Command, Sparkles, Tv } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { AccentSelector } from '../ui/AccentSelector';
import { AudioToggle } from '../ui/AudioToggle';
import { ScanlineOverlay } from '../ui/ScanlineOverlay';
import { useTheme } from '../../context/ThemeContext';
import { MobileMenu } from './MobileMenu';
import { soundFx } from '../../utils/audio';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCommandMenu, toggleScanlines, scanlinesEnabled } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Experience', path: '/experience' },
    { name: 'Lab', path: '/lab', badge: 'STUDIO' },
    { name: 'Resume', path: '/resume' },
    { name: 'Now', path: '/now' },
    { name: 'Uses', path: '/uses' },
    { name: 'Writing', path: '/writing' },
    { name: 'Reading', path: '/reading' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <ScanlineOverlay />

      <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/85 backdrop-blur-xl border-b border-[var(--border-color)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <NavLink
            to="/"
            onClick={() => soundFx.playClick()}
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
                  onClick={() => soundFx.playClick()}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all duration-200 relative ${
                    isActive
                      ? 'text-[var(--accent-color)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.name}
                    {link.badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-color)]/40 rounded">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-400" />
                        {link.badge}
                      </span>
                    )}
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

            <button
              onClick={toggleScanlines}
              type="button"
              title={`CRT Scanlines: ${scanlinesEnabled ? 'ON' : 'OFF'}`}
              className={`p-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] transition-colors ${
                scanlinesEnabled ? 'text-[var(--accent-color)] border-[var(--accent-color)]' : 'text-[var(--text-muted)]'
              }`}
            >
              <Tv className="w-4 h-4" />
            </button>

            <AudioToggle />
            <AccentSelector />
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <AudioToggle />
            <ThemeToggle />
            <button
              onClick={() => {
                soundFx.playClick();
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
