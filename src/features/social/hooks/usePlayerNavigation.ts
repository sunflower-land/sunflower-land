/* eslint-disable no-console */
import { useState, useCallback } from "react";

interface NavigationState {
  history: number[];
  currentIndex: number;
}

export interface UsePlayerNavigationReturn {
  currentPlayerId: number | undefined;
  canGoBack: boolean;
  navigateToPlayer: (playerId: number) => void;
  goBack: () => void;
  clearHistory: () => void;
  setInitialPlayer: (playerId: number) => void;
}

/**
 * Custom hook for managing player navigation within the PlayerModal
 * Provides navigation history functionality similar to browser navigation
 */
export const usePlayerNavigation = (): UsePlayerNavigationReturn => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    history: [],
    currentIndex: -1,
  });

  const goBack = () => {
    if (navigationState.currentIndex === 0) return;

    setNavigationState((prev) => ({
      currentIndex: prev.currentIndex - 1,
      history: prev.history.slice(0, -1),
    }));
  };

  const clearHistory = useCallback(() => {
    setNavigationState({
      history: [],
      currentIndex: -1,
    });
  }, []);

  const setInitialPlayer = useCallback((playerId: number) => {
    setNavigationState({
      history: [playerId],
      currentIndex: 0,
    });
  }, []);

  const navigateToPlayer = useCallback((playerId: number) => {
    setNavigationState((prev) => {
      const newHistory = [...prev.history, playerId];
      return {
        history: [...prev.history, playerId],
        currentIndex: newHistory.length - 1,
      };
    });
  }, []);

  const currentPlayerId = navigationState.history[navigationState.currentIndex];

  return {
    navigateToPlayer,
    currentPlayerId,
    canGoBack: navigationState.history.length > 1,
    goBack,
    clearHistory,
    setInitialPlayer,
  };
};
