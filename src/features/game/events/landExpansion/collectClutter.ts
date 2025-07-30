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
};

export function collectClutter({ state, action }: Options) {
  // game state is the farm that is being visited
  return produce(state, (game) => {
    const clutters = game.socialFarming?.clutter?.locations;

    if (!clutters || !clutters[action.id]) {
      throw new Error("No clutter found");
    }

    delete clutters[action.id];
  });
}
