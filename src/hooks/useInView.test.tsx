import React, { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { useInView } from './useInView';
import { MockIntersectionObserver } from '../test/mocks/intersection-observer';

/**
 * useInView returns a ref the CONSUMER must attach to a DOM element, so the
 * honest test drives it through a probe component rather than renderHook
 * (where the ref is never attached and the effect correctly exits early).
 */
function makeProbe(onChange: (inView: boolean) => void, threshold?: number) {
  const Probe: React.FC = () => {
    const [ref, inView] = useInView<HTMLDivElement>(threshold);
    useEffect(() => {
      onChange(inView);
    }, [inView, onChange]);
    return <div ref={ref} data-testid="probe" />;
  };
  return Probe;
}

describe('useInView', () => {
  it('reports in-view once the attached element is observed (mock defaults to intersecting)', () => {
    const states: boolean[] = [];
    const Probe = makeProbe((v) => states.push(v));
    render(<Probe />);
    // observe() fires synchronously in the polyfill → initial callback is true.
    expect(states.at(-1)).toBe(true);
  });

  it('reports not-in-view when the observer emits an exit', () => {
    const states: boolean[] = [];
    const Probe = makeProbe((v) => states.push(v));
    render(<Probe />);

    act(() => {
      MockIntersectionObserver.emitAll(false);
    });
    expect(states.at(-1)).toBe(false);
  });

  it('disconnects the observer on unmount', () => {
    const disconnectSpy = vi.spyOn(MockIntersectionObserver.prototype, 'disconnect');
    const Probe = makeProbe(() => {});
    const { unmount } = render(<Probe />);
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
    disconnectSpy.mockRestore();
  });

  it('creates a fresh observer when the threshold changes', () => {
    MockIntersectionObserver.reset();
    const states: boolean[] = [];
    const Probe = makeProbe((v) => states.push(v), 0.05);
    const { rerender } = render(<Probe />);
    const afterFirst = MockIntersectionObserver.instances.length;
    expect(afterFirst).toBe(1);

    const ProbeB = makeProbe((v) => states.push(v), 0.5);
    rerender(<ProbeB />);
    expect(MockIntersectionObserver.instances.length).toBe(2);
  });
});
