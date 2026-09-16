import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CountUpProps {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * Counts up to `end` when scrolled into view. Only used with real,
 * resume-supported numbers. Static final value when reduced motion is on.
 */
export const CountUp: React.FC<CountUpProps> = ({
  end,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1100,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion ? end : 0);

  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(2, -10 * t);
            setValue(end * (t === 1 ? 1 : eased));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
