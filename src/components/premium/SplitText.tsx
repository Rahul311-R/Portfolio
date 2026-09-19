import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Seconds between word reveals. */
  stagger?: number;
  delay?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3';
  /** Apply gold gradient to each word */
  gradient?: boolean;
  /** Custom gradient class (e.g., 'linear-gradient(...)') */
  gradientClass?: string;
}

/**
 * Word-by-word masked rise: each word slides up out of an overflow-hidden
 * line box, staggered. Fires once when scrolled into view. Under reduced
 * motion framer-motion's global config keeps it instant.
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  stagger = 0.08,
  delay = 0,
  as: Tag = 'span',
  gradient = false,
  gradientClass = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const words = text.split(' ');

  const gradientStyle = gradient
    ? {
        background: gradientClass || 'linear-gradient(105deg, #F5E7C1 0%, #D9BC7A 45%, #9A7A35 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }
    : {};

  return (
    <Tag className={className}>
      <span ref={ref} className="inline">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : { y: '110%' }}
              transition={{
                duration: 0.7,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                ...gradientStyle,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
};
