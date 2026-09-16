import React, { useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Large display text that leans in 3D toward the pointer. Subtle by design
 * (a few degrees) — depth you feel, not a carnival ride.
 */
export const TiltHeading: React.FC<{
  children: React.ReactNode;
  max?: number;
  className?: string;
}> = ({ children, max = 6, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${(px * max * 2).toFixed(2)}deg) rotateX(${(-py * max * 2).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.18s ease-out', willChange: 'transform' }}
    >
      {children}
    </div>
  );
};
