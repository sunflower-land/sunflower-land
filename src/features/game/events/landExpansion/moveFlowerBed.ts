import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
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

    flowerBed.x = action.coordinates.x;
    flowerBed.y = action.coordinates.y;

    return stateCopy;
  });
}
