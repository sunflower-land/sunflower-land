import { GameState } from "../../types/game";
import { CROPS } from "../../types/crops";
import Decimal from "decimal.js-light";

export type LandExpansionHarvestAction = {
  type: "crop.harvested";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: GameState;
  action: LandExpansionHarvestAction;
  createdAt?: number;
};

export function harvest({ state, action, createdAt = Date.now() }: Options) {
  const expansions = [...state.expansions];
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  if (!expansion.plots) {
    throw new Error("Expansion does not have any plots");
  }

  const { plots } = expansion;

  if (action.index < 0) {
    throw new Error("Plot does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Plot does not exist");
  }

  if (action.index > Object.keys(plots).length) {
    throw new Error("Plot does not exist");
  }

  const plot = plots[action.index];

  if (!plot.crop) {
    throw new Error("Nothing was planted");
  }

  const { name, plantedAt, amount = 1 } = plot.crop;

  const { harvestSeconds } = CROPS()[name];

  if (createdAt - plantedAt < harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

  // Remove crop data for plot
  delete plot.crop;

  const cropCount = state.inventory[name] || new Decimal(0);

  return {
    ...state,
    expansions,
    inventory: {
      ...state.inventory,
      [name]: cropCount.add(amount),
    },
  } as GameState;
}
