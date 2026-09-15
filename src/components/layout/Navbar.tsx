import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Command, Menu as MenuIcon } from 'lucide-react';
import { MotionToggle } from '../ui/MotionToggle';
import { useTheme } from '../../context/ThemeContext';
import { FullscreenMenu, type MenuLink } from './FullscreenMenu';

export const NAV_LINKS: MenuLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Experience', path: '/experience' },
  { name: 'Lab', path: '/lab' },
  { name: 'Resume', path: '/resume' },
  { name: 'Now', path: '/now' },
  { name: 'Uses', path: '/uses' },
  { name: 'Writing', path: '/writing' },
  { name: 'Reading', path: '/reading' },
  { name: 'Contact', path: '/contact' },
];

/**
 * Editorial header — deliberately minimal. Brand left; local time + command
 * + toggles + a labelled MENU trigger right. All navigation lives in the
 * fullscreen takeover (FullscreenMenu), the reel-style signature.
 */
export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleCommandMenu } = useTheme();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }).format(new Date())
      );
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-[100rem] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <NavLink to="/" viewTransition className="group flex items-baseline gap-3 focus:outline-none">
            <span className="font-display font-extrabold text-base tracking-[0.08em] text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
              RAHUL R
            </span>
            <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
              AI × Data × Code
            </span>
          </NavLink>

          {/* Right cluster */}
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden md:inline font-mono text-[10px] tracking-[0.22em] text-[var(--text-muted)] tabular-nums">
              COIMBATORE {clock} IST
            </span>

            <button
              onClick={toggleCommandMenu}
              type="button"
              aria-label="Open command menu"
              title="Open Command Menu (/)"
              className="hidden sm:grid h-9 w-9 place-items-center rounded-full border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-colors"
            >
              <Command className="w-3.5 h-3.5" />
            </button>

            <span className="hidden sm:flex items-center gap-2">
              <MotionToggle />
            </span>

            {/* The MENU trigger — editorial, all breakpoints */}
            <button
              onClick={() => setMenuOpen(true)}
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="group flex items-center gap-3 pl-1 focus:outline-none"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                Menu
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-color)] group-hover:border-[var(--accent-color)] group-hover:shadow-[0_0_18px_var(--accent-glow)] transition-all">
                <MenuIcon className="w-4 h-4 text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
    </>
  );
};
