import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SESSION_KEY = 'rr-preloaded';

/**
 * Premium entry moment: a quiet counter running 0→100 in Fraunces italic,
 * a gold hairline drawing across, then the curtain splits and lifts.
 * Runs once per browser session so navigation stays instant afterwards.
 */
export const Preloader: React.FC = () => {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [gone, setGone] = useState(() => done);

  useEffect(() => {
    if (done) return;
    document.documentElement.style.overflow = 'hidden';
    const start = performance.now();
    const DURATION = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // easeOutExpo — fast charge, slow settle, feels engineered
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          /* private mode */
        }
        window.setTimeout(() => {
          setDone(true);
          document.documentElement.style.overflow = '';
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = '';
    };
  }, [done]);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), 1100);
    return () => window.clearTimeout(t);
  }, [done]);

  if (gone) return null;

  const lift = done ? '-100%' : '0%';

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden="true">
      {/* Left + right curtain panels */}
      {[0, 1].map((side) => (
        <motion.div
          key={side}
          className="absolute top-0 h-full w-1/2 bg-[#0A0B10]"
          style={{ [side === 0 ? 'left' : 'right']: 0 } as React.CSSProperties}
          initial={false}
          animate={{ y: lift }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {side === 0 && (
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#C9A45C55] to-transparent" />
          )}
          {side === 1 && (
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#C9A45C55] to-transparent" />
          )}
        </motion.div>
      ))}

      {/* Counter + hairline */}
      <AnimatePresence>
        {!done && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <span className="font-serif-accent text-6xl sm:text-7xl text-[#EFE3C2] tabular-nums">
              {count}
            </span>
            <div className="h-px w-44 overflow-hidden bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#C9A45C] to-[#EFE3C2]"
                style={{ width: `${count}%` }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
              Establishing transmission
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
