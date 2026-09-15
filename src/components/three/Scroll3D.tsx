import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * 3D entrance on scroll: cards flip up toward the viewer as they enter.
 */
export const FlipIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article';
}> = ({ children, delay = 0, className = '', as = 'div' }) => {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Single-element design: the animated transform (with an inline
  // perspective() function) lives on the same element that carries layout
  // classes, so FlipIn never breaks grid/flex placement of its children.
  // Settles to `none` so descendant 3D layers (preserve-3d) keep working.
  type FlipTag = React.FC<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement | null> }>;
  const Tag = as as unknown as FlipTag;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'none'
          : 'perspective(1100px) rotateX(16deg) translate3d(0, 44px, -60px)',
        transformOrigin: 'center bottom',
        transitionProperty: 'opacity, transform',
          transitionDuration: reducedMotion ? '0ms' : '450ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        transitionDelay: `${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
};

/**
 * Scroll-scrubbed 3D hero: the wrapped visual gently rotates and drifts
 * based on its position in the viewport. Scrubbed — no timers.
 */
export const ScrubHero: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  drift?: number;
}> = ({ children, className = '', maxTilt = 7, drift = 36 }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      // progress 1 → hero filling view; 0 → scrolled past
      const tilt = (1 - progress) * maxTilt - maxTilt / 2;
      inner.style.transform = `rotateX(${tilt.toFixed(2)}deg) translateY(${((1 - progress) * -drift).toFixed(1)}px) scale(${(1 - (1 - progress) * 0.035).toFixed(3)})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion, maxTilt, drift]);

  return (
    <div ref={outerRef} className={className} style={{ perspective: '1400px' }}>
      <div ref={innerRef} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
};

/**
 * Sticky stacking 3D cards: each stage pins beneath the previous one while
 * covered cards sink back (scale + dim) in 3D. Falls back to a plain list
 * when reduced motion is on.
 */
export const StickyStack: React.FC<{
  nodes: string[];
  note?: string;
}> = ({ nodes, note }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const stuckTop = 96;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        // how many later cards have reached their pinned position above this one
        let covering = 0;
        for (let j = i + 1; j < cardRefs.current.length; j++) {
          const later = cardRefs.current[j];
          if (!later) continue;
          if (later.getBoundingClientRect().top <= stuckTop + j * 16 + 2) covering++;
        }
        const scale = Math.max(0.86, 1 - covering * 0.045);
        card.style.transform = `scale(${scale.toFixed(3)}) translateZ(${-covering * 40}px)`;
        card.style.filter = covering > 0 ? `brightness(${Math.max(0.55, 1 - covering * 0.14).toFixed(2)})` : 'none';
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion, nodes]);

  return (
    <div ref={containerRef} style={{ perspective: '1200px' }}>
      <div className="space-y-4">
        {nodes.map((node, i) => (
          <div
            key={node}
            className="sticky"
            style={{ top: `${96 + i * 16}px`, zIndex: i + 1, transformStyle: 'preserve-3d' }}
          >
            <div
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex items-center gap-4 rounded-xl border border-[var(--accent-color)]/35 bg-[var(--bg-surface)] p-4 shadow-xl sm:p-5"
              style={{ transformOrigin: 'center top', willChange: 'transform, filter' }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--accent-glow)] font-mono text-xs font-bold text-[var(--accent-color)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="truncate font-display text-base font-bold text-[var(--text-primary)] sm:text-lg">
                  {node}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {i < nodes.length - 1 ? 'Stage feeds into next ↓' : 'Terminal stage'}
                </div>
              </div>
              <span className="ml-auto hidden font-mono text-[10px] text-[var(--accent-color)] sm:block">
                0{i + 1} / 0{nodes.length}
              </span>
            </div>
          </div>
        ))}
      </div>
      {note && (
        <p className="mt-6 font-mono text-xs italic text-[var(--text-muted)]">* Note: {note}</p>
      )}
    </div>
  );
};
