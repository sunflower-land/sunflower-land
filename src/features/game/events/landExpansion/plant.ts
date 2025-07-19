import Decimal from "decimal.js-light";

import {
  CropName,
  CROPS,
  GreenHouseCropName,
  isAdvancedCrop,
  isBasicCrop,
} from "../../types/crops";
import {
  BoostName,
  Buildings,
  CropPlot,
  GameState,
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
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

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
  instaCropFn?: () => boolean;
}): { multiplier: number; boostsUsed: BoostName[] } {
  let multiplier = 1;
  const boostsUsed: BoostName[] = [];

  const { inventory, buds, bumpkin } = game;
  const skills = bumpkin?.skills ?? {};

  if (inventory["Seed Specialist"]?.gte(1)) {
    multiplier = multiplier * 0.9;
    boostsUsed.push("Seed Specialist");
  }

  // Scarecrow: 15% reduction
  const hasNancy = isCollectibleBuilt({ name: "Nancy", game });
  const hasScarecrow = isCollectibleBuilt({ name: "Scarecrow", game });
  const hasKuebiko = isCollectibleBuilt({ name: "Kuebiko", game });
  if (hasNancy || hasScarecrow || hasKuebiko) {
    multiplier = multiplier * 0.85;
    if (hasKuebiko) boostsUsed.push("Kuebiko");
    else if (hasScarecrow) boostsUsed.push("Scarecrow");
    else if (hasNancy) boostsUsed.push("Nancy");
  }

  //If lunar calender: 10% reduction
  if (isCollectibleBuilt({ name: "Lunar Calendar", game })) {
    multiplier = multiplier * 0.9;
    boostsUsed.push("Lunar Calendar");
  }

  const hasSuperTotem = isCollectibleActive({
    name: "Super Totem",
    game,
  });
  const hasTimeWarpTotem = isCollectibleActive({
    name: "Time Warp Totem",
    game,
  });

  if (hasSuperTotem || hasTimeWarpTotem) {
    multiplier = multiplier * 0.5;
    if (hasSuperTotem) boostsUsed.push("Super Totem");
    if (hasTimeWarpTotem) boostsUsed.push("Time Warp Totem");
  }

  if (isCollectibleActive({ name: "Harvest Hourglass", game })) {
    multiplier = multiplier * 0.75;
    boostsUsed.push("Harvest Hourglass");
  }

  if (skills["Green Thumb"] && !isGreenhouseCrop(crop)) {
    multiplier = multiplier * 0.95;
    boostsUsed.push("Green Thumb");
  }

  if (skills["Strong Roots"] && isAdvancedCrop(crop)) {
    multiplier = multiplier * 0.9;
    boostsUsed.push("Strong Roots");
  }

  if (isGreenhouseCrop(crop) && skills["Rice and Shine"]) {
    multiplier = multiplier * 0.95;
    boostsUsed.push("Rice and Shine");
  }

  if (
    isSummerCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Solflare Aegis", game })
  ) {
    multiplier = multiplier * 0.5;
    boostsUsed.push("Solflare Aegis");
  }

  if (
    isAutumnCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Autumn's Embrace", game })
  ) {
    multiplier = multiplier * 0.5;
    boostsUsed.push("Autumn's Embrace");
  }

  // Olive Express: 10% reduction
  if (crop === "Olive" && skills["Olive Express"]) {
    multiplier = multiplier * 0.9;
    boostsUsed.push("Olive Express");
  }

  // Rice Rocket: 10% reduction
  if (crop === "Rice" && skills["Rice Rocket"]) {
    multiplier = multiplier * 0.9;
    boostsUsed.push("Rice Rocket");
  }

  multiplier = multiplier * getBudSpeedBoosts(buds ?? {}, crop);

  return { multiplier, boostsUsed };
}

/**
 * Based on boosts, how long a crop will take
 */
