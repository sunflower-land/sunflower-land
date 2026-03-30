import { CHICKEN_RESCUE_TOKEN_DISPLAY } from "./chickenRescueTokenLabels";
import type { MinigameConfig, MinigameRuntimeState } from "./types";

export type CapBalanceProductionSlot = {
  capToken: string;
  outputToken: string;
  startActionId: string;
  collectActionId: string;
  msToComplete: number;
  /** Global concurrent cap for this output; omitted when the rule has no `limit`. */
  limit?: number;
};

/**
 * Finds every `produce` rule with `requires` and pairs it with a collect action
 * via `collectByStartId[startActionId] = collectActionId` (per-minigame registry).
 */
export function extractCapBalanceProductionSlots(
  config: MinigameConfig,
  collectByStartId: Record<string, string>,
): CapBalanceProductionSlot[] {
  const slots: CapBalanceProductionSlot[] = [];
  for (const [actionId, def] of Object.entries(config.actions)) {
    if (!def.produce) continue;
    for (const [outputToken, rule] of Object.entries(def.produce)) {
      if (!rule.requires) continue;
      const collectActionId = collectByStartId[actionId];
      if (!collectActionId) continue;
      slots.push({
        capToken: rule.requires,
        outputToken,
        startActionId: actionId,
        collectActionId,
        msToComplete: rule.msToComplete,
        limit: rule.limit,
      });
    }
  }
  return slots;
}

/** Maps each `requires` balance token to its active producing job id (if any). */
export function buildCapJobByCapToken(
  config: MinigameConfig,
  collectByStartId: Record<string, string>,
  runtime: MinigameRuntimeState,
): Record<string, string | undefined> {
  const slots = extractCapBalanceProductionSlots(config, collectByStartId);
  const map: Record<string, string | undefined> = {};
  for (const s of slots) {
    const match = Object.entries(runtime.producing).find(
      ([, job]) => job.requires === s.capToken,
    );
    map[s.capToken] = match?.[0];
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

export function capTokenDisplayName(capToken: string): string {
  const mapped = CHICKEN_RESCUE_TOKEN_DISPLAY[capToken];
  if (mapped) return mapped;
  return capToken.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function getCollectOutputForSlot(
  config: MinigameConfig,
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
 * For a shop `mint` action (e.g. BUY_MOSS_WORMERY), returns the timed `Worm` payout
 * that the new wormery will run (matches production card copy).
 */
export function getShopPurchaseProductionPreview(
  config: MinigameConfig,
  collectByStartId: Record<string, string>,
  shopActionId: string,
): { outputToken: string; amount: number; rateDenominatorMs: number } | null {
  const mint = config.actions[shopActionId]?.mint;
  if (!mint) return null;
  const mintedTokens = Object.keys(mint);
  if (!mintedTokens.length) return null;
  const slots = extractCapBalanceProductionSlots(config, collectByStartId);
  const slot = slots.find((s) => mintedTokens.includes(s.capToken));
  if (!slot) return null;
  const out = getCollectOutputForSlot(config, slot);
  if (!out) return null;
  return {
    outputToken: out.token,
    amount: out.amount,
    rateDenominatorMs: slot.msToComplete,
  };
}
