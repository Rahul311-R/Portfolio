import React from 'react';

interface SectionHeadingProps {
  number?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  title,
  subtitle,
  align = 'left',
  className = ''
}) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {number && (
        <span className="inline-block font-mono text-xs text-[var(--accent-color)] tracking-widest uppercase mb-2">
          {number} //
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-[var(--text-muted)] max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-0.5 bg-gradient-to-r from-[var(--accent-color)] to-transparent opacity-60 w-24 ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </div>
  );
};
