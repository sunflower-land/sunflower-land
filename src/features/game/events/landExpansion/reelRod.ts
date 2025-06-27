import { GameState } from "../../types/game";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";

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
    getKeys(caught).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(caught[name] ?? 0);
    });

    // Track farm activity
    getKeys(caught).forEach((itemName) => {
      game.farmActivity = trackFarmActivity(
        `${itemName} Caught`,
        game.farmActivity,
        caught[itemName],
      );
    });

    delete game.fishing.wharf.castedAt;
    delete game.fishing.wharf.caught;
    delete game.fishing.wharf.chum;

    return game;
  });
}
