import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
import { CollectibleName } from "features/game/types/craftables";

export type BurnCollectibleAction = {
  type: "collectible.burned";
  name: CollectibleName;
};

type Options = {
  state: Readonly<GameState>;
  action: BurnCollectibleAction;
  createdAt?: number;
};

export function burnCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);

  if (action.name !== "Time Warp Totem") {
    throw new Error(`Cannot burn ${action.name}`);
  }

  delete stateCopy.collectibles[action.name];
  delete stateCopy.inventory[action.name];

  return stateCopy;
}
