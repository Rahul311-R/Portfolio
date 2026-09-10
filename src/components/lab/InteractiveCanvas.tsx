import React from 'react';
import { VirtualBoardDemo } from '../projects/VirtualBoardDemo';

export const InteractiveCanvas: React.FC = () => {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 className="font-mono text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">
          EXPERIMENT 03 // INTERACTIVE DRAWING CANVAS
        </h3>
        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono rounded">
          Experimental / Personal Work
        </span>
      </div>

      <VirtualBoardDemo />
    </div>
  );
};
