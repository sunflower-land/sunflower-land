import { getKeys } from "lib/object";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import Decimal from "decimal.js-light";
import { populateSaltFarm } from "features/game/types/salt";
import { hasFeatureAccess } from "lib/flags";

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

export function resetSkills({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const { bumpkin } = game;
    const {
      paidSkillResets = 0,
      previousFreeSkillResetAt = 0,
      skills,
    } = bumpkin;

    // Check if bumpkin exists
    if (bumpkin == undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    // Check if bumpkin has any skills
    if (getKeys(skills).length === 0) {
      throw new Error("You do not have any skills to reset");
    }

    const { paymentType } = action;
    let didPaidReset = false;

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

        if (game.inventory.Gem?.lt(gemCost)) {
          throw new Error(`Not enough gems. Cost: ${gemCost} gems`);
        }

        game.inventory.Gem = game.inventory.Gem?.minus(gemCost);
        didPaidReset = true;
        break;
      }
      case "ticket": {
        const ticketBalance =
          game.inventory["Skill Reset Ticket"] ?? new Decimal(0);

        if (ticketBalance.lt(1)) {
          throw new Error("You do not have a Skill Reset Ticket");
        }

        game.inventory["Skill Reset Ticket"] = ticketBalance.minus(1);
        didPaidReset = true;
        break;
      }
      default: {
        const _exhaustive: never = paymentType;
        throw new Error(`Unknown payment type: ${_exhaustive}`);
      }
    }

    if (didPaidReset) {
      bumpkin.paidSkillResets = paidSkillResets + 1;
    }

    bumpkin.skills = {};

    if (hasFeatureAccess(game, "SALT_FARM")) {
      populateSaltFarm({
        gameBefore: state,
        gameAfter: game,
        now: createdAt,
      });
    }

    return game;
  });
}
