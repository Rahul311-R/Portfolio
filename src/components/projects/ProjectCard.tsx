import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight, Award } from 'lucide-react';
import type { Project } from '../../types/project';
import { PROJECT_ARTWORK } from '../../data/artwork';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
  const artwork = PROJECT_ARTWORK[project.id as keyof typeof PROJECT_ARTWORK];

  return (
    <article
      className={`group relative studio-panel overflow-hidden transition-all duration-500 hover:border-[var(--accent-color)] flex flex-col justify-between [transform-style:preserve-3d] ${featured ? 'shadow-xl' : ''}`}
    >
      <div className="artifact-frame h-52 sm:h-60 border-x-0 border-t-0 [transform:translateZ(24px)] transition-transform duration-500 group-hover:[transform:translateZ(44px)]">
        {artwork && <img src={artwork} alt="" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A10]/80 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-white/80 uppercase [transform:translateZ(30px)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_16px_var(--accent-secondary)]" />
          Original generative artwork
        </div>
        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/60 uppercase tracking-[0.16em] [transform:translateZ(30px)]">{project.year}</div>
        {project.badge && (
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 bg-black/35 border border-amber-300/30 text-amber-200 text-[10px] font-mono font-bold uppercase rounded-full backdrop-blur-sm [transform:translateZ(56px)] transition-transform duration-500 group-hover:[transform:translateZ(80px)]">
            <Award className="w-3 h-3" /> {project.badge}
          </span>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <div className="flex flex-wrap gap-1.5">
            {project.categories.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-0.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold font-display text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-all duration-500 [transform:translateZ(18px)] group-hover:[transform:translateZ(40px)]">
          <NavLink to={`/projects/${project.slug}`} className="focus:outline-none">
            {project.title}
          </NavLink>
        </h3>

        {/* Short Description */}
        <p className="text-sm text-[var(--text-muted)] font-normal leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Metrics highlight if available */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="pt-2 flex gap-4 border-t border-[var(--border-color)]">
            {project.metrics.map((m) => (
              <div key={m.label} className="font-mono">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">{m.label}</div>
                <div className="text-xl font-bold text-[var(--accent-color)]">{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tech stack chips */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-secondary)] border border-[var(--border-color)]"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-6 md:p-8 pt-0 flex items-center justify-between border-t border-[var(--border-color)]/40 mt-4">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          READ THE PROJECT
        </span>

        <NavLink
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider group-hover:translate-x-1 transition-transform"
        >
          <span>EXPLORE</span>
          <ArrowUpRight className="w-4 h-4" />
        </NavLink>
      </div>
    </article>
  );
};
