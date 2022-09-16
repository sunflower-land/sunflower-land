import { MAX_STAMINA } from "features/game/lib/constants";
import { BumpkinLevel, getBumpkinLevel } from "features/game/lib/level";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

// 1 = 100% regeneration over 1 hour
// 1/24 = 4.16% regeneration over 1 hour
const MAX_REGEN_PERCENTAGE = 1;
const MIN_REGEN_PERCENTAGE = 1 / 24;
const REGEN_RANGE = MAX_REGEN_PERCENTAGE - MIN_REGEN_PERCENTAGE;

const DECAY_RATE = 0.1;

function getRegenerationRate(level: BumpkinLevel) {
  const regenerationRate = REGEN_RANGE * (1 - DECAY_RATE) ** (level - 1);
  const offsetRegenerationRate = regenerationRate + MIN_REGEN_PERCENTAGE;

  return offsetRegenerationRate / 60 / 60;
}

type ReplenishStaminaAction = {
  type: "bumpkin.replenishStamina";
};

type Options = {
  state: GameState;
  action: ReplenishStaminaAction;
  createdAt: number;
};

export function replenishStamina({ state, createdAt }: Options): GameState {
  const stateCopy = cloneDeep(state);

  if (stateCopy.bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const bumpkinLevel = getBumpkinLevel(stateCopy.bumpkin.experience);
  const replenishedAt = stateCopy.bumpkin.stamina.replenishedAt;
  const value = stateCopy.bumpkin.stamina.value;

  const replenishedAtSeconds = Math.floor(replenishedAt / 1000);
  const currentTimeSeconds = Math.floor(createdAt / 1000);
  const elapsedSeconds = currentTimeSeconds - replenishedAtSeconds;

  if (elapsedSeconds < 0) {
    throw new Error("Actions cannot go back in time");
  }

  const regenerationRate = getRegenerationRate(bumpkinLevel);

  const bonusStamina =
    MAX_STAMINA[bumpkinLevel] * regenerationRate * elapsedSeconds;

  stateCopy.bumpkin.stamina.replenishedAt = createdAt;
  stateCopy.bumpkin.stamina.value = Math.min(
    value + bonusStamina,
    MAX_STAMINA[bumpkinLevel]
  );

  return stateCopy;
}
