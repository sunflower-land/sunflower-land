import { getKeys } from "lib/object";
import type { GameState } from "features/game/types/game";
import { produce, Draft } from "immer";
import Decimal from "decimal.js-light";
import { populateSaltFarm } from "features/game/types/salt";
import { getSkillPointsForSkills } from "./choseSkill";

export type ResetSkillsAction = {
  type: "skills.reset";
};

type Options = {
  state: Readonly<GameState>;
  action: ResetSkillsAction;
  createdAt?: number;
};

// Cost ramp: the first 200 points removed in the 180-day window are free,
// then 1 gem/point from 200–399, doubling every 200 thereafter (400–599 →
// 2/pt, 600–799 → 4/pt, …). Transactions that span a boundary pay split-rate.
const FREE_POINTS = 200;
const POINTS_PER_TIER = 200;

export const getGemCostForSkillPoints = (
  pointsRemoved: number,
  skillPointsUsed: number,
): number => {
  let cost = 0;
  let remaining = pointsRemoved;
  let history = skillPointsUsed;

  while (remaining > 0) {
    let rate: number;
    let tierEnd: number;

    if (history < FREE_POINTS) {
      rate = 0;
      tierEnd = FREE_POINTS;
    } else {
      const tierIndex = Math.floor((history - FREE_POINTS) / POINTS_PER_TIER);
      rate = Math.pow(2, tierIndex);
      tierEnd = FREE_POINTS + (tierIndex + 1) * POINTS_PER_TIER;
    }

    const inTier = Math.min(remaining, tierEnd - history);
    cost += inTier * rate;
    history += inTier;
    remaining -= inTier;
  }

  return cost;
};

export function getTimeUntilNextFreeReset(
  previousFreeSkillResetAt: number,
  now = Date.now(),
) {
  // 180 days in milliseconds
  const RESET_PERIOD_MS = 180 * 24 * 60 * 60 * 1000;

  // Calculate next reset time by adding reset period
  const nextResetTime = previousFreeSkillResetAt + RESET_PERIOD_MS;

  // Calculate time remaining
  const timeRemaining = nextResetTime - now;
  return timeRemaining;
}

export function canResetForFree(
  previousFreeSkillResetAt: number,
  now = Date.now(),
) {
  const timeUntilNextReset = getTimeUntilNextFreeReset(
    previousFreeSkillResetAt,
    now,
  );
  return timeUntilNextReset <= 0;
}

// Treats `skillPointsUsed` as 0 once the 180-day window has elapsed, so callers
// (cost computation, UI labels) see the auto-reset without having to wait for
// the next paid edit to actually persist it.
export function getEffectiveSkillPointsUsed(
  bumpkin: { skillPointsUsed?: number; previousFreeSkillResetAt?: number },
  now = Date.now(),
): number {
  if (canResetForFree(bumpkin.previousFreeSkillResetAt ?? 0, now)) return 0;
  return bumpkin.skillPointsUsed ?? 0;
}

const TICKET_ABSORPTION_POINTS = 200;

// Returns the gem cost + how many Skill Reset Tickets to auto-consume to absorb
// would-be-paid points (200 points absorbed per ticket, lowest-position first).
// Tickets are only consumed when the transaction actually has paid points;
// purely free removals (inside the natural free 200) don't burn a ticket.
export function getSkillEditCost(
  pointsRemoved: number,
  skillPointsUsed: number,
  ticketBalance: number,
): { gemCost: number; ticketsToUse: number } {
  if (pointsRemoved <= 0) return { gemCost: 0, ticketsToUse: 0 };

  const paidPoints =
    Math.max(0, skillPointsUsed + pointsRemoved - FREE_POINTS) -
    Math.max(0, skillPointsUsed - FREE_POINTS);

  if (paidPoints <= 0) return { gemCost: 0, ticketsToUse: 0 };

  const ticketsNeeded = Math.ceil(paidPoints / TICKET_ABSORPTION_POINTS);
  const ticketsToUse = Math.min(ticketBalance, ticketsNeeded);
  const absorbed = Math.min(
    paidPoints,
    ticketsToUse * TICKET_ABSORPTION_POINTS,
  );
  const remainingPaid = paidPoints - absorbed;

  if (remainingPaid <= 0) return { gemCost: 0, ticketsToUse };

  // Tickets absorb the lowest-position paid points, so the gem cost falls on
  // the highest-position tail of the transaction.
  const remainingPaidStart = Math.max(skillPointsUsed, FREE_POINTS) + absorbed;
  const gemCost = getGemCostForSkillPoints(remainingPaid, remainingPaidStart);

  return { gemCost, ticketsToUse };
}

// Shared by resetSkills and updateSkills so the two paths cannot drift in cost.
export function chargeSkillEdit({
  game,
  pointsRemoved,
  createdAt,
}: {
  game: Draft<GameState>;
  pointsRemoved: number;
  createdAt: number;
}) {
  const { bumpkin } = game;

  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  // Pure additions (no removals) are free of charge — there's nothing to
  // charge for, so don't burn a cooldown / ticket either.
  if (pointsRemoved <= 0) return;

  const { previousFreeSkillResetAt = 0 } = bumpkin;
  // Auto-reset: once the 180-day window has elapsed we treat history as 0,
  // and any paid edit also opens a fresh window by stamping previousFreeSkillResetAt.
  const windowExpired = canResetForFree(previousFreeSkillResetAt, createdAt);
  const skillPointsUsed = windowExpired ? 0 : (bumpkin.skillPointsUsed ?? 0);

  const ticketBalance = (
    game.inventory["Skill Reset Ticket"] ?? new Decimal(0)
  ).toNumber();
  const { gemCost, ticketsToUse } = getSkillEditCost(
    pointsRemoved,
    skillPointsUsed,
    ticketBalance,
  );

  if (gemCost > 0) {
    const gemBalance = game.inventory.Gem ?? new Decimal(0);
    if (gemBalance.lt(gemCost)) {
      throw new Error(`Not enough gems. Cost: ${gemCost} gems`);
    }
    game.inventory.Gem = gemBalance.minus(gemCost);
  }

  if (ticketsToUse > 0) {
    game.inventory["Skill Reset Ticket"] = (
      game.inventory["Skill Reset Ticket"] ?? new Decimal(0)
    ).minus(ticketsToUse);
  }

  bumpkin.skillPointsUsed = skillPointsUsed + pointsRemoved;
  if (windowExpired) bumpkin.previousFreeSkillResetAt = createdAt;
}

export function resetSkills({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const { bumpkin } = game;

    if (bumpkin == undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (getKeys(bumpkin.skills).length === 0) {
      throw new Error("You do not have any skills to reset");
    }

    chargeSkillEdit({
      game,
      pointsRemoved: getSkillPointsForSkills(bumpkin.skills),
      createdAt,
    });

    bumpkin.skills = {};

    populateSaltFarm({
      gameBefore: state,
      gameAfter: game,
      now: createdAt,
    });

    return game;
  });
}
