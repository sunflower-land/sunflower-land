import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  HONEY_PRODUCTION_TIME,
  updateBeehives,
} from "features/game/lib/updateBeehives";

export const HARVEST_BEEHIVE_ERRORS = {
  BEEHIVE_NOT_PLACED: "harvestBeeHive.notPlaced",
  NO_HONEY: "harvestBeeHive.noHoney",
};

export type HarvestBeehiveAction = {
  type: "beehive.harvested";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestBeehiveAction;
  createdAt?: number;
};

export function harvestBeehive({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;

  // Update beehives before harvesting to set honey produced
  const freshBeehives = updateBeehives({
    beehives: stateCopy.beehives,
    flowers: stateCopy.flowers,
    createdAt,
  });

  stateCopy.beehives = freshBeehives;

  if (!stateCopy.beehives[action.id]) {
    throw new Error(HARVEST_BEEHIVE_ERRORS.BEEHIVE_NOT_PLACED);
  }

  if (stateCopy.beehives[action.id].honey.produced <= 0) {
    throw new Error(HARVEST_BEEHIVE_ERRORS.NO_HONEY);
  }

  const totalHoneyProduced =
    stateCopy.beehives[action.id].honey.produced / HONEY_PRODUCTION_TIME;

  stateCopy.beehives[action.id].honey.produced = 0;
  stateCopy.beehives[action.id].honey.updatedAt = createdAt;
  stateCopy.inventory.Honey = (stateCopy.inventory.Honey ?? new Decimal(0)).add(
    new Decimal(totalHoneyProduced)
  );

  const updatedBeehives = updateBeehives({
    beehives: stateCopy.beehives,
    flowers: stateCopy.flowers,
    createdAt,
  });

  stateCopy.beehives = updatedBeehives;

  return stateCopy;
}
