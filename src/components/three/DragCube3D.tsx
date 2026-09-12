import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const FACES = [
  { label: 'Python', sub: 'core language', transform: 'rotateY(0deg)' },
  { label: 'OpenCV', sub: 'computer vision', transform: 'rotateY(90deg)' },
  { label: 'SQL', sub: 'data querying', transform: 'rotateY(180deg)' },
  { label: 'Power BI', sub: 'dashboards', transform: 'rotateY(-90deg)' },
  { label: 'Git', sub: 'version control', transform: 'rotateX(90deg)' },
  { label: 'Figma', sub: 'interface design', transform: 'rotateX(-90deg)' },
];

/**
 * A continuously auto-rotating CSS-3D cube. Grab it to spin it yourself —
 * release and it keeps your momentum, easing back to its idle rotation.
 * All face labels are resume-listed tools. Pure CSS 3D, zero dependencies.
 */
export const DragCube3D: React.FC<{ size?: number }> = ({ size = 260 }) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const drag = useRef({ active: false, lastX: 0, lastY: 0 });
  const rotation = useRef({ x: -18, y: 24 });

  const applyRotation = () => {
    const cube = cubeRef.current;
    if (!cube) return;
    cube.style.transform = `rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 18;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [0, -step],
      ArrowRight: [0, step],
      ArrowUp: [-step, 0],
      ArrowDown: [step, 0],
    };
    const delta = map[e.key];
    if (!delta) return;
    e.preventDefault();
    rotation.current.x += delta[0];
    rotation.current.y += delta[1];
    applyRotation();
  };

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube || reducedMotion) return;

    const rot = rotation.current;
    let velX = 0;
    let velY = 0.32; // idle auto-rotation (deg / frame)
    let raf = 0;

    const render = () => {
      if (!drag.current.active) {
        rot.x += velX;
        rot.y += velY;
        velX *= 0.95;
        // ease back toward the idle spin speed
        velY += (0.32 - velY) * 0.02;
      }
      cube.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onDown = (e: PointerEvent) => {
      drag.current = { active: true, lastX: e.clientX, lastY: e.clientY };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      const dy = e.clientY - drag.current.lastY;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      rot.y += dx * 0.5;
      rot.x -= dy * 0.5;
      velY = dx * 0.12;
      velX = -dy * 0.12;
      cube.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
    };
    const onUp = () => {
      drag.current.active = false;
    };

    cube.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      cancelAnimationFrame(raf);
      cube.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [reducedMotion]);

  // Half-depth scales with the rendered cube via CSS min(), so the cube
  // never distorts on narrow viewports.
  const half = `calc(min(${size}px, 68vw) / 2)`;

  return (
    <div
      className="select-none"
      style={{ perspective: '1100px', width: `min(${size}px, 68vw)`, aspectRatio: '1 / 1' }}
      role="img"
      aria-label="Interactive rotating cube showing resume tools: Python, OpenCV, SQL, Power BI, Git and Figma. Drag or use arrow keys to spin it."
    >
      <div
        ref={cubeRef}
        tabIndex={0}
        aria-label="3D cube. Use left, right, up and down arrow keys to rotate."
        onKeyDown={handleKeyDown}
        className="relative h-full w-full cursor-grab rounded-xl outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
        style={{
          transformStyle: 'preserve-3d',
          transform: reducedMotion ? 'rotateX(-18deg) rotateY(24deg)' : undefined,
          touchAction: 'none',
        }}
      >
        {FACES.map((face) => (
          <div
            key={face.label}
            className="absolute inset-0 grid place-items-center rounded-xl border border-white/15 bg-[#10131D]/85 text-center shadow-[0_0_45px_rgba(139,92,246,0.22)] backdrop-blur-sm"
            style={{ transform: `${face.transform} translateZ(${half})` }}
          >
            <div>
              <div className="font-display text-2xl font-extrabold tracking-tight text-white">
                {face.label}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                {face.sub}
              </div>
            </div>
          </div>
        ))}
        {/* inner glow core */}
        <div
          className="absolute left-1/2 top-1/2 h-16 w-16 rounded-full bg-[var(--accent-color)] opacity-40 blur-2xl"
          style={{ transform: 'translate(-50%, -50%) translateZ(0px)' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
