import React from 'react';

export type CategoryFilter = 'ALL' | 'AI' | 'COMPUTER VISION' | 'DATA' | 'WEB' | 'EXPERIMENTS';

interface ProjectFiltersProps {
  currentFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  counts: Record<string, number>;
}

export const CATEGORIES: CategoryFilter[] = [
  'ALL',
  'AI',
  'COMPUTER VISION',
  'DATA',
  'WEB',
  'EXPERIMENTS'
];

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  currentFilter,
  onFilterChange,
  counts
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8" role="tablist" aria-label="Project Categories">
      {CATEGORIES.map((category) => {
        const isSelected = currentFilter === category;
        const count = counts[category] || 0;

        return (
          <button
            key={category}
            onClick={() => onFilterChange(category)}
            role="tab"
            aria-selected={isSelected}
            aria-pressed={isSelected}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 border rounded-none ${
              isSelected
                ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] font-bold shadow-[0_0_15px_var(--accent-glow)]'
                : 'bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)]'
            }`}
          >
            <span>{category}</span>
            <span className="ml-1.5 opacity-70">({count})</span>
          </button>
        );
      })}
    </div>
  );
};
