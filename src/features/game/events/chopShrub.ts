import Decimal from "decimal.js-light";
import { GameState, LandExpansionTree } from "../types/game";

// 10 minutes
export const SHRUB_RECOVERY_SECONDS = 10 * 60;

export function canChop(shrub: LandExpansionTree, now: number = Date.now()) {
  if (shrub.wood) {
    return now - shrub.wood.choppedAt > SHRUB_RECOVERY_SECONDS * 1000;
  }
  return true;
}

export type ChopShrubAction = {
  type: "shrub.chopped";
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
  const shrub = state.shrubs[action.index];

  if (!shrub) {
    throw new Error("No shrub");
  }

  if (!canChop(shrub, createdAt)) {
    throw new Error("Shrub is still growing");
  }

  const woodAmount = state.inventory.Wood || new Decimal(0);
  const { x, y, height, width } = shrub;
  return {
    ...state,
    inventory: {
      ...state.inventory,
      Wood: woodAmount.add(WOOD_AMOUNT),
    },
    shrubs: {
      ...state.shrubs,
      [action.index]: {
        wood: { choppedAt: Date.now(), amount: WOOD_AMOUNT },
        height,
        width,
        x,
        y,
      },
    },
  };
}
