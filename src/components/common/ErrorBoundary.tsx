import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, ExternalLink, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
  authInfo: any;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let firestoreError: FirestoreErrorInfo | null = null;
      try {
        if (this.state.error?.message) {
          firestoreError = JSON.parse(this.state.error.message);
        }
      } catch (e) {
        // Not a JSON error message
      }

      const isIndexError = firestoreError?.error?.includes('index');
      const indexUrl = firestoreError?.error?.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)?.[0];

      return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-xl space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                {isIndexError ? (
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black text-black tracking-tight">
                {isIndexError ? 'Index Required' : 'Something went wrong'}
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {isIndexError 
                  ? 'This query requires a Firestore index to work properly. You can create it using the link below.'
                  : 'An unexpected error occurred. We\'ve been notified and are looking into it.'}
              </p>
            </div>

            {firestoreError && (
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 overflow-hidden">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Error Details</p>
                <p className="text-xs font-mono text-zinc-600 break-words line-clamp-3">
                  {firestoreError.error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {isIndexError && indexUrl && (
                <a
                  href={indexUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-4 rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  Create Index
                </a>
              )}
              
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-zinc-100 text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all duration-300"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>

            <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Error ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
