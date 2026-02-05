import Decimal from "decimal.js-light";
import { CROPS } from "../../types/crops";
import { GameState, InventoryItemName } from "../../types/game";
import { isReadyToHarvest } from "./harvest";
import { produce } from "immer";
import { trackFarmActivity } from "../../types/farmActivity";
import { hasFeatureAccess } from "lib/flags";

export enum REMOVE_CROP_ERRORS {
  EMPTY_EXPANSION = "Expansion does not exist!",
  EXPANSION_NO_PLOTS = "Expansion does not have any plots!",
  EMPTY_PLOT = "Plot does not exist!",
  EMPTY_CROP = "There is no crop planted!",
  NO_VALID_SHOVEL_SELECTED = "No valid shovel selected!",
  NO_SHOVEL_AVAILABLE = "No shovel available!",
  READY_TO_HARVEST = "Plant is ready to harvest!",
}

export type LandExpansionRemoveCropAction = {
  type: "crop.removed";
  item?: InventoryItemName;
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionRemoveCropAction;
  createdAt?: number;
};

export function removeCrop({ state, action, createdAt = Date.now() }: Options) {
  if (!hasFeatureAccess(state, "REMOVE_CROPS")) {
    throw new Error("You do not have access to remove crops");
  }
  return produce(state, (stateCopy) => {
    const { crops: plots } = stateCopy;

    const plot = plots[action.index];
    if (!plot) {
      throw new Error(REMOVE_CROP_ERRORS.EMPTY_PLOT);
    }

    const crop = plot && plot.crop;

    if (!crop) {
      throw new Error(REMOVE_CROP_ERRORS.EMPTY_CROP);
    }

    if (action.item !== "Rusty Shovel") {
      throw new Error(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
    }

    const shovelAmount = stateCopy.inventory["Rusty Shovel"] || new Decimal(0);
    if (shovelAmount.lessThan(1)) {
      throw new Error(REMOVE_CROP_ERRORS.NO_SHOVEL_AVAILABLE);
    }

    const cropDetails = CROPS[crop.name];
    if (isReadyToHarvest(createdAt, crop, cropDetails)) {
      throw new Error(REMOVE_CROP_ERRORS.READY_TO_HARVEST);
    }

    // Store crop name before deleting
    const cropName = crop.name;

    delete plot.crop;

    // Consume Rusty Shovel
    stateCopy.inventory["Rusty Shovel"] = shovelAmount.minus(1);

    // Decrement planted activity
    stateCopy.farmActivity = trackFarmActivity(
      `${cropName} Planted`,
      stateCopy.farmActivity,
      new Decimal(-1),
    );

    // Track crop removal
    stateCopy.farmActivity = trackFarmActivity(
      "Crop Removed",
      stateCopy.farmActivity,
    );

    stateCopy.farmActivity = trackFarmActivity(
      `${cropName} Removed`,
      stateCopy.farmActivity,
      new Decimal(1),
    );

    stateCopy.crops = plots;
    return stateCopy;
  });
}
