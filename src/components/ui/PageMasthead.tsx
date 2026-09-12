import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ParallaxLayer } from './Animations';
import { ScrubHero } from '../three/Scroll3D';

interface PageMastheadProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  artwork: string;
  artworkLabel: string;
  children?: React.ReactNode;
}

export const PageMasthead: React.FC<PageMastheadProps> = ({ number, eyebrow, title, description, artwork, artworkLabel, children }) => {
  const reducedMotion = useReducedMotion();
  const motionProps: MotionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: 'easeOut' },
      };
  const artworkMotion: MotionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, delay: 0.08, ease: 'easeOut' },
      };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
      <motion.div {...motionProps} className="lg:col-span-7 xl:col-span-7 py-4">
        <div className="eyebrow-rule">{number} / {eyebrow}</div>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(3.25rem,7vw,6.7rem)] font-extrabold leading-[0.86] tracking-[-0.07em] text-[var(--text-primary)]">{title}</h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--text-muted)]">{description}</p>
        {children && <div className="mt-7">{children}</div>}
      </motion.div>
      <motion.div {...artworkMotion} className="lg:col-span-5 relative">
        <ScrubHero maxTilt={5} drift={28}>
          <div className="artifact-frame visual-stage aspect-[5/4] rounded-2xl shadow-xl">
            <ParallaxLayer speed={0.05} max={36} className="absolute inset-0">
              <img src={artwork} alt="" className="h-full w-full scale-110 object-cover" />
            </ParallaxLayer>
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D]/80 via-transparent to-transparent" />
            <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between text-white [transform:translateZ(48px)]"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/65">{artworkLabel}</span><span className="grid h-9 w-9 place-items-center rounded-full border border-white/25 font-mono text-[10px]">{number}</span></div>
          </div>
        </ScrubHero>
      </motion.div>
    </section>
  );
};
