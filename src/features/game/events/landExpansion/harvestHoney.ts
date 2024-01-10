import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum HARVEST_HONEY_ERRORS {
  NO_BEEHIVE = "This beehive does not exist.",
  NOT_READY = "This beehive is not ready to be harvested.",
}

export type HarvestHoneyAction = {
  type: "honey.harvested";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestHoneyAction;
  createdAt?: number;
};

export function harvestHoney({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;

  if (!stateCopy.beehives?.[Number(action.id)]) {
    throw new Error(HARVEST_HONEY_ERRORS.NO_BEEHIVE);
  }

  const beehive = stateCopy.beehives[action.id];

  if (!beehive.honeyReadyAt || beehive.honeyReadyAt > createdAt) {
    throw new Error(HARVEST_HONEY_ERRORS.NOT_READY);
  }

  return stateCopy;
}
