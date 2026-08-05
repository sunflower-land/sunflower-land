import Decimal from "decimal.js-light";

import {
  type CropName,
  CROPS,
  type GreenHouseCropName,
  isAdvancedCrop,
  isBasicCrop,
} from "../../types/crops";
import type {
  AOE,
  BoostName,
  Buildings,
  Bumpkin,
  Collectibles,
  CropPlot,
  GameState,
  Inventory,
  InventoryItemName,
  IslandType,
} from "../../types/game";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { hasFeatureAccess } from "lib/flags";
import {
  computeReadyAt,
  getCropPlotBoostWindows,
} from "features/game/lib/boostWindows";
import {
  SEASONAL_SEEDS,
  type SeedName,
  SEEDS,
} from "features/game/types/seeds";
import {
  CHAPTER_CROP_WEEK_CROP,
  CHAPTER_CROP_WEEK_SEED,
} from "features/game/types/chapterCropWeek";
import {
  isWithinAOE,
  type Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { getBudSpeedBoosts } from "features/game/lib/getBudSpeedBoosts";

import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import {
  type CalendarEventName,
  getActiveCalendarEvent,
} from "features/game/types/calendar";
import { getActiveGuardian } from "features/game/lib/getActiveGuardian";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import {
  canUseTimeBoostAOE,
  isCollectibleOnFarm,
  setAOEAvailableAt,
} from "features/game/lib/aoe";
import cloneDeep from "lodash.clonedeep";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getObjectEntries } from "lib/object";
import {
  type FarmActivityName,
  trackFarmActivity,
} from "features/game/types/farmActivity";
import { isBuffActive } from "features/game/types/buffs";
import {
  SKILL_RANKS,
  getSkillLevel,
  downgradeChapterCropWeekSkills,
} from "features/game/types/bumpkinSkills";
import { isAutumnCrop, isSummerCrop } from "./harvest";
import { getKeys } from "lib/object";
import { mfTrack } from "lib/moonforgeAnalytics";

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
export const INITIAL_SUPPORTED_PLOTS = (island: IslandType) =>
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
}: {
  game: GameState;
  crop: CropName | GreenHouseCropName;
}): { multiplier: number; boostsUsed: { name: BoostName; value: string }[] } {
  let multiplier = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];
  const { inventory, buds = {}, bumpkin } = game;
  // Saltwort is the CHAPTER_CROP_WEEK event crop: neutralise upgraded Crops skills
  // (they still apply at rank 1) so the event crop isn't boosted by ascension ranks.
  const skills =
    crop === CHAPTER_CROP_WEEK_CROP
      ? downgradeChapterCropWeekSkills(bumpkin?.skills ?? {})
      : (bumpkin?.skills ?? {});

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
  // Totems: under SPEED_BOOSTS they're a windowed 2× speed boost (see
  // boostWindows; Super & Time Warp merge so they don't stack) for BOTH crop
  // consumers — plot crops and greenhouse crops — so they're excluded from the
  // baked time here. The flag-off path keeps the legacy discount-at-start.
  const totemsWindowed = hasFeatureAccess(game, "SPEED_BOOSTS");
  if (!totemsWindowed && (hasSuperTotem || hasTimeWarpTotem)) {
    multiplier = multiplier * 0.5;
    if (hasSuperTotem) boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    else if (hasTimeWarpTotem)
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
  }

  // Harvest Hourglass: under SPEED_BOOSTS it's a retroactive speed-rate window
  // (see boostWindows) for BOTH crop consumers — plot crops and greenhouse
  // crops — so it's excluded from the baked time here (all crops keep the
  // legacy discount-at-start when the flag is off). Not recorded in boostsUsed
  // for the windowed case — contribution is derived over the grow.
  const harvestHourglassIsWindowed = hasFeatureAccess(game, "SPEED_BOOSTS");
  if (
    !harvestHourglassIsWindowed &&
    isTemporaryCollectibleActive({ name: "Harvest Hourglass", game })
  ) {
    multiplier = multiplier * 0.75;
    boostsUsed.push({ name: "Harvest Hourglass", value: "x0.75" });
  }

  const strongRootsLevel = getSkillLevel(skills, "Strong Roots");
  if (strongRootsLevel && isAdvancedCrop(crop)) {
    const m = SKILL_RANKS["Strong Roots"].ranks[strongRootsLevel - 1];
    multiplier = multiplier * m;
    boostsUsed.push({ name: "Strong Roots", value: `x${m}` });
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
}
/**
 * Based on boosts, how long a crop will take
 */
