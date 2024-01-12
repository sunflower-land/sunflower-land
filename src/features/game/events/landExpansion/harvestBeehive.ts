import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum HARVEST_BEEHIVE_ERRORS {
  NO_BEEHIVE = "This beehive does not exist.",
  NOT_READY = "This beehive is not ready to be harvested.",
}

export type HarvestHoneyAction = {
  type: "beehive.harvested";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestHoneyAction;
  createdAt?: number;
};

export function harvestBeehive({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;

  if (!stateCopy.beehives?.[Number(action.id)]) {
    throw new Error(HARVEST_BEEHIVE_ERRORS.NO_BEEHIVE);
  }

  const beehive = stateCopy.beehives[action.id];

  if (!beehive.honeyReadyAt || beehive.honeyReadyAt > createdAt) {
    throw new Error(HARVEST_BEEHIVE_ERRORS.NOT_READY);
  }

  return stateCopy;
}
