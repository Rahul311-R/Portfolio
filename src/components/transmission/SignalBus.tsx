import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMotionEngine } from '../../engine/MotionEngine';

interface Packet {
  lane: number;
  x: number;
  speed: number;
  len: number;
  hue: number;
  delay: number;
}

/**
 * Live "signal bus": a handful of horizontal traffic lanes carrying
 * glowing packets that pulse every few seconds like a heartbeat, plus a
 * thin waveform idling in the background. Decorative — aria-hidden, and
 * the rAF loop pauses whenever it scrolls out of view.
 */
export const SignalBus: React.FC<{
  className?: string;
  height?: number;
  lanes?: number;
}> = ({ className = '', height = 190, lanes = 4 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const engine = useMotionEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let heightPx = (canvas.height = height);
    const onResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      heightPx = canvas.height = height;
    };
    window.addEventListener('resize', onResize);

    const laneY = (i: number) => heightPx * (0.18 + (0.64 * i) / Math.max(lanes - 1, 1));

    const packets: Packet[] = [];
    const perLane = 3;
    for (let lane = 0; lane < lanes; lane++) {
      for (let k = 0; k < perLane; k++) {
        packets.push({
          lane,
          x: Math.random(),
          speed: 0.0016 + Math.random() * 0.0022,
          len: 26 + Math.random() * 70,
          hue: Math.random() < 0.55 ? 42 : 48,
          delay: Math.random() * 0.5,
        });
      }
    }

    let visible = false;
    let beat = 0;

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, heightPx);

      // lanes
      for (let i = 0; i < lanes; i++) {
        const y = laneY(i);
        ctx.strokeStyle = 'rgba(245, 247, 250, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // direction arrow on alternating lanes
        ctx.fillStyle = 'rgba(245, 247, 250, 0.16)';
        ctx.font = '10px monospace';
        ctx.fillText(i % 2 === 0 ? 'TX →' : '← RX', 8, y - 6);
      }

      // idle background waveform
      beat += dt * 0.002;
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const y = heightPx / 2 + Math.sin(x * 0.02 + beat * 2) * 9 * Math.sin(x * 0.004 + beat);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // packets
      for (const p of packets) {
        p.x += p.speed * (dt / 16.7);
        if (p.x - p.len / width > 1.1) p.x = -Math.random() * 0.3;
        const y = laneY(p.lane) + (p.lane % 2 === 0 ? 5 : -5);
        const px = p.x * width;
        const grad = ctx.createLinearGradient(px - p.len, 0, px, 0);
        grad.addColorStop(0, `hsla(${p.hue}, 62%, 70%, 0)`);
        grad.addColorStop(1, `hsla(${p.hue}, 64%, 72%, 0.85)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(px - p.len, y);
        ctx.lineTo(px, y);
        ctx.stroke();
        ctx.fillStyle = `hsla(${p.hue}, 66%, 76%, 0.95)`;
        ctx.beginPath();
        ctx.arc(px, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reducedMotion) {
      draw(16);
      return () => window.removeEventListener('resize', onResize);
    }

    // Draws ride the shared MotionEngine clock; the IO gate skips work
    // while the bus is offscreen so the shared loop costs nothing extra.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const unsubscribe = engine.subscribe(({ dt }) => {
      if (visible) draw(dt);
    });

    return () => {
      observer.disconnect();
      unsubscribe();
      window.removeEventListener('resize', onResize);
    };
  }, [lanes, height, reducedMotion, engine]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full" style={{ height }} />
    </div>
  );
};