export const getCropPlotTime = ({
  crop,
  game,
  plot,
  createdAt,
}: GetCropPlotTimeArgs): {
  time: number;
  aoe: AOE;
  boostsUsed: { name: BoostName; value: string }[];
} => {
  const { aoe } = game;
  // Saltwort (the CHAPTER_CROP_WEEK event crop) ignores upgraded Crops-skill ranks.
  const skills =
    crop === CHAPTER_CROP_WEEK_CROP
      ? downgradeChapterCropWeekSkills(game.bumpkin.skills)
      : game.bumpkin.skills;
  const updatedAoe = cloneDeep(aoe);

  let seconds = CROPS[crop].harvestSeconds;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const { multiplier: baseMultiplier, boostsUsed: baseBoostsUsed } =
    getCropTime({
      game,
      crop,
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

  const greenThumbLevel = getSkillLevel(skills, "Green Thumb");
  if (greenThumbLevel) {
    const m = SKILL_RANKS["Green Thumb"].ranks[greenThumbLevel - 1];
    seconds = seconds * m;
    boostsUsed.push({ name: "Green Thumb", value: `x${m}` });
  }

  // Under the SPEED_BOOSTS model the Sparrow Shrine is a retroactive speed-rate
  // window applied at read time (see boostWindows). Without the flag it stays a
  // legacy discount-at-start multiplier baked in here.
  // Note: under the flag it is intentionally NOT recorded in `boostsUsed` here —
  // a windowed boost's contribution is determined over the grow (and may not
  // apply if the shrine is removed), not at plant time. If analytics ever needs
  // it, record it at harvest where it actually contributes.
  if (
    !hasFeatureAccess(game, "SPEED_BOOSTS") &&
    isTemporaryCollectibleActive({ name: "Sparrow Shrine", game })
  ) {
    seconds = seconds * 0.75;
    boostsUsed.push({ name: "Sparrow Shrine", value: "x0.75" });
  }

  // Power hour: under SPEED_BOOSTS it's a windowed 2× speed boost for plot crops
  // (see boostWindows); legacy / flag-off keeps the discount-at-start here.
  if (
    !hasFeatureAccess(game, "SPEED_BOOSTS") &&
    isBuffActive({ buff: "Power hour", game, now: createdAt })
  ) {
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

  // Rapid Root / Sproutroot Surprise: under SPEED_BOOSTS these are a windowed 2×
  // speed boost for the crop (see getCropFertiliserWindows); legacy / flag-off
  // bakes the discount-at-start here. (Sproutroot's +0.2 yield is separate.)
  if (
    !hasFeatureAccess(game, "SPEED_BOOSTS") &&
    (plot?.fertiliser?.name === "Rapid Root" ||
      plot?.fertiliser?.name === "Sproutroot Surprise")
  ) {
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

  // Sunshower: under SPEED_BOOSTS it's a windowed 2× (4× with a season Guardian)
  // speed boost for plot crops (see boostWindows); legacy / flag-off bakes the
  // discount-at-start here.
  const isSunshower =
    !hasFeatureAccess(game, "SPEED_BOOSTS") &&
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
        // Under the speed-rate model the crop is ready when accrued work hits
        // `seconds`, which the active windows reach sooner — so the AOE frees up
        // at the windowed ready time, not the raw duration.
        const aoeWaitTime = hasFeatureAccess(game, "SPEED_BOOSTS")
          ? computeReadyAt({
              startedAt: createdAt,
              baseDurationMs: seconds * 1000,
              windows: getCropPlotBoostWindows(game),
            }) - createdAt
          : seconds * 1000;
        setAOEAvailableAt(
          updatedAoe,
          "Basic Scarecrow",
          { dx, dy },
          createdAt,
          aoeWaitTime,
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

export function plantCropOnPlot({
  plotId,
  cropName,
  cropId,
  game,
  createdAt,
  seedItem,
}: {
  plotId: string;
  cropName: CropName;
  cropId: string;
  game: GameState;
  createdAt: number;
  seedItem: InventoryItemName;
}): {
  updatedPlot: CropPlot;
  boostedTime: number;
  aoe: AOE;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { inventory, crops: plots } = game;
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
  });

  const activityName: FarmActivityName = `${cropName} Planted`;

  game.farmActivity = trackFarmActivity(activityName, game.farmActivity);

  const updatedPlot: CropPlot = {
    ...plot,
    crop: hasFeatureAccess(game, "SPEED_BOOSTS")
      ? {
          id: cropId,
          // True plant time — Sparrow Shrine speed-up is derived live from
          // windows rather than baked in by back-dating plantedAt.
          plantedAt: createdAt,
          baseDurationMs: boostedTime * 1000,
          name: cropName,
        }
      : {
          id: cropId,
          plantedAt: getPlantedAt({
            crop: cropName,
            inventory: game.inventory,
            collectibles: game.collectibles,
            bumpkin: game.bumpkin,
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
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops: plots } = stateCopy;

    if (!action.item) {
      throw new Error("No seed selected");
    }

    if (!(action.item in SEEDS)) {
      throw new Error("Not a seed");
    }

    // The Chapter Crop Week seed is a limited-time event crop that is not tied
    // to a season, so it is exempt from the seasonal availability check.
    if (
      action.item !== CHAPTER_CROP_WEEK_SEED &&
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
    });

    stateCopy.aoe = aoe;
    plots[action.index] = updatedPlot;
    stateCopy.inventory[action.item] = stateCopy.inventory[action.item]?.sub(1);
    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    mfTrack("crop_planted", { crop_type: cropName });

    return stateCopy;
  });
}
