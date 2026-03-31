import type { MinigameName } from "features/game/types/minigames";
import type {
  MinigameConfig,
  MinigameDashboardConfig,
  MinigameRuntimeState,
} from "./types";
import type {
  MinigameDashboardData,
  MinigameDashboardUi,
  MinigameInventoryItemUi,
  MinigameShopItemUi,
} from "./minigameDashboardTypes";
import { getMinigameTokenImage } from "./minigameTokenIcons";

export function primaryMintTokenKey(
  config: MinigameConfig,
  actionId: string,
): string {
  const mint = config.actions[actionId]?.mint;
  if (!mint) return "";
  const keys = Object.keys(mint);
  return keys[0] ?? "";
}

export function buildTokenImageMap(
  items: MinigameConfig["items"],
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!items) return out;
  for (const [key, v] of Object.entries(items)) {
    if (v.image && v.image.length > 0) out[key] = v.image;
  }
  return out;
}

export function resolveTokenImageUrl(
  token: string,
  tokenImages: Record<string, string>,
): string {
  const direct = tokenImages[token];
  if (direct) return direct;
  return getMinigameTokenImage(token, tokenImages);
}

export function tokenDisplayName(
  config: MinigameConfig,
  token: string,
): string {
  const named = config.items?.[token]?.name;
  if (named) return named;
  return token.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export type TradableMarketplacePick = { tokenKey: string; itemId: number };

/**
 * Marketplace row: prefers token with `id === 0`, else lowest numeric `items[token].id`.
 */
export function getPrimaryTradableMarketplaceItem(
  config: MinigameConfig,
): TradableMarketplacePick | null {
  const items = config.items;
  if (!items) return null;
  const pairs: [string, number][] = [];
  for (const [k, v] of Object.entries(items)) {
    if (v && typeof v.id === "number") pairs.push([k, v.id]);
  }
  if (pairs.length === 0) return null;
  const atZero = pairs.find(([, id]) => id === 0);
  if (atZero) return { tokenKey: atZero[0], itemId: 0 };
  const [tokenKey, itemId] = pairs.reduce((best, cur) =>
    cur[1] < best[1] ? cur : best,
  );
  return { tokenKey, itemId };
}

function buildShopItems(
  config: MinigameConfig,
  dash: MinigameDashboardConfig,
  tokenImages: Record<string, string>,
): MinigameShopItemUi[] {
  return dash.shop.map((row) => {
    const mintKey = primaryMintTokenKey(config, row.actionId);
    const imageToken = row.listImageToken ?? mintKey;
    const itemForMint = mintKey ? config.items?.[mintKey] : undefined;
    return {
      id: row.id,
      actionId: row.actionId,
      name: row.name ?? itemForMint?.name ?? mintKey,
      description: row.description ?? itemForMint?.description ?? "",
      listImage: resolveTokenImageUrl(imageToken, tokenImages),
      price: row.price,
      ownedBalanceToken: row.ownedBalanceToken,
    };
  });
}

function buildInventoryItems(
  config: MinigameConfig,
): MinigameInventoryItemUi[] {
  const items = config.items;
  if (!items) return [];
  return Object.entries(items)
    .filter(([, v]) => v.name && v.description)
    .map(([token, v]) => ({
      token,
      name: v.name,
      description: v.description,
    }))
    .sort((a, b) => a.token.localeCompare(b.token));
}

function buildUi(
  config: MinigameConfig,
  dash: MinigameDashboardConfig,
): MinigameDashboardUi {
  const tokenImages = buildTokenImageMap(config.items);
  return {
    headerBalanceToken: dash.headerBalanceToken,
    shopItems: buildShopItems(config, dash, tokenImages),
    inventoryItems: buildInventoryItems(config),
    inventoryShortcutTokens: [...dash.inventoryShortcutTokens],
    tokenImages,
    visualTheme: dash.visualTheme,
  };
}

export function buildMinigameDashboardData(
  slug: string,
  portalName: MinigameName,
  config: MinigameConfig,
  state: MinigameRuntimeState,
): MinigameDashboardData {
  const dash = config.dashboard;
  if (!dash) {
    throw new Error("Minigame config is missing dashboard");
  }

  return {
    slug,
    portalName,
    displayName: dash.displayName,
    config,
    state,
    ui: buildUi(config, dash),
    productionCollectByStartId: { ...dash.productionCollectByStartId },
  };
}
