import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState, LandExpansionTree } from "../types/game";

// 10 minutes
export const SHRUB_RECOVERY_SECONDS = 10 * 60;

export function canChop(shrub: LandExpansionTree, now: number = Date.now()) {
  if (!shrub.wood) return true;

  return now - shrub.wood.choppedAt > SHRUB_RECOVERY_SECONDS * 1000;
}

export type ChopShrubAction = {
  type: "shrub.chopped";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: GameState;
  action: ChopShrubAction;
  createdAt?: number;
};

const WOOD_AMOUNT = 0.1;

export function chopShrub({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { expansions } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  const { shrubs } = expansion;

  if (!shrubs) {
    throw new Error("Expansion does not have any shrubs");
  }

  const shrub = shrubs[action.index];

  if (!shrub) {
    throw new Error("No shrub");
  }

  if (!canChop(shrub, createdAt)) {
    throw new Error("Shrub is still growing");
  }

  const woodAmount = state.inventory.Wood || new Decimal(0);

  shrub.wood = { choppedAt: Date.now(), amount: WOOD_AMOUNT };

  return {
    ...state,
    expansions,
    inventory: {
      ...state.inventory,
      Wood: woodAmount.add(WOOD_AMOUNT),
    },
  };
}
