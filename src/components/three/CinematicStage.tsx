import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CinematicWorld = lazy(() =>
  import('./CinematicWorld').then((m) => ({ default: m.CinematicWorld }))
);

/**
 * Fixed full-viewport stage that hosts the cinematic 3D world behind the
 * Home page content. The three.js payload (~875KB min / ~237KB gzip) is
 * deliberately NOT fetched at mount: it is deferred until the browser
 * reaches an idle moment after first paint, so it never competes with the
 * preloader, fonts, and above-the-fold content. Falls back to the CSS
 * aurora when WebGL is unsupported, under reduced motion, on metered
 * connections, on low-end hardware (<= 4 threads), or when the tab is
 * hidden (laptop batteries thank us).
 */
const loadWhenIdle = (cb: () => void) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cb, { timeout: 2500 });
  } else {
    setTimeout(cb, 350);
  }
};

const onMeteredConnection = () => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  return Boolean(c?.saveData || c?.effectiveType?.startsWith('2g'));
};

/**
 * Mid-tier phones and constrained CI machines report <= 4 logical cores.
 * A full-screen three.js stage on such hardware tanks interactivity (and
 * battery), so those devices get the CSS aurora instead — by design.
 */
const isLowEndHardware = () => (navigator.hardwareConcurrency ?? 8) <= 4;

/**
 * Runtime safety net: watches real frame pacing once the world is live and
 * calls `onTooSlow` if the median frame takes longer than ~50ms (< 20fps)
 * — the machine can't afford the stage, so the aurora takes over. This
 * catches devices whose core count lied, and headless/software-GL contexts
 * that pass the capability probes but render at a crawl.
 */
const FrameBudgetGuard: React.FC<{ onTooSlow: () => void }> = ({ onTooSlow }) => {
  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const deltas: number[] = [];
    let last = performance.now();
    let frames = 0;
    const tick = (now: number) => {
      if (cancelled) return;
      const dt = now - last;
      last = now;
      frames += 1;
      // Skip the first frames: shader compile + JIT warmup are one-off costs,
      // not the steady state we are measuring.
      if (frames > 10) deltas.push(dt);
      if (deltas.length >= 40) {
        const sorted = [...deltas].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
        if (median > 50) onTooSlow();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [onTooSlow]);
  return null;
};

export const CinematicStage: React.FC = () => {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [slowGpu, setSlowGpu] = useState(false);
  const onTooSlow = useCallback(() => setSlowGpu(true), []);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setWebgl(!!(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Defer the GL payload until after first paint: idle time (or 350ms) once
  // the stage is actually going to render it.
  useEffect(() => {
    if (!webgl || reduced || isLowEndHardware()) return;
    if (onMeteredConnection()) return;
    let cancelled = false;
    loadWhenIdle(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [webgl, reduced]);

  const showWorld = webgl && !reduced && ready && !hidden && !slowGpu;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-screen w-screen"
      style={{ pointerEvents: 'none' }}
    >
      {showWorld ? (
        <>
          <FrameBudgetGuard onTooSlow={onTooSlow} />
          <Suspense fallback={null}>{<CinematicWorld className="h-full w-full" />}</Suspense>
        </>
      ) : (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,164,92,0.08),transparent_55%)]" />
      )}
    </div>
  );
};
