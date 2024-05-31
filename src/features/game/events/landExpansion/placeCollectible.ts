import cloneDeep from "lodash.clonedeep";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "../../types/craftables";
import { GameState, PlacedItem } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CollectibleLocation } from "features/game/types/collectibles";

export type PlaceCollectibleAction = {
  type: "collectible.placed";
  name: CollectibleName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
  location: CollectibleLocation;
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
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;
  const collectible = action.name;

  let collectibleItems =
    action.location === "home"
      ? stateCopy.home.collectibles[action.name]
      : stateCopy.collectibles[action.name];

  if (!collectibleItems) {
    collectibleItems = [];
  }

  const inventoryItemBalance = stateCopy.inventory[collectible];

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

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

  const newCollectiblePlacement: PlacedItem = {
    id: action.id,
    createdAt: createdAt,
    coordinates: action.coordinates,
    readyAt: createdAt,
  };

  bumpkin.activity = trackActivity("Collectible Placed", bumpkin.activity);

  collectibleItems.push(newCollectiblePlacement);

  // Update stateCopy with the new collectibleItems
  if (action.location === "home") {
    stateCopy.home.collectibles[action.name] = collectibleItems;
  } else {
    stateCopy.collectibles[action.name] = collectibleItems;
  }

  return {
    ...stateCopy,
  };
}
