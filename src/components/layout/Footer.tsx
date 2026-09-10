import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-color)] mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] flex items-center justify-center font-mono text-xs font-bold text-[var(--accent-color)]">
                R
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-[var(--text-primary)]">
                RAHUL R
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--accent-color)] uppercase tracking-widest">
              AI × DATA × CODE
            </p>
            <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed font-normal">
              Exploring artificial intelligence, data systems, computer vision, and creative coding interfaces through practical engineering projects and interactive experiments.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                SYSTEM ONLINE // COIMBATORE, TN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest border-b border-[var(--border-color)] pb-2">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <NavLink to="/about" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  01 / ABOUT ME
                </NavLink>
              </li>
              <li>
                <NavLink to="/projects" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  02 / PROJECTS
                </NavLink>
              </li>
              <li>
                <NavLink to="/experience" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  03 / EXPERIENCE
                </NavLink>
              </li>
              <li>
                <NavLink to="/lab" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors inline-flex items-center gap-1">
                  04 / THE LAB <Sparkles className="w-3 h-3 text-[var(--accent-color)]" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/resume" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  05 / RESUME
                </NavLink>
              </li>
              <li>
                <NavLink to="/now" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  06 / NOW
                </NavLink>
              </li>
              <li>
                <NavLink to="/uses" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  07 / USES
                </NavLink>
              </li>
              <li>
                <NavLink to="/writing" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  08 / WRITING
                </NavLink>
              </li>
              <li>
                <NavLink to="/reading" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  09 / READING
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                  10 / CONTACT
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Social / Connect */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest border-b border-[var(--border-color)] pb-2">
              CONNECT
            </h4>
            <div className="space-y-2.5">
              <span className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary)]">
                <GithubIcon className="w-4 h-4 text-[var(--text-muted)]" />
                <span>GitHub Profile [ADD LINK]</span>
              </span>
              <span className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary)]">
                <LinkedinIcon className="w-4 h-4 text-[var(--text-muted)]" />
                <span>LinkedIn Profile [ADD LINK]</span>
              </span>
              <NavLink
                to="/contact"
                className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                <span>Direct Contact Form</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[var(--text-muted)] gap-4">
          <div>
            RAHUL R © {new Date().getFullYear()} — B.Tech Artificial Intelligence & Data Science
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>DESIGN SYSTEM v2.4</span>
            <span>•</span>
            <span>BUILT WITH REACT + VITE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
