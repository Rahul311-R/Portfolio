import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { InteractiveHero } from '@/components/hero/InteractiveHero';
import { CinematicStage } from '@/components/three/CinematicStage';
import { ProjectPreview } from '@/components/home/ProjectPreview';
import { WhoamiTerminal } from '@/components/home/WhoamiTerminal';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { SplitText } from '@/components/premium/SplitText';
import { PROJECTS } from '@/data/projects';
import { EXPERIENCES } from '@/data/experience';
import { PROJECT_ARTWORK } from '@/data/artwork';
import { RESUME_DATA } from '@/data/resume';
import { CountUp } from '@/components/ui/CountUp';

/**
 * Home — the cinematic version. One scroll-driven 3D corridor sits fixed
 * behind everything; the page is a sequence of transparent chapters that
 * fly past as the camera moves. No boxed panels on this page — type,
 * hairlines, and the world behind.
 */
export const Home: React.FC = () => {
  const featuredProjects = PROJECTS.filter((p) => p.featured);
  const [preview, setPreview] = useState<{ src: string; label: string } | null>(null);

  return (
    <PageTransition>
      <CinematicStage />
      <InteractiveHero />

      <div className="relative">
        {/* ————— 01 / THE IDEA — statement over the void ————— */}
        <section id="chapter-idea" className="mx-auto max-w-[100rem] px-5 sm:px-8 py-28 sm:py-44">
          <SectionMarker n="01" label="The idea" />
          <p className="mt-10 max-w-5xl font-display text-[clamp(1.8rem,4.2vw,3.6rem)] font-medium leading-[1.16] tracking-[-0.02em] text-[var(--text-primary)]">
            <SplitText text="Every system is a" stagger={0.05} />{' '}
            <span className="font-serif-accent text-gold-gradient">
              <SplitText text="signal path" stagger={0.06} delay={0.3} />
            </span>{' '}
            <SplitText
              text="— sensor to model, model to decision. I build the parts in between."
              stagger={0.02}
              delay={0.6}
            />
          </p>
        </section>

        {/* ————— 02 / SELECTED WORK — rows + cursor preview ————— */}
        <section className="mx-auto max-w-[100rem] px-5 sm:px-8 py-20 sm:py-32">
          <SectionMarker n="02" label="Selected work" />
          <div className="mt-8 flex items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-[var(--text-primary)]">
              Work
            </h2>
            <NavLink
              to="/projects"
              className="group mb-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-color)]"
            >
              All projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </NavLink>
          </div>

          <ProjectPreview preview={preview} />

          <ul
            className="mt-10 border-t border-white/10"
            onMouseLeave={() => setPreview(null)}
          >
            {featuredProjects.map((project, i) => (
              <li key={project.id} className="border-b border-white/10">
                <NavLink
                  to={`/projects/${project.slug}`}
                  className="group relative flex items-baseline gap-5 sm:gap-10 py-8 sm:py-10"
                  onMouseEnter={() =>
                    setPreview({
                      src: PROJECT_ARTWORK[project.slug] ?? '',
                      label: project.categories[0] ?? 'Project',
                    })
                  }
                >
                  <span className="w-8 shrink-0 font-mono text-[11px] tabular-nums text-[var(--accent-color)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-display text-[clamp(1.6rem,4.5vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--accent-color)]">
                    {project.title}
                  </span>
                  <span className="hidden md:block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {project.categories.slice(0, 2).join(' · ')}
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 self-center text-[var(--text-muted)] transition-all duration-300 group-hover:rotate-45 group-hover:text-[var(--accent-color)]" />
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        {/* ————— 03 / CAPABILITIES ————— */}
        <section className="mx-auto max-w-[100rem] px-5 sm:px-8 py-20 sm:py-32">
          <SectionMarker n="03" label="Capabilities" />
          <h2 className="mt-8 font-display text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-[var(--text-primary)]">
            What I <span className="font-serif-accent text-gold-gradient">work with</span>
          </h2>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {[
              { k: 'Languages', v: RESUME_DATA.skills.programming },
              { k: 'Data & vision', v: RESUME_DATA.skills.dataAndAi },
              { k: 'Tools', v: RESUME_DATA.skills.toolsAndDev },
            ].map((row) => (
              <div key={row.k} className="group grid grid-cols-1 gap-3 py-7 sm:grid-cols-[16rem_1fr] sm:gap-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-color)]">
                  {row.k}
                </span>
                <p className="font-display text-xl sm:text-2xl font-medium text-[var(--text-primary)]">
                  {row.v.join('  ·  ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ————— 04 / EXPERIENCE ————— */}
        <section className="mx-auto max-w-[100rem] px-5 sm:px-8 py-20 sm:py-32">
          <SectionMarker n="04" label="Experience" />
          <h2 className="mt-8 font-display text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-[var(--text-primary)]">
            Where I've <span className="font-serif-accent text-gold-gradient">worked</span>
          </h2>
          <div className="mt-12 border-t border-white/10">
            {EXPERIENCES.map((exp) => (
              <div
                key={exp.id}
                className="group grid grid-cols-1 gap-4 border-b border-white/10 py-8 sm:grid-cols-[11rem_1fr_auto] sm:gap-10"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {exp.period}
                </span>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-color)]">
                    {exp.company}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {exp.role}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
                    {exp.summary}
                  </p>
                </div>
                <span className="self-start rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-color)]">
                  {exp.badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ————— 05 / BEYOND THE CODE ————— */}
        <section className="mx-auto max-w-[100rem] px-5 sm:px-8 py-20 sm:py-32">
          <SectionMarker n="05" label="Beyond the code" />
          <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
                The person behind the{' '}
                <span className="font-serif-accent text-gold-gradient">terminal</span>
              </h2>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
                Outside of code — I enjoy exploring new technologies, breaking things apart to
                understand how they work, and turning random ideas into small experiments that
                sometimes turn into real projects. Long walks untangle whatever the debugger can't.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-8">
                {[
                  ['Currently learning', 'Attention from first principles · Rust · GLSL shaders'],
                  ['On the walk', 'Nils Frahm · Jon Hopkins · Hiroshi Yoshimura'],
                  ['On the desk', 'DDIA · Hamming · the Transformer paper (again)'],
                  ['Philosophy', 'Build useful things. Keep learning. Solve real problems.'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent-color)]">{k}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0A0B10]/70 backdrop-blur-md">
              <WhoamiTerminal />
            </div>
            </div>
        </section>

        {/* ————— 06 / PROOF ————— */}
        <section className="mx-auto max-w-[100rem] px-5 sm:px-8 py-20 sm:py-32">
          <SectionMarker n="06" label="Proof of work" />
          <div className="mt-12 grid grid-cols-2 gap-y-12 sm:grid-cols-4">
            {[
              { end: 3, label: 'Projects' },
              { end: 6, label: 'Lab experiments' },
              { end: 4, label: 'Certifications' },
              { end: 8.3, label: 'CGPA / 10', decimals: 1 },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-[clamp(3rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.04em] text-[var(--text-primary)]">
                  <CountUp end={stat.end} decimals={stat.decimals ?? 0} />
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-10">
            {RESUME_DATA.certifications.map((c) => (
              <span key={c.title} className="group inline-flex items-baseline gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] transition-transform group-hover:scale-150" aria-hidden="true" />
                <span className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">{c.title}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{c.issuer}</span>
              </span>
            ))}
          </div>
        </section>

        {/* ————— 07 / CONTACT — the arrival ————— */}
        <section className="mx-auto max-w-[100rem] px-5 sm:px-8 pt-10 pb-28 sm:pb-44 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            07 / Have an interesting problem?
          </p>
          <NavLink to="/contact" className="group mt-6 inline-block focus:outline-none">
            <span className="font-serif-accent text-[clamp(3rem,10vw,9rem)] leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)] transition-colors duration-500 group-hover:text-[var(--accent-color)]">
              Let's build <span className="text-gold-gradient">together</span>.
            </span>
          </NavLink>
        </section>
      </div>
    </PageTransition>
  );
};
