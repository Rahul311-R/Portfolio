import React, { useEffect, useRef } from 'react';
import { useMotionEngine } from '@/engine/MotionEngine';

/**
 * Signal progress HUD: a gradient bar across the top of the viewport that
 * fills with scroll depth and flares with scroll velocity. Driven by the
 * shared MotionEngine clock — no extra rAF loop, no scroll listeners.
 */
export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const engine = useMotionEngine();

  useEffect(() => {
    let lastY = window.scrollY;
    const unsubscribe = engine.subscribe(({ scrollY, scrollVel }) => {
      const bar = barRef.current;
      if (!bar) return;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = Math.min(scrollY / max, 1);
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
      bar.style.opacity = scrollY > 40 ? '1' : '0';
      const flare = flareRef.current;
      if (flare) {
        const movingDown = scrollY >= lastY;
        lastY = scrollY;
        flare.style.left = `${(p * 100).toFixed(2)}%`;
        flare.style.opacity = `${Math.min(0.9, scrollVel * 1.6).toFixed(3)}`;
        flare.style.transform = `translateX(${movingDown ? '-50%' : '-50%'}) scaleY(${(1 + scrollVel * 2).toFixed(2)})`;
      }
    });
    return unsubscribe;
  }, [engine]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div
        ref={barRef}
        className="h-[3px] origin-left bg-gradient-to-r from-[var(--accent-color)] via-[var(--accent-secondary)] to-[var(--accent-color)] opacity-0 transition-opacity duration-300"
        style={{ transform: 'scaleX(0)', boxShadow: '0 0 12px var(--accent-glow)' }}
      />
      <div
        ref={flareRef}
        className="absolute -top-1 h-[11px] w-16 -translate-x-1/2 rounded-full bg-[var(--accent-secondary)] opacity-0 blur-[6px]"
      />
    </div>
  );
};
