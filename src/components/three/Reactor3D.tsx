import React, { Suspense, lazy } from 'react';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// three.js + R3F load only when this component first mounts — the main
// bundle stays lean and the canvas 2D fallback covers the gap instantly.
const ReactorScene = lazy(() =>
  import('./ReactorScene').then((m) => ({ default: m.ReactorScene }))
);

/**
 * Enterprise-grade hero mount for the WebGL reactor:
 * 1. Instant static poster (SVG, ~0 KB JS) renders first.
 * 2. If WebGL is available, the React Three Fiber scene lazy-loads in.
 * 3. If WebGL is unavailable, an animated 2D-canvas fallback runs instead.
 * 4. Offscreen => frameloop parked; reduced motion => static poster only.
 */
export const Reactor3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reducedMotion = useReducedMotion();
  const [frameRef, inView] = useInView<HTMLDivElement>(0.02);
  const [webglSupported] = React.useState(() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      return false;
    }
  });

  const staticPoster = (
    <div className="relative grid h-[420px] w-full place-items-center overflow-hidden" aria-hidden="true">
      <div className="absolute h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--accent-glow),transparent_70%)]" />
      <div className="absolute h-40 w-40 animate-pulse rounded-full border border-[var(--accent-color)]/50" />
      <div className="absolute h-64 w-64 rounded-full border border-[var(--accent-color)]/20" />
      <div className="h-4 w-4 rounded-full bg-[var(--text-primary)] shadow-[0_0_30px_var(--accent-color)]" />
    </div>
  );

  return (
    <div
      ref={frameRef}
      role="img"
      aria-label="Interactive 3D transmission reactor: nodes orbiting a glowing core, leaning toward your pointer. Click to pulse the system."
      className={`visual-stage relative w-full overflow-hidden rounded-2xl border border-[var(--border-color)] ${className}`}
    >
      {!reducedMotion && inView && webglSupported ? (
        <Suspense fallback={staticPoster}>
          <ReactorScene paused={!inView} />
        </Suspense>
      ) : (
        staticPoster
      )}
      <div className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
        Transmission reactor / WebGL
      </div>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--visual-muted)]">
        Move your pointer · the rig follows
      </div>
    </div>
  );
};
