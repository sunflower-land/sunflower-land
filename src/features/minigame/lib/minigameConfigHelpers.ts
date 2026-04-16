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
  MinigameFlowerPurchaseItemUi,
  MinigameInventoryItemUi,
  MinigameShopItemUi,
  MinigameTrophyDisplay,
} from "./minigameDashboardTypes";
import { getMinigameTokenImage } from "./minigameTokenIcons";
import {
  isGeneratorBalanceItem,
  migrateLegacyPlayerEconomyConfigFields,
} from "./minigameConfigMigration";
import {
  isShopActionGloballySupplyBlocked,
  minSupplyRemainingForShopAction,
} from "./minigameShopSupply";

/**
 * When the persisted minigame has no balance entry for a token yet, use
 * `items[token].initialBalance` from config so the dashboard matches “starting inventory”
 * (many APIs omit keys until first write).
 */
function coerceBalanceValue(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) {
    return Math.max(0, Math.floor(v));
  }
  const n = Number(v);
  if (Number.isFinite(n)) return Math.max(0, Math.floor(n));
  return 0;
}

export function mergeInitialBalancesFromConfig(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(balances)) {
    out[k] = coerceBalanceValue(v);
  }
  const items = config.items ?? {};
  for (const [token, meta] of Object.entries(items)) {
    const initRaw = meta.initialBalance;
    const init =
      typeof initRaw === "number" && Number.isFinite(initRaw)
        ? initRaw
        : Number(initRaw);
    if (!Number.isFinite(init) || init <= 0) continue;
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

/** Items marked `trophy: true` with a positive balance (after merged initial balances). */
export function deriveOwnedTrophyDisplays(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
  tokenImages: Record<string, string>,
): MinigameTrophyDisplay[] {
  const items = config.items;
  if (!items) return [];
  const out: MinigameTrophyDisplay[] = [];
  for (const [token, meta] of Object.entries(items)) {
    if (meta.trophy !== true) continue;
    const raw = balances[token];
    const amt =
      typeof raw === "number" && Number.isFinite(raw)
        ? Math.max(0, Math.floor(raw))
        : Number.isFinite(Number(raw))
          ? Math.max(0, Math.floor(Number(raw)))
          : 0;
    if (amt <= 0) continue;
    const name = meta.name?.trim() || token;
    out.push({
      token,
      name,
      imageUrl: resolveTokenImageUrl(token, tokenImages),
    });
  }
  out.sort((a, b) => a.token.localeCompare(b.token));
  return out;
}

export function buildTokenImageMap(
  items: PlayerEconomyConfig["items"],
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!items) return out;
  for (const [key, v] of Object.entries(items)) {
    const img = v.image?.trim();
    if (img) out[key] = img;
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

function tokenKeysForBalanceItemId(
  items: PlayerEconomyConfig["items"],
  itemId: number,
): string[] {
  if (!items) return [];
  return Object.entries(items)
    .filter(([, v]) => v.id === itemId)
    .map(([k]) => k);
}

/**
 * FLOWER offers from `config.purchases` (requires a unique `items[token].id` match per `itemId`).
 */
export function deriveFlowerPurchaseItemsFromConfig(
  config: PlayerEconomyConfig,
  tokenImages: Record<string, string>,
): MinigameFlowerPurchaseItemUi[] {
  const raw = config.purchases;
  if (!raw || typeof raw !== "object") return [];
  const items = config.items ?? {};
  const out: MinigameFlowerPurchaseItemUi[] = [];

  for (const [purchaseId, p] of Object.entries(raw).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const flower = Math.floor(Number(p.flower));
    const economyAmount = Math.floor(Number(p.amount));
    const itemId = Math.floor(Number(p.itemId));
    if (!Number.isFinite(flower) || flower < 1 || flower > 100) continue;
    if (!Number.isFinite(economyAmount) || economyAmount < 1) continue;
    if (!Number.isFinite(itemId)) continue;

    const keys = tokenKeysForBalanceItemId(items, itemId);
    if (keys.length !== 1) continue;
    const tokenKey = keys[0] as string;
    const meta = items[tokenKey];
    const name = meta?.name?.trim() || tokenKey;
    const description = meta?.description?.trim() ?? "";

    out.push({
      id: purchaseId,
      purchaseId,
      name,
      description,
      listImage: resolveTokenImageUrl(tokenKey, tokenImages),
      flower,
      economyAmount,
      tokenKey,
      itemId,
    });
  }

  return out;
}

/**
 * Derive shop rows from purchasable / claimable actions (`burn`+`mint`, `require`+`mint`, or free `mint`).
 */
export function deriveShopItemsFromConfig(
  config: PlayerEconomyConfig,
  tokenImages: Record<string, string>,
  supplies: Record<string, number> = {},
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

    let prices: { token: string; amount: number }[];

    if (burn && Object.keys(burn).length) {
      prices = Object.entries(burn)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([token, rule]) => ({
          token,
          amount: burnRulePriceAmount(rule as BurnRule),
        }));
    } else if (req && Object.keys(req).length) {
      prices = Object.entries(req)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([token, rule]) => ({ token, amount: rule.amount }));
    } else {
      const me = firstRecordEntry(mint);
      if (!me) continue;
      prices = [{ token: me[0], amount: 0 }];
    }

    const mintKey = primaryMintTokenKey(config, actionId);
    const imageToken = mintKey || prices[0]?.token || "";
    const itemForMint = mintKey ? config.items?.[mintKey] : undefined;

    const maxCalls =
      typeof def.maxCalls === "number" &&
      Number.isFinite(def.maxCalls) &&
      def.maxCalls > 0
        ? Math.floor(def.maxCalls)
        : undefined;

    const supplyRemainingMin = minSupplyRemainingForShopAction(
      config,
      actionId,
      supplies,
    );
    const supplyBlocked = isShopActionGloballySupplyBlocked(
      config,
      actionId,
      supplies,
    );

    out.push({
      id: actionId,
      actionId,
      name: itemForMint?.name ?? (mintKey || prices[0]?.token || ""),
      description: itemForMint?.description ?? "",
      listImage: resolveTokenImageUrl(imageToken, tokenImages),
      prices,
      ...(maxCalls !== undefined ? { maxCalls } : {}),
      ...(supplyRemainingMin !== undefined
        ? {
            supplyRemainingMin,
            ...(supplyBlocked ? { supplyBlocked: true as const } : {}),
          }
        : {}),
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
    .map(([token, v]) => {
      const name = v.name?.trim();
      const description = v.description?.trim() ?? "";
      return {
        token,
        name: name || token,
        description,
      };
    })
    .sort((a, b) => a.token.localeCompare(b.token));
}

function inventoryShortcutTokensFromProduction(
  config: PlayerEconomyConfig,
): string[] {
  const items = config.items ?? {};
  const out: string[] = [];
  for (const [token, meta] of Object.entries(items)) {
    if (isGeneratorBalanceItem(meta)) out.push(token);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function enrichShopItemsWithCallProgress(
  items: MinigameShopItemUi[],
  rules: PlayerEconomyRuntimeState["rules"],
): MinigameShopItemUi[] {
  return items.map((item) =>
    item.maxCalls != null && item.maxCalls > 0
      ? { ...item, callsSoFar: rules?.[item.actionId]?.count ?? 0 }
      : item,
  );
}

function buildUi(
  config: PlayerEconomyConfig,
  headerBalanceToken: string,
  visualTheme: string | undefined,
  rules: PlayerEconomyRuntimeState["rules"],
  supplies: Record<string, number>,
): MinigameDashboardUi {
  const tokenImages = buildTokenImageMap(config.items);
  return {
    headerBalanceToken,
    flowerPurchaseItems: deriveFlowerPurchaseItemsFromConfig(
      config,
      tokenImages,
    ),
    shopItems: enrichShopItemsWithCallProgress(
      deriveShopItemsFromConfig(config, tokenImages, supplies),
      rules,
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
  economySupplies: Record<string, number> = {},
): MinigameDashboardData {
  const normalized = migrateLegacyPlayerEconomyConfigFields(config);

  const displayName = normalized.descriptions?.title?.trim() || slug;

  const headerBalanceToken =
    getPrimaryTradableMarketplaceItem(normalized)?.tokenKey ?? "";

  const visualTheme = normalized.visualTheme;

  const mergedState = mergeRuntimeWithInitialBalances(normalized, state);
  const supplies = { ...economySupplies };

  return {
    slug,
    portalName,
    displayName,
    config: normalized,
    state: mergedState,
    economySupplies: supplies,
    ui: buildUi(
      normalized,
      headerBalanceToken,
      visualTheme,
      mergedState.rules,
      supplies,
    ),
    playUrl: normalized.playUrl,
  };
}
