import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type InstantCookRecipe = {
  type: "recipe.instantCooked";
  buildingId: string;
  buildingName: BuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: InstantCookRecipe;
  createdAt?: number;
};

const SECONDS_TO_GEMS = {
  60: 1,
  [5 * 60]: 2,
  [10 * 60]: 3,
  [30 * 60]: 4,
  [60 * 60]: 5,
  [2 * 60 * 60]: 8,
  [4 * 60 * 60]: 10,
  [6 * 60 * 60]: 12,
  [12 * 60 * 60]: 14,
  [24 * 60 * 60]: 16,
  [36 * 60 * 60]: 18,
  [48 * 60 * 60]: 20,
};

export function getInstantGems({
  readyAt,
  now = Date.now(),
}: {
  readyAt: number;
  now?: number;
}) {
  const secondsLeft = (readyAt - now) / 1000;

  const thresholds = getKeys(SECONDS_TO_GEMS);
  for (let i = 0; i < thresholds.length; i++) {
    if (thresholds[i] >= secondsLeft) {
      return SECONDS_TO_GEMS[thresholds[i]];
    }
  }

  return 100;
}

export function instantCook({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const building = game.buildings[action.buildingName]?.find(
      (b) => b.id === action.buildingId,
    );

    if (!building) {
      throw new Error("Building does not exist");
    }

    const recipe = building.crafting;
    if (!recipe) {
      throw new Error("Nothing is cooking");
    }

    if (createdAt > recipe.readyAt) {
      throw new Error("Already cooked");
    }

    const gems = getInstantGems({ readyAt: recipe.readyAt, now: createdAt });

    if (!game.inventory["Gem"]?.gte(gems)) {
      throw new Error("Insufficient gems");
    }

    game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(gems);

    game.inventory[recipe.name] = (
      game.inventory[recipe.name] ?? new Decimal(0)
    ).add(1);

    delete building.crafting;

    return game;
  });
}
