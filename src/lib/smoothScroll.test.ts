import { describe, expect, it, vi, beforeEach } from 'vitest';
import { initSmoothScroll, scrollToTop, scrollTo, lockScroll } from './smoothScroll';

/**
 * Lenis is exercised through real browser rAF + wheel events, which jsdom
 * does not simulate. These tests therefore cover the environment guards and
 * the fallback paths — exactly the branches that can break in production
 * (reduced-motion users, overlays before/after init).
 */
describe('smoothScroll', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initSmoothScroll returns a callable teardown that is idempotent', () => {
    const teardown = initSmoothScroll();
    expect(typeof teardown).toBe('function');
    expect(() => {
      teardown();
      teardown();
    }).not.toThrow();
  });

  it('scrollToTop falls back to native window.scrollTo when Lenis is not initialized', () => {
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    scrollToTop(true);
    expect(spy).toHaveBeenCalledWith(0, 0);
  });

  it('scrollTo falls back to native window.scrollTo for numeric targets', () => {
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    scrollTo(420);
    expect(spy).toHaveBeenCalledWith(0, 420);
  });

  it('scrollTo falls back to scrollIntoView for selector targets when Lenis is inactive', () => {
    const section = document.createElement('div');
    section.id = 'target-section';
    document.body.appendChild(section);
    const intoView = vi.fn();
    section.scrollIntoView = intoView;

    scrollTo('#target-section');
    expect(intoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    section.remove();
  });

  it('lockScroll is a no-op (does not throw) when Lenis is not initialized', () => {
    expect(() => {
      lockScroll(true);
      lockScroll(false);
    }).not.toThrow();
  });
});
