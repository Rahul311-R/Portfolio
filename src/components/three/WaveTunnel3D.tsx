import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMotionEngine } from '@/engine/MotionEngine';

/**
 * A perspective "signal tunnel": rings of light recede toward a vanishing
 * point and stream toward the viewer like data entering a waveguide.
 * Drag vertically to steer the vanishing point. Decorative (aria-hidden canvas
 * with a role="img" wrapper), pauses when offscreen, static under reduced motion.
 */
export const WaveTunnel3D: React.FC<{ className?: string; rings?: number }> = ({
  className = '',
  rings = 11,
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
    let height = 320;
    const size = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 320;
    };
    size();
    window.addEventListener('resize', size);

    const SEGS = 30;
    // z in (0, 1]: 1 = far, near 0.06
    let zs = Array.from({ length: rings }, (_, i) => 0.06 + (i / rings) * 0.94);
    let tiltX = 0; // drag offsets
    let tiltY = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(11, 12, 19, 0.32)';
      ctx.fillRect(0, 0, width, height);
      const cx = width / 2 + tiltX * 60;
      const cy = height / 2 + tiltY * 40;
      const spread = Math.min(width, height) * 0.62;

      zs = zs.map((z) => {
        const nz = z - 0.0035;
        return nz <= 0.06 ? 1 : nz;
      });

      const sorted = [...zs].sort((a, b) => b - a);
      for (const z of sorted) {
        const scale = 1 / z;
        const rx = spread * scale * 0.55;
        const ry = spread * scale * 0.34;
        const alpha = Math.min(0.9, (1.05 - z) * 0.9);
        const hue = (Math.round(z * 10) % 2 === 0 ? 42 : 48);
        ctx.strokeStyle = `hsla(${hue}, 62%, 68%, ${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(0.6, 2.4 * scale * 0.5);
        ctx.beginPath();
        for (let s = 0; s <= SEGS; s++) {
          const a = (s / SEGS) * Math.PI * 2;
          const wobble = Math.sin(a * 3 + z * 14) * 4 * scale * 0.4;
          const x = cx + Math.cos(a) * (rx + wobble);
          const y = cy + Math.sin(a) * (ry + wobble);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // bright core at the vanishing point
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
      core.addColorStop(0, 'rgba(245, 247, 250, 0.85)');
      core.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fill();
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      tiltX = Math.max(-1, Math.min(1, tiltX + (e.clientX - lastX) * 0.004));
      tiltY = Math.max(-1, Math.min(1, tiltY + (e.clientY - lastY) * 0.004));
      lastX = e.clientX;
      lastY = e.clientY;
      draw();
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

    const unsubscribe = engine.subscribe(() => {
      if (!visible) return;
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
  }, [rings, reducedMotion, engine]);

  return (
    <div
      role="img"
      aria-label="Decorative 3D tunnel of signal rings streaming toward the viewer. Drag to steer."
      className={`visual-stage relative w-full overflow-hidden rounded-xl border border-[var(--border-color)] ${className}`}
    >
      <canvas ref={canvasRef} className="block h-[320px] w-full cursor-grab touch-none active:cursor-grabbing" />
      <div className="pointer-events-none absolute left-2 top-2 font-mono text-[10px] text-[var(--visual-muted)]">
        Drag to steer the tunnel
      </div>
    </div>
  );
};
