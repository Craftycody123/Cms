'use client';

import { useEffect, useCallback } from 'react';

/**
 * Custom hook for auto-refreshing data
 * Refetches data at specified intervals and when user returns to page
 */
export const useAutoRefresh = (
  callback: () => void,
  intervalMs: number = 5000, // Default 5 seconds
  dependencies: any[] = []
) => {
  const handleVisibilityChange = useCallback(() => {
    // Refresh data when user returns to page
    if (!document.hidden) {
      callback();
    }
  }, [callback]);

  useEffect(() => {
    // Set up visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up interval polling
    const interval = setInterval(callback, intervalMs);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [callback, intervalMs, handleVisibilityChange, ...dependencies]);
};
