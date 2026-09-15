import React from 'react';

/**
 * Pure-CSS carrier beams that sweep across a panel every few seconds.
 * Decorative only — rendered inside an aria-hidden wrapper, and the
 * animation collapses to a static wave under prefers-reduced-motion.
 */
export const CarrierWave: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden="true" className={`carrier-wave ${className}`}>
    <span />
    <span />
    <span />
  </div>
);
