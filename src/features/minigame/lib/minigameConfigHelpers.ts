import type { MinigameName } from "features/game/types/minigames";
import type {
  BurnRule,
  PlayerEconomyActionDefinition,
  PlayerEconomyConfig,
  PlayerEconomyRuntimeState,
} from "./types";

/** Human-readable burn cost for dashboard copy (fixed or range). */
export function formatBurnRuleForDisplay(rule: BurnRule): string {
  if ("min" in rule && "max" in rule) {
    if (rule.min === rule.max) return String(rule.min);
    return `${rule.min}–${rule.max}`;
  }
  return String(rule.amount);
}
import type {
  MinigameDashboardData,
  MinigameDashboardUi,
  MinigameInventoryItemUi,
  MinigameShopItemUi,
} from "./minigameDashboardTypes";
import { getMinigameTokenImage } from "./minigameTokenIcons";
import { migrateLegacyPlayerEconomyConfigFields } from "./minigameConfigMigration";

/**
 * When the persisted minigame has no balance entry for a token yet, use
 * `items[token].initialBalance` from config so the dashboard matches “starting inventory”
 * (many APIs omit keys until first write).
 */
export function mergeInitialBalancesFromConfig(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
): Record<string, number> {
  const out = { ...balances };
  const items = config.items ?? {};
  for (const [token, meta] of Object.entries(items)) {
    const init = meta.initialBalance;
    if (typeof init !== "number" || !Number.isFinite(init) || init <= 0)
      continue;
    if (!(token in out)) {
      out[token] = Math.max(0, Math.floor(init));
    }
  }
  return out;
}

export function mergeRuntimeWithInitialBalances(
  config: PlayerEconomyConfig,
  state: PlayerEconomyRuntimeState,
): PlayerEconomyRuntimeState {
  return {
    ...state,
    balances: mergeInitialBalancesFromConfig(config, state.balances),
  };
}

export function primaryMintTokenKey(
  config: PlayerEconomyConfig,
  actionId: string,
): string {
  const mint = config.actions[actionId]?.mint;
  if (!mint) return "";
  const keys = Object.keys(mint);
  return keys[0] ?? "";
}

export function buildTokenImageMap(
  items: PlayerEconomyConfig["items"],
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
  return getMinigameTokenImage(token, tokenImages);
}

