import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
  radius?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.35,
  radius = 80,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const el = ref.current;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        setPos({ x: dx * strength, y: dy * strength });
      } else {
        setPos({ x: 0, y: 0 });
      }
    };
    const handleLeave = () => setPos({ x: 0, y: 0 });
    window.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [reducedMotion, strength, radius]);

  return (
    <motion.div
      ref={ref}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      transition={{ type: 'spring', stiffness: 550, damping: 26, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxLayer: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
  /** Maximum pixel drift so framed artwork never exposes its edges. */
  max?: number;
}> = ({ children, speed = 0.15, className = '', max = 56 }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setOffset((prev) => {
          const y = Math.min(window.scrollY * speed, max);
          return prev.y === y ? prev : { ...prev, y };
        });
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion, speed, max]);

  return (
    <div
      className={className}
      style={{
        transform: `translate3d(0, ${offset.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

export const SplitText: React.FC<{
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  stagger?: number;
  asLines?: boolean;
}> = ({ text, tag = 'p', className = '', delay = 0, stagger = 0.03, asLines = false }) => {
  const reducedMotion = useReducedMotion();
  const words = text.split(' ');
  const lines = asLines ? text.split('\n') : [text];

  if (reducedMotion) {
    const Tag = tag;
    return <Tag className={className}>{text}</Tag>;
  }

  const Tag = tag;
  return (
    <Tag className={className} style={{ display: 'block', overflow: 'hidden' }}>
      {asLines ? (
        lines.map((line, li) => (
          <motion.div
            key={li}
            initial={{ opacity: 0, y: '1.2em' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay + li * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {line.split(' ').map((word, wi) => (
              <motion.span
                key={wi}
                initial={{ opacity: 0, y: '1.1em' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: delay + li * 0.12 + wi * stagger, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ display: 'inline-block', marginRight: '0.35em' }}
              >
                {word}
              </motion.span>
            ))}
            {' '}
          </motion.div>
        ))
      ) : (
        words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: '1.1em' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + i * stagger, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ display: 'inline-block', marginRight: '0.35em' }}
          >
            {word}
          </motion.span>
        ))
      )}
    </Tag>
  );
};

export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}> = ({ children, stagger = 0.08, delay = 0, className = '' }) => {
  const reducedMotion = useReducedMotion();
  const childArray = React.Children.toArray(children);

  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <div className={className}>
      {childArray.map((child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.55, delay: delay + index * stagger, ease: [0.2, 0.8, 0.2, 1] },
            } as any)
          : child
      )}
    </div>
  );
};

export const Float: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}> = ({ children, amplitude = 8, duration = 6, delay = 0, className = '' }) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={reducedMotion ? undefined : { y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'aside';
}> = ({ children, threshold = 0.12, rootMargin = '0px 0px -8% 0px', once = true, className = '', delay = 0, as = 'div' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, threshold, rootMargin, once]);

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 28px, 0)',
        transitionProperty: 'opacity, transform',
        transitionDuration: reducedMotion ? '0ms' : '450ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        transitionDelay: `${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
};

