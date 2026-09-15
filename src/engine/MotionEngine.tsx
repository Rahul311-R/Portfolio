import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export interface FrameEnv {
  /** Seconds since engine start. */
  t: number;
  /** Milliseconds since previous frame (clamped). */
  dt: number;
  scrollY: number;
  /** Smoothed 0..1 scroll velocity — feed it into your visuals. */
  scrollVel: number;
  /** Pointer position in CSS pixels, viewport-relative. */
  pointerX: number;
  pointerY: number;
  /** Pointer position normalised to -1..1 (0 = centre). */
  pointerNX: number;
  pointerNY: number;
  pointerActive: boolean;
}

type Listener = (env: FrameEnv) => void;

interface MotionContextValue {
  subscribe: (fn: Listener) => () => void;
  /** Called by page transitions so visuals can reset/accent per route. */
  getRouteKey: () => string;
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined);

/**
 * One requestAnimationFrame loop for the whole site. Every animated canvas
 * subscribes to the same clock, so five animated sections cost one loop,
 * not five — and everything shares pointer + scroll velocity as inputs.
 * When the user enables reduced motion the clock still runs at a slow,
 * gentle cadence so canvases can drift subtly instead of freezing.
 */
export const MotionEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listeners = useRef<Set<Listener>>(new Set());
  const location = useLocation();
  const routeRef = useRef(location.pathname);
  useEffect(() => {
    routeRef.current = location.pathname;
  }, [location.pathname]);
  const { reducedMotion } = useTheme();

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let start = last;
    let scrollVel = 0;
    let lastScrollY = window.scrollY;
    const env: FrameEnv = {
      t: 0,
      dt: 16,
      scrollY: 0,
      scrollVel: 0,
      pointerX: -1000,
      pointerY: -1000,
      pointerNX: 0,
      pointerNY: 0,
      pointerActive: false,
    };

    const onPointer = (e: PointerEvent) => {
      env.pointerX = e.clientX;
      env.pointerY = e.clientY;
      env.pointerNX = (e.clientX / window.innerWidth) * 2 - 1;
      env.pointerNY = (e.clientY / window.innerHeight) * 2 - 1;
      env.pointerActive = true;
    };
    const onPointerLeave = () => {
      env.pointerActive = false;
      env.pointerX = -1000;
      env.pointerY = -1000;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    // Single shared loop. Reduced motion = 1 gentle beat every ~120ms
    // instead of a per-frame storm, so canvases breathe but never race.
    const tick = (now: number) => {
      const minFrame = reducedMotion ? 120 : 0;
      if (now - last >= minFrame) {
        env.dt = Math.min(now - last, 50);
        env.t = (now - start) / 1000;
        const dy = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        env.scrollY = window.scrollY;
        const instant = Math.min(Math.abs(dy) / 40, 1);
        scrollVel += (instant - scrollVel) * 0.12;
        env.scrollVel = scrollVel;
        for (const fn of listeners.current) fn(env);
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [reducedMotion]);

  const value = useMemo<MotionContextValue>(
    () => ({
      subscribe: (fn: Listener) => {
        listeners.current.add(fn);
        return () => listeners.current.delete(fn);
      },
      getRouteKey: () => routeRef.current,
    }),
    []
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
};

export function useMotionEngine(): MotionContextValue {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotionEngine must be used inside <MotionEngineProvider>');
  return ctx;
}
