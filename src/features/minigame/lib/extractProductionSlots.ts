import { tokenDisplayName } from "./minigameConfigHelpers";
import { isGeneratorBalanceItem } from "./minigameConfigMigration";
import { resolveProduceDurationMs } from "./resolveProduceDuration";
import type {
  CollectRule,
  PlayerEconomyConfig,
  PlayerEconomyRuntimeState,
} from "./types";

export type CapBalanceProductionSlot = {
  capToken: string;
  outputToken: string;
  startActionId: string;
  collectActionId: string;
  msToComplete: number;
  /** Global concurrent cap for this output; omitted when the rule has no `limit`. */
  limit?: number;
};

/** One generator (kitchen, wormery, …) and every produce recipe that uses it as `requires`. */
export type GeneratorProductionEntry = {
  capToken: string;
  recipes: CapBalanceProductionSlot[];
};

/** Stable key for mapping runtime `generating` jobs to dashboard recipe rows. */
export function recipeJobKey(slot: CapBalanceProductionSlot): string {
  return `${slot.startActionId}|${slot.outputToken}`;
}

/**
 * Finds every `produce` rule with `requires` and a collect target: either `collect` on the
 * same action (`collectActionId` is set to that action id) or legacy `collectActionId` on the rule.
 */
/** Production UI only lists lanes whose cap token is an item with `generator: true`. */
export function isGeneratorCapToken(
  config: PlayerEconomyConfig,
  token: string,
): boolean {
  return isGeneratorBalanceItem(config.items?.[token]);
}

/**
 * Dashboard shows a generator only when the player has at least one of that cap item,
 * or already has production running on it (so they can collect after edge balance changes).
 */
