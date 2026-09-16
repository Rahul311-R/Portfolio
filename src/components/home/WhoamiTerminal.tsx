import React, { useEffect, useState } from 'react';

const LINES: { cmd: string; out: string[] }[] = [
  { cmd: 'whoami', out: ['AI & Data Science developer — Coimbatore, IN'] },
  {
    cmd: 'currently_building',
    out: [
      'this portfolio — React 19 · Three.js · zero templates',
      'a tiny CLI that scaffolds experiments',
      'OpenCV hand-tracking, ported to the web',
    ],
  },
  {
    cmd: 'currently_learning',
    out: ['attention mechanisms from first principles', 'Rust · GLSL shaders'],
  },
  {
    cmd: 'mission',
    out: ['build useful things.', 'keep learning.', 'solve real problems.'],
  },
];

/**
 * The developer-personality terminal (the "whoami" section).
 * Lines reveal one after another with a small typed cadence when scrolled
 * into view; static full output under reduced motion.
 */
export const WhoamiTerminal: React.FC = () => {
  const [visible, setVisible] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { threshold: 0.05 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const total = LINES.reduce((acc, l) => acc + 1 + l.out.length, 0);
    if (reduced) {
      setVisible(total);
      return;
    }
    const id = window.setInterval(() => {
      setVisible((v) => {
        if (v >= total) {
          window.clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 260);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  let cursor = 0;
  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[#0A0B10] shadow-2xl"
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#C9A45C]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
          rahul@portfolio — zsh
        </span>
      </div>
      <div className="space-y-5 px-5 py-6 font-mono text-[13px] leading-relaxed sm:px-7">
        {LINES.map((line) => {
          const cmdShown = visible > cursor++;
          const outShown = line.out.filter(() => visible > cursor++).length;
          return (
            <div key={line.cmd}>
              <div className="flex gap-2">
                <span className="text-[#C9A45C]">$</span>
                <span className="text-[#F5F7FA]">
                  {cmdShown ? line.cmd : ''}
                  {cmdShown && visible <= cursor ? (
                    <span className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-[#EFE3C2] animate-pulse" />
                  ) : null}
                </span>
              </div>
              {line.out.map((o, i) => (
                <div
                  key={o}
                  className={`pl-5 text-white/55 transition-opacity duration-300 ${
                    i < outShown ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  &gt; {o}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
