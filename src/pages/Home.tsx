import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { InteractiveHero } from '../components/hero/InteractiveHero';
import { ProjectPreview } from '../components/home/ProjectPreview';
import { SectionMarker } from '../components/ui/SectionMarker';
import { SplitText } from '../components/premium/SplitText';
import { PROJECTS } from '../data/projects';
import { EXPERIENCES } from '../data/experience';
import { PROJECT_ARTWORK } from '../data/artwork';
import { RESUME_DATA } from '../data/resume';
import { CountUp } from '../components/ui/CountUp';
import { WhoamiTerminal } from '../components/home/WhoamiTerminal';
import { WarpDivider } from '../components/three/WarpDivider';
import { PacketOrbit3D } from '../components/three/PacketOrbit3D';
import { SignalHelix3D } from '../components/three/SignalHelix3D';

/**
 * Home — rebuilt in the reference reel's editorial genre:
 * numbered sections, a statement manifesto, the work list with
 * cursor-following previews, row lists instead of card grids,
 * and quiet unboxed stats.
 */
export const Home: React.FC = () => {
  const featuredProjects = PROJECTS.filter((p) => p.featured);
  const [preview, setPreview] = useState<{ src: string; label: string } | null>(null);

  return (
    <PageTransition>
      <InteractiveHero />
      <WarpDivider />

      {/* ————— 01 / STATEMENT ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 py-24 sm:py-40">
        <SectionMarker n="01" label="The idea" />
        <p className="mt-10 max-w-5xl font-display text-[clamp(1.7rem,4vw,3.4rem)] font-medium leading-[1.18] tracking-[-0.02em] text-[var(--text-primary)]">
          <SplitText
            text="I build useful things with code —"
            stagger={0.045}
          />{' '}
          <span className="font-serif-accent text-gold-gradient">
            <SplitText text="intelligence, data and interfaces" stagger={0.045} delay={0.35} />
          </span>{' '}
          <SplitText text="shaped with intent." stagger={0.045} delay={0.75} />
        </p>
        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <span>Artificial intelligence</span>
          <span>Computer vision</span>
          <span>Data analytics</span>
          <span>Interfaces</span>
        </div>
      </section>

      {/* ————— 02 / THE STORY — the narrative arc ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionMarker n="02" label="The story" />
        <h2 className="mt-8 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
          How I got <span className="font-serif-accent text-gold-gradient">here</span>
        </h2>
        <div className="mt-14 border-l border-[var(--border-color)] pl-6 sm:pl-10">
          {[
            ['Curious about technology', 'Took things apart to see how they worked — software was the only thing that never ran out of screws.'],
            ['Started with programming', 'Python first: small scripts, small wins, and the realisation that ideas could actually run.'],
            ['Moved into AI & data', 'B.Tech in Artificial Intelligence & Data Science — transformers, computer vision and the mathematics underneath them.'],
            ['Built real projects', 'A patent-published road analyzer, gesture drawing, live-data dashboards — things that meet reality.'],
            ['Now looking for problems worth solving', 'Open to opportunities where useful beats impressive — and ideally both.'],
          ].map(([title, body], i, arr) => (
            <div key={title} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[1.75rem] top-1.5 h-2 w-2 rounded-full bg-[var(--accent-color)] sm:-left-[2.75rem]" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Chapter {String(i + 1).padStart(2, '0')} {i === arr.length - 1 ? '— now' : ''}
              </span>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ————— 03 / SELECTED WORK — list rows with cursor preview ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionMarker n="03" label="Selected work" />
        <div className="mt-8 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
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
          className="mt-10 border-t border-[var(--border-color)]"
          onMouseLeave={() => setPreview(null)}
        >
          {featuredProjects.map((project, i) => (
            <li key={project.id} className="border-b border-[var(--border-color)]">
              <NavLink
                to={`/projects/${project.slug}`}
                className="group relative flex items-baseline gap-5 sm:gap-10 py-7 sm:py-9"
                onMouseEnter={() =>
                  setPreview({
                    src: PROJECT_ARTWORK[project.slug],
                    label: project.categories[0] ?? 'Project',
                  })
                }
              >
                <span className="w-8 shrink-0 font-mono text-[11px] tabular-nums text-[var(--accent-color)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-display text-[clamp(1.5rem,4.2vw,3.2rem)] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--accent-color)]">
                  {project.title}
                </span>
                <span className="hidden md:block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {project.categories.slice(0, 2).join(' · ')}
                </span>
                <span className="hidden sm:block font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                  {project.year}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 self-center text-[var(--text-muted)] transition-all duration-300 group-hover:rotate-45 group-hover:text-[var(--accent-color)]" />
              </NavLink>
            </li>
          ))}
        </ul>
      </section>

      {/* ————— 04 / CAPABILITIES — unboxed editorial rows ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionMarker n="04" label="Capabilities" />
        <h2 className="mt-8 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
          What I <span className="font-serif-accent text-gold-gradient">work with</span>
        </h2>

        <div className="mt-12 divide-y divide-[var(--border-color)] border-y border-[var(--border-color)]">
          {[
            { k: 'Languages', v: RESUME_DATA.skills.programming },
            { k: 'Data & vision', v: RESUME_DATA.skills.dataAndAi },
            { k: 'Tools', v: RESUME_DATA.skills.toolsAndDev },
          ].map((row) => (
            <div
              key={row.k}
              className="group grid grid-cols-1 gap-3 py-7 sm:grid-cols-[16rem_1fr] sm:gap-8"
            >
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

      {/* ————— 05 / EXPERIENCE — editorial rows ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionMarker n="05" label="Experience" />
        <h2 className="mt-8 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
          Where I've <span className="font-serif-accent text-gold-gradient">worked</span>
        </h2>

        <div className="mt-12 border-t border-[var(--border-color)]">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              className="group grid grid-cols-1 gap-4 border-b border-[var(--border-color)] py-8 sm:grid-cols-[11rem_1fr_auto] sm:gap-10"
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
              <span className="self-start rounded-full border border-[var(--border-color)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-color)]">
                {exp.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ————— 06 / BEYOND THE CODE — the human layer ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionMarker n="06" label="Beyond the code" />
        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
              The person behind the <span className="font-serif-accent text-gold-gradient">terminal</span>
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
              Outside of code — I enjoy exploring new technologies, breaking things apart to
              understand how they work, and turning random ideas into small experiments that
              sometimes turn into real projects. Long walks untangle whatever the debugger can't.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent-color)]">Currently learning</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]">Attention from first principles · Rust · GLSL shaders</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent-color)]">On the walk</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]">Nils Frahm · Jon Hopkins · Hiroshi Yoshimura</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent-color)]">On the desk</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]">DDIA · Hamming · the Transformer paper (again)</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent-color)]">Philosophy</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]">Build useful things. Keep learning. Solve real problems.</p>
              </div>
            </div>
          </div>
          <WhoamiTerminal />
        </div>
      </section>

      {/* ————— 07 / SIGNALS + LAB — the two live 3D studies ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionMarker n="07" label="Signals & lab" />
        <div className="mt-8 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
            Live <span className="font-serif-accent text-gold-gradient">signals</span>
          </h2>
          <NavLink
            to="/lab"
            className="group mb-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-color)]"
          >
            Enter the lab
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </NavLink>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="visual-stage artifact-frame relative overflow-hidden rounded-xl">
            <PacketOrbit3D />
            <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EFE3C2]/70">
              SIG A · Orbit
            </span>
          </div>
          <div className="visual-stage artifact-frame relative overflow-hidden rounded-xl">
            <SignalHelix3D />
            <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EFE3C2]/70">
              SIG B · Helix
            </span>
          </div>
        </div>
      </section>

      {/* ————— 08 / PROOF — credentials + numbers ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionMarker n="08" label="Proof of work" />
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

        {/* Certification wall — named, not counted */}
        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-5 border-t border-[var(--border-color)] pt-10">
          {RESUME_DATA.certifications.map((c) => (
            <span key={c.title} className="group inline-flex items-baseline gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] transition-transform group-hover:scale-150" aria-hidden="true" />
              <span className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">{c.title}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{c.issuer}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ————— 09 / CONTACT — the closing invitation ————— */}
      <section className="max-w-[100rem] mx-auto px-5 sm:px-8 pt-10 pb-24 sm:pb-36 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          09 / Have an interesting problem?
        </p>
        <NavLink
          to="/contact"
          className="group mt-6 inline-block focus:outline-none"
        >
          <span className="font-serif-accent text-[clamp(3rem,10vw,9rem)] leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)] transition-colors duration-500 group-hover:text-[var(--accent-color)]">
            Let's build{' '}
            <span className="text-gold-gradient">together</span>.
          </span>
        </NavLink>
      </section>
    </PageTransition>
  );
};
