import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TypewriterProps {
  phrases: string[];
  prefix?: string;
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}

/**
 * Types, pauses, deletes and cycles through short phrases. Screen readers
 * get the full static list once; the animation itself is hidden from them.
 */
export const Typewriter: React.FC<TypewriterProps> = ({
  phrases,
  prefix = '> ',
  className = '',
  typeSpeed = 55,
  deleteSpeed = 26,
  pause = 1500,
}) => {
  const reducedMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion || phrases.length === 0) return;
    const current = phrases[phraseIndex % phrases.length];
    let delay = deleting ? deleteSpeed : typeSpeed;
    if (!deleting && charCount === current.length) delay = pause;
    if (deleting && charCount === 0) delay = 320;

    const timer = setTimeout(() => {
      if (!deleting && charCount === current.length) {
        setDeleting(true);
      } else if (deleting && charCount === 0) {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      } else {
        setCharCount((c) => c + (deleting ? -1 : 1));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charCount, deleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pause, reducedMotion]);

  const visible = phrases.length === 0 ? '' : phrases[phraseIndex % phrases.length].slice(0, charCount);

  return (
    <span className={className}>
      <span className="sr-only">{phrases.join(', ')}.</span>
      <span aria-hidden="true">
        <span className="text-[var(--accent-color)]">{prefix}</span>
        <span>{reducedMotion ? phrases[0] ?? '' : visible}</span>
        {!reducedMotion && (
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[var(--accent-color)]" />
        )}
      </span>
    </span>
  );
};
