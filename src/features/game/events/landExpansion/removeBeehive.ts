import Decimal from "decimal.js-light";
import {
  DEFAULT_HONEY_PRODUCTION_TIME,
  updateBeehives,
} from "features/game/lib/updateBeehives";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum REMOVE_BEEHIVE_ERRORS {
  BEEHIVE_NOT_PLACED = "This beehive is not placed",
}

export type RemoveBeehiveAction = {
  type: "beehive.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveBeehiveAction;
  createdAt?: number;
};

export function removeBeehive({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const beehive = copy.beehives[action.id];

    if (!beehive) {
      throw new Error(REMOVE_BEEHIVE_ERRORS.BEEHIVE_NOT_PLACED);
    }

    const totalHoneyProduced =
      beehive.honey.produced / DEFAULT_HONEY_PRODUCTION_TIME;

    copy.inventory.Honey = (copy.inventory.Honey ?? new Decimal(0)).add(
      totalHoneyProduced,
    );

    delete beehive.x;
    delete beehive.y;
    beehive.removedAt = createdAt;
    beehive.flowers = [];
    beehive.honey.produced = 0;

    const updatedBeehives = updateBeehives({
      game: copy,
      createdAt,
    });

    copy.beehives = updatedBeehives;

    return copy;
  });
}
