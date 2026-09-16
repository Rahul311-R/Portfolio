import React, { lazy, Suspense, useEffect, useState } from 'react';
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
 * connections, or when the tab is hidden (laptop batteries thank us).
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

export const CinematicStage: React.FC = () => {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);

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
    if (!webgl || reduced) return;
    if (onMeteredConnection()) return;
    let cancelled = false;
    loadWhenIdle(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [webgl, reduced]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-screen w-screen"
      style={{ pointerEvents: 'none' }}
    >
      {webgl && !reduced && ready && !hidden ? (
        <Suspense fallback={null}>{<CinematicWorld className="h-full w-full" />}</Suspense>
      ) : (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,164,92,0.08),transparent_55%)]" />
      )}
    </div>
  );
};
