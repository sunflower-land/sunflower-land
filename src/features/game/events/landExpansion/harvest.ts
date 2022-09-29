// eslint-disable-next-line @typescript-eslint/no-var-requires
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
import { CROPS } from "../../types/crops";
import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";

export type LandExpansionHarvestAction = {
  type: "crop.harvested";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionHarvestAction;
  createdAt?: number;
};

export function harvest({ state, action, createdAt = Date.now() }: Options) {
  const stateCopy = cloneDeep(state);
  const { expansions, bumpkin } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
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

  const cropCount = stateCopy.inventory[name] || new Decimal(0);

  bumpkin.activity = trackActivity(`${name} Harvested`, bumpkin.activity);

  return {
    ...stateCopy,
    expansions,
    inventory: {
      ...stateCopy.inventory,
      [name]: cropCount.add(amount),
    },
  } as GameState;
}
