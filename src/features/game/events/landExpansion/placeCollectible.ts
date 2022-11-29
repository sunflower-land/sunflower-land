import cloneDeep from "lodash.clonedeep";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "../../types/craftables";
import { GameState, PlacedItem } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";

// TODO
export const COLLECTIBLE_PLACE_SECONDS: Partial<
  Record<CollectibleName, number>
> = {
  "Foreman Beaver": 60 * 60 * 8,
  Kuebiko: 60 * 60 * 24,
  Scarecrow: 5 * 60,
};

export type PlaceCollectibleAction = {
  type: "collectible.placed";
  name: CollectibleName;
  id: string;
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
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;
  const collectible = action.name;
  const collectibleItems = stateCopy.collectibles[collectible];
  const inventoryItemBalance = stateCopy.inventory[collectible];

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
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

  const placed = stateCopy.collectibles[action.name] || [];
  const seconds = COLLECTIBLE_PLACE_SECONDS[action.name] ?? 0;
  const newCollectiblePlacement: PlacedItem = {
    id: action.id,
    createdAt: createdAt,
    coordinates: action.coordinates,
    readyAt: createdAt + seconds * 1000,
  };

  bumpkin.activity = trackActivity("Collectible Placed", bumpkin.activity);

  return {
    ...stateCopy,
    collectibles: {
      ...stateCopy.collectibles,
      [collectible]: [...placed, newCollectiblePlacement],
    },
  };
}
