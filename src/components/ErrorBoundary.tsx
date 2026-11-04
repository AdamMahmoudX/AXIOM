import React from 'react';

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message + '\n' + error.stack;
  }
  return JSON.stringify(error, null, 2);
};

// Wrapper component to handle errors without depending on language context
const ErrorBoundaryContent: React.FC<{ hasError: boolean; error: any; children: React.ReactNode }> = ({ hasError, error, children }) => {
  if (hasError) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#0B0B0B] border border-red-500/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
          </div>
          <pre className="mt-4 p-4 bg-[#050505] rounded-lg text-red-400 text-sm overflow-x-auto whitespace-pre-wrap break-all font-mono">{serializeError(error)}</pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    return (
      <ErrorBoundaryContent hasError={this.state.hasError} error={this.state.error}>
        {this.props.children}
      </ErrorBoundaryContent>
    );
  }
}
