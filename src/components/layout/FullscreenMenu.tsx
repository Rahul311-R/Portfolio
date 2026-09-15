import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MotionToggle } from '../ui/MotionToggle';
import { GithubIcon, LinkedinIcon } from '../ui/SocialIcons';
import { Mail, Command } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SOCIAL } from '../../data/social';
import { lockScroll } from '../../lib/smoothScroll';

export interface MenuLink {
  name: string;
  path: string;
}

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Editorial full-screen menu — the reel signature interaction.
 * A curtain of obsidian wipes down, then the oversized links rise one by one.
 * Each entry rolls from grotesk caps to gold serif italic on hover.
 * Presented on every breakpoint; the header is just brand + MENU.
 */
export const FullscreenMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  links: MenuLink[];
}> = ({ isOpen, onClose, links }) => {
  const { toggleCommandMenu } = useTheme();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [clock, setClock] = useState('');

  // Local-time clock — the editorial footer staple.
  useEffect(() => {
    if (!isOpen) return;
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }).format(new Date())
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isOpen]);

  // Scroll lock (Lenis-aware), ESC to close, focus the close button.
  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => closeRef.current?.focus(), 650);
    return () => {
      lockScroll(false);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-[60] bg-[#0A0B10] flex flex-col"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Menu header — mirrors the site header so the swap is seamless */}
          <div className="flex items-center justify-between px-5 sm:px-8 h-16 border-b border-white/8 shrink-0">
            <span className="font-display font-extrabold text-sm tracking-widest text-[#F5F7FA]">
              RAHUL R
            </span>
            <button
              ref={closeRef}
              onClick={onClose}
              type="button"
              aria-label="Close menu"
              className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-[#EFE3C2] transition-colors focus:outline-none"
            >
              Close
              <span className="relative grid h-9 w-9 place-items-center rounded-full border border-white/20 group-hover:border-[#C9A45C] group-hover:rotate-90 transition-all duration-300">
                <span className="absolute h-px w-3.5 bg-current rotate-45" />
                <span className="absolute h-px w-3.5 bg-current -rotate-45" />
              </span>
            </button>
          </div>

          {/* Link index — the oversized editorial list.
              data-lenis-prevent lets Lenis ignore wheel events here so the
              list itself scrolls when it overflows on short viewports. */}
          <nav
            data-lenis-prevent
            className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 py-6 sm:py-8"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ y: 48, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.055, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-white/8"
              >
                <NavLink
                  to={link.path}
                  onClick={onClose}
                  className="group relative flex items-baseline gap-4 sm:gap-8 py-3 sm:py-4 focus:outline-none"
                >
                  <span className="font-mono text-[10px] text-[#C9A45C]/70 w-8 shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative block flex-1 overflow-hidden">
                    {/* Primary — grotesk caps */}
                    <span className="block font-display font-extrabold uppercase tracking-[-0.03em] text-[clamp(2rem,6.5vw,4.25rem)] leading-[1.02] text-[#F5F7FA] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[110%]">
                      {link.name}
                    </span>
                    {/* Reveal — gold serif italic rolls in */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 block font-serif-accent text-gold-gradient text-[clamp(2rem,6.5vw,4.25rem)] leading-[1.02] translate-y-[110%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                    >
                      {link.name}
                    </span>
                  </span>
                  <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                    Enter →
                  </span>
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Menu footer — channels + controls + clock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="shrink-0 border-t border-white/8 px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
          >
            <div className="flex items-center gap-5">
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/55 hover:text-[#EFE3C2] transition-colors"
              >
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/55 hover:text-[#EFE3C2] transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" /> LinkedIn
              </a>
              <a
                href={`mailto:${SOCIAL.email}`}
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/55 hover:text-[#EFE3C2] transition-colors"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  window.setTimeout(toggleCommandMenu, 350);
                }}
                type="button"
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-[#EFE3C2] transition-colors"
                title="Open command menu"
              >
                <Command className="w-3.5 h-3.5" /> Search <span className="border border-white/20 rounded px-1">/</span>
              </button>
              <MotionToggle />
              <ThemeToggle />
            </div>

            <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 tabular-nums">
              COIMBATORE {clock} IST
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
