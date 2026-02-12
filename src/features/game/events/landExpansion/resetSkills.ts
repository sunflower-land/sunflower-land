import { getKeys } from "features/game/types/decorations";
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
    const { bumpkin, buildings } = game;
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

    if (action.paymentType === "free") {
      // If trying to do free reset before 4 months
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

      // Reset paid resets counter since 4 months have passed
      bumpkin.paidSkillResets = 0;
    }

    // Handle gem reset
    if (action.paymentType === "gems") {
      const gemCost = getGemCost(paidSkillResets);

      if (game.inventory.Gem?.lt(gemCost)) {
        throw new Error(`Not enough gems. Cost: ${gemCost} gems`);
      }

      // Deduct gems
      game.inventory.Gem = game.inventory.Gem?.minus(gemCost);
      // Increment paid resets counter
      bumpkin.paidSkillResets = paidSkillResets + 1;
    }

    // Reset skills
    bumpkin.skills = {};

    // Update last free reset timestamp only for free resets
    if (action.paymentType === "free") {
      bumpkin.previousFreeSkillResetAt = createdAt;
    }

    return game;
  });
}
