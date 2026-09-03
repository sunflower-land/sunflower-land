import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import type { FloatingIslandGameName } from "features/game/types/floatingIsland";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";

/**
 * Generic Love Charm prize claim for the Floating Island daily puzzles.
 *
 * Every mini-game on the island rewards Love Charms through this single event
 * so the daily caps live in one place:
 *  - A single claim grants between 0 and 100 Love Charms.
 *  - VIP players can earn up to 100 Love Charms per (UTC) day in total.
 *  - Non-VIP players can earn up to 5 Love Charms per (UTC) day in total.
 *  - No more than 10 claims are accepted per day, regardless of amount.
 */
export const FLOATING_ISLAND_MAX_CLAIM_AMOUNT = 100;
export const FLOATING_ISLAND_DAILY_LOVE_CHARM_LIMIT = 100;
export const FLOATING_ISLAND_NON_VIP_DAILY_LOVE_CHARM_LIMIT = 5;
export const FLOATING_ISLAND_MAX_DAILY_CLAIMS = 10;

export type FloatingIslandPrizeClaim = {
  claimedAt: number;
  amount: number;
  /** Which puzzle paid out. Optional so older claims stay valid. */
  game?: FloatingIslandGameName;
  /** The puzzle's round - a `{ game, roundId }` pair can only be claimed once. */
  roundId?: number;
};

export type ClaimFloatingIslandPrizeAction = {
  type: "floatingIslandPrize.claimed";
  amount: number;
  /** Which puzzle is paying out - recorded so per-game client rules work. */
  game?: FloatingIslandGameName;
  /** The puzzle's round, so a reload can't replay the same reveal. */
  roundId?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimFloatingIslandPrizeAction;
  createdAt?: number;
};

const toDayKey = (timestamp: number) =>
  new Date(timestamp).toISOString().split("T")[0];

/** Claims made on the same UTC day as `createdAt`, oldest first. */
export function getFloatingIslandClaimsToday({
  state,
  createdAt = Date.now(),
}: {
  state: GameState;
  createdAt?: number;
}): FloatingIslandPrizeClaim[] {
  const todayKey = toDayKey(createdAt);

  return (state.floatingIsland.prizeClaims ?? []).filter(
    (claim) => toDayKey(claim.claimedAt) === todayKey,
  );
}

/** Today's claims made by one specific puzzle. */
export function getFloatingIslandGameClaimsToday({
  state,
  game,
  createdAt = Date.now(),
}: {
  state: GameState;
  game: FloatingIslandGameName;
  createdAt?: number;
}): FloatingIslandPrizeClaim[] {
  return getFloatingIslandClaimsToday({ state, createdAt }).filter(
    (claim) => claim.game === game,
  );
}

/** Total Love Charms already claimed today across all island games. */
export function getFloatingIslandLoveCharmsClaimedToday({
  state,
  createdAt = Date.now(),
}: {
  state: GameState;
  createdAt?: number;
}): number {
  return getFloatingIslandClaimsToday({ state, createdAt }).reduce(
    (total, claim) => total + claim.amount,
    0,
  );
}

/** Love Charms this player can still earn today - claims above this throw. */
export function getFloatingIslandLoveCharmsRemainingToday({
  state,
  createdAt = Date.now(),
}: {
  state: GameState;
  createdAt?: number;
}): number {
  return Math.max(
    0,
    getFloatingIslandDailyLoveCharmLimit({ state, createdAt }) -
      getFloatingIslandLoveCharmsClaimedToday({ state, createdAt }),
  );
}

/** Daily Love Charm cap for this player - VIP unlocks the full amount. */
export function getFloatingIslandDailyLoveCharmLimit({
  state,
  createdAt = Date.now(),
}: {
  state: GameState;
  createdAt?: number;
}): number {
  return hasVipAccess({ game: state, now: createdAt })
    ? FLOATING_ISLAND_DAILY_LOVE_CHARM_LIMIT
    : FLOATING_ISLAND_NON_VIP_DAILY_LOVE_CHARM_LIMIT;
}

export function claimFloatingIslandPrize({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { amount, game: gameName, roundId } = action;

    if (roundId !== undefined && !Number.isInteger(roundId)) {
      throw new Error("Invalid round");
    }

    if (!Number.isInteger(amount) || amount < 0) {
      throw new Error("Invalid prize amount");
    }

    if (amount > FLOATING_ISLAND_MAX_CLAIM_AMOUNT) {
      throw new Error("Prize amount exceeds maximum");
    }

    const claimsToday = getFloatingIslandClaimsToday({
      state: game,
      createdAt,
    });

    if (
      gameName &&
      roundId !== undefined &&
      claimsToday.some(
        (claim) => claim.game === gameName && claim.roundId === roundId,
      )
    ) {
      throw new Error("Prize already claimed for this round");
    }

    if (claimsToday.length >= FLOATING_ISLAND_MAX_DAILY_CLAIMS) {
      throw new Error("Daily claim limit reached");
    }

    const claimedToday = claimsToday.reduce(
      (total, claim) => total + claim.amount,
      0,
    );
    const dailyLimit = getFloatingIslandDailyLoveCharmLimit({
      state: game,
      createdAt,
    });

    if (claimedToday + amount > dailyLimit) {
      throw new Error("Daily Love Charm limit reached");
    }

    // Only today's claims matter, so drop older days to keep the array small
    game.floatingIsland.prizeClaims = [
      ...claimsToday,
      {
        claimedAt: createdAt,
        amount,
        ...(gameName ? { game: gameName } : {}),
        ...(roundId !== undefined ? { roundId } : {}),
      },
    ];

    const previous = game.inventory["Love Charm"] ?? new Decimal(0);
    game.inventory["Love Charm"] = previous.add(amount);

    return game;
  });
}
