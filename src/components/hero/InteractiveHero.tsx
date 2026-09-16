import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { ArrowDown, ArrowRight, FileText } from 'lucide-react';
import { Magnetic } from '@/components/ui/Animations';
import { Typewriter } from '@/components/ui/Typewriter';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Chapter 0 — the intro. Full-viewport, transparent; the cinematic world
 * IS the visual. Type, tagline, CTAs and a scroll cue — nothing else.
 */
export const InteractiveHero: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const reveal = (delay = 0): MotionProps =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: 'easeOut' },
        };

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center px-5 sm:px-8">
      <div className="mx-auto w-full max-w-[100rem]">
        <motion.div {...reveal(0.05)} className="flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-color)]" />
            Portfolio — 2026
          </span>
          <span className="hidden sm:block">Coimbatore, India</span>
        </motion.div>

        <motion.h1
          {...reveal(0.12)}
          className="mt-10 font-display font-extrabold text-[clamp(3.8rem,12vw,11rem)] tracking-[-0.08em] leading-[0.8] text-[var(--text-primary)]"
        >
          RAHUL
          <br />
          <span className="font-serif-accent text-gold-gradient font-medium tracking-[-0.03em]">R.</span>
        </motion.h1>

        <motion.p {...reveal(0.2)} className="mt-8 font-serif-accent text-2xl sm:text-4xl md:text-5xl tracking-tight text-[var(--text-primary)]">
          AI <span className="text-[var(--accent-color)] not-italic font-display font-bold text-xl align-middle">×</span> DATA{' '}
          <span className="text-[var(--accent-color)] not-italic font-display font-bold text-xl align-middle">×</span> CODE
        </motion.p>

        <motion.p {...reveal(0.27)} className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[var(--text-muted)]">
          I like taking messy problems, turning them into systems, and seeing whether they work —
          across artificial intelligence, data, computer vision and interactive software.
        </motion.p>

        <motion.div {...reveal(0.33)} className="mt-5 font-mono text-sm text-[var(--text-primary)] sm:text-base">
          <Typewriter phrases={['artificial intelligence', 'data analytics', 'computer vision', 'interactive software']} />
        </motion.div>

        <motion.div {...reveal(0.38)} className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <Button to="/projects" size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              View my work
            </Button>
          </Magnetic>
          <Magnetic>
            <Button to="/contact" size="lg" variant="outline" icon={<FileText className="w-4 h-4" />}>
              Let's connect
            </Button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.a
        {...reveal(0.5)}
        href="#chapter-idea"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors"
      >
        Scroll
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.a>
    </section>
  );
};
