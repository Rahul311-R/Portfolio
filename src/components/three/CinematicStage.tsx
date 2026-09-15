import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CinematicWorld = lazy(() =>
  import('./CinematicWorld').then((m) => ({ default: m.CinematicWorld }))
);

/**
 * Fixed full-viewport stage that hosts the cinematic 3D world behind the
 * Home page content. Lazy-loads three.js only when Home mounts with WebGL;
 * falls back to the CSS aurora when unsupported or under reduced motion;
 * unmounts the GL context when the tab is hidden (laptop batteries thank us).
 */
export const CinematicStage: React.FC = () => {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [hidden, setHidden] = useState(false);

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

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-screen w-screen"
      style={{ pointerEvents: 'none' }}
    >
      {webgl && !reduced ? (
        <Suspense fallback={null}>{!hidden && <CinematicWorld className="h-full w-full" />}</Suspense>
      ) : (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,164,92,0.08),transparent_55%)]" />
      )}
    </div>
  );
};
