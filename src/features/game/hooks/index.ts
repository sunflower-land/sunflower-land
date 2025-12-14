/**
 * Game State Hooks
 *
 * Custom hooks for accessing game state with optimized re-render behavior.
 * These hooks use stable selectors and custom comparators for Decimal.js values.
 *
 * @example
 * // Instead of:
 * const { gameService } = useContext(Context);
 * const inventory = useSelector(gameService, (state) => state.context.state.inventory);
 *
 * // Use:
 * import { useInventory } from "features/game/hooks";
 * const inventory = useInventory();
 */

export * from "./useGameService";
export * from "./useInventory";
export * from "./useBumpkin";
export * from "./useBuildings";
export * from "./useResources";
export * from "./useGameState";
