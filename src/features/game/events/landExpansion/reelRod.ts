import { getObjectEntries } from "features/game/expansion/lib/utils";
import { GameState } from "../../types/game";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import { getKeys } from "features/game/lib/crafting";

export type ReelRodAction = {
  type: "rod.reeled";
  location?: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ReelRodAction;
  createdAt?: number;
};

export function reelRod({ state }: Options): GameState {
  return produce(state, (game) => {
    if (!game.fishing.wharf.castedAt) {
      throw new Error("Nothing has been casted");
    }

    const caught = game.fishing.wharf.caught ?? {};
    getObjectEntries(caught).forEach(([name, amount]) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(amount ?? 0);
    });

    // Track farm activity
    getObjectEntries(caught).forEach(([itemName, amount]) => {
      game.farmActivity = trackFarmActivity(
        `${itemName} Caught`,
        game.farmActivity,
        new Decimal(amount ?? 0),
      );
    });

    const maps = game.fishing.wharf.maps;

    if (maps) {
      getKeys(maps).forEach((map) => {
        game.farmActivity = trackFarmActivity(
          `${map} Map Piece Found`,
          game.farmActivity,
          new Decimal(maps[map] ?? 0),
        );
      });
    }

    delete game.fishing.wharf.castedAt;
    delete game.fishing.wharf.caught;
    delete game.fishing.wharf.chum;
    delete game.fishing.wharf.multiplier;
    delete game.fishing.wharf.guaranteedCatch;
    delete game.fishing.wharf.maps;

    return game;
  });
}
