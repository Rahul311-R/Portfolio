import React, { useEffect, useRef, useState } from 'react';

interface LazyMountProps {
  children: React.ReactNode;
  /** Reserved height before mount to avoid layout shift (CLS). */
  minHeight?: number | string;
  /** How far before entering the viewport to start mounting. */
  rootMargin?: string;
  fallbackLabel?: string;
}

/**
 * Mounts heavy children (canvas experiments, charts) only when they are
 * near the viewport. Reserves space upfront so there is no layout shift.
 */
export const LazyMount: React.FC<LazyMountProps> = ({
  children,
  minHeight = 320,
  rootMargin = '480px 0px',
  fallbackLabel = 'Loading experiment…',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMounted(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div
      ref={ref}
      style={mounted ? undefined : { minHeight }}
      className="w-full"
      aria-busy={!mounted}
    >
      {mounted ? (
        children
      ) : (
        <div
          className="grid w-full place-items-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-muted)]"
          style={{ minHeight }}
        >
          {fallbackLabel}
        </div>
      )}
    </div>
  );
};
