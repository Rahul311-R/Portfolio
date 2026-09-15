import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Star {
  x: number;
  y: number;
  z: number;
  hue: number;
}

/**
 * Full-bleed starfield divider. Stars drift constantly; scrolling faster
 * stretches them into warp streaks. Pure decoration — hidden from AT.
 */
export const WarpDivider: React.FC<{ className?: string; stars?: number }> = ({
  className = '',
  stars = 110,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 170);
    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 170;
    };
    window.addEventListener('resize', onResize);

    const field: Star[] = Array.from({ length: stars }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 0.9 + 0.1,
      hue: Math.random() < 0.6 ? 42 : Math.random() < 0.5 ? 48 : 0,
    }));

    let warp = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let inView = true;

    // Park the loop entirely while offscreen — no draw cost when scrolled away.
    const io = new IntersectionObserver(([entry]) => {
      const was = inView;
      inView = entry.isIntersecting;
      if (inView && !was && !reducedMotion) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(render);
      }
    });
    io.observe(canvas);

    const draw = () => {
      ctx.fillStyle = 'rgba(11, 12, 19, 0.4)';
      ctx.fillRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const spread = Math.min(width, height) * 0.55;

      for (const s of field) {
        s.z -= 0.006 + warp * 0.05;
        if (s.z <= 0.05) {
          s.z = 1;
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
        }
        const px = cx + (s.x / s.z) * spread;
        const py = cy + (s.y / s.z) * spread;
        const tail = Math.min(warp * 30, 26);
        const tx = cx + (s.x / Math.max(s.z + 0.02 + warp * 0.12, 0.06)) * spread;
        const ty = cy + (s.y / Math.max(s.z + 0.02 + warp * 0.12, 0.06)) * spread;
        const alpha = Math.min(1, (1.1 - s.z) * (0.5 + warp * 2));
        ctx.strokeStyle =
          s.hue === 0
            ? `rgba(245, 247, 250, ${alpha.toFixed(2)})`
            : `hsla(${s.hue}, 62%, 70%, ${alpha.toFixed(2)})`;
        ctx.lineWidth = Math.max(1, (1 - s.z) * 2);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + (tx - px) * Math.min(tail / 26, 1) * 0.6, py + (ty - py) * Math.min(tail / 26, 1) * 0.6);
        ctx.stroke();
        if (tail < 2) {
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.8, (1 - s.z) * 1.8), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const render = () => {
      if (!inView) return; // parked
      const y = window.scrollY;
      const vel = Math.abs(y - lastY);
      lastY = y;
      warp += (Math.min(vel * 0.004, 1) - warp) * 0.08;
      draw();
      raf = requestAnimationFrame(render);
    };

    if (reducedMotion) {
      draw();
    } else {
      raf = requestAnimationFrame(render);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [stars, reducedMotion]);

  return (
    <div aria-hidden="true" className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block h-[170px] w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[var(--bg-primary)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </div>
  );
};
