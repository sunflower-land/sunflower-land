import type { MinigameName } from "features/game/types/minigames";
import type { MinigameConfig, MinigameRuntimeState } from "./types";

export type MinigameShopItemUi = {
  id: string;
  actionId: string;
  name: string;
  description: string;
  listImage: string;
  price: { token: string; amount: number };
  /**
   * When the player has at least 1 of this balance, the row shows a check and
   * cannot open the buy modal (e.g. one-off chicken unlocks). Omit for repeatable purchases.
   */
  ownedBalanceToken?: string;
};

export type MinigameInventoryItemUi = {
  token: string;
  name: string;
  description: string;
};

export type MinigameDashboardUi = {
  headerBalanceToken: string;
  shopItems: MinigameShopItemUi[];
  inventoryItems: MinigameInventoryItemUi[];
  inventoryShortcutTokens: string[];
  tokenImages: Record<string, string>;
  /** When set, dashboard shell can apply a themed backdrop (e.g. `chicken-rescue`). */
  visualTheme?: string;
};

export type MinigameDashboardData = {
  slug: string;
  portalName: MinigameName;
  displayName: string;
  config: MinigameConfig;
  state: MinigameRuntimeState;
  ui: MinigameDashboardUi;
  productionCollectByStartId: Record<string, string>;
  /** Iframe base from API; `Portal` uses `VITE_PORTAL_GAME_URL` instead when set. */
  playUrl?: string;
};

/** User-facing load failure; translate in the dashboard with `useAppTranslation`. */
export type MinigameLoadError =
  | { kind: "unknown_minigame"; slug: string }
  | { kind: "sign_in_required" }
  | { kind: "message"; text: string };

export type FetchMinigameResult =
  | { ok: true; data: MinigameDashboardData }
  | { ok: false; error: MinigameLoadError };
