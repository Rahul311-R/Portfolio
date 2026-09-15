import React from 'react';

/**
 * Editorial section marker — gold index number, hairline, spaced label.
 * The quiet rhythm device that structures every section of the page.
 */
export const SectionMarker: React.FC<{
  n: string;
  label: string;
  className?: string;
}> = ({ n, label, className = '' }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent-color)] tabular-nums">
      {n}
    </span>
    <span className="gold-hairline w-14 sm:w-20" aria-hidden="true" />
    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
      {label}
    </span>
  </div>
);
