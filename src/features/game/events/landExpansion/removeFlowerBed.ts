import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { updateBeehives } from "features/game/lib/updateBeehives";

export enum REMOVE_FLOWER_BED_ERRORS {
  FLOWER_BED_NOT_FOUND = "Flower bed not found",
  FLOWER_BED_NOT_PLACED = "Flower bed not placed",
}

export type RemoveFlowerBedAction = {
  type: "flowerBed.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveFlowerBedAction;
  createdAt?: number;
};

export function removeFlowerBed({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (copy) => {
    const { flowers } = copy;
    const flowerBed = flowers.flowerBeds[action.id];
    if (!flowerBed) {
      throw new Error(REMOVE_FLOWER_BED_ERRORS.FLOWER_BED_NOT_FOUND);
    }

    if (flowerBed.x === undefined || flowerBed.y === undefined) {
      throw new Error(REMOVE_FLOWER_BED_ERRORS.FLOWER_BED_NOT_PLACED);
    }

    delete flowerBed.x;
    delete flowerBed.y;
    flowerBed.removedAt = createdAt;

    const attachedBeehive = Object.values(copy.beehives).find((beehive) =>
      beehive.flowers.some((flower) => flower.id === action.id),
    );

    if (attachedBeehive) {
      attachedBeehive.flowers = attachedBeehive.flowers.filter(
        (flower) => flower.id !== action.id,
      );
    }

    const updatedBeehives = updateBeehives({ game: copy, createdAt });
    copy.beehives = updatedBeehives;

    return copy;
  });
}
