import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { SOCIAL } from '@/data/social';
import { SplitText } from '@/components/premium/SplitText';

const CHANNELS = [
  { label: 'GitHub', href: SOCIAL.github, text: SOCIAL.githubLabel, icon: <GithubIcon className="w-4 h-4" /> },
  { label: 'LinkedIn', href: SOCIAL.linkedin, text: SOCIAL.linkedinLabel, icon: <LinkedinIcon className="w-4 h-4" /> },
  { label: 'Email', href: `mailto:${SOCIAL.email}`, text: SOCIAL.email, icon: <Mail className="w-4 h-4" /> },
];

/**
 * Editorial footer — the reel's closing move. A hairline, a wordmark,
 * an oversized serif "Let's talk" CTA that leans toward the pointer's
 * side of the page, then channels and the fine print.
 */
export const Footer: React.FC = () => {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="max-w-[100rem] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
        {/* Wordmark row */}
        <div className="flex flex-wrap items-end justify-between gap-6 pb-10 sm:pb-16">
          <div>
            <span className="font-display font-extrabold text-2xl tracking-[0.06em] text-[var(--text-primary)]">
              RAHUL R
            </span>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--accent-color)]">
              AI × Data × Code
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
            Building useful things with code — artificial intelligence, data systems, computer vision and interfaces with intent.
          </p>
        </div>

        {/* The giant CTA — pointer-reactive serif */}
        <div
          className="group relative block border-t border-b border-[var(--border-color)] py-12 sm:py-20 cursor-pointer"
          style={{
            transform: `perspective(1000px) rotateX(${-tilt.y * 6}deg) rotateY(${tilt.x * 6}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s ease-out',
            willChange: 'transform',
          }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTilt({
              x: ((e.clientX - r.left) / r.width - 0.5) * 2,
              y: ((e.clientY - r.top) / r.height - 0.5) * 2,
            });
          }}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          onClick={() => navigate('/contact')}
        >
          <div className="flex items-center justify-between gap-6">
            <NavLink
              to="/contact"
              className="focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-serif-accent text-[clamp(3rem,9vw,8.5rem)] leading-[0.95] tracking-[-0.02em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-color)]">
                <SplitText text="Let's talk" stagger={0.09} />
                <span className="text-gold-gradient">.</span>
              </h2>
            </NavLink>
            <NavLink
              to="/contact"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/contact');
              }}
              className="grid h-16 w-16 sm:h-24 sm:w-24 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] transition-all duration-500 group-hover:border-[var(--accent-color)] group-hover:shadow-[0_0_40px_var(--accent-glow)] group-hover:rotate-45 hover:border-[var(--accent-color)] hover:shadow-[0_0_40px_var(--accent-glow)] hover:rotate-45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
              aria-label="Go to contact page"
            >
              <ArrowUpRight className="h-6 w-6 sm:h-9 sm:w-9 text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-color)]" />
            </NavLink>
          </div>
        </div>

        {/* Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-10 sm:py-14">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-5 py-4 transition-all duration-300 hover:border-[var(--accent-color)]/60 hover:bg-[var(--bg-surface-secondary)]"
            >
              <span className="flex items-center gap-3">
                <span className="text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-color)]">{c.icon}</span>
                <span className="font-mono text-xs text-[var(--text-primary)]">{c.text}</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-color)]">
                {c.label}
              </span>
            </a>
          ))}
        </div>

        {/* Fine print */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-t border-[var(--border-color)] pt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <span>© {new Date().getFullYear()} Rahul R — B.Tech AI &amp; Data Science</span>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'About', path: '/about' },
              { label: 'Projects', path: '/projects' },
              { label: 'Resume', path: '/resume' },
              { label: 'Now', path: '/now' },
              { label: 'Contact', path: '/contact' },
            ].map((l) => (
              <NavLink key={l.path} to={l.path} className="hover:text-[var(--accent-color)] transition-colors">
                {l.label}
              </NavLink>
            ))}
          </div>
          <span className="tabular-nums">Coimbatore, IN</span>
        </div>
      </div>
    </footer>
  );
};
