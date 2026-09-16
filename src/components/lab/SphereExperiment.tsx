import React, { useState } from 'react';
import { Rotate3d } from 'lucide-react';
import { ParticleSphere3D } from '@/components/three/ParticleSphere3D';

export const SphereExperiment: React.FC = () => {
  const [density, setDensity] = useState(160);

  return (
    <div className="space-y-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">
          <Rotate3d className="h-4 w-4" />
          EXPERIMENT 06 // DRAGGABLE 3D PARTICLE SPHERE
        </h3>
        <span className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] text-rose-400">
          Experimental / Personal Work
        </span>
      </div>

      <p className="font-mono text-xs leading-relaxed text-[var(--text-muted)]">
        3D points projected onto canvas in real time. The sphere idles on its own —
        drag to take over, release to hand it back with your momentum.
      </p>

      <ParticleSphere3D key={density} points={density} />

      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className="text-[10px] uppercase text-[var(--text-muted)]">Density:</span>
        {[80, 160, 260].map((d) => (
          <button
            key={d}
            onClick={() => setDensity(d)}
            aria-pressed={density === d}
            className={`rounded border px-2 py-0.5 text-[10px] transition-colors ${
              density === d
                ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--accent-ink)]'
                : 'border-[var(--border-color)] bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]'
            }`}
          >
            {d} pts
          </button>
        ))}
      </div>
    </div>
  );
};
