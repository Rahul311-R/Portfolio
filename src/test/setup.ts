/**
 * Vitest + jsdom global setup. jsdom does not implement several browser APIs
 * that are load-bearing for this app (canvas components park their rAF loops
 * behind IntersectionObserver; Lenis requires ResizeObserver), so we install
 * minimal, observable polyfills here.
 *
 * `@testing-library/jest-dom` matchers are registered once, globally.
 */
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { MockIntersectionObserver } from './mocks/intersection-observer';

// --- IntersectionObserver ------------------------------------------------------
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// --- ResizeObserver ------------------------------------------------------------
// Required by Lenis (smoothScroll) and element-size observers.
class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

// --- matchMedia -----------------------------------------------------------------
// Lenis, the MotionEngine and several premium components query
// prefers-reduced-motion at module init; default to no-preference (motion on).
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: !query.includes('prefers-reduced-motion: reduce'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- scrollIntoView -------------------------------------------------------------
// jsdom has no layout engine, so scrollIntoView is unimplemented; give every
// element a no-op that individual tests may override.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// --- requestAnimationFrame --------------------------------------------------------
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number;
  window.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

afterEach(() => {
  cleanup();
  MockIntersectionObserver.reset();
});
