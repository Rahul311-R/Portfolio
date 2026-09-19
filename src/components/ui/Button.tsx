import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  as?: 'button' | 'a';
  href?: string;
  /** Internal route — renders a client-side <Link> with view transitions (no full page reload). */
  to?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className = '',
  as = 'button',
  href,
  to,
  target,
  rel,
  disabled,
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-mono font-medium tracking-wide uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-none border';

  const variantClasses = {
    primary:
      'bg-[var(--accent-color)] text-[var(--accent-ink)] border-[var(--accent-color)] hover:opacity-90 shadow-[0_0_15px_var(--accent-glow)]',
    secondary:
      'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]',
    outline:
      'bg-transparent text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-glow)] hover:text-[var(--accent-color)]',
    ghost:
      'bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-secondary)]'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="inline-block">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-block">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick as never}>
        {content}
      </Link>
    );
  }

  if (as === 'a' && href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={classes} {...props}>
      {content}
    </button>
  );
};
