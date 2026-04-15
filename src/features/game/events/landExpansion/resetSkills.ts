import { getKeys } from "lib/object";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type PaymentType = "gems" | "free";

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

// 180 days in milliseconds
export const RESET_PERIOD_MS = 180 * 24 * 60 * 60 * 1000;

export function getTimeUntilNextFreeReset(
  previousFreeSkillResetAt: number,
  now: number,
) {
  // Calculate next reset time by adding reset period
  const nextResetTime = previousFreeSkillResetAt + RESET_PERIOD_MS;

  // Calculate time remaining
  const timeRemaining = nextResetTime - now;
  return timeRemaining;
}

export function canResetForFree(
  previousFreeSkillResetAt: number,
  freeSkillResets: number,
  now: number,
) {
  if (freeSkillResets >= 1) {
    return true;
  }
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
      freeSkillResets = 0,
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

    if (action.paymentType === "free") {
      if (
        !canResetForFree(previousFreeSkillResetAt, freeSkillResets, createdAt)
      ) {
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
      bumpkin.freeSkillResets = Math.max(0, freeSkillResets - 1);
      bumpkin.previousFreeSkillResetAt = createdAt;
    } else {
      const gemCost = getGemCost(paidSkillResets);

      if (game.inventory.Gem?.lt(gemCost)) {
        throw new Error(`Not enough gems. Cost: ${gemCost} gems`);
      }

      game.inventory.Gem = game.inventory.Gem?.minus(gemCost);
      bumpkin.paidSkillResets = paidSkillResets + 1;
    }

    bumpkin.skills = {};

    return game;
  });
}
