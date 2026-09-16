import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SOCIAL } from '@/data/social';

const SEQ = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

/**
 * Konami-code easter egg: ↑ ↑ ↓ ↓ ← → ← → B A opens the hidden layer —
 * a gold-on-obsidian terminal with the story behind the site. Toggle again
 * with the code or dismiss with ESC / the close button.
 */
export const KonamiTerminal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) {
        if (e.key === 'Escape') setOpen(false);
        return;
      }
      const expected = SEQ[progress] ?? SEQ[0]!;
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        if (progress + 1 === SEQ.length) {
          setProgress(0);
          setOpen(true);
        } else {
          setProgress(progress + 1);
        }
      } else {
        setProgress(e.key.toLowerCase() === (SEQ[0] ?? '').toLowerCase() ? 1 : 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [progress, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Hidden terminal"
            className="w-full max-w-lg overflow-hidden rounded-xl border border-[#C9A45C]/40 bg-[#0A0B10] shadow-[0_0_80px_rgba(201,164,92,0.15)]"
            initial={{ y: 40, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C9A45C]">
                hidden_layer — access granted
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close hidden terminal"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#EFE3C2] transition-colors"
              >
                esc
              </button>
            </div>
            <div className="space-y-4 px-6 py-7 font-mono text-[13px] leading-relaxed">
              <p className="text-white/50">
                <span className="text-[#C9A45C]">$</span> cat /etc/site-origin
              </p>
              <p className="text-[#F5F7FA]">
                You found the layer under the layer. This whole site runs on one
                shared animation clock, a self-drawn 3D reactor, and zero UI
                templates — every line is in the repo.
              </p>
              <p className="text-white/50">
                <span className="text-[#C9A45C]">$</span> ping --quick
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`mailto:${SOCIAL.email}`}
                  className="rounded-full border border-[#C9A45C]/50 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#EFE3C2] hover:bg-[#C9A45C]/10 transition-colors"
                >
                  Email me
                </a>
                <a
                  href={SOCIAL.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-[#EFE3C2] hover:border-white/40 transition-colors"
                >
                  GitHub
                </a>
              </div>
              <p className="pt-2 text-[10px] uppercase tracking-[0.2em] text-white/25">
                ↑ ↑ ↓ ↓ ← → ← → B A — you know the drill
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
