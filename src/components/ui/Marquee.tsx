import React from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MarqueeProps {
  items: string[];
  label?: string;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ items, label = 'Ticker', className }) => {
  const reducedMotion = useReducedMotion();
  const row = [...items, ...items];

  return (
    <div aria-label={label} className={`relative overflow-hidden border-y border-[var(--border-color)] bg-[var(--bg-surface)] ${className ?? ''}`}>
      <div
        className={reducedMotion ? 'flex flex-wrap gap-x-8 gap-y-2 px-5 py-4' : 'marquee-track flex w-max items-center gap-10 px-5 py-4'}
      >
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= items.length}
            className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-color)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
