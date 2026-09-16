import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMotionEngine } from '@/engine/MotionEngine';

/**
 * A double helix of signal nodes — two strands carrying paired "packets"
 * joined by rungs, slowly rotating like a data cable under tension.
 * Drag horizontally to spin. Decorative, pauses offscreen, static frame
 * under reduced motion.
 */
export const SignalHelix3D: React.FC<{ className?: string; pairs?: number }> = ({
  className = '',
  pairs = 16,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const engine = useMotionEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || 600;
    let height = 340;
    const size = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 340;
    };
    size();
    window.addEventListener('resize', size);

    let rot = 0;
    let vel = 0.011;
    let dragging = false;
    let lastX = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(16, 19, 29, 0.3)';
      ctx.fillRect(0, 0, width, height);

      const amp = Math.min(width, height) * 0.27;
      const cx = width / 2;
      const top = height * 0.12;
      const bottom = height * 0.88;

      type Node = { x: number; y: number; depth: number; strand: 0 | 1; i: number };
      const nodes: Node[] = [];

      for (let i = 0; i < pairs; i++) {
        const t = i / (pairs - 1);
        const y = top + t * (bottom - top);
        const a = rot + t * Math.PI * 3.2;
        const x1 = cx + Math.cos(a) * amp;
        const x2 = cx + Math.cos(a + Math.PI) * amp;
        const d1 = (Math.sin(a) + 1) / 2;
        const d2 = (Math.sin(a + Math.PI) + 1) / 2;
        nodes.push({ x: x1, y, depth: d1, strand: 0, i });
        nodes.push({ x: x2, y, depth: d2, strand: 1, i });
      }

      // rungs first (behind-ish), then strands
      ctx.lineWidth = 1.4;
      for (let i = 0; i < pairs; i += 2) {
        const a = nodes[i * 2];
        const b = nodes[i * 2 + 1];
        if (!a || !b) continue;
        ctx.strokeStyle = `rgba(245, 247, 250, ${(0.08 + Math.min(a.depth, b.depth) * 0.16).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      const ordered = [...nodes].sort((p, q) => p.depth - q.depth);
      for (const n of ordered) {
        const hue = n.strand === 0 ? 42 : 48;
        const alpha = 0.25 + n.depth * 0.75;
        const r = 1.6 + n.depth * 2.6;
        ctx.fillStyle = `hsla(${hue}, 62%, 72%, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // spine glow
      const grad = ctx.createLinearGradient(cx, top, cx, bottom);
      grad.addColorStop(0, 'rgba(139, 92, 246, 0)');
      grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.35)');
      grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, top);
      ctx.lineTo(cx, bottom);
      ctx.stroke();
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      rot += (e.clientX - lastX) * 0.008;
      vel = (e.clientX - lastX) * 0.0009;
      lastX = e.clientX;
    };
    const onUp = () => {
      dragging = false;
    };

    if (reducedMotion) {
      draw();
      return () => {
        window.removeEventListener('resize', size);
      };
    }

    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
    }, { threshold: 0.05 });
    io.observe(canvas);
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    const unsubscribe = engine.subscribe(({ dt }) => {
      if (!visible) return;
      const f = dt / 16.7;
      if (!dragging) {
        rot += vel * f;
        vel += (0.011 - vel) * 0.02;
      }
      draw();
    });

    return () => {
      io.disconnect();
      unsubscribe();
      window.removeEventListener('resize', size);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [pairs, reducedMotion, engine]);

  return (
    <div
      role="img"
      aria-label="Decorative 3D double helix of signal nodes. Drag to spin it."
      className={`visual-stage relative w-full overflow-hidden rounded-xl border border-[var(--border-color)] ${className}`}
    >
      <canvas ref={canvasRef} className="block h-[340px] w-full cursor-grab touch-none active:cursor-grabbing" />
      <div className="pointer-events-none absolute left-2 top-2 font-mono text-[10px] text-[var(--visual-muted)]">
        Drag to spin the helix
      </div>
    </div>
  );
};
