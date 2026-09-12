import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Code2, Database, Cpu, Sparkles, Rotate3d, Move, Zap } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { InteractiveHero } from '../components/hero/InteractiveHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Button } from '../components/ui/Button';
import { PROJECTS } from '../data/projects';
import { EXPERIENCES } from '../data/experience';
import { RESUME_DATA } from '../data/resume';
import { TiltCard } from '../components/ui/TiltCard';
import { CodePanel } from '../components/ui/CodePanel';
import { DragCube3D } from '../components/three/DragCube3D';
import { FlipIn, ScrubHero } from '../components/three/Scroll3D';
import { CountUp } from '../components/ui/CountUp';
import { Magnetic } from '../components/ui/Animations';
import { WarpDivider } from '../components/three/WarpDivider';
import { Marquee } from '../components/ui/Marquee';
import heroField from '../assets/hero-field.svg';

export const Home: React.FC = () => {
  const featuredProjects = PROJECTS.filter((p) => p.featured);

  return (
    <PageTransition>
      {/* 01 / Hero Section with Particle Vortex & Code Panel */}
      <InteractiveHero />
      <WarpDivider />
      <Marquee
        label="Focus areas"
        items={[
          'Artificial intelligence',
          'Data visualisation',
          'Computer vision',
          'Python interfaces',
          'API integration',
          'Creative coding',
          'Build in public',
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 sm:space-y-36 py-20 sm:py-28">
        {/* Selected work */}
        <FlipIn as="section" className="scroll-mt-24" >
          <div id="selected-projects" className="scroll-mt-24" />
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <SectionHeading
              number="01"
              title="SELECTED PROJECTS"
              subtitle="Practical work across AI, computer vision, data and interactive software."
            />
            <NavLink
              to="/projects"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider hover:translate-x-1 transition-transform mb-12 md:mb-0"
            >
              <span>VIEW ALL PROJECTS</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {featuredProjects.map((project) => (
              <TiltCard key={project.id}>
                <ProjectCard project={project} featured={project.featured} />
              </TiltCard>
            ))}
          </div>
        </FlipIn>

        <FlipIn as="section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <ScrubHero maxTilt={5} drift={26} className="lg:col-span-5">
            <div className="artifact-frame visual-stage min-h-[26rem] rounded-xl">
              <img src={heroField} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A10]/90 via-[#090A10]/20 to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 z-10 [transform:translateZ(48px)]">
                <div className="eyebrow-rule text-white/75">The workbench</div>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white">Ideas become interfaces.</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">Real code from this codebase, running the draggable 3D object below — no simulated terminals.</p>
              </div>
            </div>
          </ScrubHero>
          <div className="lg:col-span-7 flex items-center studio-panel p-4 sm:p-7 rounded-xl">
            <TiltCard maxTilt={6} className="w-full">
              <CodePanel />
            </TiltCard>
          </div>
        </FlipIn>

        {/* Playable 3D object — drag to spin the resume stack */}
        <FlipIn as="section" className="studio-panel relative overflow-hidden rounded-xl p-6 sm:p-10 md:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="eyebrow-rule">Playable object / 3D</div>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Spin the stack.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                Six tools from the resume, folded into one object. It turns on its own —
                grab it to spin it your way, let go and it keeps your momentum before
                settling back into its idle rotation.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] px-3 py-1.5">
                  <Rotate3d className="h-3.5 w-3.5 text-[var(--accent-color)]" /> auto-rotates
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] px-3 py-1.5">
                  <Move className="h-3.5 w-3.5 text-[var(--accent-color)]" /> drag to spin
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] px-3 py-1.5">
                  <Zap className="h-3.5 w-3.5 text-[var(--accent-color)]" /> release for momentum
                </span>
              </div>
            </div>
            <div className="visual-stage relative grid min-h-[22rem] place-items-center overflow-hidden rounded-xl border border-[var(--border-color)] py-10">
              <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-40" />
              <DragCube3D />
              <div className="absolute bottom-4 left-1/2 h-4 w-48 -translate-x-1/2 rounded-full bg-black/50 blur-xl" aria-hidden="true" />
            </div>
          </div>
        </FlipIn>

        {/* Technical skills */}
        <FlipIn as="section" className="studio-panel p-6 sm:p-8 md:p-12 rounded-xl relative overflow-hidden">
          <SectionHeading
            number="02"
            title="TECHNICAL SKILLS"
            subtitle="Languages, data tools and development practices from the supplied resume."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] space-y-3 rounded">
              <div className="flex items-center gap-2 text-[var(--accent-color)] font-mono text-xs font-bold uppercase">
                <Code2 className="w-4 h-4" />
                <span>Programming Languages</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {RESUME_DATA.skills.programming.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] space-y-3 rounded">
              <div className="flex items-center gap-2 text-[var(--accent-color)] font-mono text-xs font-bold uppercase">
                <Cpu className="w-4 h-4" />
                <span>Data & Computer Vision</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {RESUME_DATA.skills.dataAndAi.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] space-y-3 sm:col-span-2 lg:col-span-1 rounded">
              <div className="flex items-center gap-2 text-[var(--accent-color)] font-mono text-xs font-bold uppercase">
                <Database className="w-4 h-4" />
                <span>Tools & Architecture</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {RESUME_DATA.skills.toolsAndDev.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FlipIn>

        {/* Experience snapshot */}
        <FlipIn as="section">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <SectionHeading
              number="03"
              title="EXPERIENCE SNAPSHOT"
              subtitle="Internships and structured training in data analytics, web development and visualisation."
            />
            <NavLink
              to="/experience"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider hover:translate-x-1 transition-transform mb-12 md:mb-0"
            >
              <span>VIEW TIMELINE</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPERIENCES.map((exp) => (
              <TiltCard key={exp.id}>
                <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg space-y-3 hover:border-[var(--accent-color)] transition-colors h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="font-mono text-xs text-[var(--accent-color)] font-bold">
                      {exp.period}
                    </div>
                    <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">
                      {exp.company}
                    </h3>
                    <div className="text-xs font-mono text-[var(--text-muted)] uppercase">
                      {exp.role}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {exp.summary}
                    </p>
                  </div>
                  {exp.badge && (
                    <span className="self-start px-2 py-0.5 text-[10px] font-mono bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-color)]/30 rounded uppercase mt-4">
                      {exp.badge}
                    </span>
                  )}
                </div>
              </TiltCard>
            ))}
          </div>
        </FlipIn>

        {/* Lab teaser */}
        <FlipIn as="section" className="relative overflow-hidden visual-stage border border-[var(--accent-color)]/35 p-8 md:p-12 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_30px_var(--accent-glow)]">
          <img src={heroField} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-[#0B0C13]/60" />
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-glow)] border border-[var(--accent-color)]/40 text-[var(--accent-color)] font-mono text-xs uppercase tracking-wider rounded">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>THE LAB // PERSONAL EXPERIMENTS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white">
              CREATIVE CODING & DATA LAB
            </h2>
            <p className="text-sm text-white/65 leading-relaxed font-mono">
              A collection of small creative-coding studies in motion, drawing, colour and data visualisation.
            </p>
          </div>

          <Magnetic>
            <Button
              as="a"
              href="/lab"
              size="lg"
              variant="primary"
              icon={<Sparkles className="w-4 h-4" />}
              className="relative z-10"
            >
              ENTER THE LAB
            </Button>
          </Magnetic>
        </FlipIn>

        {/* 07 / Final CTA */}
        <FlipIn as="section" className="text-center space-y-6 py-16 border-t border-[var(--border-color)]">
          <h2 className="text-4xl md:text-7xl font-extrabold font-display text-[var(--text-primary)] text-glow">
            LET'S BUILD SOMETHING INTERESTING.
          </h2>
          <p className="text-base text-[var(--text-muted)] max-w-lg mx-auto font-mono">
            Interested in AI, data, computer vision, software and thoughtful interfaces.
          </p>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-4">
            {[
              { end: 3, label: 'Projects', decimals: 0, suffix: '' },
              { end: 6, label: 'Lab experiments', decimals: 0, suffix: '' },
              { end: 4, label: 'Certifications', decimals: 0, suffix: '' },
              { end: 8.3, label: 'CGPA / 10', decimals: 1, suffix: '' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--bg-surface)] px-4 py-5">
                <div className="font-display text-3xl font-extrabold text-[var(--accent-color)] sm:text-4xl">
                  <CountUp end={stat.end} decimals={stat.decimals} suffix={stat.suffix} />
                </div>
                <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Magnetic>
              <Button as="a" href="/contact" size="lg" variant="primary">
                GET IN TOUCH
              </Button>
            </Magnetic>
          </div>
        </FlipIn>
      </div>
    </PageTransition>
  );
};
