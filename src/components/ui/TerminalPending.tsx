import React from 'react';

/**
 * Styled stand-in for links that don't have a real URL yet (resume
 * placeholders like "[ADD LINK]"). Renders a dashed terminal-style chip
 * with a blinking caret so the gap reads as intentional, not broken.
 */
export const TerminalPending: React.FC<{ label: string; className?: string }> = ({
  label,
  className = '',
}) => (
  <span
    className={`terminal-pending ${className}`}
    title={`${label} — link pending, add the real URL`}
  >
    <span>{label}</span>
    <span className="pending-caret" aria-hidden="true" />
  </span>
);
