import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES } from '../../data/experience';

export const ExperienceTimeline: React.FC = () => {
  return (
    <div className="relative border-l-2 border-[var(--border-color)] ml-4 md:ml-32 space-y-12 my-8">
      {EXPERIENCES.map((exp, index) => (
        <div key={exp.id} className="relative pl-8 md:pl-12 group">
          {/* Timeline Node Point */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--accent-color)] group-hover:bg-[var(--accent-color)] transition-colors shadow-[0_0_10px_var(--accent-glow)]" />

          {/* Left date tag for desktop layout */}
          <div className="hidden md:block absolute -left-36 top-1 text-right w-28 font-mono text-xs text-[var(--accent-color)] font-bold">
            {exp.period}
          </div>

          {/* Card Container */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 md:p-8 rounded-lg space-y-4 hover:border-[var(--accent-color)] transition-colors">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--accent-color)] tracking-wider">
                    0{index + 1} // {exp.company}
                  </span>
                  {exp.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-color)]/30 rounded uppercase">
                      {exp.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-display text-[var(--text-primary)] mt-1">
                  {exp.role}
                </h3>
              </div>

              {/* Mobile period display */}
              <div className="md:hidden flex items-center gap-1 font-mono text-xs text-[var(--accent-color)]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{exp.period}</span>
              </div>
            </div>

            {/* Role summary */}
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {exp.summary}
            </p>

            {/* Highlights Bullet List */}
            <div className="space-y-2 pt-2">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                Key Accomplishments:
              </h4>
              <ul className="space-y-2">
                {exp.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-muted)] font-mono">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
                    <span className="leading-normal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-color)]/50">
              {exp.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-secondary)] border border-[var(--border-color)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
