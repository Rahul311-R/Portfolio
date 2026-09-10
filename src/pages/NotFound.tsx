import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import heroField from '../assets/hero-field.svg';

export const NotFound: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col justify-center space-y-6 py-6">
            <div className="eyebrow-rule">404 / Field note</div>
            <h1 className="font-display text-6xl sm:text-7xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Off the map.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-[var(--text-muted)]">
              This route does not exist in the portfolio. The work, timeline, lab and contact pages are all one step away.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button as="a" href="/" size="md" variant="primary" icon={<ArrowLeft className="h-4 w-4" />}>
                Back home
              </Button>
              <Button as="a" href="/projects" size="md" variant="outline" icon={<Compass className="h-4 w-4" />}>
                Browse projects
              </Button>
            </div>
            <nav aria-label="Sitemap" className="flex flex-wrap gap-x-5 gap-y-2 pt-2 font-mono text-xs text-[var(--text-muted)]">
              {[
                ['/about', 'About'],
                ['/experience', 'Experience'],
                ['/lab', 'Lab'],
                ['/resume', 'Resume'],
                ['/contact', 'Contact'],
              ].map(([path, label]) => (
                <NavLink key={path} to={path} className="hover:text-[var(--accent-color)]">
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="artifact-frame visual-stage min-h-[22rem] rounded-2xl">
            <img src={heroField} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D]/85 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/65">
              Original generative artwork / not a screenshot
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
