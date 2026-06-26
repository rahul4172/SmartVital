import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export function GlobalError() {
  const error = useRouteError();
  console.error("Global Error Caught:", error);

  let errorMessage = "An unexpected error occurred.";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
    errorDetails = error.data?.message || `Status: ${error.status}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full p-8 animate-fade-in flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-red-500/10 mb-6">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-white">Oops! Something went wrong</h1>
        <p className="text-gray-400 mb-8 text-lg max-w-md">
          We're sorry, but the application encountered an error while trying to process your request.
        </p>
        
        <div className="w-full bg-black/40 rounded-xl p-4 mb-8 text-left overflow-x-auto border border-white/5">
          <p className="text-red-400 font-mono text-sm font-semibold mb-2">{errorMessage}</p>
          {errorDetails && (
            <pre className="text-gray-500 font-mono text-xs whitespace-pre-wrap">
              {errorDetails}
            </pre>
          )}
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 sm:flex-none btn-secondary flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          
          <Link 
            to="/"
            className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Home size={18} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
