import { tokenDisplayName } from "./minigameConfigHelpers";
import { resolveProduceDurationMs } from "./resolveProduceDuration";
import type { PlayerEconomyConfig, PlayerEconomyRuntimeState } from "./types";

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
export function isGeneratorCapToken(config: PlayerEconomyConfig, token: string): boolean {
  return config.items?.[token]?.generator === true;
}

export function isProductionSlotConfigured(slot: CapBalanceProductionSlot): boolean {
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
      const requires = rule.requires?.trim();
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
        msToComplete: resolveProduceDurationMs(
          outputToken,
          rule,
          def.collect,
        ),
        limit: rule.limit,
      });
    }
  }
  return slots;
}

/**
 * Dashboard production zone: every item with `generator: true`, grouped with all produce
 * recipes that use that token as `requires`. Generators with no rules have `recipes: []`.
 */
export function getProductionZoneEntries(
  config: PlayerEconomyConfig,
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
      .filter(([, m]) => m.generator === true)
      .map(([t]) => t),
  ]);
  return Array.from(tokens)
    .sort((a, b) => a.localeCompare(b))
    .map((capToken) => ({
      capToken,
      recipes: byCap.get(capToken) ?? [],
    }));
}

/** Maps each recipe (`startActionId|outputToken`) to its active generating job id. */
export function buildCapJobByRecipeKey(
  config: PlayerEconomyConfig,
  runtime: PlayerEconomyRuntimeState,
): Record<string, string | undefined> {
  const map: Record<string, string | undefined> = {};
  for (const entry of getProductionZoneEntries(config)) {
    for (const slot of entry.recipes) {
      if (!isProductionSlotConfigured(slot)) continue;
      const key = recipeJobKey(slot);
      const match = Object.entries(runtime.generating).find(
        ([, job]) =>
          job.requires === slot.capToken && job.outputToken === slot.outputToken,
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

export function getCollectOutputForSlot(
  config: PlayerEconomyConfig,
  slot: CapBalanceProductionSlot,
): { token: string; amount: number } | null {
  const collect = config.actions[slot.collectActionId]?.collect;
  if (!collect) return null;
  const entries = Object.entries(collect);
  if (!entries.length) return null;
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
      mintedTokens.includes(s.capToken) && isGeneratorCapToken(config, s.capToken),
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
