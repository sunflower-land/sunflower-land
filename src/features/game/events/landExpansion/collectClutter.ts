import Decimal from "decimal.js-light";
import { produce } from "immer";
import { GameState } from "features/game/types/game";
import { ClutterName, FARM_GARBAGE } from "features/game/types/clutter";
import { getKeys } from "features/game/lib/crafting";

export type CollectClutterAction = {
  type: "clutter.collected";
  id: string;
  clutterType: ClutterName;
  visitedFarmId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectClutterAction;
  createdAt?: number;
  visitorState?: GameState;
};

export function getCollectedGarbage({
  game,
  farmId,
}: {
  game: GameState;
  farmId: number;
}) {
  const dailyCollections = game.socialFarming?.dailyCollections;

  if (!dailyCollections) {
    return 0;
  }

  const totalCollectedForFarm = getKeys(
    dailyCollections[farmId]?.clutter ?? {},
  ).filter(
    (id) => dailyCollections[farmId]?.clutter[id].type in FARM_GARBAGE,
  ).length;

  return totalCollectedForFarm;
}

export const TRASH_BIN_FARM_LIMIT = 5;
export const TRASH_BIN_DAILY_LIMIT = 30;

export function collectClutter({
  state,
  action,
  visitorState,
  createdAt = Date.now(),
}: Options): [GameState, GameState] {
  return produce([state, visitorState!], ([game, visitorGame]) => {
    let dailyCollections = visitorGame?.socialFarming
      ?.dailyCollections as GameState["socialFarming"]["dailyCollections"];

    if (!dailyCollections) {
      dailyCollections = {};
    }

    if (!dailyCollections[action.visitedFarmId]?.clutter) {
      dailyCollections[action.visitedFarmId] = {
        clutter: {},
      };
    }

    dailyCollections[action.visitedFarmId].clutter[action.id] = {
      collectedAt: createdAt,
      type: action.clutterType,
    };

    const clutters = game.socialFarming?.clutter?.locations;

    if (!clutters || !clutters[action.id]) {
      throw new Error("No clutter found");
    }

    delete clutters[action.id];
    visitorGame.socialFarming.dailyCollections = dailyCollections;

    visitorGame.inventory[action.clutterType] = (
      visitorGame.inventory[action.clutterType] ?? new Decimal(0)
    ).plus(1);
  });
}
