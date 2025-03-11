import { useState, useCallback } from 'react';

interface ErrorHandlerResult {
  error: string | null;
  setError: (error: string | null) => void;
  handleError: (error: unknown) => string;
  clearError: () => void;
}

/**
 * Custom hook for consistent error handling across the application
 * @returns Object with error state and error handling methods
 */
export function useErrorHandler(): ErrorHandlerResult {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown): string => {
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      errorMessage = error.message;
    } else {
      errorMessage = 'An unknown error occurred';
    }
    
    setError(errorMessage);
    return errorMessage;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError
  };
} 