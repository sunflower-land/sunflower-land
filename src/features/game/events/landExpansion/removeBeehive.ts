import Decimal from "decimal.js-light";
import {
  DEFAULT_HONEY_PRODUCTION_TIME,
  updateBeehives,
} from "features/game/lib/updateBeehives";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

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
  const copy: GameState = cloneDeep(state);

  if (!copy.beehives[action.id]) {
    throw new Error(REMOVE_BEEHIVE_ERRORS.BEEHIVE_NOT_PLACED);
  }

  const totalHoneyProduced =
    copy.beehives[action.id].honey.produced / DEFAULT_HONEY_PRODUCTION_TIME;

  copy.inventory.Honey = (copy.inventory.Honey ?? new Decimal(0)).add(
    totalHoneyProduced,
  );

  delete copy.beehives[action.id];

  const updatedBeehives = updateBeehives({
    game: copy,
    createdAt,
  });

  copy.beehives = updatedBeehives;

  return copy;
}
