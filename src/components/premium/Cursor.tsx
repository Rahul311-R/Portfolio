import React, { useEffect, useRef, useState } from 'react';

type CursorMode = 'default' | 'link' | 'drag' | 'view';

const LABELS: Record<CursorMode, string> = {
  default: '',
  link: '→',
  drag: 'DRAG',
  view: 'VIEW',
};

/**
 * Fine-pointer custom cursor: an instant gold dot and a physics-trailed ring.
 * The ring swells over links/buttons and morphs into a labelled disc over
 * draggable 3D stages (data-cursor="drag") and project cards (data-cursor="view").
 * Auto-disables on touch, coarse pointers and reduced motion.
 */
export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const [mode, setMode] = useState<CursorMode>('default');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.classList.add('custom-cursor');

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const el = (e.target as HTMLElement | null)?.closest(
        '[data-cursor], a, button, [role="button"], input, textarea, select'
      );
      const next: CursorMode = el
        ? el.getAttribute('data-cursor') === 'drag'
          ? 'drag'
          : el.getAttribute('data-cursor') === 'view'
            ? 'view'
            : 'link'
        : 'default';
      setMode((m) => (m === next ? m : next));
    };

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16;
      ring.current.y += (pos.current.y - ring.current.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  const isDisc = mode === 'drag' || mode === 'view';

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 rounded-full bg-[#EFE3C2]"
        style={{ opacity: isDisc ? 0 : 1 }}
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full border font-mono text-[9px] tracking-[0.18em] transition-[width,height,background-color,border-color] duration-300 ${
          isDisc
            ? 'h-16 w-16 border-transparent bg-[#C9A45C]/90 text-[#0A0B10]'
            : mode === 'link'
              ? 'h-11 w-11 border-[#C9A45C]/70 bg-[#C9A45C]/10'
              : 'h-8 w-8 border-[#C9A45C]/40'
        }`}
      >
        {LABELS[mode]}
      </div>
    </>
  );
};
