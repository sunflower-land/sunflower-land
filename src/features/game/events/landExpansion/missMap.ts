import { produce } from "immer";
import { GameState } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type MissMapAction = {
  type: "map.missed";
};

type Options = {
  state: Readonly<GameState>;
  action: MissMapAction;
  createdAt?: number;
};

export function missMap({ state, createdAt = Date.now() }: Options): GameState {
  return produce(state, (game) => {
    if (!game.fishing.wharf.castedAt) {
      throw new Error("Nothing has been casted");
    }

    if (!game.fishing.wharf.maps) {
      throw new Error("No maps have been found");
    }

    if (isCollectibleBuilt({ game, name: "Anemone Flower" })) {
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: [{ name: "Anemone Flower", value: "+1 Attempt" }],
        createdAt,
      });
    }

    delete game.fishing.wharf.maps;

    // Add activity
    game.farmActivity = trackFarmActivity("Map Missed", game.farmActivity);
  });
}
