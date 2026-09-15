import Lenis from 'lenis';

/**
 * Site-wide inertial smooth scrolling (Lenis). One instance owned by Layout;
 * route changes call scrollToTop() so navigation lands at the top even
 * while the scroll position is animated.
 */
let lenis: Lenis | null = null;
let rafId = 0;

export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    // Premium easing: long glide out, no bounce.
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
  };
}

/** Jump (or glide) back to the top — used on route change. */
export function scrollToTop(immediate = true): void {
  if (lenis) {
    lenis.scrollTo(0, { immediate });
  } else {
    window.scrollTo(0, 0);
  }
}

/** Scroll to a section within the Lenis-managed page. */
export function scrollTo(target: string | number, immediate = false): void {
  if (lenis) {
    lenis.scrollTo(target, { immediate });
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo(0, target);
  }
}

/** Pause/resume Lenis while an overlay (menu, modal) owns the viewport. */
export function lockScroll(lock: boolean): void {
  if (!lenis) return;
  if (lock) {
    lenis.stop();
  } else {
    lenis.start();
  }
}
