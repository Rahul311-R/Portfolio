import React, { useRef, useEffect, useState } from 'react';

export const GenerativeTypography: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('RAHUL R');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 360);

    // Off-screen canvas for text rasterization
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    offCtx.fillStyle = '#FFFFFF';
    offCtx.font = '900 64px "Space Grotesk", sans-serif';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(text, width / 2, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height);
    const dots: { x: number; y: number; originX: number; originY: number; color: string }[] = [];

    const step = 6;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        if (imgData.data[index + 3] > 128) {
          dots.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            originX: x,
            originY: y,
            color: x % 12 === 0 ? '#22D3EE' : '#8B5CF6'
          });
        }
      }
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
      ctx.clearRect(0, 0, width, height);

      for (let d of dots) {
        const dx = mouseX - d.x;
        const dy = mouseY - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          const angle = Math.atan2(dy, dx);
          const force = (80 - dist) / 80;
          d.x -= Math.cos(angle) * force * 8;
          d.y -= Math.sin(angle) * force * 8;
        } else {
          // Spring back to original rasterized coordinates
          d.x += (d.originX - d.x) * 0.08;
          d.y += (d.originY - d.y) * 0.08;
        }

        ctx.fillStyle = d.color;
        ctx.fillRect(d.x, d.y, 2.5, 2.5);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [text]);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 className="font-mono text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">
          EXPERIMENT 02 // KINETIC MATRIX TYPOGRAPHY
        </h3>
        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono rounded">
          Experimental / Personal Work
        </span>
      </div>

      <div className="visual-stage relative h-72 w-full rounded border border-[var(--border-color)] overflow-hidden">
        <canvas ref={canvasRef} className="relative z-10 w-full h-full cursor-crosshair" />
        <div className="absolute z-20 top-2 left-2 bg-black/60 px-2 py-1 rounded font-mono text-[10px] text-[var(--visual-muted)] pointer-events-none">
          Hover cursor over letters to disrupt particle matrix
        </div>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs pt-1">
        <span className="text-[var(--text-muted)]">Input String:</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.toUpperCase())}
          maxLength={12}
          className="bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] px-3 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded"
        />
      </div>
    </div>
  );
};
