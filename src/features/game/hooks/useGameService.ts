/**
 * Game Service Hook
 *
 * Base hook for accessing the game service.
 * Other hooks build on top of this to avoid repeating useContext.
 */

import { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "../GameProvider";
import { MachineState } from "../lib/gameMachine";
import Decimal from "decimal.js-light";

/**
 * Hook to get the game service directly
 * Use when you need to send events to the machine
 */
export const useGameService = () => {
  const { gameService } = useContext(Context);
  return gameService;
};

/**
 * Compare two Decimal values for equality
 * Used to prevent re-renders when Decimal value hasn't changed
 */
export const decimalEquals = (
  a: Decimal | undefined,
  b: Decimal | undefined,
): boolean => {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  return a.equals(b);
};

/**
 * Factory function to create a selector hook
 * Reduces boilerplate when creating new hooks
 *
 * @example
 * const useBumpkin = createGameSelectorHook(selectBumpkin);
 * const useBalance = createGameSelectorHook(selectBalance, decimalEquals);
 */
export const createGameSelectorHook = <T>(
  selector: (state: MachineState) => T,
  compare?: (a: T, b: T) => boolean,
) => {
  return () => {
    const gameService = useGameService();
    return useSelector(gameService, selector, compare);
  };
};
