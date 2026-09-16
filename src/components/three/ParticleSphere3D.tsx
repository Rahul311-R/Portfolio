import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Dot {
  x: number;
  y: number;
  z: number;
  hue: number;
  size: number;
}

/**
 * A draggable 3D point sphere projected onto canvas. Spins on its own,
 * follows your drag with momentum, and settles back to an idle rotation.
 * Decorative generative art — clearly an experiment, not project data.
 */
export const ParticleSphere3D: React.FC<{
  points?: number;
  className?: string;
  /** Size the canvas to its parent instead of the fixed 380px height. */
  fluid?: boolean;
  /** Skip the dark backdrop fill so dots float over existing artwork. */
  transparent?: boolean;
}> = ({ points = 160, className = '', fluid = false, transparent = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const measure = () => ({
      w: canvas.parentElement?.clientWidth || 600,
      h: fluid ? canvas.parentElement?.clientHeight || 480 : 380,
    });
    let { w: width, h: height } = measure();
    canvas.width = width;
    canvas.height = height;
    const onResize = () => {
      if (!canvas) return;
      const m = measure();
      width = canvas.width = m.w;
      height = canvas.height = m.h;
    };
    window.addEventListener('resize', onResize);

    // Fibonacci sphere distribution
    const dots: Dot[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < points; i++) {
      const y = 1 - (i / (points - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      dots.push({
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius,
        hue: Math.random() < 0.55 ? 42 : 48,
        size: Math.random() * 1.6 + 1,
      });
    }

    let rotX = 0.4;
    let rotY = 0;
    let velX = 0;
    let velY = 0.005; // idle spin
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;

    const project = (d: Dot) => {
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const y1 = d.y * cosX - d.z * sinX;
      const z1 = d.y * sinX + d.z * cosX;
      const x1 = d.x * cosY + z1 * sinY;
      const z2 = -d.x * sinY + z1 * cosY;
      const R = Math.min(width, height) * 0.32;
      const scale = 1 / (1.6 - z2);
      return {
        sx: width / 2 + x1 * R * scale,
        sy: height / 2 + y1 * R * scale,
        depth: (z2 + 1) / 2,
      };
    };

    const draw = () => {
      if (transparent) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = 'rgba(16, 19, 29, 0.28)';
        ctx.fillRect(0, 0, width, height);
      }

      // connecting ring for structure
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, Math.min(width, height) * 0.32, Math.min(width, height) * 0.1, -0.4, 0, Math.PI * 2);
      ctx.stroke();

      for (const d of dots) {
        const p = project(d);
        const alpha = 0.25 + p.depth * 0.75;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, d.size * (0.6 + p.depth * 1.4), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue}, 62%, 70%, ${alpha})`;
        ctx.fill();
      }
    };

    const render = () => {
      if (!dragging) {
        rotX += velX;
        rotY += velY;
        velX *= 0.95;
        velY += (0.005 - velY) * 0.02;
      }
      draw();
      raf = requestAnimationFrame(render);
    };

    if (reducedMotion) {
      draw();
    } else {
      raf = requestAnimationFrame(render);
    }

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rotY += dx * 0.006;
      rotX += dy * 0.006;
      velY = dx * 0.0006;
      velX = dy * 0.0006;
    };
    const onUp = () => {
      dragging = false;
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [points, reducedMotion, fluid, transparent]);

  return (
    <div
      className={`relative w-full overflow-hidden ${transparent ? '' : 'visual-stage rounded border border-[var(--border-color)]'} ${className}`}
      role="img"
      aria-label="Interactive 3D sphere of glowing particles. Drag to spin it."
    >
      <canvas
        ref={canvasRef}
        className={`relative z-10 block w-full cursor-grab touch-none active:cursor-grabbing ${fluid ? 'h-full' : 'h-[380px]'}`}
      />
      {!transparent && (
        <div className="absolute left-2 top-2 z-20 rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-[var(--visual-muted)]">
          Drag the sphere — it keeps your spin
        </div>
      )}
    </div>
  );
};
