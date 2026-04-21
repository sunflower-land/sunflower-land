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
  /** Max lifetime invocations per farm when set on the rule (`maxCalls` in config). */
  maxCalls?: number;
  /** Lifetime invocations recorded for this action (from runtime `rules[actionId].count`). */
  callsSoFar?: number;
  /**
   * Tightest remaining global supply among capped mint outputs (from `economy_supplies` + config).
   * Omitted when no `supply` caps apply to this action’s mints.
   */
  supplyRemainingMin?: number;
  /** True when global supply cannot fit another mint for this shop action. */
  supplyBlocked?: boolean;
};

/** FLOWER-priced row from `config.purchases` (main game balance, not economy tokens). */
export type MinigameFlowerPurchaseItemUi = {
  id: string;
  purchaseId: string;
  name: string;
  description: string;
  listImage: string;
  flower: number;
  economyAmount: number;
  tokenKey: string;
  itemId: number;
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
  flowerPurchaseItems: MinigameFlowerPurchaseItemUi[];
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
  /** Global per-token totals from API `supplies` (non-zero keys only from server; merged optimistically). */
  economySupplies: Record<string, number>;
};

/** User-facing load failure; translate in the dashboard with `useAppTranslation`. */
export type MinigameLoadError =
  | { kind: "unknown_player_economy"; slug: string }
  | { kind: "sign_in_required" }
  | { kind: "message"; text: string };

export type FetchMinigameResult =
  | { ok: true; data: MinigameDashboardData }
  | { ok: false; error: MinigameLoadError };
