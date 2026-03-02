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
  BoostName,
  Buildings,
  Bumpkin,
  Collectibles,
  CropPlot,
  CriticalHitName,
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
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { SEASONAL_SEEDS, SeedName, SEEDS } from "features/game/types/seeds";
import {
  isWithinAOE,
  Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { getBudSpeedBoosts } from "features/game/lib/getBudSpeedBoosts";

import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import {
  CalendarEventName,
  getActiveCalendarEvent,
  getActiveGuardian,
} from "features/game/types/calendar";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import {
  canUseTimeBoostAOE,
  isCollectibleOnFarm,
  setAOEAvailableAt,
} from "features/game/lib/aoe";
import cloneDeep from "lodash.clonedeep";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import {
  FarmActivityName,
  trackFarmActivity,
} from "features/game/types/farmActivity";
import { isBuffActive } from "features/game/types/buffs";
import { isAutumnCrop, isSummerCrop } from "./harvest";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";

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
  farmId: number;
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
  const hasPlacedWell =
    buildings["Water Well"]?.some((w) => !!w.coordinates) ?? false;
  let effectiveWellLevel = wellLevel;

  if (upgradeReadyAt && upgradeReadyAt > createdAt) {
    effectiveWellLevel -= 1;
  }

  if (!hasPlacedWell) return plots;
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
  const cropsWellCanWater = getSupportedPlots({
    wellLevel,
    buildings,
    upgradeReadyAt,
    createdAt,
    island,
  });

  const cropPosition =
    getObjectEntries(crops)
      .filter(([, plot]) => plot.x !== undefined && plot.y !== undefined)
      .sort(([a], [b]) => (crops[a].createdAt > crops[b].createdAt ? 1 : -1))
      .findIndex(([plotId]) => plotId === plotIndex) + 1;
  return cropPosition <= cropsWellCanWater;
}

export function getAffectedWeather({
  id,
  game,
}: {
  id: string;
  game: GameState;
}): CalendarEventName | undefined {
  const weather = getActiveCalendarEvent({ calendar: game.calendar });

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
  prngArgs,
}: {
  game: GameState;
  crop: CropName | GreenHouseCropName;
  prngArgs?: { farmId: number; counter: number };
}): { multiplier: number; boostsUsed: { name: BoostName; value: string }[] } {
  let multiplier = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];
  const { inventory, buds = {}, bumpkin } = game;
  const skills = bumpkin?.skills ?? {};

  // Only check PRNG-based boosts if prngArgs are provided
  if (prngArgs) {
    const itemId = KNOWN_IDS[crop];
    const prngFn = (criticalHitName: CriticalHitName, chance: number) =>
      prngChance({
        ...prngArgs,
        itemId,
        chance,
        criticalHitName,
      });

    // Insta crops on wings
    const hasAngelWing = isWearableActive({ name: "Angel Wings", game });
    const hasDevilWing = isWearableActive({ name: "Devil Wings", game });

    if (hasAngelWing && prngFn("Angel Wings", 30)) {
      return {
        multiplier: 0,
        boostsUsed: [{ name: "Angel Wings", value: "Instant" }],
      };
    }

    if (hasDevilWing && prngFn("Devil Wings", 30)) {
      return {
        multiplier: 0,
        boostsUsed: [{ name: "Devil Wings", value: "Instant" }],
      };
    }
  }

  if (inventory["Seed Specialist"]?.gte(1)) {
    multiplier = multiplier * 0.9;
    boostsUsed.push({ name: "Seed Specialist", value: "x0.9" });
  }

  // Scarecrow: 15% reduction
  const hasNancy = isCollectibleBuilt({ name: "Nancy", game });
  const hasScarecrow = isCollectibleBuilt({ name: "Scarecrow", game });
  const hasKuebiko = isCollectibleBuilt({ name: "Kuebiko", game });
  if (hasNancy || hasScarecrow || hasKuebiko) {
    multiplier = multiplier * 0.85;
    if (hasKuebiko) boostsUsed.push({ name: "Kuebiko", value: "x0.85" });
    else if (hasScarecrow)
      boostsUsed.push({ name: "Scarecrow", value: "x0.85" });
    else if (hasNancy) boostsUsed.push({ name: "Nancy", value: "x0.85" });
  }

  //If lunar calendar: 10% reduction
  if (isCollectibleBuilt({ name: "Lunar Calendar", game })) {
    multiplier = multiplier * 0.9;
    boostsUsed.push({ name: "Lunar Calendar", value: "x0.9" });
  }

  const hasSuperTotem = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const hasTimeWarpTotem = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });
  if (hasSuperTotem || hasTimeWarpTotem) {
    multiplier = multiplier * 0.5;
    if (hasSuperTotem) boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    else if (hasTimeWarpTotem)
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
  }

  if (isTemporaryCollectibleActive({ name: "Harvest Hourglass", game })) {
    multiplier = multiplier * 0.75;
    boostsUsed.push({ name: "Harvest Hourglass", value: "x0.75" });
  }

  if (skills["Strong Roots"] && isAdvancedCrop(crop)) {
    multiplier = multiplier * 0.9;
    boostsUsed.push({ name: "Strong Roots", value: "x0.9" });
  }

  // Apply bud speed boosts
  const { speedBoost: budMultiplier, budUsed } = getBudSpeedBoosts(buds, crop);
  multiplier *= budMultiplier;
  if (budUsed)
    boostsUsed.push({ name: budUsed, value: `x${budMultiplier.toString()}` });

  return { multiplier, boostsUsed };
}

