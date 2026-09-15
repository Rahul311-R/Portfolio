import React, { useEffect } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

interface ProjectPreviewState {
  src: string;
  label: string;
}

/**
 * The signature interaction from the reference reel: hovering a project row
 * summons an image preview that glides after the cursor on springs.
 * Fixed, pointer-events-none, spring-driven — zero re-renders on mousemove.
 * Desktop fine pointers only.
 */
export const ProjectPreview: React.FC<{ preview: ProjectPreviewState | null }> = ({
  preview,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.55 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.55 });

  useEffect(() => {
    if (!preview) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [preview, x, y]);

  if (
    typeof window === 'undefined' ||
    !window.matchMedia('(pointer: fine)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      {preview && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-40"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, scale: 0.72, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.72, rotate: 4 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="h-[13rem] w-[19.5rem] -translate-x-1/2 -translate-y-[110%] overflow-hidden rounded-xl shadow-2xl shadow-black/60 sm:h-[14.5rem] sm:w-[22rem]">
            <img src={preview.src} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
            <span className="absolute bottom-2.5 left-2.5 rounded bg-black/65 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#EFE3C2] backdrop-blur-sm">
              {preview.label}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
