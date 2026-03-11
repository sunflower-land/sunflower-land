import Decimal from "decimal.js-light";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";

import { CropName } from "../../types/crops";
import { GameState, InventoryItemName } from "../../types/game";
import { SEASONAL_SEEDS, SeedName, SEEDS } from "../../types/seeds";
import { updateBoostUsed } from "../../types/updateBoostUsed";
import { BoostName } from "../../types/game";
import { getAffectedWeather, plantCropOnPlot } from "./plant";

export type BulkPlantAction = {
  type: "seeds.bulkPlanted";
  seed: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: BulkPlantAction;
  createdAt?: number;
};

export const getAvailablePlots = (state: GameState) => {
  return Object.entries(state.crops).filter(([plotId, plot]) => {
    if (plot.x === undefined || plot.y === undefined || plot.crop) return false;
    // Exclude plots destroyed or blocked by tornado, tsunami, greatFreeze
    if (getAffectedWeather({ id: plotId, game: state })) return false;
    return true;
  });
};

export function bulkPlant({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops: plots, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    if (!action.seed) {
      throw new Error("No seed selected");
    }

    if (!(action.seed in SEEDS)) {
      throw new Error("Not a seed");
    }

    if (
      !SEASONAL_SEEDS[stateCopy.season.season].includes(action.seed as SeedName)
    ) {
      throw new Error("This seed is not available in this season");
    }

    const availablePlots = getAvailablePlots(stateCopy);

    const seedCount = stateCopy.inventory[action.seed] || new Decimal(0);
    const seedsToPlant = Math.min(seedCount.toNumber(), availablePlots.length);

    if (seedsToPlant < 1) {
      throw new Error("Not enough seeds to plant");
    }

    const cropName = action.seed.split(" ")[0] as CropName;
    const allBoostsUsed: { name: BoostName; value: string }[] = [];

    for (let i = 0; i < seedsToPlant; i++) {
      const [plotId] = availablePlots[i];
      const cropId = uuidv4().slice(0, 8);

      try {
        const { updatedPlot, aoe, boostsUsed } = plantCropOnPlot({
          plotId,
          cropName,
          cropId,
          game: stateCopy,
          createdAt,
          seedItem: action.seed,
        });

        allBoostsUsed.push(...boostsUsed);

        stateCopy.aoe = aoe;
        plots[plotId] = updatedPlot;
      } catch (error) {
        // ignore error
        continue;
      }
    }

    stateCopy.inventory[action.seed] =
      stateCopy.inventory[action.seed]?.minus(seedsToPlant);

    if (allBoostsUsed.length > 0) {
      stateCopy.boostsUsedAt = updateBoostUsed({
        game: stateCopy,
        boostNames: allBoostsUsed,
        createdAt,
      });
    }
  });
}
