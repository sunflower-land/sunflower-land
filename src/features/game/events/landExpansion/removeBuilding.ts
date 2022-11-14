import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { getSupportedChickens } from "./utils";

export enum REMOVE_BUILDING_ERRORS {
  INVALID_BUILDING = "This building does not exist",
  NO_RUSTY_SHOVEL_AVAILABLE = "No Rusty Shovel available!",
}

export type RemoveBuildingAction = {
  type: "building.removed";
  building: BuildingName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveBuildingAction;
  createdAt?: number;
};

// First 15 plots do not need water
const INITIAL_SUPPORTED_PLOTS = 15;
// Each well can support an additional 8 plots
const WELL_PLOT_SUPPORT = 8;

function getUnSupportedPlotCount(gameState: GameState): number {
  // Get the well count
  const activeWells =
    gameState.buildings["Water Well"]?.filter(
      (well) => well.readyAt < Date.now()
    ).length ?? 0;

  // How many plots well can support
  const supportedPlots =
    activeWells * WELL_PLOT_SUPPORT + INITIAL_SUPPORTED_PLOTS;

  const plotCount = gameState.expansions.reduce((count, expansion) => {
    if (!expansion.plots) return count;

    count += getKeys(expansion.plots).length;

    return count;
  }, 0);

  return plotCount - supportedPlots;
}

/**
 * Removes crop data from any plots that don't have water well support.
 * It iterates backwards through the expansions and backwards through each expansions plots removing unsupported crops.
 * NOTE: At this time, we do not consider total crops planted vs supported crops. We just remove from then end even if early plots have no crops.
 * @param gameState
 * @returns LandExpansion[]
 */
function removeUnsupportedCrops(gameState: GameState) {
  const unsupportedPlotCount = getUnSupportedPlotCount(gameState);
  const { expansions = [] } = gameState;

  let count = 0;

  for (let expIndex = expansions.length - 1; expIndex >= 0; expIndex--) {
    if (count === unsupportedPlotCount) break;
    if (!expansions[expIndex].plots) continue;

    const reversedPlotKeys = getKeys({
      ...expansions[expIndex].plots,
    }).reverse();

    for (let plotKey = 0; plotKey < reversedPlotKeys.length; plotKey++) {
      if (count === unsupportedPlotCount) break;

      const plot = expansions[expIndex].plots?.[reversedPlotKeys[plotKey]];

      if (plot?.crop) delete plot.crop;

      count++;
    }
  }

  return expansions;
}

export function removeUnsupportedChickens(gameState: GameState) {
  const supportedChickens = getSupportedChickens(gameState);
  const chickenKeys = getKeys(gameState.chickens);
  const chickenCount = chickenKeys.length;
  const unsupportedChickens = chickenCount - supportedChickens;

  // Remove unsupported chickens last in first out
  [...Array(unsupportedChickens)].forEach((_, i) => {
    const keyIndex = chickenCount - (i + 1);

    delete gameState.chickens[chickenKeys[keyIndex]];
  });

  return gameState.chickens;
}

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export function removeBuilding({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const { buildings, inventory } = stateCopy;
  const buildingGroup = buildings[action.building];

  if (!buildingGroup) {
    throw new Error(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
  }

  const buildingIndex = buildingGroup?.findIndex(
    (building) => building.id == action.id
  );

  if (buildingIndex === -1) {
    throw new Error(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
  }

  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);

  if (shovelAmount.lessThan(1)) {
    throw new Error(REMOVE_BUILDING_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  }

  stateCopy.buildings[action.building] = removeItem(
    buildingGroup,
    buildingGroup[buildingIndex]
  );

  if (action.building === "Water Well") {
    stateCopy.expansions = removeUnsupportedCrops(stateCopy);
  }

  if (action.building === "Hen House") {
    stateCopy.chickens = removeUnsupportedChickens(stateCopy);
  }

  inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);

  return stateCopy;
}
