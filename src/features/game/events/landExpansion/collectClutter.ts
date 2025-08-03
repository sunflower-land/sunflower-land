import Decimal from "decimal.js-light";
import { produce } from "immer";
import { GameState } from "features/game/types/game";
import { ClutterName } from "features/game/types/clutter";

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
