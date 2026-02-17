import { produce } from "immer";
import { GameState } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { FISH_DIFFICULTY } from "features/game/types/fishing";
import { getKeys } from "features/game/lib/crafting";

export type MissFishAction = {
  type: "fish.missed";
  location?: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MissFishAction;
  createdAt?: number;
};

export function missFish({ state }: Options): GameState {
  return produce(state, (game) => {
    if (!game.fishing.wharf.castedAt) {
      throw new Error("Nothing has been casted");
    }

    const currentCatch = game.fishing.wharf.caught;

    if (currentCatch) {
      getKeys(currentCatch).forEach((name) => {
        if (name in FISH_DIFFICULTY) {
          delete currentCatch[name];
        }
      });

      if (Object.keys(currentCatch).length === 0) {
        delete game.fishing.wharf.castedAt;
        delete game.fishing.wharf.caught;
        delete game.fishing.wharf.chum;
        delete game.fishing.wharf.multiplier;
        delete game.fishing.wharf.guaranteedCatch;
        delete game.fishing.wharf.maps;
      }
    }

    // Add activity
    game.farmActivity = trackFarmActivity("Fish Missed", game.farmActivity);
  });
}
