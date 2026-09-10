import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export const ParticleFieldExperiment: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const attractorForce = 1.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 360);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }[] = [];

    const colors = ['#8B5CF6', '#22D3EE', '#34D399', '#FBBF24'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 1.5
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.fillStyle = 'rgba(17, 19, 26, 0.25)';
      ctx.fillRect(0, 0, width, height);

      for (let p of particles) {
        if (isRunning) {
          p.x += p.vx * speed;
          p.y += p.vy * speed;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Mouse gravity force
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 1) {
            p.x += (dx / dist) * attractorForce;
            p.y += (dy / dist) * attractorForce;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isRunning, speed, attractorForce]);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 className="font-mono text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">
          EXPERIMENT 01 // GRAVITATIONAL PARTICLE FIELD
        </h3>
        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono rounded">
          Experimental / Personal Work
        </span>
      </div>

      <div className="visual-stage relative h-72 w-full rounded border border-[var(--border-color)] overflow-hidden">
        <canvas ref={canvasRef} className="relative z-10 w-full h-full cursor-crosshair" />
        <div className="absolute z-20 top-2 left-2 bg-black/60 px-2 py-1 rounded font-mono text-[10px] text-[var(--visual-muted)] pointer-events-none">
          Move cursor to attract particles
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 bg-[var(--accent-color)] text-white rounded flex items-center gap-1 hover:opacity-90"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] text-[10px] uppercase">Speed:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded border text-[10px] ${
                  speed === s
                    ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]'
                    : 'bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
