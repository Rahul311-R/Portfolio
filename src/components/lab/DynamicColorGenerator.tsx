import React, { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

interface ColorHarmonies {
  base: string;
  analogous1: string;
  analogous2: string;
  triadic1: string;
  triadic2: string;
  complementary: string;
}

export const DynamicColorGenerator: React.FC = () => {
  const [hue, setHue] = useState(265);
  const [copied, setCopied] = useState<string | null>(null);

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const harmonies: ColorHarmonies = {
    base: hslToHex(hue, 85, 65),
    analogous1: hslToHex((hue + 30) % 360, 85, 65),
    analogous2: hslToHex((hue + 330) % 360, 85, 65),
    triadic1: hslToHex((hue + 120) % 360, 85, 65),
    triadic2: hslToHex((hue + 240) % 360, 85, 65),
    complementary: hslToHex((hue + 180) % 360, 85, 65)
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 className="text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">
          EXPERIMENT 04 // ALGORITHMIC PALETTE HARMONIZER
        </h3>
        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] rounded">
          Experimental / Personal Work
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>Base Hue Matrix ({hue}°)</span>
          <button
            onClick={() => setHue(Math.floor(Math.random() * 360))}
            className="flex items-center gap-1 text-[var(--accent-color)] hover:underline"
          >
            <RefreshCw className="w-3 h-3" /> Randomize
          </button>
        </div>

        <input
          type="range"
          min={0}
          max={359}
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          className="w-full accent-[var(--accent-color)] cursor-pointer"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {Object.entries(harmonies).map(([key, hex]) => (
            <div
              key={key}
              onClick={() => handleCopy(hex)}
              className="p-3 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded space-y-2 cursor-pointer hover:border-[var(--accent-color)] transition-colors group"
            >
              <div className="h-16 rounded border border-black/20" style={{ backgroundColor: hex }} />
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-tight">{key}</div>
              <div className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                <span>{hex}</span>
                {copied === hex ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
