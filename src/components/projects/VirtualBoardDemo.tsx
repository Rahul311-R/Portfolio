import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Hand } from 'lucide-react';

export const VirtualBoardDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#22D3EE');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const step = 20;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial background grid drawing
    drawGrid(ctx, rect.width, rect.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? '#11131A' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawGrid(ctx, rect.width, rect.height);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-lg space-y-3">
      {/* Demo Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Hand className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="font-mono text-xs text-[var(--text-primary)] uppercase font-bold tracking-wider">
            Interactive Demo
          </span>
        </div>
        <span className="font-mono text-[10px] text-[var(--accent-color)] px-2 py-0.5 bg-[var(--accent-glow)] border border-[var(--accent-color)]/30 rounded uppercase">
          Pointer-based preview
        </span>
      </div>

      {/* Drawing Canvas Viewport */}
      <div className="visual-stage relative h-64 sm:h-72 w-full rounded border border-[var(--border-color)] overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 w-full h-full touch-none"
        />
        <div className="absolute z-20 top-2 right-2 bg-black/60 px-2 py-1 rounded font-mono text-[10px] text-[var(--visual-muted)] pointer-events-none">
          Drag or touch to draw
        </div>
      </div>

      {/* Control Palette */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Colors */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--text-muted)]">Color:</span>
          {['#22D3EE', '#8B5CF6', '#34D399', '#FBBF24', '#FFFFFF'].map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full border border-black/40 transition-transform ${
                color === c && !isEraser ? 'scale-125 ring-2 ring-white' : ''
              }`}
              title={`Color ${c}`}
              aria-label={`Select brush color ${c}`}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--text-muted)]">Size:</span>
          {[2, 4, 8, 12].map((s) => (
            <button
              key={s}
              onClick={() => setBrushSize(s)}
              className={`px-2 py-0.5 font-mono text-xs rounded border transition-colors ${
                brushSize === s
                  ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]'
                  : 'bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)]'
              }`}
            >
              {s}px
            </button>
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-1.5 rounded border font-mono text-xs flex items-center gap-1 transition-colors ${
              isEraser
                ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]'
                : 'bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)]'
            }`}
            title="Eraser tool"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Eraser</span>
          </button>
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-400/50 font-mono text-xs flex items-center gap-1 transition-colors"
            title="Clear canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};