export function tokenDisplayName(
  config: PlayerEconomyConfig,
  token: string,
): string {
  const named = config.items?.[token]?.name;
  if (named) return named;
  return token.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export type TradableMarketplacePick = { tokenKey: string; itemId: number };

function tradeableMarketplacePairs(
  config: PlayerEconomyConfig,
): [string, number][] {
  const items = config.items;
  if (!items) return [];
  return Object.entries(items)
    .filter(
      ([, v]) =>
        v &&
        v.tradeable === true &&
        typeof v.id === "number" &&
        Number.isFinite(v.id),
    )
    .map(([k, v]) => [k, v.id as number] as const);
}

/**
 * HUD + marketplace price widget: uses `mainCurrencyToken` when set and valid;
 * otherwise prefers `id === 0`, else lowest numeric id among `tradeable` items.
 */
export function getPrimaryTradableMarketplaceItem(
  config: PlayerEconomyConfig,
): TradableMarketplacePick | null {
  const pairs = tradeableMarketplacePairs(config);
  if (pairs.length === 0) return null;

  const explicit = config.mainCurrencyToken?.trim();
  if (explicit) {
    const hit = pairs.find(([k]) => k === explicit);
    if (hit) return { tokenKey: hit[0], itemId: hit[1] };
  }

  const atZero = pairs.find(([, id]) => id === 0);
  if (atZero) return { tokenKey: atZero[0], itemId: 0 };
  const [tokenKey, itemId] = pairs.reduce((best, cur) =>
    cur[1] < best[1] ? cur : best,
  );
  return { tokenKey, itemId };
}

function firstRecordEntry<T>(
  r: Record<string, T> | undefined,
): [string, T] | undefined {
  if (!r) return undefined;
  const e = Object.entries(r);
  return e[0];
}

function burnRulePriceAmount(rule: BurnRule): number {
  if ("min" in rule && "max" in rule) return rule.max;
  return rule.amount;
}

function isProduceOnly(def: PlayerEconomyActionDefinition): boolean {
  const p = def.produce && Object.keys(def.produce).length > 0;
  const m = def.mint && Object.keys(def.mint).length > 0;
  const b = def.burn && Object.keys(def.burn).length > 0;
  return Boolean(p && !m && !b);
}

function isCollectOnly(def: PlayerEconomyActionDefinition): boolean {
  const c = def.collect && Object.keys(def.collect).length > 0;
  const m = def.mint && Object.keys(def.mint).length > 0;
  const b = def.burn && Object.keys(def.burn).length > 0;
  const p = def.produce && Object.keys(def.produce).length > 0;
  return Boolean(c && !m && !b && !p);
}

/**
 * Derive shop rows from purchasable / claimable actions (`burn`+`mint`, `require`+`mint`, or free `mint`).
 */
export function deriveShopItemsFromConfig(
  config: PlayerEconomyConfig,
  tokenImages: Record<string, string>,
): MinigameShopItemUi[] {
  const out: MinigameShopItemUi[] = [];

  const entries = Object.entries(config.actions).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  for (const [actionId, def] of entries) {
    if (def.showInShop === false) continue;
    if (isProduceOnly(def)) continue;
    if (isCollectOnly(def)) continue;

    const mint = def.mint;
    const burn = def.burn;
    const req = def.require;

    if (!mint || Object.keys(mint).length === 0) {
      continue;
    }

    let priceToken: string;
    let priceAmount: number;

    if (burn && Object.keys(burn).length) {
      const be = firstRecordEntry(burn);
      if (!be) continue;
      priceToken = be[0];
      priceAmount = burnRulePriceAmount(be[1] as BurnRule);
    } else if (req && Object.keys(req).length) {
      const re = firstRecordEntry(req);
      if (!re) continue;
      priceToken = re[0];
      priceAmount = re[1].amount;
    } else {
      const me = firstRecordEntry(mint);
      if (!me) continue;
      priceToken = me[0];
      priceAmount = 0;
    }

    const mintKey = primaryMintTokenKey(config, actionId);
    const imageToken = mintKey || priceToken;
    const itemForMint = mintKey ? config.items?.[mintKey] : undefined;

    let ownedBalanceToken: string | undefined;
    if (burn && mint && Object.keys(mint).length === 1) {
      ownedBalanceToken = Object.keys(mint)[0];
    }

    const purchaseLimit =
      typeof def.purchaseLimit === "number" &&
      Number.isFinite(def.purchaseLimit) &&
      def.purchaseLimit > 0
        ? Math.floor(def.purchaseLimit)
        : undefined;

    out.push({
      id: actionId,
      actionId,
      name: itemForMint?.name ?? (mintKey || priceToken),
      description: itemForMint?.description ?? "",
      listImage: resolveTokenImageUrl(imageToken, tokenImages),
      price: { token: priceToken, amount: priceAmount },
      ...(ownedBalanceToken ? { ownedBalanceToken } : {}),
      ...(purchaseLimit !== undefined ? { purchaseLimit } : {}),
    });
  }

  return out;
}

function buildInventoryItems(
  config: PlayerEconomyConfig,
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

function inventoryShortcutTokensFromProduction(
  config: PlayerEconomyConfig,
): string[] {
  const items = config.items ?? {};
  const out: string[] = [];
  for (const [token, meta] of Object.entries(items)) {
    if (meta.generator === true) out.push(token);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function enrichShopItemsWithPurchaseProgress(
  items: MinigameShopItemUi[],
  purchaseCounts: Record<string, number> | undefined,
): MinigameShopItemUi[] {
  const c = purchaseCounts ?? {};
  return items.map((item) =>
    item.purchaseLimit != null && item.purchaseLimit > 0
      ? { ...item, purchasesSoFar: c[item.actionId] ?? 0 }
      : item,
  );
}

function buildUi(
  config: PlayerEconomyConfig,
  headerBalanceToken: string,
  visualTheme: string | undefined,
  purchaseCounts: Record<string, number> | undefined,
): MinigameDashboardUi {
  const tokenImages = buildTokenImageMap(config.items);
  return {
    headerBalanceToken,
    shopItems: enrichShopItemsWithPurchaseProgress(
      deriveShopItemsFromConfig(config, tokenImages),
      purchaseCounts,
    ),
    inventoryItems: buildInventoryItems(config),
    inventoryShortcutTokens: inventoryShortcutTokensFromProduction(config),
    tokenImages,
    visualTheme,
  };
}

export function buildMinigameDashboardData(
  slug: string,
  portalName: MinigameName,
  config: PlayerEconomyConfig,
  state: PlayerEconomyRuntimeState,
): MinigameDashboardData {
  const normalized = migrateLegacyPlayerEconomyConfigFields(config);

  const displayName = normalized.descriptions?.title?.trim() || slug;

  const headerBalanceToken =
    getPrimaryTradableMarketplaceItem(normalized)?.tokenKey ?? "";

  const visualTheme = normalized.visualTheme;

  const mergedState = mergeRuntimeWithInitialBalances(normalized, state);

  return {
    slug,
    portalName,
    displayName,
    config: normalized,
    state: mergedState,
    ui: buildUi(
      normalized,
      headerBalanceToken,
      visualTheme,
      mergedState.purchaseCounts,
    ),
    playUrl: normalized.playUrl,
  };
}
