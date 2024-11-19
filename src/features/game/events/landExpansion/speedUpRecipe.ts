import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type InstantCookRecipe = {
  type: "recipe.spedUp";
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
  [4 * 60 * 60]: 14,
  [6 * 60 * 60]: 20,
  [12 * 60 * 60]: 25,
  [24 * 60 * 60]: 40,
  [36 * 60 * 60]: 60,
  [48 * 60 * 60]: 80,
  [72 * 60 * 60]: 110,
  [96 * 60 * 60]: 140,
};

export function getInstantGems({
  readyAt,
  now = Date.now(),
  game,
}: {
  readyAt: number;
  now?: number;
  game: GameState;
}) {
  const secondsLeft = (readyAt - now) / 1000;

  const thresholds = getKeys(SECONDS_TO_GEMS);

  let gems = 100;

  for (let i = 0; i < thresholds.length; i++) {
    if (thresholds[i] >= secondsLeft) {
      gems = SECONDS_TO_GEMS[thresholds[i]];
      break;
    }
  }

  const today = new Date(now).toISOString().substring(0, 10);
  const gemsSpentToday = game.gems.history?.[today]?.spent ?? 0;

  if (gemsSpentToday >= 100) {
    const multiplier = Math.floor(gemsSpentToday / 100);
    gems += Math.floor(0.2 * multiplier * gems);
  }

  return gems;
}

export function makeGemHistory({
  game,
  amount,
}: {
  game: GameState;
  amount: number;
}): GameState {
  const today = new Date().toISOString().substring(0, 10);

  game.gems.history = game.gems.history ?? {};

  // Remove other dates
  game.gems.history = {
    [today]: {
      spent: (game.gems.history[today]?.spent ?? 0) + amount,
    },
  };

  return game;
}

export function speedUpRecipe({
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

    const gems = getInstantGems({
      readyAt: recipe.readyAt,
      now: createdAt,
      game,
    });

    if (!game.inventory["Gem"]?.gte(gems)) {
      throw new Error("Insufficient gems");
    }

    game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(gems);

    game.inventory[recipe.name] = (
      game.inventory[recipe.name] ?? new Decimal(0)
    ).add(1);

    delete building.crafting;

    game = makeGemHistory({ game, amount: gems });

    return game;
  });
}
