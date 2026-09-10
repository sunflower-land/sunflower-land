import type { InventoryItemName } from "features/game/types/game";
import type { MinigameType } from "./minigames";

/**
 * Shared types for the community Giveaway mini-games.
 *
 * A giveaway is an admin-run event (e.g. a stream race). Players join, play a
 * client-simulated mini-game, submit a score, and the server ranks everyone and
 * hands out prizes as airdrops. See `src/features/giveaway` for the full flow.
 */

/**
 * A prize tier covers an inclusive, 1-based range of leaderboard positions
 * (e.g. `{ from: 2, to: 3, coins: 250 }` rewards 2nd and 3rd place). Tiers must
 * not overlap. A tier can grant coins and/or items.
 */
export type PrizeTier = {
  from: number;
  to: number;
  coins?: number;
  items?: Partial<Record<InventoryItemName, number>>;
};

/**
 * upcoming  - created, before `startAt` (joins open, "starting soon")
 * live      - between start/end (joins + scoring open)
 * ended     - past `endAt`, awaiting admin finalisation
 * complete  - admin finalised; prizes claimable
 */
export type GiveawayStatus = "upcoming" | "live" | "ended" | "complete";

/** A joinable giveaway (upcoming/live) from `GET /data?type=giveaways`. */
export type ActiveGiveaway = {
  id: string;
  title: string;
  description?: string;
  status: Extract<GiveawayStatus, "upcoming" | "live">;
  startAt: number;
  endAt: number;
  /** Which mini-game it runs (absent on legacy giveaways). */
  minigame?: MinigameType;
  /** When any participant may finalise it. */
  finalisableAt: number;
  prizes: PrizeTier[];
};

/** A finalised giveaway from the `recent` list — drill in for the full board. */
export type RecentGiveaway = {
  id: string;
  title: string;
  description?: string;
  status: Extract<GiveawayStatus, "complete">;
  startAt: number;
  endAt: number;
  /** Which mini-game it ran (absent on legacy giveaways). */
  minigame?: MinigameType;
  finalisableAt: number;
  endedAt: number;
  prizes: PrizeTier[];
};

/**
 * `GET /data?type=giveaways`: what's on/coming (`active`, soonest-first) plus the
 * last ~10 finalised (`recent`, newest-first). One poll renders the whole board;
 * drill into any id via `giveawayLeaderboard` for winners.
 */
export type GiveawaysResponse = {
  active: ActiveGiveaway[];
  recent: RecentGiveaway[];
};

/** A single ranked row in the giveaway leaderboard (top 10 only). */
export type GiveawayLeaderboardEntry = {
  farmId: number;
  score: number;
  position: number;
  username?: string;
};

/** Full board for one giveaway from `GET /data?type=giveawayLeaderboard&id=<id>`. */
export type GiveawayLeaderboardResponse = {
  id: string;
  title: string;
  status: GiveawayStatus;
  startAt: number;
  endAt: number;
  /** Which mini-game the event runs (absent on giveaways created before the
   * API carried the type — those fall back to the `?type=` query param). */
  minigame?: MinigameType;
  /** When the mini-game's own clock runs out. */
  finishesAt: number;
  /**
   * When ANY participant may finalise the event — the game clock plus a grace
   * period for the last scores to land. The server enforces the same instant,
   * so gating the "Finish" button on this never offers a click that would fail.
   */
  finalisableAt: number;
  prizes: PrizeTier[];
  /** Top 10 only, ranked best-first. */
  leaderboard: GiveawayLeaderboardEntry[];
  /** ALL participant farm IDs, ranked best-first (IDs only). */
  participants: number[];
  totalParticipants: number;
};

/** Winner assignment returned by the `giveaway.ended` effect. */
export type GiveawayWinner = {
  farmId: number;
  position: number;
  reward: PrizeTier;
};
