import { ERRORS } from "lib/errors";
import type { GameState } from "../types/game";
import { hasVipAccess } from "./vipAccess";

/**
 * Marketplace withdrawal cooldown.
 *
 * Non-VIP farms can't withdraw an item for 90 days after their most recent
 * marketplace purchase of it. Purchase history lives in the trade ledger, not
 * game state, so the client can't predict a block - the API rejects the
 * withdrawal with WITHDRAW_MARKETPLACE_COOLDOWN and lists the blocked items.
 * We remember what it told us so the withdraw screens can mark those items
 * until the player either waits it out or buys VIP.
 */

/**
 * Item name as it appears in game state -> ms timestamp it becomes
 * withdrawable. Collectibles and wearables use their name, buds are
 * `Bud #123` and pets are `Pet #1`.
 */
export type WithdrawCooldowns = Record<string, number>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Pull the blocked items off a WITHDRAW_MARKETPLACE_COOLDOWN rejection:
 * `{ errorCode, data: { items: { [name]: withdrawableAt } } }`. Anything
 * else (another code, a malformed body) yields an empty map.
 */
export function getWithdrawCooldownItems(error: unknown): WithdrawCooldowns {
  if (!isRecord(error)) return {};
  if (error.message !== ERRORS.WITHDRAW_MARKETPLACE_COOLDOWN) return {};

  const items = isRecord(error.data) ? error.data.items : undefined;
  if (!isRecord(items)) return {};

  return Object.entries(items).reduce<WithdrawCooldowns>(
    (acc, [name, until]) => {
      if (typeof until === "number" && Number.isFinite(until)) {
        acc[name] = until;
      }
      return acc;
    },
    {},
  );
}

/**
 * When `name` is blocked from withdrawal by a marketplace purchase, the
 * timestamp it frees up; otherwise undefined. Paid VIP or a Lifetime Farmer
 * Banner lifts the block straight away - the free trial does not, matching
 * the API's own check.
 */
export function getMarketplaceWithdrawBlock({
  game,
  cooldowns,
  name,
  now,
}: {
  game: GameState;
  cooldowns: WithdrawCooldowns | undefined;
  name: string;
  now: number;
}): number | undefined {
  const until = cooldowns?.[name];
  if (until === undefined || until <= now) return undefined;
  if (hasVipAccess({ game, now, type: "full" })) return undefined;

  return until;
}

/** Locale-formatted calendar date, e.g. "9 Dec 2026". */
export const formatWithdrawableDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
