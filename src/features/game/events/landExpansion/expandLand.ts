import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";

import cloneDeep from "lodash.clonedeep";

export type ExpandLandAction = {
  type: "land.expanded";
  farmId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: ExpandLandAction;
  createdAt?: number;
};

export function expandLand({ state, action, createdAt = Date.now() }: Options) {
  const game = cloneDeep(state) as GameState;
  const bumpkin = game.bumpkin;

  if (!game.expansionRequirements) {
    throw new Error("No more land expansions available");
  }

  const previousExpansion = game.expansions[game.expansions.length - 1];
  if (previousExpansion.readyAt > createdAt) {
    throw new Error("Player is expanding");
  }

  const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);
  if (bumpkinLevel < game.expansionRequirements.bumpkinLevel) {
    throw new Error("Insufficient Bumpkin Level");
  }

  const inventory = getKeys(game.expansionRequirements.resources).reduce(
    (inventory, ingredientName) => {
      const count = game.inventory[ingredientName] || new Decimal(0);
      const totalAmount =
        game.expansionRequirements?.resources[ingredientName] || new Decimal(0);

      if (count.lessThan(totalAmount)) {
        throw new Error(`Insufficient ingredient: ${ingredientName}`);
      }

      return {
        ...inventory,
        [ingredientName]: count.sub(totalAmount),
      };
    },
    game.inventory
  );

  inventory["Basic Land"] = (inventory["Basic Land"] ?? new Decimal(0)).add(1);

  game.expansions = [
    ...game.expansions,
    {
      createdAt,
      readyAt: createdAt + game.expansionRequirements.seconds * 1000,
    },
  ];

  return {
    ...game,
    inventory,
  };
}
