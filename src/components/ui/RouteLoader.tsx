import React from 'react';

/**
 * Route-level suspense fallback: a small 3D cube assembling itself.
 * Pure CSS — collapses to a static cube under reduced motion via globals.
 */
export const RouteLoader: React.FC = () => {
  const faces = [
    'rotateY(0deg)',
    'rotateY(90deg)',
    'rotateY(180deg)',
    'rotateY(270deg)',
    'rotateX(90deg)',
    'rotateX(-90deg)',
  ];
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status" aria-label="Loading view">
      <div className="flex flex-col items-center gap-6">
        <div style={{ perspective: '500px', width: 44, height: 44 }}>
          <div className="loader-cube relative h-full w-full">
            {faces.map((t, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute inset-0 rounded-[6px] border border-[var(--accent-color)] bg-[var(--accent-glow)]"
                style={{ transform: `${t} translateZ(22px)` }}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Loading view
        </span>
      </div>
    </div>
  );
};
