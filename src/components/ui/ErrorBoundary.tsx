import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] px-6">
          <div className="max-w-lg w-full border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-color)] mb-4">
              System notice
            </div>
            <h1 className="font-display text-3xl font-bold mb-3">
              Something went wrong.
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
              The app hit an unexpected runtime error. Refreshing the page usually resolves it, but you can also try again below.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center justify-center rounded-md border border-[var(--accent-color)] bg-[var(--accent-color)]/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] text-[var(--accent-color)] transition-colors hover:bg-[var(--accent-color)] hover:text-white"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
