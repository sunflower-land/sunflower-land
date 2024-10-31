import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { PLOT_CROPS } from "../../types/crops";
import { GameState, InventoryItemName } from "../../types/game";
import { isReadyToHarvest } from "./harvest";
import { produce } from "immer";

export enum REMOVE_CROP_ERRORS {
  EMPTY_EXPANSION = "Expansion does not exist!",
  EXPANSION_NO_PLOTS = "Expansion does not have any plots!",
  EMPTY_PLOT = "Plot does not exist!",
  EMPTY_CROP = "There is no crop planted!",
  NO_VALID_SHOVEL_SELECTED = "No valid shovel selected!",
  NO_SHOVEL_AVAILABLE = "No shovel available!",
  READY_TO_HARVEST = "Plant is ready to harvest!",
  INVALID_PLANT = "Invalid Plant!",
}

export type LandExpansionRemoveCropAction = {
  type: "crop.removed";
  item?: InventoryItemName;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionRemoveCropAction;
  createdAt?: number;
};

export function removeCrop({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { crops: plots, inventory } = stateCopy;

    if (action.index < 0) {
      throw new Error(REMOVE_CROP_ERRORS.EMPTY_PLOT);
    }

    if (!Number.isInteger(action.index)) {
      throw new Error(REMOVE_CROP_ERRORS.EMPTY_PLOT);
    }

    if (action.index >= Object.keys(plots).length) {
      throw new Error(REMOVE_CROP_ERRORS.EMPTY_PLOT);
    }

    const plot = plots[action.index];
    const crop = plot && plot.crop;

    if (!crop) {
      throw new Error(REMOVE_CROP_ERRORS.EMPTY_CROP);
    }

    if (action.item !== "Shovel") {
      throw new Error(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
    }

    const shovelAmount = stateCopy.inventory.Shovel || new Decimal(0);
    if (shovelAmount.lessThan(1)) {
      throw new Error(REMOVE_CROP_ERRORS.NO_SHOVEL_AVAILABLE);
    }

    const cropDetails = PLOT_CROPS[crop.name];
    if (isReadyToHarvest(createdAt, crop, cropDetails)) {
      throw new Error(REMOVE_CROP_ERRORS.READY_TO_HARVEST);
    }

    if (!screenTracker.calculate()) {
      throw new Error(REMOVE_CROP_ERRORS.INVALID_PLANT);
    }

    delete plot.crop;

    stateCopy.crops = plots;
    return stateCopy;
  });
}