export const getCropPlotTime = ({
  crop,
  game,
  plot,
  createdAt = Date.now(),
}: {
  crop: CropName;
  game: GameState;
  plot?: CropPlot;
  createdAt?: number;
}): { seconds: number; boostsUsed: BoostName[] } => {
  let seconds = CROPS[crop].harvestSeconds;

  const { multiplier: baseMultiplier, boostsUsed } = getCropTime({
    game,
    crop,
  });
  seconds *= baseMultiplier;

  if (seconds === 0) {
    return { seconds: 0, boostsUsed };
  }

  if (
    crop === "Parsnip" &&
    isCollectibleBuilt({ name: "Mysterious Parsnip", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push("Mysterious Parsnip");
  }

  if (crop === "Carrot" && isWearableActive({ name: "Carrot Amulet", game })) {
    seconds = seconds * 0.8;
    boostsUsed.push("Carrot Amulet");
  }

  // If Cabbage Girl: 50% reduction
  if (
    crop === "Cabbage" &&
    isCollectibleBuilt({ name: "Cabbage Girl", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push("Cabbage Girl");
  }

  // If Obie: 25% reduction
  if (crop === "Eggplant" && isCollectibleBuilt({ name: "Obie", game })) {
    seconds = seconds * 0.75;
    boostsUsed.push("Obie");
  }

  if (
    crop === "Zucchini" &&
    isCollectibleBuilt({ name: "Giant Zucchini", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push("Giant Zucchini");
  }

  // If within Basic Scarecrow AOE: 20% reduction
  if (game.collectibles["Basic Scarecrow"]?.[0] && isBasicCrop(crop)) {
    if (!plot || !createdAt) return { seconds, boostsUsed };

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
      if (game.bumpkin.skills["Chonky Scarecrow"]) {
        seconds = seconds * 0.7;
        boostsUsed.push("Chonky Scarecrow");
      } else {
        seconds = seconds * 0.8;
        boostsUsed.push("Basic Scarecrow");
      }
      boostsUsed.push("Basic Scarecrow");
    }
  }

  // If Kernaldo: 25% reduction
  if (crop === "Corn" && isCollectibleBuilt({ name: "Kernaldo", game })) {
    seconds = seconds * 0.75;
    boostsUsed.push("Kernaldo");
  }

  if (
    crop === "Pepper" &&
    isWearableActive({ name: "Red Pepper Onesie", game })
  ) {
    seconds = seconds * 0.75;
    boostsUsed.push("Red Pepper Onesie");
  }

  if (isWearableActive({ name: "Broccoli Hat", game }) && crop === "Broccoli") {
    seconds = seconds * 0.5;
    boostsUsed.push("Broccoli Hat");
  }

  if (plot?.fertiliser?.name === "Rapid Root") {
    seconds = seconds * 0.5;
    boostsUsed.push("Rapid Root");
  }

  const isSunshower = getActiveCalendarEvent({ game }) === "sunshower";

  if (isSunshower) {
    seconds = seconds * 0.5;
    const { hasGuardian, boostsUsed: guardianBoostsUsed } = isGuardianActive({
      game,
    });
    if (hasGuardian) {
      seconds = seconds * 0.5;
      boostsUsed.push(...guardianBoostsUsed);
    }
  }

  return { seconds, boostsUsed };
};

type GetPlantedAtArgs = {
  crop: CropName;
  game: GameState;
  createdAt: number;
  plot: CropPlot;
};

/**
 * Set a plantedAt in the past to make a crop grow faster
 */
export function getPlantedAt({
  crop,
  game,
  createdAt,
  plot,
}: GetPlantedAtArgs): {
  plantedAt: number;
  boostsUsed: BoostName[];
} {
  if (!crop) return { plantedAt: 0, boostsUsed: [] };

  const cropTime = CROPS[crop].harvestSeconds;
  const { seconds: boostedTime, boostsUsed } = getCropPlotTime({
    crop,
    game,
    plot,
    createdAt,
  });

  const offset = cropTime - boostedTime;

  return { plantedAt: createdAt - offset * 1000, boostsUsed };
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
    const { crops: plots, bumpkin, inventory, buildings } = stateCopy;

    if (bumpkin === undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (!action.index) {
      throw new Error("Plot does not exist");
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

    if (plot.crop?.plantedAt) {
      throw new Error("Crop is already planted");
    }

    if (!action.item) {
      throw new Error("No seed selected");
    }

    if (!(action.item in SEEDS)) {
      throw new Error("Not a seed");
    }

    const seedCount = inventory[action.item] || new Decimal(0);

    if (seedCount.lessThan(1)) {
      throw new Error("Not enough seeds");
    }

    if (
      !SEASONAL_SEEDS[stateCopy.season.season].includes(action.item as SeedName)
    ) {
      throw new Error("This seed is not available in this season");
    }

    const cropName = action.item.split(" ")[0] as CropName;

    const activityName: BumpkinActivityName = `${cropName} Planted`;

    bumpkin.activity = trackActivity(activityName, bumpkin.activity);
    const { plantedAt, boostsUsed } = getPlantedAt({
      crop: cropName,
      game: stateCopy,
      createdAt,
      plot,
    });
    plots[action.index] = {
      ...plot,
      crop: {
        id: action.cropId,
        plantedAt,
        name: cropName,
      },
    };

    inventory[action.item] = seedCount.sub(1);
    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