function balanceForToken(
  balances: Record<string, number>,
  token: string,
): number {
  const v = balances[token];
  if (typeof v === "number" && Number.isFinite(v)) {
    return Math.max(0, Math.floor(v));
  }
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function playerControlsGeneratorCap(
  runtime: PlayerEconomyRuntimeState,
  capToken: string,
): boolean {
  if (balanceForToken(runtime.balances, capToken) > 0) return true;
  return Object.values(runtime.generating).some(
    (job) => job.requires === capToken,
  );
}

export function isProductionSlotConfigured(
  slot: CapBalanceProductionSlot,
): boolean {
  return Boolean(slot.startActionId && slot.collectActionId);
}

export function extractCapBalanceProductionSlots(
  config: PlayerEconomyConfig,
): CapBalanceProductionSlot[] {
  const slots: CapBalanceProductionSlot[] = [];
  for (const [actionId, def] of Object.entries(config.actions)) {
    if (!def.produce) continue;
    const inlineCollect =
      def.collect !== undefined && Object.keys(def.collect).length > 0;
    for (const [outputToken, rule] of Object.entries(def.produce)) {
      const rawReq = rule.requires;
      const requires =
        typeof rawReq === "string"
          ? rawReq.trim()
          : String(rawReq ?? "").trim();
      if (!requires) continue;
      const collectActionId = inlineCollect
        ? actionId
        : rule.collectActionId?.trim();
      if (!collectActionId) continue;
      slots.push({
        capToken: requires,
        outputToken,
        startActionId: actionId,
        collectActionId,
        msToComplete: resolveProduceDurationMs(outputToken, rule, def.collect),
        limit: rule.limit,
      });
    }
  }
  return slots;
}

/**
 * Dashboard production zone: generator items the player controls ({@link playerControlsGeneratorCap}),
 * grouped with produce recipes that use that token as `requires`. Generators with no rules yet
 * still appear once owned (`recipes: []`).
 */
export function getProductionZoneEntries(
  config: PlayerEconomyConfig,
  runtime: PlayerEconomyRuntimeState,
): GeneratorProductionEntry[] {
  const ruleSlots = extractCapBalanceProductionSlots(config).filter((s) =>
    isGeneratorCapToken(config, s.capToken),
  );
  const byCap = new Map<string, CapBalanceProductionSlot[]>();
  for (const s of ruleSlots) {
    const list = byCap.get(s.capToken) ?? [];
    list.push(s);
    byCap.set(s.capToken, list);
  }
  for (const [, list] of byCap) {
    list.sort((a, b) => {
      const o = a.outputToken.localeCompare(b.outputToken);
      if (o !== 0) return o;
      return a.startActionId.localeCompare(b.startActionId);
    });
  }
  const tokens = new Set<string>([
    ...byCap.keys(),
    ...Object.entries(config.items ?? {})
      .filter(([, m]) => isGeneratorBalanceItem(m))
      .map(([t]) => t),
  ]);
  return Array.from(tokens)
    .sort((a, b) => a.localeCompare(b))
    .map((capToken) => ({
      capToken,
      recipes: byCap.get(capToken) ?? [],
    }))
    .filter((e) => playerControlsGeneratorCap(runtime, e.capToken));
}

/** Maps each recipe (`startActionId|outputToken`) to its active generating job id. */
export function buildCapJobByRecipeKey(
  config: PlayerEconomyConfig,
  runtime: PlayerEconomyRuntimeState,
): Record<string, string | undefined> {
  const map: Record<string, string | undefined> = {};
  for (const entry of getProductionZoneEntries(config, runtime)) {
    for (const slot of entry.recipes) {
      if (!isProductionSlotConfigured(slot)) continue;
      const key = recipeJobKey(slot);
      const match = Object.entries(runtime.generating).find(
        ([, job]) =>
          job.requires === slot.capToken &&
          job.outputToken === slot.outputToken,
      );
      map[key] = match?.[0];
    }
  }
  return map;
}

export function formatMinigameDuration(ms: number): string {
  if (ms <= 0) return "0s";
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function capTokenDisplayName(
  capToken: string,
  config: PlayerEconomyConfig,
): string {
  return tokenDisplayName(config, capToken);
}

export function getCollectRuleForSlot(
  config: PlayerEconomyConfig,
  slot: CapBalanceProductionSlot,
): CollectRule | null {
  const collect = config.actions[slot.collectActionId]?.collect;
  if (!collect) return null;
  const byOutput = collect[slot.outputToken];
  if (byOutput) return byOutput;
  const entries = Object.entries(collect);
  if (!entries.length) return null;
  return entries[0][1];
}

/** True when collect is not guaranteed (client shows "?" while producing). */
export function isChanceBasedCollectRule(
  rule: CollectRule | null | undefined,
): boolean {
  if (!rule) return false;
  const c = rule.chance;
  if (typeof c !== "number" || !Number.isFinite(c)) return false;
  return c < 100;
}

/**
 * True when collect always grants a single known row: one collect entry and no sub-100% chance roll.
 * Multi-row weighted picks and Bernoulli single rows are not deterministic for yield display.
 */
export function isDeterministicCollectYield(
  config: PlayerEconomyConfig,
  slot: CapBalanceProductionSlot,
): boolean {
  const collect = config.actions[slot.collectActionId]?.collect;
  if (!collect) return false;
  const keys = Object.keys(collect);
  if (keys.length !== 1) return false;
  const rule = collect[keys[0]];
  if (!rule) return false;
  return !isChanceBasedCollectRule(rule);
}

/**
 * Collect uses a chance roll and/or multiple configured reward rows — show a reveal modal after claim.
 */
export function shouldShowCollectRevealModal(
  config: PlayerEconomyConfig,
  slot: CapBalanceProductionSlot,
): boolean {
  const collect = config.actions[slot.collectActionId]?.collect;
  if (!collect) return false;
  if (Object.keys(collect).length > 1) return true;
  return isChanceBasedCollectRule(getCollectRuleForSlot(config, slot));
}

export type CollectDropOddsRow = {
  token: string;
  amount: number;
  /** Share of the weighted pick, 0–100 (sums to ~100; float). */
  percent: number;
};

/**
 * When an action's `collect` has multiple token rows, `chance` is a relative weight;
 * returns normalized percentages for UI (same weights as server multi-row collect).
 */
export function getCollectDropOddsForAction(
  collect: Record<string, CollectRule> | undefined,
): CollectDropOddsRow[] | null {
  if (!collect) return null;
  const entries = Object.entries(collect);
  if (entries.length < 2) return null;
  const weights = entries.map(([, r]) => {
    if (r.chance === undefined) return 100;
    const c = Number(r.chance);
    if (!Number.isFinite(c)) return 100;
    return Math.max(0, Math.floor(c));
  });
  let sum = weights.reduce((a, b) => a + b, 0);
  const use = sum > 0 ? weights : weights.map(() => 1);
  sum = use.reduce((a, b) => a + b, 0);
  if (sum <= 0) return null;
  return entries.map(([token, rule], i) => ({
    token,
    amount: rule.amount,
    percent: (100 * use[i]) / sum,
  }));
}

export function getCollectDropOddsForSlot(
  config: PlayerEconomyConfig,
  slot: CapBalanceProductionSlot,
): CollectDropOddsRow[] | null {
  return getCollectDropOddsForAction(
    config.actions[slot.collectActionId]?.collect,
  );
}

export function getCollectOutputForSlot(
  config: PlayerEconomyConfig,
  slot: CapBalanceProductionSlot,
): { token: string; amount: number } | null {
  const collect = config.actions[slot.collectActionId]?.collect;
  if (!collect) return null;
  const entries = Object.entries(collect);
  if (!entries.length) return null;
  const direct = collect[slot.outputToken];
  if (direct) {
    return { token: slot.outputToken, amount: direct.amount };
  }
  const [token, rule] = entries[0];
  return { token, amount: rule.amount };
}

/**
 * For a shop `mint` action (e.g. BUY_WORMERY_2), returns the timed `Worm` payout
 * that the new wormery will run (matches production card copy).
 */
export function getShopPurchaseProductionPreview(
  config: PlayerEconomyConfig,
  shopActionId: string,
): { outputToken: string; amount: number; rateDenominatorMs: number } | null {
  const mint = config.actions[shopActionId]?.mint;
  if (!mint) return null;
  const mintedTokens = Object.keys(mint);
  if (!mintedTokens.length) return null;
  const slots = extractCapBalanceProductionSlots(config);
  const slot = slots.find(
    (s) =>
      mintedTokens.includes(s.capToken) &&
      isGeneratorCapToken(config, s.capToken),
  );
  if (!slot) return null;
  const out = getCollectOutputForSlot(config, slot);
  if (!out) return null;
  return {
    outputToken: out.token,
    amount: out.amount,
    rateDenominatorMs: slot.msToComplete,
  };
}
