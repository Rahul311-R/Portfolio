import React from 'react';
import { useParams, NavLink, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Award, Layers, Link2Off } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/Button';
import { RoadConditionDemo } from '@/components/projects/RoadConditionDemo';
import { VirtualBoardDemo } from '@/components/projects/VirtualBoardDemo';
import { WeatherApiDemo } from '@/components/projects/WeatherApiDemo';
import { PROJECTS } from '@/data/projects';
import { GithubIcon } from '@/components/ui/SocialIcons';
import { ScrubHero, StickyStack, FlipIn } from '@/components/three/Scroll3D';
import { PROJECT_ARTWORK } from '@/data/artwork';
import { TerminalPending } from '@/components/ui/TerminalPending';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const artwork = PROJECT_ARTWORK[project.id];
  const projectIndex = PROJECTS.findIndex((item) => item.slug === slug);
  const previousProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : undefined;
  const nextProject = projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : undefined;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Top Navigation Back Link */}
        <NavLink
          to="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-color)] uppercase tracking-wider hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL CASE STUDIES</span>
        </NavLink>

        {/* Project Detail Header */}
        <div className="space-y-6 border-b border-[var(--border-color)] pb-12">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            {project.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider text-[11px] rounded"
              >
                {cat}
              </span>
            ))}
            {project.badge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-gold-300 font-bold uppercase rounded text-[11px]">
                <Award className="w-3.5 h-3.5" />
                {project.badge}
              </span>
            )}
            <span className="text-[var(--text-muted)]">• {project.year}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display text-[var(--text-primary)] leading-tight text-glow">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-3xl leading-relaxed font-mono">
            {project.description}
          </p>

          {/* Metrics display if present */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-wrap gap-6 pt-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded min-w-[200px]">
                  <div className="font-mono text-xs text-[var(--text-muted)] uppercase">{m.label}</div>
                  <div className="text-3xl font-bold font-display text-[var(--accent-color)] mt-1">{m.value}</div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1">Resume Supported Metric</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.githubUrl ? <Button as="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="md" icon={<GithubIcon className="w-4 h-4" />}>VIEW REPOSITORY</Button> : <span className="inline-flex items-center gap-2"><Link2Off className="w-4 h-4 text-[var(--text-muted)]" /><TerminalPending label="Repository" /></span>}
            {project.liveUrl ? <Button as="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="md" icon={<ExternalLink className="w-4 h-4" />}>VIEW LIVE DEMO</Button> : <span className="inline-flex items-center gap-2"><Link2Off className="w-4 h-4 text-[var(--text-muted)]" /><TerminalPending label="Live demo" /></span>}
          </div>
        </div>

        <ScrubHero maxTilt={8} drift={44}>
          <section className="artifact-frame visual-stage min-h-[18rem] md:min-h-[28rem] rounded-xl">
            {artwork && <img src={artwork} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />}
            <div className="absolute inset-0 bg-gradient-to-r from-[#090A10]/78 via-[#090A10]/12 to-transparent" />
            <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10 max-w-md z-10 [transform:translateZ(60px)]">
              <div className="eyebrow-rule text-white/75">Visual system study</div>
              <p className="mt-3 font-mono text-xs md:text-sm leading-relaxed text-white/75">Original abstract artwork created for this portfolio. It represents the project theme, not a project screenshot.</p>
            </div>
          </section>
        </ScrubHero>

        {/* Interactive Demos depending on project */}
        {project.id === 'road-condition-analyzer' && (
          <section className="space-y-4">
            <h2 className="font-mono text-xs text-[var(--accent-color)] uppercase font-bold tracking-widest">
              CONCEPTUAL PROJECT PREVIEW
            </h2>
            <RoadConditionDemo />
          </section>
        )}

        {project.id === 'virtual-drawing-board' && (
          <section className="space-y-4">
            <h2 className="font-mono text-xs text-[var(--accent-color)] uppercase font-bold tracking-widest">
              INTERACTIVE DEMO PREVIEW
            </h2>
            <VirtualBoardDemo />
          </section>
        )}

        {project.id === 'weather-prediction-gui' && (
          <section className="space-y-4">
            <h2 className="font-mono text-xs text-[var(--accent-color)] uppercase font-bold tracking-widest">
              DEMO PREVIEW
            </h2>
            <WeatherApiDemo />
          </section>
        )}

        {/* Architectural Flow Diagram if present */}
        {project.architecture && (
          <section className="p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-color)] font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>System Architecture (Conceptual Diagram)</span>
            </div>

            <StickyStack nodes={project.architecture.nodes} note={project.architecture.description} />
          </section>
        )}

        {/* 9 Standard Case Study Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-12">
            {project.sections.map((section, i) => (
              <FlipIn key={section.title} delay={Math.min(i * 40, 200)}>
                <section className="space-y-3 border-b border-[var(--border-color)]/50 pb-8">
                  <h3 className="font-mono text-xs text-[var(--accent-color)] font-bold tracking-widest uppercase">
                    {section.title}
                  </h3>
                  <p className="text-base text-[var(--text-primary)] leading-relaxed font-normal">
                    {section.content}
                  </p>
                </section>
              </FlipIn>
            ))}
          </div>

          {/* Technology & Metadata Sidebar */}
          <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg space-y-6 sticky top-24">
            <h4 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest border-b border-[var(--border-color)] pb-3">
              TECHNOLOGY STACK
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] space-y-3 font-mono text-xs">
              <div>
                <span className="text-[var(--text-muted)] block">DEVELOPMENT YEAR:</span>
                <span className="text-[var(--text-primary)] font-bold">{project.year}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">FACTUAL VERIFICATION:</span>
                <span className="text-emerald-400 font-bold">Resume source</span>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="More projects" className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--border-color)] pt-8">
          {previousProject ? (
            <NavLink
              to={`/projects/${previousProject.slug}`}
              viewTransition
              className="group studio-panel rounded-xl p-5 transition-colors hover:border-[var(--accent-color)]"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <ArrowLeft className="h-3.5 w-3.5 text-[var(--accent-color)] transition-transform group-hover:-translate-x-1" /> Previous project
              </span>
              <span className="mt-2 block font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)]">
                {previousProject.title}
              </span>
            </NavLink>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextProject && (
            <NavLink
              to={`/projects/${nextProject.slug}`}
              viewTransition
              className="group studio-panel rounded-xl p-5 text-right transition-colors hover:border-[var(--accent-color)]"
            >
              <span className="inline-flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Next project <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-color)] transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 block font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)]">
                {nextProject.title}
              </span>
            </NavLink>
          )}
        </nav>
      </div>
    </PageTransition>
  );
};
