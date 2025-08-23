import { produce } from "immer";
import Decimal from "decimal.js-light";
import { GameState, Inventory } from "features/game/types/game";
import { getKeys } from "features/game/lib/crafting";
import {
  LOVE_CHARM_MONUMENTS,
  REQUIRED_CHEERS,
  MEGASTORE_MONUMENTS,
} from "features/game/types/monuments";

export type IncreaseHelpLimitAction = {
  type: "helpLimit.increased";
};

type Options = {
  state: Readonly<GameState>;
  action: IncreaseHelpLimitAction;
  createdAt?: number;
  visitorState?: GameState;
};

export const HELP_LIMIT_COST: Inventory = {
  Iron: new Decimal(1),
  Wool: new Decimal(3),
  Feather: new Decimal(3),
};

export const HELP_LIMIT = 5;

export function getHelpLimit({
  game,
  now = new Date(),
}: {
  game: GameState;
  now?: Date;
}) {
  let limit = HELP_LIMIT;

  const monuments = {
    ...LOVE_CHARM_MONUMENTS,
    ...MEGASTORE_MONUMENTS,
  };

  getKeys(monuments).forEach((monument) => {
    if (
      (game.socialFarming.villageProjects?.[monument]?.cheers ?? 0) >=
      REQUIRED_CHEERS[monument]
    ) {
      limit += 1;
    }
  });

  // Get all the increases for the current UTC date
  const increases =
    game.socialFarming?.helpIncrease?.boughtAt.filter(
      (date) =>
        new Date(date).toISOString().split("T")[0] ===
        now.toISOString().split("T")[0],
    )?.length ?? 0;

  return limit + increases;
}

export function increaseHelpLimit({
  state,
  visitorState,
  createdAt = Date.now(),
}: Options): [GameState, GameState] {
  return produce([state, visitorState!], ([game, visitorGame]) => {
    // Subtract resources
    Object.entries(HELP_LIMIT_COST).forEach(([resource, cost]) => {
      const amount =
        visitorGame!.inventory[resource as keyof Inventory] ?? new Decimal(0);
      if (cost.gt(amount)) {
        throw new Error(`Not enough ${resource} to increase help limit`);
      }

      visitorGame!.inventory[resource as keyof Inventory] = amount.minus(cost);
    });

    let helpLimits = visitorGame.socialFarming.helpIncrease?.boughtAt ?? [];
    helpLimits.push(createdAt);

    // Filter out any help limits from previous days
    const today = new Date().toISOString().split("T")[0];

    helpLimits = helpLimits.filter(
      (date) => new Date(date).toISOString().split("T")[0] === today,
    );

    visitorGame.socialFarming.helpIncrease = {
      boughtAt: helpLimits,
    };
  });
}

export function hasHitHelpLimit({
  game,
  totalHelpedToday,
}: {
  game: GameState;
  totalHelpedToday: number;
}) {
  return totalHelpedToday >= getHelpLimit({ game });
}
