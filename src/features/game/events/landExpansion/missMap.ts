import { produce } from "immer";
import { GameState } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type MissMapAction = {
  type: "map.missed";
};

type Options = {
  state: Readonly<GameState>;
  action: MissMapAction;
  createdAt?: number;
};

export function missMap({ state }: Options): GameState {
  return produce(state, (game) => {
    if (!game.fishing.wharf.castedAt) {
      throw new Error("Nothing has been casted");
    }

    if (!game.fishing.wharf.maps) {
      throw new Error("No maps have been found");
    }

    delete game.fishing.wharf.maps;

    // Add activity
    game.farmActivity = trackFarmActivity("Map Missed", game.farmActivity);
  });
}