interface GetCropPlotTimeArgs {
  crop: CropName;
  game: GameState;
  plot?: CropPlot;
  createdAt: number;
  prngArgs?: { farmId: number; counter: number };
}
/**
 * Based on boosts, how long a crop will take
 */
export const getCropPlotTime = ({
  crop,
  game,
  plot,
  createdAt,
  prngArgs,
}: GetCropPlotTimeArgs): {
  time: number;
  aoe: AOE;
  boostsUsed: { name: BoostName; value: string }[];
} => {
  const {
    aoe,
    bumpkin: { skills },
  } = game;
  const updatedAoe = cloneDeep(aoe);

  let seconds = CROPS[crop].harvestSeconds;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const { multiplier: baseMultiplier, boostsUsed: baseBoostsUsed } =
    getCropTime({
      game,
      crop,
      prngArgs,
    });
  seconds *= baseMultiplier;
  boostsUsed.push(...baseBoostsUsed);

  if (seconds === 0) {
    return { time: 0, aoe: updatedAoe, boostsUsed };
  }

  if (
    isSummerCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    isWearableActive({ name: "Solflare Aegis", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Solflare Aegis", value: "x0.5" });
  }

  if (
    isAutumnCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    isWearableActive({ name: "Autumn's Embrace", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Autumn's Embrace", value: "x0.5" });
  }

  if (skills["Green Thumb"]) {
    seconds = seconds * 0.95;
    boostsUsed.push({ name: "Green Thumb", value: "x0.95" });
  }

  if (isTemporaryCollectibleActive({ name: "Sparrow Shrine", game })) {
    seconds = seconds * 0.75;
    boostsUsed.push({ name: "Sparrow Shrine", value: "x0.75" });
  }

  if (isBuffActive({ buff: "Power hour", game })) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Power hour", value: "x0.5" });
  }

  if (
    crop === "Parsnip" &&
    isCollectibleBuilt({ name: "Mysterious Parsnip", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Mysterious Parsnip", value: "x0.5" });
  }

  if (crop === "Carrot" && isWearableActive({ name: "Carrot Amulet", game })) {
    seconds = seconds * 0.8;
    boostsUsed.push({ name: "Carrot Amulet", value: "x0.8" });
  }

  // If Cabbage Girl: 50% reduction
  if (
    crop === "Cabbage" &&
    isCollectibleBuilt({ name: "Cabbage Girl", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Cabbage Girl", value: "x0.5" });
  }

  // If Obie: 25% reduction
  if (crop === "Eggplant" && isCollectibleBuilt({ name: "Obie", game })) {
    seconds = seconds * 0.75;
    boostsUsed.push({ name: "Obie", value: "x0.75" });
  }

  // If Kernaldo: 25% reduction
  if (crop === "Corn" && isCollectibleBuilt({ name: "Kernaldo", game })) {
    seconds = seconds * 0.75;
    boostsUsed.push({ name: "Kernaldo", value: "x0.75" });
  }

  if (
    crop === "Pepper" &&
    isWearableActive({ name: "Red Pepper Onesie", game })
  ) {
    seconds = seconds * 0.75;
    boostsUsed.push({ name: "Red Pepper Onesie", value: "x0.75" });
  }

  if (isWearableActive({ name: "Broccoli Hat", game }) && crop === "Broccoli") {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Broccoli Hat", value: "x0.5" });
  }

  if (plot?.fertiliser?.name === "Rapid Root") {
    seconds = seconds * 0.5;
  }

  if (
    crop === "Zucchini" &&
    isCollectibleBuilt({ name: "Giant Zucchini", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Giant Zucchini", value: "x0.5" });
  }

  if (isCollectibleBuilt({ name: "Giant Turnip", game }) && crop === "Turnip") {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Giant Turnip", value: "x0.5" });
  }

  const isSunshower =
    getActiveCalendarEvent({ calendar: game.calendar }) === "sunshower";

  if (isSunshower) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "sunshower", value: "x0.5" });
    const { activeGuardian } = getActiveGuardian({
      game,
    });
    if (activeGuardian) {
      seconds = seconds * 0.5;
      boostsUsed.push({ name: activeGuardian, value: "x0.5" });
    }
  }

  // If within Basic Scarecrow AOE: 20% reduction
  // This must be at the end of the function as it relies on the seconds variable
  if (
    isCollectibleOnFarm({ name: "Basic Scarecrow", game }) &&
    isBasicCrop(crop) &&
    plot &&
    plot.x !== undefined &&
    plot.y !== undefined
  ) {
    const coordinates = game.collectibles["Basic Scarecrow"]![0].coordinates!;
    const scarecrowPosition: Position = {
      ...coordinates,
      ...COLLECTIBLES_DIMENSIONS["Basic Scarecrow"],
    };

    const plotPosition: Position = {
      x: plot.x,
      y: plot.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    if (
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
          boostsUsed.push({ name: "Chonky Scarecrow", value: "x0.7" });
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
      boostsUsed.push({ name: "Basic Scarecrow", value: "x0.8" });
    }
  }

  return { time: seconds, aoe: updatedAoe, boostsUsed };
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

export function isPlotCrop(
  plant: GreenHouseCropName | CropName,
): plant is CropName {
  return (plant as CropName) in CROPS;
}

export function plantCropOnPlot({
  plotId,
  cropName,
  cropId,
  game,
  createdAt,
  seedItem,
  farmId,
}: {
  plotId: string;
  cropName: CropName;
  cropId: string;
  game: GameState;
  createdAt: number;
  seedItem: InventoryItemName;
  farmId: number;
}): {
  updatedPlot: CropPlot;
  boostedTime: number;
  aoe: AOE;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { inventory, collectibles, bumpkin, crops: plots } = game;
  const plot = plots[plotId];
  const seedCount = inventory[seedItem] || new Decimal(0);

  if (!plot) {
    throw new Error("Plot does not exist");
  }

  if (plot.x === undefined && plot.y === undefined) {
    throw new Error("Plot is not placed");
  }

  if (
    !isPlotFertile({
      plotIndex: plotId,
      crops: plots,
      wellLevel: game.waterWell.level,
      buildings: game.buildings,
      upgradeReadyAt: game.waterWell.upgradeReadyAt ?? 0,
      createdAt,
      island: game.island.type,
    })
  ) {
    throw new Error("Plot is not fertile");
  }

  const cropAffectedBy = getAffectedWeather({
    id: plotId,
    game,
  });

  if (!!cropAffectedBy && cropAffectedBy !== "insectPlague") {
    throw new Error(`Plot is affected by ${cropAffectedBy}`);
  }

  if (plot.crop?.plantedAt) {
    throw new Error(`Crop is already planted in plot ${plotId}`);
  }

  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  const {
    time: boostedTime,
    aoe,
    boostsUsed,
  } = getCropPlotTime({
    crop: cropName,
    game,
    plot,
    createdAt,
    prngArgs: {
      farmId,
      counter: game.farmActivity[`${cropName} Planted`] ?? 0,
    },
  });

  const activityName: FarmActivityName = `${cropName} Planted`;

  game.farmActivity = trackFarmActivity(activityName, game.farmActivity);

  const updatedPlot: CropPlot = {
    ...plot,
    crop: {
      id: cropId,
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

  return {
    updatedPlot,
    boostedTime,
    aoe,
    boostsUsed,
  };
}

export function plant({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops: plots } = stateCopy;

    if (!action.item) {
      throw new Error("No seed selected");
    }

    if (!(action.item in SEEDS)) {
      throw new Error("Not a seed");
    }

    if (
      !SEASONAL_SEEDS[stateCopy.season.season].includes(action.item as SeedName)
    ) {
      throw new Error("This seed is not available in this season");
    }

    const cropName = action.item.split(" ")[0] as CropName;
    const cropId = action.cropId || crypto.randomUUID().slice(0, 8);

    const { updatedPlot, aoe, boostsUsed } = plantCropOnPlot({
      plotId: action.index,
      cropName,
      cropId,
      game: stateCopy,
      createdAt,
      seedItem: action.item,
      farmId,
    });

    stateCopy.aoe = aoe;
    plots[action.index] = updatedPlot;
    stateCopy.inventory[action.item] = stateCopy.inventory[action.item]?.sub(1);
    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
