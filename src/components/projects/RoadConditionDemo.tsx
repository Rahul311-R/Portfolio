import React, { useState } from 'react';
import { Award, Camera, Layers } from 'lucide-react';

const stages = ['Camera / Input', 'Computer Vision', 'Road Fault Detection', 'GPS', 'IoT / Data Layer'];

export const RoadConditionDemo: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState(0);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-lg space-y-6 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-[var(--accent-color)]" />
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">CONCEPTUAL SYSTEM WALKTHROUGH</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase rounded text-[11px]">
          <Award className="w-4 h-4" /> PATENT PUBLISHED
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-3">
          <div className="visual-stage relative h-64 sm:h-72 w-full border border-[var(--border-color)] rounded overflow-hidden flex flex-col justify-between p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between text-[10px] text-[var(--visual-ink)] bg-black/50 p-2 rounded border border-white/10">
              <span className="text-[var(--accent-color)] font-bold">CONCEPTUAL FLOW</span>
              <span>STAGE 0{selectedStage + 1} / 05</span>
            </div>
            <div className="relative z-10 mx-auto my-auto w-3/4 h-32 border-2 border-[var(--accent-color)] rounded bg-[var(--accent-glow)] flex flex-col justify-between p-3">
              <span className="text-[var(--accent-color)] text-[10px] font-bold uppercase tracking-wider">{stages[selectedStage]}</span>
              <span className="text-right text-[9px] text-[var(--text-muted)]">Select stages to follow the proposed input-to-data path.</span>
            </div>
            <div className="relative z-10 flex items-center justify-between text-[10px] text-[var(--visual-ink)] bg-black/50 p-2 rounded border border-white/10">
              <span>ROAD SAFETY CONCEPT</span><span>AI + GPS + IOT</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage, index) => (
              <button key={stage} type="button" onClick={() => setSelectedStage(index)} aria-pressed={selectedStage === index}
                className={`px-3 py-1.5 text-xs rounded border transition-colors ${selectedStage === index ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] font-bold' : 'bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)]'}`}>
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-5 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3"><Layers className="w-4 h-4 text-[var(--accent-color)]" /><span className="font-bold text-[var(--text-primary)]">CONCEPT NOTES</span></div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]"><span className="text-[var(--text-muted)]">Current stage:</span><span className="font-bold text-[var(--text-primary)]">{stages[selectedStage]}</span></div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]"><span className="text-[var(--text-muted)]">Inputs:</span><span className="font-bold text-[var(--accent-color)]">AI, GPS, IoT</span></div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]"><span className="text-[var(--text-muted)]">Status:</span><span className="font-bold text-amber-500">Conceptual illustration</span></div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]"><span className="text-[var(--text-muted)]">Patent:</span><span className="font-bold text-emerald-500">Published</span></div>
          </div>
          <div className="visual-stage relative pt-2 text-[10px] text-[var(--visual-muted)] rounded p-2"><div className="text-[var(--accent-color)] font-bold mb-1">Illustrative data shape:</div><pre className="relative z-10 p-2.5 bg-black/40 rounded border border-white/10 overflow-x-auto text-[9px] text-[var(--visual-ink)]">{JSON.stringify({ stage: stages[selectedStage], visual_input: 'camera / input', location_context: 'GPS', data_layer: 'IoT', note: 'conceptual preview' }, null, 2)}</pre></div>
        </div>
      </div>
    </div>
  );
};
