import Decimal from "decimal.js-light";

import {
  CropName,
  CROPS,
  GreenHouseCropName,
  isAdvancedCrop,
  isBasicCrop,
} from "../../types/crops";
import {
  AOE,
  Buildings,
  Bumpkin,
  Collectibles,
  CropPlot,
  GameState,
  Inventory,
  InventoryItemName,
  IslandType,
} from "../../types/game";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { SEASONAL_SEEDS, SeedName, SEEDS } from "features/game/types/seeds";
import {
  isWithinAOE,
  Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { isSummerCrop, isAutumnCrop } from "./harvest";
import { getBudSpeedBoosts } from "features/game/lib/getBudSpeedBoosts";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import { isWearableActive } from "features/game/lib/wearables";
import { isGreenhouseCrop } from "./plantGreenhouse";
import { produce } from "immer";
import {
  CalendarEventName,
  getActiveCalendarEvent,
  isGuardianActive,
} from "features/game/types/calendar";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { canUseTimeBoostAOE, setAOEAvailableAt } from "features/game/lib/aoe";
import cloneDeep from "lodash.clonedeep";

export type LandExpansionPlantAction = {
  type: "seed.planted";
  item: InventoryItemName;
  index: string;
  cropId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionPlantAction;
  createdAt?: number;
};

type IsPlotFertile = {
  plotIndex: string;
  crops: Record<string, CropPlot>;
  wellLevel: number;
  buildings: Buildings;
  upgradeReadyAt?: number;
  createdAt?: number;
  island: IslandType;
};

// First 15 plots do not need water
const INITIAL_SUPPORTED_PLOTS = (island: IslandType) =>
  island !== "basic" ? 18 : 17;

// Each well can support an additional 8 plots
const WELL_PLOT_SUPPORT = 8;

function isCropDestroyed({ id, game }: { id: string; game: GameState }) {
  // Sort oldest to newest
  const crops = getKeys(game.crops).sort((a, b) =>
    game.crops[b].createdAt > game.crops[a].createdAt ? -1 : 1,
  );
  const cropsToRemove = crops.slice(0, Math.floor(crops.length / 2));

  return cropsToRemove.includes(id);
}

export const getSupportedPlots = ({
  wellLevel,
  buildings,
  upgradeReadyAt,
  createdAt = Date.now(),
  island,
}: {
  wellLevel: number;
  buildings: Buildings;
  upgradeReadyAt?: number;
  createdAt?: number;
  island: IslandType;
}) => {
  let plots = INITIAL_SUPPORTED_PLOTS(island);
  const hasWell = (buildings["Water Well"]?.length ?? 0) > 0;
  let effectiveWellLevel = wellLevel;

  if (upgradeReadyAt && upgradeReadyAt > createdAt) {
    effectiveWellLevel -= 1;
  }

  if (!hasWell) return plots;
  if (effectiveWellLevel >= 4) return 99;

  plots =
    effectiveWellLevel * WELL_PLOT_SUPPORT + INITIAL_SUPPORTED_PLOTS(island);
  return plots;
};

export function isPlotFertile({
  plotIndex,
  crops,
  wellLevel,
  buildings,
  upgradeReadyAt,
  createdAt = Date.now(),
  island,
}: IsPlotFertile): boolean {
  // get the well count
  const cropsWellCanWater = getSupportedPlots({
    wellLevel,
    buildings,
    upgradeReadyAt,
    createdAt,
    island,
  });

  const cropPosition =
    getKeys(crops)
      .sort((a, b) => (crops[a].createdAt > crops[b].createdAt ? 1 : -1))
      .findIndex((plotId) => plotId === plotIndex) + 1;
  return cropPosition <= cropsWellCanWater;
}

export function getAffectedWeather({
  id,
  game,
}: {
  id: string;
  game: GameState;
}): CalendarEventName | undefined {
  const weather = getActiveCalendarEvent({ game });

  if (
    weather === "tornado" &&
    !game.calendar.tornado?.protected &&
    isCropDestroyed({ id, game })
  ) {
    return "tornado";
  }

  if (
    game.calendar.tsunami?.triggeredAt &&
    !game.calendar.tsunami?.protected &&
    isCropDestroyed({ id, game })
  ) {
    return "tsunami";
  }

  if (
    game.calendar.greatFreeze?.triggeredAt &&
    !game.calendar.greatFreeze?.protected &&
    isCropDestroyed({ id, game })
  ) {
    return "greatFreeze";
  }

  return undefined;
}

/**
 * Generic boost for all crop types - basic, normal, advanced + greenhouse
 */
export function getCropTime({
  game,
  crop,
}: {
  game: GameState;
  crop: CropName | GreenHouseCropName;
}) {
  let seconds = 1;

  const { inventory, buds, bumpkin } = game;
  const skills = bumpkin?.skills ?? {};

  if (inventory["Seed Specialist"]?.gte(1)) {
    seconds = seconds * 0.9;
  }

  // Scarecrow: 15% reduction
  if (
    isCollectibleBuilt({ name: "Nancy", game }) ||
    isCollectibleBuilt({ name: "Scarecrow", game }) ||
    isCollectibleBuilt({ name: "Kuebiko", game })
  ) {
    seconds = seconds * 0.85;
  }

  if (skills["Cultivator"]) {
    seconds = seconds * 0.95;
  }

  //If lunar calender: 10% reduction
  if (isCollectibleBuilt({ name: "Lunar Calendar", game })) {
    seconds = seconds * 0.9;
  }

  if (
    isCollectibleActive({ name: "Super Totem", game }) ||
    isCollectibleActive({ name: "Time Warp Totem", game })
  ) {
    seconds = seconds * 0.5;
  }

  if (isCollectibleActive({ name: "Harvest Hourglass", game })) {
    seconds = seconds * 0.75;
  }

  if (skills["Green Thumb"] && !isGreenhouseCrop(crop)) {
    seconds = seconds * 0.95;
  }

  if (skills["Strong Roots"] && isAdvancedCrop(crop)) {
    seconds = seconds * 0.9;
  }

  if (isGreenhouseCrop(crop) && skills["Rice and Shine"]) {
    seconds = seconds * 0.95;
  }

  if (
    crop === "Zucchini" &&
    isCollectibleBuilt({ name: "Giant Zucchini", game })
  ) {
    seconds = seconds * 0.5;
  }

  if (
    isSummerCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Solflare Aegis", game })
  ) {
    seconds = seconds * 0.5;
  }

  if (
    isAutumnCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Autumn's Embrace", game })
  ) {
    seconds = seconds * 0.5;
  }

  // Olive Express: 10% reduction
  if (crop === "Olive" && skills["Olive Express"]) {
    seconds = seconds * 0.9;
  }

  // Rice Rocket: 10% reduction
  if (crop === "Rice" && skills["Rice Rocket"]) {
    seconds = seconds * 0.9;
  }

  seconds = seconds * getBudSpeedBoosts(buds ?? {}, crop);

  return seconds;
}

interface GetCropPlotTimeArgs {
  crop: CropName;
  game: GameState;
  plot?: CropPlot;
  createdAt: number;
}
/**
 * Based on boosts, how long a crop will take
 */
export const getCropPlotTime = ({
  crop,
  game,
  plot,
  createdAt,
}: GetCropPlotTimeArgs): { time: number; aoe: AOE } => {
  const { aoe } = game;
  const updatedAoe = cloneDeep(aoe);

  let seconds = CROPS[crop].harvestSeconds;

  const baseMultiplier = getCropTime({ game, crop });
  seconds *= baseMultiplier;

  if (seconds === 0) {
    return { time: 0, aoe: updatedAoe };
  }

  if (
    crop === "Parsnip" &&
    isCollectibleBuilt({ name: "Mysterious Parsnip", game })
  ) {
    seconds = seconds * 0.5;
  }

  if (crop === "Carrot" && isWearableActive({ name: "Carrot Amulet", game })) {
    seconds = seconds * 0.8;
  }

  // If Cabbage Girl: 50% reduction
  if (
    crop === "Cabbage" &&
    isCollectibleBuilt({ name: "Cabbage Girl", game })
  ) {
    seconds = seconds * 0.5;
  }

  // If Obie: 25% reduction
  if (crop === "Eggplant" && isCollectibleBuilt({ name: "Obie", game })) {
    seconds = seconds * 0.75;
  }

  // If Kernaldo: 25% reduction
  if (crop === "Corn" && isCollectibleBuilt({ name: "Kernaldo", game })) {
    seconds = seconds * 0.75;
  }

  if (
    crop === "Pepper" &&
    isWearableActive({ name: "Red Pepper Onesie", game })
  ) {
    seconds = seconds * 0.75;
  }

  if (isWearableActive({ name: "Broccoli Hat", game }) && crop === "Broccoli") {
    seconds = seconds * 0.5;
  }

  if (plot?.fertiliser?.name === "Rapid Root") {
    seconds = seconds * 0.5;
  }

  const isSunshower = getActiveCalendarEvent({ game }) === "sunshower";

  if (isSunshower) {
    seconds = seconds * 0.5;
    if (isGuardianActive({ game })) {
      seconds = seconds * 0.5;
    }
  }

  // If within Basic Scarecrow AOE: 20% reduction
  // This must be at the end of the function as it relies on the seconds variable
  if (game.collectibles["Basic Scarecrow"]?.[0] && isBasicCrop(crop)) {
    if (!plot || !createdAt) return { time: seconds, aoe: updatedAoe };

    const basicScarecrowCoordinates =
      game.collectibles["Basic Scarecrow"]?.[0].coordinates;
    const scarecrowDimensions = COLLECTIBLES_DIMENSIONS["Basic Scarecrow"];

    const scarecrowPosition: Position = {
      x: basicScarecrowCoordinates.x,
      y: basicScarecrowCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const plotPosition: Position = {
      x: plot?.x,
      y: plot?.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    if (
      isCollectibleBuilt({ name: "Basic Scarecrow", game }) &&
      isWithinAOE(
        "Basic Scarecrow",
        scarecrowPosition,
        plotPosition,
        game.bumpkin.skills,
      )
    ) {
      const dx = plotPosition.x - scarecrowPosition.x;
      const dy = plotPosition.y - scarecrowPosition.y;

      const canUseAoe = canUseTimeBoostAOE(
        updatedAoe,
        "Basic Scarecrow",
        { dx, dy },
        createdAt,
      );

      if (canUseAoe) {
        if (game.bumpkin.skills["Chonky Scarecrow"]) {
          seconds = seconds * 0.7;
        } else {
          seconds = seconds * 0.8;
        }
        setAOEAvailableAt(
          updatedAoe,
          "Basic Scarecrow",
          { dx, dy },
          createdAt,
          seconds * 1000,
        );
      }
    }
  }

  return { time: seconds, aoe: updatedAoe };
};

type GetPlantedAtArgs = {
  crop: CropName;
  inventory: Inventory;
  collectibles: Collectibles;
  bumpkin: Bumpkin;
  createdAt: number;
  plot: CropPlot;
  boostedTime: number;
};

function getBoostedTime({
  crop,
  boostedTime,
}: {
  crop: CropName;
  boostedTime: number;
}): number {
  const cropTime = CROPS[crop].harvestSeconds;

  const offset = cropTime - boostedTime;

  return offset * 1000;
}

/**
 * Set a plantedAt in the past to make a crop grow faster
 */
export function getPlantedAt({
  crop,
  createdAt,
  boostedTime,
}: GetPlantedAtArgs): number {
  const offset = getBoostedTime({ crop, boostedTime });

  return createdAt - offset;
}

function isPlotCrop(plant: GreenHouseCropName | CropName): plant is CropName {
  return (plant as CropName) in CROPS;
}

export function plant({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const buds = stateCopy.buds ?? {};
    const {
      crops: plots,
      bumpkin,
      collectibles,
      inventory,
      buildings,
    } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    const plot = plots[action.index];

    if (!plot) {
      throw new Error("Plot does not exist");
    }

    if (
      !isPlotFertile({
        plotIndex: action.index,
        crops: plots,
        wellLevel: stateCopy.waterWell.level,
        buildings,
        upgradeReadyAt: stateCopy.waterWell.upgradeReadyAt ?? 0,
        createdAt,
        island: stateCopy.island.type,
      })
    ) {
      throw new Error("Plot is not fertile");
    }

    const cropAffectedBy = getAffectedWeather({
      id: action.index,
      game: stateCopy,
    });

    if (!!cropAffectedBy && cropAffectedBy !== "insectPlague") {
      throw new Error(`Plot is affected by ${cropAffectedBy}`);
    }

    if (plot.crop?.plantedAt) {
      throw new Error("Crop is already planted");
    }

    if (!action.item) {
      throw new Error("No seed selected");
    }

    if (!(action.item in SEEDS)) {
      throw new Error("Not a seed");
    }

    const seedCount = stateCopy.inventory[action.item] || new Decimal(0);

    if (seedCount.lessThan(1)) {
      throw new Error("Not enough seeds");
    }

    if (
      !SEASONAL_SEEDS[stateCopy.season.season].includes(action.item as SeedName)
    ) {
      throw new Error("This seed is not available in this season");
    }

    const cropName = action.item.split(" ")[0] as CropName;

    const { time: boostedTime, aoe } = getCropPlotTime({
      crop: cropName,
      game: stateCopy,
      plot,
      createdAt,
    });
    stateCopy.aoe = aoe;

    const activityName: BumpkinActivityName = `${cropName} Planted`;

    bumpkin.activity = trackActivity(activityName, bumpkin.activity);

    plots[action.index] = {
      ...plot,
      crop: {
        ...(action.cropId && { id: action.cropId }),
        plantedAt: getPlantedAt({
          crop: cropName,
          inventory,
          collectibles,
          bumpkin,
          createdAt,
          plot,
          boostedTime,
        }),
        boostedTime: getBoostedTime({ crop: cropName, boostedTime }),
        name: cropName,
      },
    };

    inventory[action.item] = seedCount?.sub(1);

    return stateCopy;
  });
}
