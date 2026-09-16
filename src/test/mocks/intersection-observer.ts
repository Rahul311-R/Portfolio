/**
 * Deterministic IntersectionObserver mock for jsdom.
 *
 * Imported BOTH by `src/test/setup.ts` (which installs it as the global) and
 * by individual test files (which drive `emit()`), so every party shares one
 * module instance and one `instances` registry.
 */
type IOCallback = (entries: IntersectionObserverEntry[]) => void;

export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root: Element | Document | null = null;
  readonly rootMargin: string;
  readonly scrollMargin: string = '0px';
  readonly thresholds: readonly number[];
  #callback: IOCallback;
  #observed = new Set<Element>();

  constructor(callback: IOCallback, options: IntersectionObserverInit = {}) {
    this.#callback = callback;
    this.rootMargin = options.rootMargin ?? '0px';
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0];
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.#observed.add(target);
    // Report as intersecting by default so in-view flows run in tests.
    this.#callback([MockIntersectionObserver.#entry(target, true)]);
  }

  unobserve(target: Element): void {
    this.#observed.delete(target);
  }

  disconnect(): void {
    this.#observed.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Test helper: emit a custom intersection state for all observed targets. */
  emit(isIntersecting: boolean): void {
    this.#callback([...this.#observed].map((target) => MockIntersectionObserver.#entry(target, isIntersecting)));
  }

  /** Reset the registry between tests. */
  static reset(): void {
    MockIntersectionObserver.instances = [];
  }

  /** Fire `emit` on every live observer. */
  static emitAll(isIntersecting: boolean): void {
    for (const io of MockIntersectionObserver.instances) io.emit(isIntersecting);
  }

  static #entry(target: Element, isIntersecting: boolean): IntersectionObserverEntry {
    return {
      isIntersecting,
      target,
      intersectionRatio: isIntersecting ? 1 : 0,
      time: 0,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
    } as unknown as IntersectionObserverEntry;
  }
}
