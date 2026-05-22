import { getKeys } from "lib/object";
import type { GameState } from "features/game/types/game";
import { produce, Draft } from "immer";
import Decimal from "decimal.js-light";
import { populateSaltFarm } from "features/game/types/salt";
import { getSkillPointsForSkills } from "./choseSkill";

export type PaymentType = "gems" | "free" | "ticket";

export type ResetSkillsAction = {
  type: "skills.reset";
  paymentType: PaymentType;
};

type Options = {
  state: Readonly<GameState>;
  action: ResetSkillsAction;
  createdAt?: number;
};

// Cost ramp: 1 gem/point at 0–199 history, doubles every 200 points used
// (200–399 → 2, 400–599 → 4, …). Transactions that span a boundary pay
// split-rate.
const POINTS_PER_TIER = 200;

export const getGemCostForSkillPoints = (
  pointsRemoved: number,
  skillPointsUsed: number,
): number => {
  let cost = 0;
  let remaining = pointsRemoved;
  let history = skillPointsUsed;

  while (remaining > 0) {
    const tierEnd =
      (Math.floor(history / POINTS_PER_TIER) + 1) * POINTS_PER_TIER;
    const inTier = Math.min(remaining, tierEnd - history);
    const rate = Math.pow(2, Math.floor(history / POINTS_PER_TIER));
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

// Shared by resetSkills and updateSkills so the two paths cannot drift in cost.
export function chargeSkillEdit({
  game,
  paymentType,
  pointsRemoved,
  createdAt,
}: {
  game: Draft<GameState>;
  paymentType: PaymentType;
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

  const { skillPointsUsed = 0, previousFreeSkillResetAt = 0 } = bumpkin;

  switch (paymentType) {
    case "free": {
      if (!canResetForFree(previousFreeSkillResetAt, createdAt)) {
        const timeToNextFreeResetInMilliseconds = getTimeUntilNextFreeReset(
          previousFreeSkillResetAt,
          createdAt,
        );
        const daysRemaining = Math.ceil(
          timeToNextFreeResetInMilliseconds / (24 * 60 * 60 * 1000),
        );
        throw new Error(
          `Wait ${daysRemaining} more days for free reset or use gems`,
        );
      }

      bumpkin.skillPointsUsed = 0;
      bumpkin.previousFreeSkillResetAt = createdAt;
      break;
    }
    case "gems": {
      const gemCost = getGemCostForSkillPoints(pointsRemoved, skillPointsUsed);
      const gemBalance = game.inventory.Gem ?? new Decimal(0);

      if (gemBalance.lt(gemCost)) {
        throw new Error(`Not enough gems. Cost: ${gemCost} gems`);
      }

      game.inventory.Gem = gemBalance.minus(gemCost);
      bumpkin.skillPointsUsed = skillPointsUsed + pointsRemoved;
      break;
    }
    case "ticket": {
      const ticketBalance =
        game.inventory["Skill Reset Ticket"] ?? new Decimal(0);

      if (ticketBalance.lt(1)) {
        throw new Error("You do not have a Skill Reset Ticket");
      }

      game.inventory["Skill Reset Ticket"] = ticketBalance.minus(1);
      bumpkin.skillPointsUsed = skillPointsUsed + pointsRemoved;
      break;
    }
    default: {
      const _exhaustive: never = paymentType;
      throw new Error(`Unknown payment type: ${_exhaustive}`);
    }
  }
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
      paymentType: action.paymentType,
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
