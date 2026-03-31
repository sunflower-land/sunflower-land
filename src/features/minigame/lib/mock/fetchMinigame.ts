/**
 * Types and mock entrypoint. Live loads use {@link loadMinigameDashboard}.
 */
export type {
  MinigameDashboardData,
  MinigameDashboardUi,
  MinigameInventoryItemUi,
  MinigameShopItemUi,
  FetchMinigameResult,
  MinigameLoadError,
} from "../minigameDashboardTypes";

export { loadMinigameDashboard as fetchMinigame } from "../loadMinigameDashboard";
