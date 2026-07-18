import { Component, type ErrorInfo, type ReactNode } from 'react';
import AppErrorFallback from './AppErrorFallback';

type AppErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);

    if (import.meta.env.DEV) {
      console.error('[AppErrorBoundary]', error, errorInfo.componentStack);
    }
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (error) {
      if (this.props.fallback) {
        return this.props.fallback({ error, reset: this.reset });
      }

      return <AppErrorFallback error={error} onReset={this.reset} />;
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
