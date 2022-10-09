import cloneDeep from "lodash.clonedeep";
import { GameState, PlacedItem } from "features/game/types/game";
import { RandomID } from "lib/images";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  DecorationName,
  DECORATION_DIMENSIONS,
} from "features/game/types/decorations";

export type PlaceDecorationAction = {
  type: "decoration.placed";
  name: DecorationName;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceDecorationAction;
  createdAt?: number;
};

export function placeDecoration({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;
  const decoration = action.name;
  const decorationItems = stateCopy.decorations[decoration];
  const inventoryItemBalance = stateCopy.inventory[decoration];

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!inventoryItemBalance) {
    throw new Error("You can't place an item that is not on the inventory");
  }

  if (
    decorationItems &&
    inventoryItemBalance?.lessThanOrEqualTo(decorationItems.length)
  ) {
    throw new Error("This decoration is already placed");
  }

  if (!(decoration in DECORATION_DIMENSIONS)) {
    throw new Error("You cannot place this item");
  }

  const placed = stateCopy.decorations[action.name] || [];
  const newDecorationPlacement: PlacedItem = {
    createdAt: createdAt,
    coordinates: action.coordinates,
    readyAt: createdAt + 5 * 60 * 1000,
    id: RandomID(),
  };

  bumpkin.activity = trackActivity("Decoration Placed", bumpkin.activity);

  return {
    ...stateCopy,
    decorations: {
      ...stateCopy.decorations,
      [decoration]: [...placed, newDecorationPlacement],
    },
  };
}
