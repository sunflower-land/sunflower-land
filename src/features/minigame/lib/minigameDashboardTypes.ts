import type { MinigameName } from "features/game/types/minigames";
import type { PlayerEconomyConfig, PlayerEconomyRuntimeState } from "./types";

export type MinigameShopItemUi = {
  id: string;
  actionId: string;
  name: string;
  description: string;
  listImage: string;
  /** Cost lines: all burn tokens, all require tokens, or one free-mint line (amount 0). */
  prices: { token: string; amount: number }[];
  /** Max lifetime purchases per farm when set on the shop rule (`purchaseLimit` in config). */
  purchaseLimit?: number;
  /** Successful purchases recorded for this action (from runtime `purchaseCounts`). */
  purchasesSoFar?: number;
};

export type MinigameInventoryItemUi = {
  token: string;
  name: string;
  description: string;
};

/** Owned trophy row for the dashboard checkered zone (no panel chrome). */
export type MinigameTrophyDisplay = {
  token: string;
  name: string;
  imageUrl: string;
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
  config: PlayerEconomyConfig;
  state: PlayerEconomyRuntimeState;
  ui: MinigameDashboardUi;
  /** Iframe base from API; `Portal` uses `VITE_PORTAL_GAME_URL` instead when set. */
  playUrl?: string;
};

/** User-facing load failure; translate in the dashboard with `useAppTranslation`. */
export type MinigameLoadError =
  | { kind: "unknown_player_economy"; slug: string }
  | { kind: "sign_in_required" }
  | { kind: "message"; text: string };

export type FetchMinigameResult =
  | { ok: true; data: MinigameDashboardData }
  | { ok: false; error: MinigameLoadError };
