import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  sublabel,
  className = ''
}) => {
  return (
    <div
      className={`p-6 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] relative overflow-hidden transition-all duration-300 hover:border-[var(--accent-color)] group ${className}`}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--accent-glow)] to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
        {label}
      </div>
      <div className="text-3xl lg:text-4xl font-bold font-display text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
        {value}
      </div>
      {sublabel && (
        <div className="mt-2 text-xs text-[var(--text-muted)] font-mono">
          {sublabel}
        </div>
      )}
    </div>
  );
};
