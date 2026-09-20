import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="my-8 mx-auto max-w-lg p-6 rounded-2xl bg-slate-900 border border-pink-500/30 text-white text-center shadow-xl">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-pink-300 mb-2">
            Bagian Ini Sedang Dimuat Ulang
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            Terjadi kendala saat memuat grafis 3D pada perangkat Anda. Silakan klik tombol di bawah untuk mencoba kembali.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
