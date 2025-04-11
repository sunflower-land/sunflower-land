import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { GameState } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";

export type MoveFlowerBedAction = {
  type: "flowerBed.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveFlowerBedAction;
  createdAt?: number;
};

export function moveFlowerBed({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const flowerBed = stateCopy.flowers.flowerBeds[action.id];

    if (!flowerBed) {
      throw new Error(translate("harvestflower.noFlowerBed"));
    }

    const dimensions = RESOURCE_DIMENSIONS["Flower Bed"];
    const collides = detectCollision({
      state: stateCopy,
      name: "Flower Bed",
      location: "farm",
      position: {
        x: action.coordinates.x,
        y: action.coordinates.y,
        height: dimensions.height,
        width: dimensions.width,
      },
      ignore: {
        x: flowerBed.x,
        y: flowerBed.y,
        width: dimensions.width,
        height: dimensions.height,
      },
    });

    if (collides) {
      throw new Error("Flower Bed collides");
    }

    flowerBed.x = action.coordinates.x;
    flowerBed.y = action.coordinates.y;

    return stateCopy;
  });
}
