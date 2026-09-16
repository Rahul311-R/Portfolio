import React, { useState } from 'react';
import { Cpu, Sliders, Zap } from 'lucide-react';

export const NeuralNetworkInspector: React.FC = () => {
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochs, setEpochs] = useState(100);

  // Synthetic illustration only: outputs are a direct function of the
  // sliders, not the result of a trained model.
  const calculateIllustration = () => {
    const p1 = Math.min(99.8, 85 + learningRate * 500);
    const p2 = Math.max(0.1, 100 - p1 - 2);
    const p3 = Math.max(0.1, 100 - p1 - p2);
    return { p1: p1.toFixed(1), p2: p2.toFixed(1), p3: p3.toFixed(1) };
  };

  const probs = calculateIllustration();

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[var(--accent-color)]" />
          <h3 className="text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">
            EXPERIMENT 02 // HYPERPARAMETER PLAYGROUND (SYNTHETIC)
          </h3>
        </div>
        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] rounded">
          Experimental / Personal Work
        </span>
      </div>

      <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
        A UI study in wiring sliders to live outputs. Values below are computed
        directly from the controls for illustration — no model is trained here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
        {/* Input Layer */}
        <div className="p-4 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded space-y-3 text-center">
          <div className="text-[10px] text-cyan-400 font-bold uppercase">SYNTHETIC INPUT (X)</div>
          <div className="space-y-1.5 text-[10px] text-[var(--text-primary)]">
            <div className="p-1.5 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">X1: Feature A · normalized [0, 1]</div>
            <div className="p-1.5 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">X2: Feature B · normalized [0, 1]</div>
            <div className="p-1.5 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">X3: Feature C · normalized [0, 1]</div>
          </div>
        </div>

        {/* Hidden Dense Layers */}
        <div className="p-4 bg-[var(--bg-surface-secondary)] border border-[var(--accent-color)]/40 rounded space-y-3 text-center shadow-[0_0_15px_var(--accent-glow)]">
          <div className="text-[10px] text-purple-400 font-bold uppercase flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> ILLUSTRATIVE LAYERS
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[9px] text-[var(--text-muted)] mb-1">
                <span>Weight bar W1:</span>
                <span className="text-emerald-400 font-bold">Full</span>
              </div>
              <div className="h-1.5 bg-[var(--bg-primary)] rounded overflow-hidden">
                <div className="h-full bg-emerald-400 w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] text-[var(--text-muted)] mb-1">
                <span>Bias bar B1:</span>
                <span className="text-cyan-400 font-bold">Partial</span>
              </div>
              <div className="h-1.5 bg-[var(--bg-primary)] rounded overflow-hidden">
                <div className="h-full bg-cyan-400 w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="p-4 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded space-y-3">
          <div className="text-[10px] text-emerald-400 font-bold uppercase text-center">COMPUTED SPLIT (NOT PREDICTIONS)</div>
          <div className="space-y-2 text-[10px]">
            <div className="flex justify-between">
              <span>Share A:</span>
              <span className="text-rose-400 font-bold">{probs.p1}%</span>
            </div>
            <div className="flex justify-between">
              <span>Share B:</span>
              <span className="text-[var(--text-muted)]">{probs.p2}%</span>
            </div>
            <div className="flex justify-between">
              <span>Share C:</span>
              <span className="text-[var(--text-muted)]">{probs.p3}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hyperparameter Controls */}
      <div className="p-4 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="text-[10px] uppercase font-bold text-[var(--text-primary)]">CONTROLS:</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="lr-slider" className="text-[10px] text-[var(--text-muted)]">Learning Rate:</label>
            <input
              id="lr-slider"
              type="range"
              min={0.001}
              max={0.05}
              step={0.001}
              value={learningRate}
              onChange={(e) => {
                setLearningRate(parseFloat(e.target.value));
              }}
              className="accent-[var(--accent-color)] cursor-pointer"
            />
            <span className="text-emerald-400 font-bold">{learningRate}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--text-muted)]">Epochs:</span>
            {[50, 100, 200].map((ep) => (
              <button
                key={ep}
                onClick={() => {
                  setEpochs(ep);
                }}
                aria-pressed={epochs === ep}
                className={`px-2 py-0.5 rounded text-[10px] border ${
                  epochs === ep
                    ? 'bg-[var(--accent-color)] text-[var(--accent-ink)] border-[var(--accent-color)] font-bold'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)]'
                }`}
              >
                {ep}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
