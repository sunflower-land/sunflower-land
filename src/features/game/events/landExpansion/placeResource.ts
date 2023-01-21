import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";

export type PlaceResourceAction = {
  type: "resource.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceResourceAction;
  createdAt?: number;
};

export const RESOURCE_FIELDS: Record<
  ResourceName,
  keyof GameState["resources"]
> = {
  "Crop Plot": "plots",
  "Gold Rock": "gold",
  "Iron Rock": "iron",
  "Stone Rock": "stones",
  Tree: "trees",
  "Fruit Patch": "fruitPatches",
  Boulder: "boulders",
};

function getInitialResource(name: ResourceName) {
  if (name === "Tree") {
    return {
      wood: {
        choppedAt: 0,
        amount: 0,
      },
    };
  }

  if (name === "Crop Plot") {
    return {
      crop: undefined,
    };
  }

  return {
    stone: {
      amount: 1,
      minedAt: 0,
    },
  };
}
export function placeResource({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  console.log("Place resource!", action);
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  // TODO - assert they have a spare item

  const fieldName = RESOURCE_FIELDS[action.name];

  // TODO
  bumpkin.activity = trackActivity("Collectible Placed", bumpkin.activity);

  const previous = stateCopy.resources[fieldName];
  const newGame = {
    ...stateCopy,
    resources: {
      ...stateCopy.resources,
      [fieldName]: {
        ...previous,
        [action.id as unknown as number]: {
          createdAt: createdAt,
          x: action.coordinates.x,
          y: action.coordinates.y,
          ...RESOURCE_DIMENSIONS[action.name],
          ...getInitialResource(action.name),
        },
      },
    },
  };

  console.log({ newGame });

  return newGame;
}
