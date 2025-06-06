import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can log the error to an error reporting service here
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🔧</div>
            <h1 className="text-2xl font-display font-bold mb-4 text-foreground">
              Something went wrong
            </h1>
            <p className="text-foreground/70 font-sans mb-6 leading-relaxed">
              Don't worry, it's not you - it's us. Our code had a little hiccup. 
              Try refreshing the page, and if that doesn't work, come back in a few minutes.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-display font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full px-6 py-3 bg-surface/30 text-foreground/80 font-display font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                Go Back
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-surface/20 rounded-lg p-4 border border-white/5">
                <summary className="cursor-pointer text-sm font-mono text-foreground/60 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-error overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 