import { getKeys } from "lib/object";
import type { GameState } from "features/game/types/game";
import { produce, Draft } from "immer";
import Decimal from "decimal.js-light";
import { populateSaltFarm } from "features/game/types/salt";

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

export const getGemCost = (paidSkillResets: number) =>
  200 * Math.pow(2, paidSkillResets);

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
  createdAt,
}: {
  game: Draft<GameState>;
  paymentType: PaymentType;
  createdAt: number;
}) {
  const { bumpkin } = game;

  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  const { paidSkillResets = 0, previousFreeSkillResetAt = 0 } = bumpkin;

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

      bumpkin.paidSkillResets = 0;
      bumpkin.previousFreeSkillResetAt = createdAt;
      break;
    }
    case "gems": {
      const gemCost = getGemCost(paidSkillResets);
      const gemBalance = game.inventory.Gem ?? new Decimal(0);

      if (gemBalance.lt(gemCost)) {
        throw new Error(`Not enough gems. Cost: ${gemCost} gems`);
      }

      game.inventory.Gem = gemBalance.minus(gemCost);
      bumpkin.paidSkillResets = paidSkillResets + 1;
      break;
    }
    case "ticket": {
      const ticketBalance =
        game.inventory["Skill Reset Ticket"] ?? new Decimal(0);

      if (ticketBalance.lt(1)) {
        throw new Error("You do not have a Skill Reset Ticket");
      }

      game.inventory["Skill Reset Ticket"] = ticketBalance.minus(1);
      bumpkin.paidSkillResets = paidSkillResets + 1;
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

    chargeSkillEdit({ game, paymentType: action.paymentType, createdAt });

    bumpkin.skills = {};

    populateSaltFarm({
      gameBefore: state,
      gameAfter: game,
      now: createdAt,
    });

    return game;
  });
}
