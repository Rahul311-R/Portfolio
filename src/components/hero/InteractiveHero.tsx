import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { ArrowDown, ArrowRight, FileText, Cpu, Database, Eye } from 'lucide-react';
import { ParticleVortexCanvas } from './ParticleVortexCanvas';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import heroField from '../../assets/hero-field.svg';

export const InteractiveHero: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const reveal = (delay = 0): MotionProps =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.62, delay, ease: 'easeOut' },
        };

  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--border-color)]">
      <ParticleVortexCanvas />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_84%_22%,var(--accent-glow),transparent_24rem)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-7">
        <motion.div {...reveal()} className="flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.13em] uppercase text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--accent-color)]" /> System online</span>
          <span className="hidden sm:block">Coimbatore, India / 2026</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-12 sm:pt-16 pb-12 lg:pb-16 min-h-[calc(100svh-8rem)]">
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.div {...reveal(0.06)} className="eyebrow-rule">Independent portfolio / creative coding laboratory</motion.div>
            <motion.h1 {...reveal(0.13)} className="mt-5 max-w-4xl font-display font-extrabold text-[clamp(4.1rem,11vw,10rem)] tracking-[-0.085em] leading-[0.78] text-[var(--text-primary)]">
              RAHUL<br /><span className="text-[var(--accent-color)]">R.</span>
            </motion.h1>
            <motion.p {...reveal(0.2)} className="mt-8 font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              AI <span className="text-[var(--accent-color)]">x</span> DATA <span className="text-[var(--accent-color)]">x</span> CODE
            </motion.p>
            <motion.p {...reveal(0.27)} className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[var(--text-muted)]">
              Building useful things with code. Exploring artificial intelligence, data, computer vision and interactive software through practical projects and creative experiments.
            </motion.p>
            <motion.div {...reveal(0.34)} className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="/projects" size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>Explore projects</Button>
              <Button as="a" href="/resume" size="lg" variant="outline" icon={<FileText className="w-4 h-4" />}>View resume</Button>
            </motion.div>
            <motion.div {...reveal(0.42)} className="mt-10 flex flex-wrap gap-x-5 gap-y-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2"><Cpu className="h-3.5 w-3.5 text-[var(--accent-color)]" /> Artificial intelligence</span>
              <span className="inline-flex items-center gap-2"><Eye className="h-3.5 w-3.5 text-[var(--accent-color)]" /> Computer vision</span>
              <span className="inline-flex items-center gap-2"><Database className="h-3.5 w-3.5 text-[var(--accent-color)]" /> Data visualisation</span>
            </motion.div>
          </div>

          <motion.div {...reveal(0.18)} className="lg:col-span-5 xl:col-span-5 relative lg:self-stretch min-h-[25rem] sm:min-h-[32rem]">
            <div className="artifact-frame visual-stage absolute inset-0 rounded-2xl shadow-2xl">
              <img src={heroField} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#08090D]/76 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.16em] uppercase text-white/70">Computational landscape / 01</div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white">
                <div><div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/55">Build / Experiment / Visualize</div><div className="mt-1 font-display text-2xl font-bold">An active field of ideas.</div></div>
                <span className="hidden sm:grid h-12 w-12 place-items-center rounded-full border border-white/25 font-mono text-xs">01</span>
              </div>
            </div>
            <motion.div animate={reducedMotion ? undefined : { y: [0, -9, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-3 sm:-left-8 top-12 studio-panel backdrop-blur-md px-4 py-3 rounded-lg max-w-[11rem]">
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--text-muted)]">Selected note</span>
              <p className="mt-1 font-display text-sm font-bold text-[var(--text-primary)]">Patent published</p>
            </motion.div>
            <motion.div animate={reducedMotion ? undefined : { y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} className="absolute -right-2 sm:-right-6 bottom-16 studio-panel backdrop-blur-md px-4 py-3 rounded-lg max-w-[12rem]">
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--text-muted)]">Education</span>
              <p className="mt-1 font-display text-sm font-bold text-[var(--text-primary)]">CGPA 8.3 / 10</p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div {...reveal(0.5)} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          {[
            ['Focus', 'AI & data'],
            ['Project note', 'Patent published'],
            ['Practice', 'Code & interfaces'],
            ['Approach', 'Learn by building']
          ].map(([label, value]) => <div key={label} className="bg-[var(--bg-surface)] px-4 py-4 sm:px-5 sm:py-5"><div className="font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-[0.14em]">{label}</div><div className="mt-1.5 font-display text-sm sm:text-base font-bold text-[var(--text-primary)]">{value}</div></div>)}
        </motion.div>
      </div>
      <a href="#selected-projects" className="absolute z-10 bottom-5 right-5 hidden lg:inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--text-muted)] hover:text-[var(--accent-color)]"><ArrowDown className="h-4 w-4" /> Scroll for projects</a>
    </section>
  );
};
