/**
 * Error Boundary Components
 *
 * Catches React errors and displays fallback UI with recovery options.
 */

import React, { Component, ReactNode } from 'react';

// =============================================================================
// ERROR BOUNDARY PROPS & STATE
// =============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: 'app' | 'component' | 'panel';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// =============================================================================
// MAIN ERROR BOUNDARY
// =============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          level={this.props.level || 'component'}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

// =============================================================================
// ERROR FALLBACK UI
// =============================================================================

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  level: 'app' | 'component' | 'panel';
  onReset: () => void;
  onReload: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  level,
  onReset,
  onReload,
}) => {
  const isAppLevel = level === 'app';
  const isPanelLevel = level === 'panel';

  // Compact panel error
  if (isPanelLevel) {
    return (
      <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-lg m-2">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">Something went wrong</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-red-400 hover:text-red-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // Full app or component error
  return (
    <div className={`${isAppLevel ? 'min-h-screen' : 'min-h-[300px]'} bg-zinc-950 flex items-center justify-center p-8`}>
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="text-6xl mb-6">
          {isAppLevel ? '💥' : '⚠️'}
        </div>

        {/* Title */}
        <h1 className={`${isAppLevel ? 'text-3xl' : 'text-xl'} font-bold text-white mb-3`}>
          {isAppLevel ? 'Application Error' : 'Something went wrong'}
        </h1>

        {/* Message */}
        <p className="text-zinc-400 mb-6">
          {isAppLevel
            ? "We've encountered an unexpected error. Your data has been auto-saved."
            : "This component encountered an error. You can try to recover or reload."}
        </p>

        {/* Error details (collapsible) */}
        {error && (
          <details className="text-left mb-6 bg-zinc-900 rounded-lg overflow-hidden">
            <summary className="px-4 py-3 text-sm text-zinc-500 cursor-pointer hover:bg-zinc-800">
              Technical Details
            </summary>
            <div className="px-4 py-3 border-t border-zinc-800">
              <p className="text-sm text-red-400 font-mono mb-2">
                {error.message}
              </p>
              {errorInfo?.componentStack && (
                <pre className="text-xs text-zinc-600 overflow-auto max-h-32">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
          >
            Try Again
          </button>
          <button
            onClick={onReload}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
          >
            Reload Page
          </button>
        </div>

        {/* Help text */}
        <p className="text-xs text-zinc-600 mt-6">
          If this problem persists, try clearing your browser data or contact support.
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// AI ERROR BOUNDARY (Specialized for AI operations)
// =============================================================================

interface AIErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

interface AIErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
}

export class AIErrorBoundary extends Component<AIErrorBoundaryProps, AIErrorBoundaryState> {
  constructor(props: AIErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, isRetrying: false };
  }

  static getDerivedStateFromError(error: Error): Partial<AIErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    console.error('AI Error:', error);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, isRetrying: true });
    // Reset retry state after a short delay
    setTimeout(() => this.setState({ isRetrying: false }), 100);
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const isAPIKeyError = this.state.error?.message?.includes('API') ||
                           this.state.error?.message?.includes('key') ||
                           this.state.error?.message?.includes('401');

      return (
        <div className="p-4 bg-amber-950/30 border border-amber-900/50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              {isAPIKeyError ? '🔑' : '🤖'}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-400 mb-1">
                {isAPIKeyError ? 'API Key Issue' : 'AI Processing Error'}
              </h3>
              <p className="text-sm text-zinc-400 mb-3">
                {isAPIKeyError
                  ? 'Please check your Gemini API key in the environment settings.'
                  : this.props.fallbackMessage || 'The AI service encountered an error. You can try again or continue without AI features.'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="px-3 py-1 text-xs bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-white rounded transition"
                >
                  {this.state.isRetrying ? 'Retrying...' : 'Retry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ErrorBoundary;
