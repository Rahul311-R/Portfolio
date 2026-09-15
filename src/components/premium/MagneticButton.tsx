import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps extends React.ComponentPropsWithoutRef<'a'> {
  /** Pull strength — how far the button chases the pointer. */
  strength?: number;
  children: React.ReactNode;
}

const isFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Magnetic CTA: the element leans toward the pointer inside its hover field
 * and springs back on exit. Outer spans the magnet field so the inner
 * content moves at a softer rate — the layered parallax reads as premium.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  strength = 0.35,
  children,
  className = '',
  ...rest
}) => {
  const fieldRef = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  const innerX = useTransform(sx, (v) => v * 0.4);
  const innerY = useTransform(sy, (v) => v * 0.4);
  const active = useRef(false);

  const onMove = (e: React.MouseEvent) => {
    if (!active.current || !isFinePointer()) return;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  return (
    <motion.span
      ref={fieldRef}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseEnter={() => {
        active.current = true;
      }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        active.current = false;
        x.set(0);
        y.set(0);
      }}
    >
      <motion.span className="inline-block" style={{ x: innerX, y: innerY }}>
        <a {...rest}>{children}</a>
      </motion.span>
    </motion.span>
  );
};
