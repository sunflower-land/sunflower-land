import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import type { FloatingIslandGameName } from "features/game/types/floatingIsland";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";

/**
 * Generic prize claim for the Floating Island daily puzzles.
 *
 * Most mini-games on the island reward Love Charms through this single event
 * so the daily caps live in one place:
 *  - A single claim grants between 0 and 100 Love Charms.
 *  - VIP players can earn up to 100 Love Charms per (UTC) day in total.
 *  - Non-VIP players can earn up to 5 Love Charms per (UTC) day in total.
 *  - No more than 10 claims are accepted per day, regardless of amount.
 *
 * The exception is the puzzles in FLOATING_ISLAND_GAME_ITEM_PRIZE, which pay
 * an item instead and are bounded by their own once-a-day rule.
 */
export const FLOATING_ISLAND_MAX_CLAIM_AMOUNT = 100;
export const FLOATING_ISLAND_DAILY_LOVE_CHARM_LIMIT = 100;
export const FLOATING_ISLAND_NON_VIP_DAILY_LOVE_CHARM_LIMIT = 5;
export const FLOATING_ISLAND_MAX_DAILY_CLAIMS = 10;

/**
 * Puzzles that pay an item rather than Love Charms.
 *
 * Lover's Push took the clearing over from the petal puzzle, so it inherits
 * that puzzle's prize - one Bronze Love Box a UTC day - and islanders keep the
 * reward they had before it arrived. The petal puzzle still pays its own.
 *
 * A claim for one of these pays no Love Charms whatever `amount` it carries,
 * and is recorded as `amount: 0`, so it neither counts toward the daily Love
 * Charm cap nor is refused by it. Kept in step with the API's copy of this
 * event, which is the one that actually mints the box.
 */
export const FLOATING_ISLAND_GAME_ITEM_PRIZE: Partial<
  Record<FloatingIslandGameName, { item: InventoryItemName; amount: number }>
> = {
  love_push: { item: "Bronze Love Box", amount: 1 },
};

/**
 * Puzzles whose prize only the server knows.
 *
 * The Love Boulder pays a box or coins rolled per UTC day on the API - a
 * Bronze Love Box, a Bronze Food Box, 250 coins or 500 coins. The client
 * can't roll it (the room previews it, but the seed stays server-side), so
 * this copy records the claim as worth 0 Love Charms and pays nothing; the
 * API's copy pays the prize and the next sync brings it down. Like an item
 * prize, it neither counts toward the daily Love Charm cap nor is refused
 * by it.
 */
export const FLOATING_ISLAND_SERVER_PAID_GAMES: FloatingIslandGameName[] = [
  "love_boulder",
];

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

    // What this puzzle actually pays. An item prize pays no Love Charms, so
    // the Love Charm cap neither refuses the claim nor records anything. A
    // server-paid prize is the same from here, minus the item.
    const itemPrize = gameName
      ? FLOATING_ISLAND_GAME_ITEM_PRIZE[gameName]
      : undefined;
    const serverPaid =
      !!gameName && FLOATING_ISLAND_SERVER_PAID_GAMES.includes(gameName);
    const paysLoveCharms = !itemPrize && !serverPaid;
    const loveCharms = paysLoveCharms ? amount : 0;

    if (paysLoveCharms) {
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
    }

    // Only today's claims matter, so drop older days to keep the array small
    game.floatingIsland.prizeClaims = [
      ...claimsToday,
      {
        claimedAt: createdAt,
        amount: loveCharms,
        ...(gameName ? { game: gameName } : {}),
        ...(roundId !== undefined ? { roundId } : {}),
      },
    ];

    if (itemPrize) {
      const held = game.inventory[itemPrize.item] ?? new Decimal(0);
      game.inventory[itemPrize.item] = held.add(itemPrize.amount);
    } else if (paysLoveCharms) {
      const previous = game.inventory["Love Charm"] ?? new Decimal(0);
      game.inventory["Love Charm"] = previous.add(loveCharms);
    }

    return game;
  });
}
