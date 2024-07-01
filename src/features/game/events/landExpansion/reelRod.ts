import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { FishingLocation } from "features/game/types/fishing";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type ReelRodAction = {
  type: "rod.reeled";
  location: FishingLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: ReelRodAction;
  createdAt?: number;
};

export function reelRod({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;
  const location = action.location;

  if (!game.fishing[location].castedAt) {
    throw new Error("Nothing has been casted");
  }

  const caught = game.fishing[location].caught ?? {};
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

  delete game.fishing[location].castedAt;
  delete game.fishing[location].caught;
  delete game.fishing[location].chum;

  return {
    ...game,
  };
}
