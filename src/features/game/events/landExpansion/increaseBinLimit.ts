import { produce } from "immer";
import { GameState, Inventory } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { TRASH_BIN_DAILY_LIMIT } from "./collectClutter";

export type IncreaseBinLimitAction = {
  type: "binLimit.increased";
};

type Options = {
  state: Readonly<GameState>;
  action: IncreaseBinLimitAction;
  createdAt?: number;
  visitorState?: GameState;
};

export const BIN_LIMIT_INCREASE = 30;

export const BIN_LIMIT_COST: Inventory = {
  Iron: new Decimal(3),
  Leather: new Decimal(3),
  Feather: new Decimal(10),
};

export function getBinLimit({
  game,
  now = new Date(),
}: {
  game: GameState;
  now?: Date;
}) {
  const limit = TRASH_BIN_DAILY_LIMIT;

  // Get all the increases for the current UTC date
  const increases = game.socialFarming.binIncrease?.boughtAt.filter(
    (date) =>
      new Date(date).toISOString().split("T")[0] ===
      now.toISOString().split("T")[0],
  );

  return limit + (increases?.length ?? 0) * BIN_LIMIT_INCREASE;
}

export function increaseBinLimit({
  state,
  visitorState,
  createdAt = Date.now(),
}: Options) {
  return produce([state, visitorState!], ([game, visitorGame]) => {
    // Subtract resources
    Object.entries(BIN_LIMIT_COST).forEach(([resource, cost]) => {
      const amount =
        visitorGame!.inventory[resource as keyof Inventory] ?? new Decimal(0);

      if (cost.gt(amount)) {
        throw new Error(`Not enough ${resource} to increase bin limit`);
      }

      visitorGame!.inventory[resource as keyof Inventory] = amount.minus(cost);
    });

    let binLimits = visitorGame?.socialFarming.binIncrease?.boughtAt ?? [];
    binLimits.push(createdAt);

    // Filter out any bin limits from previous days
    const today = new Date().toISOString().split("T")[0];
    binLimits = binLimits.filter(
      (date) => new Date(date).toISOString().split("T")[0] === today,
    );

    visitorGame!.socialFarming.binIncrease = {
      boughtAt: binLimits,
    };
  });
}
