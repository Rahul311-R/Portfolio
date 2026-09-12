import React, { useEffect, useRef, useState } from 'react';
import { Mountain } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * EXPERIMENT 07 — a wireframe terrain sheet drifting on sine waves.
 * Drag to orbit it; calm/storm switch changes the wave amplitude.
 * Generative sketch only — no real elevation data anywhere.
 */
export const TerrainExperiment: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const [storm, setStorm] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 380);
    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 380;
    };
    window.addEventListener('resize', onResize);

    const COLS = 26;
    const ROWS = 15;
    const SPAN = 26;

    let rotX = 0.95;
    let rotY = 0;
    let velX = 0;
    let velY = 0.004;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let t = 0;
    let amp = storm ? 20 : 8;

    const project = (x: number, y: number, z: number) => {
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x1 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const scale = 1.1 / (2.6 - z2 * 0.004);
      return {
        sx: width / 2 + x1 * scale,
        sy: height * 0.62 + y1 * scale,
        depth: (z2 + 300) / 600,
      };
    };

    const wave = (x: number, y: number) =>
      Math.sin(x * 0.45 + t) * Math.cos(y * 0.5 + t * 0.7) * amp +
      Math.sin((x + y) * 0.25 + t * 1.4) * amp * 0.35;

    const draw = () => {
      ctx.fillStyle = 'rgba(16, 19, 29, 0.32)';
      ctx.fillRect(0, 0, width, height);
      const ox = -((COLS - 1) * SPAN) / 2;
      const oy = -((ROWS - 1) * SPAN) / 2;

      // rows
      for (let r = 0; r < ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const p = project(ox + c * SPAN, oy + r * SPAN, wave(c, r));
          if (c === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.28 + (r / ROWS) * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // columns
      for (let c = 0; c < COLS; c += 1) {
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
          const p = project(ox + c * SPAN, oy + r * SPAN, wave(c, r));
          if (r === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const render = () => {
      t += 0.02;
      amp += ((storm ? 20 : 8) - amp) * 0.05;
      if (!dragging) {
        rotX += velX;
        rotY += velY;
        velX *= 0.95;
        velY += (0.004 - velY) * 0.02;
        rotX = Math.max(0.35, Math.min(1.35, rotX));
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
      rotX = Math.max(0.35, Math.min(1.35, rotX + dy * 0.005));
      velY = dx * 0.0006;
      velX = dy * 0.0005;
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
  }, [storm, reducedMotion]);

  return (
    <div className="space-y-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">
          <Mountain className="h-4 w-4" />
          EXPERIMENT 07 // WIREFRAME TERRAIN DRIFT
        </h3>
        <span className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] text-rose-400">
          Experimental / Personal Work
        </span>
      </div>

      <p className="font-mono text-xs leading-relaxed text-[var(--text-muted)]">
        A sine-wave height field drawn as wireframe — drag to orbit it. Pure
        generative math; no real terrain data involved.
      </p>

      <div
        className="visual-stage relative w-full overflow-hidden rounded border border-[var(--border-color)]"
        role="img"
        aria-label="Interactive 3D wireframe terrain. Drag to orbit it."
      >
        <canvas
          ref={canvasRef}
          className="relative z-10 block h-[380px] w-full cursor-grab touch-none active:cursor-grabbing"
        />
        <div className="absolute left-2 top-2 z-20 rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-[var(--visual-muted)]">
          Drag to orbit the terrain
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className="text-[10px] uppercase text-[var(--text-muted)]">Swell:</span>
        {[
          { label: 'Calm', value: false },
          { label: 'Storm', value: true },
        ].map((opt) => (
          <button
            key={opt.label}
            onClick={() => setStorm(opt.value)}
            aria-pressed={storm === opt.value}
            className={`rounded border px-2 py-0.5 text-[10px] transition-colors ${
              storm === opt.value
                ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                : 'border-[var(--border-color)] bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
