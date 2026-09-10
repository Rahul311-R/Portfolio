import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const MatrixRainLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [characterSet, setCharacterSet] = useState('RAHUL_R_AI_DATA_CODE_01');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 360);

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const render = () => {
      ctx.fillStyle = 'rgba(3, 4, 8, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00F0FF';
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const textChar = characterSet[Math.floor(Math.random() * characterSet.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(textChar, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        if (isRunning) {
          drops[i]++;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isRunning, characterSet]);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 className="text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">
          EXPERIMENT 02 // MATRIX DIGITAL CODE RAIN
        </h3>
        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] rounded">
          Experimental / Personal Work
        </span>
      </div>

      <div className="visual-stage relative h-72 w-full rounded border border-[var(--border-color)] overflow-hidden">
        <canvas ref={canvasRef} className="relative z-10 w-full h-full" />
        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] text-cyan-400 border border-cyan-500/30">
          CYBER MATRIX STREAM ACTIVE
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          onClick={() => {
            soundFx.playClick();
            setIsRunning(!isRunning);
          }}
          className="px-3 py-1.5 bg-[var(--accent-color)] text-white font-bold rounded flex items-center gap-1.5"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause Stream' : 'Resume Stream'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)] text-[10px] uppercase">Glyph Set:</span>
          {['RAHUL_R_AI_DATA_CODE_01', '01010101_AI_CV_VISION', 'QUANTUM_MATRIX_LAB'].map((set) => (
            <button
              key={set}
              onClick={() => {
                soundFx.playClick();
                setCharacterSet(set);
              }}
              className={`px-2 py-0.5 rounded text-[10px] border ${
                characterSet === set
                  ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] font-bold'
                  : 'bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)]'
              }`}
            >
              {set.split('_')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
