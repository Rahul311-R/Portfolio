import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMotionEngine } from '@/engine/MotionEngine';

interface Satellite {
  ring: number;
  phase: number;
  speed: number;
  hue: number;
}

/**
 * Three tilted orbital rings of packets circling a glowing core — a
 * "transmission hub". The whole orbit rotates; drag to spin it yourself.
 * Decorative, pauses offscreen, renders a single static frame under
 * reduced motion.
 */
export const PacketOrbit3D: React.FC<{ className?: string; perRing?: number }> = ({
  className = '',
  perRing = 8,
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

    const satellites: Satellite[] = [];
    for (let ring = 0; ring < 3; ring++) {
      for (let k = 0; k < perRing; k++) {
        satellites.push({
          ring,
          phase: (k / perRing) * Math.PI * 2,
          speed: (ring === 1 ? -1 : 1) * (0.012 + ring * 0.004),
          hue: ring === 0 ? 48 : ring === 1 ? 42 : 0,
        });
      }
    }

    // Fixed ring tilts (rotation about x then z) for variety.
    const tilts = [
      { ax: 1.15, az: 0 },
      { ax: 0.5, az: 0.6 },
      { ax: 0.9, az: -0.5 },
    ];
    let rotY = 0.4;
    let velY = 0.004;
    let dragging = false;
    let lastX = 0;

    const R = () => Math.min(width, height) * 0.33;

    const project = (x: number, y: number, z: number) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const scale = 1 / (1.7 - z1);
      return {
        sx: width / 2 + x1 * R() * scale,
        sy: height / 2 + y * R() * scale,
        depth: (z1 + 1) / 2,
      };
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(16, 19, 29, 0.3)';
      ctx.fillRect(0, 0, width, height);

      // ring paths + satellites, far first
      const order = [...satellites].sort((a, b) => a.phase - b.phase);
      for (let ring = 0; ring < 3; ring++) {
        const t = tilts[ring];
        if (!t) continue;
        ctx.strokeStyle = `hsla(${ring === 0 ? 190 : ring === 1 ? 258 : 0}, 85%, 66%, 0.22)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let s = 0; s <= 60; s++) {
          const a = (s / 60) * Math.PI * 2;
          const x = Math.cos(a);
          const y0 = Math.sin(a);
          // tilt: rotate about x, then z
          const y1 = y0 * Math.cos(t.ax);
          const z1 = y0 * Math.sin(t.ax);
          const x2 = x * Math.cos(t.az) - y1 * Math.sin(t.az);
          const y2 = x * Math.sin(t.az) + y1 * Math.cos(t.az);
          const p = project(x2, y2, z1);
          if (s === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();
      }

      for (const sat of order) {
        const t = tilts[sat.ring];
        if (!t) continue;
        const a = sat.phase;
        const x = Math.cos(a);
        const y0 = Math.sin(a);
        const y1 = y0 * Math.cos(t.ax);
        const z1 = y0 * Math.sin(t.ax);
        const x2 = x * Math.cos(t.az) - y1 * Math.sin(t.az);
        const y2 = x * Math.sin(t.az) + y1 * Math.cos(t.az);
        const p = project(x2, y2, z1);
        const alpha = 0.3 + p.depth * 0.7;
        const hue = sat.hue === 0 ? 0 : sat.hue;
        const color = hue === 0 ? `rgba(245, 247, 250, ${alpha.toFixed(2)})` : `hsla(${hue}, 62%, 72%, ${alpha.toFixed(2)})`;
        // trailing dash
        const a2 = a - 0.16 * (sat.speed > 0 ? 1 : -1);
        const xT = Math.cos(a2);
        const yT0 = Math.sin(a2);
        const yT1 = yT0 * Math.cos(t.ax);
        const zT1 = yT0 * Math.sin(t.ax);
        const xT2 = xT * Math.cos(t.az) - yT1 * Math.sin(t.az);
        const yT2 = xT * Math.sin(t.az) + yT1 * Math.cos(t.az);
        const pT = project(xT2, yT2, zT1);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pT.sx, pT.sy);
        ctx.lineTo(p.sx, p.sy);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1.6 + p.depth * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // core
      const core = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 30);
      core.addColorStop(0, 'rgba(139, 92, 246, 0.9)');
      core.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(245, 247, 250, 0.95)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * 0.006;
      velY = (e.clientX - lastX) * 0.0006;
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
        rotY += velY * f;
        velY += (0.004 - velY) * 0.02;
      }
      for (const sat of satellites) sat.phase += sat.speed * f;
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
  }, [perRing, reducedMotion, engine]);

  return (
    <div
      role="img"
      aria-label="Decorative 3D orbit of packets circling a glowing transmission hub. Drag to spin."
      className={`visual-stage relative w-full overflow-hidden rounded-xl border border-[var(--border-color)] ${className}`}
    >
      <canvas ref={canvasRef} className="block h-[320px] w-full cursor-grab touch-none active:cursor-grabbing" />
      <div className="pointer-events-none absolute left-2 top-2 font-mono text-[10px] text-[var(--visual-muted)]">
        Drag to spin the orbit
      </div>
    </div>
  );
};
