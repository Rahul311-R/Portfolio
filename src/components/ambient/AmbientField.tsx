import React, { useEffect, useRef } from 'react';
import { useMotionEngine, type FrameEnv } from '../../engine/MotionEngine';

interface Mote {
  x: number;
  y: number;
  z: number;
  r: number;
  vy: number;
  phase: number;
}
interface Packet {
  x: number;
  y: number;
  speed: number;
  len: number;
  hue: number;
}

/**
 * Site-wide living background: a slow parallax starfield of motes, two
 * breathing carrier ribbons and occasional packets streaking across —
 * everything reacts to scroll velocity and the pointer. Mounted ONCE in
 * the Layout behind every page, so the whole site feels alive without
 * per-page cost. Subscribes to the shared MotionEngine clock (no extra
 * rAF loop of its own).
 */
export const AmbientField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useMotionEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const motes: Mote[] = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.random() * 0.75,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.008 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));
    const packets: Packet[] = Array.from({ length: 3 }, () => ({
      x: Math.random(),
      y: 0.1 + Math.random() * 0.8,
      speed: 0.0012 + Math.random() * 0.0022,
      len: 40 + Math.random() * 90,
      hue: Math.random() < 0.55 ? 42 : 48,
    }));

    let px = 0;
    let py = 0;
    let pActive = 0;
    let scrollOffset = 0;
    let lastScroll = window.scrollY;
    const accentHue = 42; // fixed brand hue — champagne gold

    const frame = (env: FrameEnv) => {
      const { t, dt, scrollVel, pointerNX, pointerNY, pointerActive } = env;
      const ds = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      scrollOffset += ds * 0.25;
      px += (pointerNX * 18 - px) * 0.04;
      py += (pointerNY * 12 - py) * 0.04;
      pActive += ((pointerActive ? 1 : 0) - pActive) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // ── Breathing carrier ribbons ──
      for (let b = 0; b < 2; b++) {
        const baseY = height * (b === 0 ? 0.3 : 0.72);
        const breathe = Math.sin(t * 0.35 + b * 2.1) * 26;
        const y = baseY + breathe + ((scrollOffset * (b === 0 ? -0.06 : 0.05)) % height);
        const grad = ctx.createLinearGradient(0, y - 60, width, y + 60);
        grad.addColorStop(0, `hsla(${accentHue}, 85%, 66%, 0)`);
        grad.addColorStop(0.5, `hsla(${accentHue}, 85%, 66%, ${(0.05 + Math.abs(Math.sin(t * 0.3 + b)) * 0.05).toFixed(3)})`);
        grad.addColorStop(1, 'hsla(190, 85%, 66%, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, y - 60, width, 120);
      }

      // ── Motes: parallax drift + pointer glow ──
      const cursorX = pointerActive ? width / 2 + px * 4 : -9999;
      const cursorY = pointerActive ? height / 2 + py * 4 : -9999;
      for (const m of motes) {
        m.y -= m.vy * (dt / 16.7) * (0.4 + m.z);
        if (m.y < -0.05) {
          m.y = 1.05;
          m.x = Math.random();
        }
        const sx = m.x * width + px * m.z + Math.sin(t * 0.5 + m.phase) * 6 * m.z;
        const sy = ((m.y * height + scrollOffset * m.z * 0.35) % (height + 40)) - 20;
        const dxp = sx - cursorX;
        const dyp = sy - cursorY;
        const dp = pointerActive ? Math.sqrt(dxp * dxp + dyp * dyp) : 9999;
        const glow = pointerActive && dp < 160 ? (1 - dp / 160) * 0.5 : 0;
        const alpha = (0.12 + m.z * 0.3 + glow) * (0.7 + Math.abs(Math.sin(t * 0.8 + m.phase)) * 0.3);
        ctx.fillStyle = `hsla(${m.z > 0.6 ? accentHue : 190}, 80%, 72%, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, m.r * (0.7 + m.z * 0.8), 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Packets streaking across, faster while scrolling ──
      for (const p of packets) {
        p.x += p.speed * (dt / 16.7) * (1 + scrollVel * 3);
        if (p.x > 1.2) {
          p.x = -0.2;
          p.y = 0.1 + Math.random() * 0.8;
        }
        const sx = p.x * width;
        const sy = p.y * height + Math.sin(t + p.x * 6) * 10;
        const grad = ctx.createLinearGradient(sx - p.len, 0, sx, 0);
        grad.addColorStop(0, `hsla(${p.hue}, 62%, 70%, 0)`);
        grad.addColorStop(1, `hsla(${p.hue}, 64%, 74%, ${(0.18 + scrollVel * 0.25).toFixed(3)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sx - p.len, sy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      // ── Pointer halo ──
      if (pActive > 0.02 && pointerActive) {
        const hx = width / 2 + px * 4;
        const hy = height / 2 + py * 4;
        const halo = ctx.createRadialGradient(hx, hy, 0, hx, hy, 190);
        halo.addColorStop(0, `hsla(${accentHue}, 90%, 70%, ${(0.07 * pActive).toFixed(3)})`);
        halo.addColorStop(1, `hsla(${accentHue}, 90%, 70%, 0)`);
        ctx.fillStyle = halo;
        ctx.fillRect(hx - 190, hy - 190, 380, 380);
      }
    };

    const unsubscribe = engine.subscribe(frame);
    return () => {
      unsubscribe();
      window.removeEventListener('resize', resize);
    };
  }, [engine]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full opacity-80" />
    </div>
  );
};
