import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
import { CollectibleName } from "features/game/types/craftables";
import { CollectibleLocation } from "features/game/types/collectibles";
import Decimal from "decimal.js-light";

export type BurnCollectibleAction = {
  type: "collectible.burned";
  name: CollectibleName;
  location: CollectibleLocation;
  id: string;
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

  let collectibleGroup =
    action.location === "home"
      ? stateCopy.home.collectibles[action.name]
      : stateCopy.collectibles[action.name];

  if (!collectibleGroup) {
    throw new Error("Invalid collectible");
  }

  const collectibleToRemove = collectibleGroup.find(
    (collectible) => collectible.id === action.id,
  );

  if (!collectibleToRemove) {
    throw new Error("Collectible does not exist");
  }

  collectibleGroup = collectibleGroup.filter(
    (collectible) => collectible.id !== collectibleToRemove.id,
  );

  if (collectibleGroup.length === 0) {
    if (action.location === "home") {
      delete stateCopy.home.collectibles[action.name];
    }

    if (action.location === "farm") {
      delete stateCopy.collectibles[action.name];
    }
  } else {
    if (action.location === "home") {
      stateCopy.home.collectibles[action.name] = collectibleGroup;
    }

    if (action.location === "farm") {
      stateCopy.collectibles[action.name] = collectibleGroup;
    }
  }

  const previous = stateCopy.inventory[action.name] || new Decimal(0);
  stateCopy.inventory[action.name] = previous.sub(1);

  return stateCopy;
}
