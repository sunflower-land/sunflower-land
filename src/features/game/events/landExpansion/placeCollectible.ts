import cloneDeep from "lodash.clonedeep";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "../../types/craftables";
import { GameState, Collectible } from "../../types/game";

export type PlaceCollectibleAction = {
  type: "collectible.placed";
  name: CollectibleName;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceCollectibleAction;
  createdAt?: number;
};

export function placeCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  console.log({ state });
  const stateCopy = cloneDeep(state);
  console.log({ collectible: action.name });
  const collectible = action.name;
  const collectibleItems = stateCopy.collectibles[collectible];
  const inventoryItemBalance = stateCopy.inventory[collectible];

  if (!inventoryItemBalance) {
    throw new Error("You can't place an item that is not on the inventory");
  }

  if (
    collectibleItems &&
    inventoryItemBalance?.lessThanOrEqualTo(collectibleItems.length)
  ) {
    throw new Error("This collectible is already placed");
  }

  if (!(collectible in COLLECTIBLES_DIMENSIONS)) {
    throw new Error("You cannot place this item");
  }

  const placed = stateCopy.collectibles[action.name] || [];
  const newCollectiblePlacement: Omit<Collectible, "id"> = {
    createdAt: createdAt,
    coordinates: action.coordinates,
    readyAt: createdAt + 5 * 60 * 1000,
  };

  return {
    ...stateCopy,
    collectibles: {
      ...stateCopy.collectibles,
      [collectible]: [...placed, newCollectiblePlacement],
    },
  };
}
