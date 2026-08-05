import type {
  AOE,
  BoostName,
  CriticalHitName,
  CropFertiliser,
  GameState,
  PlantedCrop,
  Reward,
  Skills,
  TemperateSeasonName,
} from "../../types/game";
import {
  type Crop,
  type CropName,
  CROPS,
  type GreenHouseCropName,
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
  isOvernightCrop,
} from "../../types/crops";
import { SEASONAL_SEEDS, type SeedName } from "features/game/types/seeds";
import Decimal from "decimal.js-light";
import type { CropPlot } from "features/game/types/game";
import { produce } from "immer";
import {
  type Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import {
  isCollectibleBuilt,
  isTemporaryCollectibleActive,
} from "features/game/lib/collectibleBuilt";
import {
  computeReadyAt,
  getCropFertiliserWindows,
  getCropPlotBoostWindows,
} from "features/game/lib/boostWindows";
import { FACTION_ITEMS } from "features/game/lib/factions";
import {
  getBudYieldBoosts,
  isPlotCrop,
} from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { getActiveGuardian } from "features/game/lib/getActiveGuardian";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { setPrecision } from "lib/utils/formatNumber";
import { isGreenhouseCrop } from "./plantGreenhouse";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import cloneDeep from "lodash.clonedeep";
import {
  canUseYieldBoostAOE,
  isCollectibleOnFarm,
  setAOELastUsed,
} from "features/game/lib/aoe";
import { getAffectedWeather } from "./plant";
import {
  trackFarmActivity,
  type FarmActivityName,
} from "features/game/types/farmActivity";
import { isBuffActive } from "features/game/types/buffs";
import {
  SKILL_RANKS,
  getSkillLevel,
  downgradeChapterCropWeekSkills,
} from "features/game/types/bumpkinSkills";
import { CHAPTER_CROP_WEEK_CROP } from "features/game/types/chapterCropWeek";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { mfTrack } from "lib/moonforgeAnalytics";
export type LandExpansionHarvestAction = {
  type: "crop.harvested";
  index: string;
};

type Options = {
  state: GameState;
  action: LandExpansionHarvestAction;
  createdAt?: number;
  farmId?: number;
};

export const isSummerCrop = (
  cropName: CropName | GreenHouseCropName,
  season: TemperateSeasonName,
  seasonalSeeds: Record<TemperateSeasonName, SeedName[]>,
): boolean => {
  if (season !== "summer") return false;
  return seasonalSeeds.summer.includes(`${cropName} Seed` as SeedName);
};
export const isAutumnCrop = (
  cropName: CropName | GreenHouseCropName,
  season: TemperateSeasonName,
  seasonalSeeds: Record<TemperateSeasonName, SeedName[]>, // 🔄 Pass as argument
): boolean => {
  if (season !== "autumn") return false;
  return seasonalSeeds.autumn.includes(`${cropName} Seed` as SeedName);
};
export const isSpringCrop = (
  cropName: CropName | GreenHouseCropName,
  season: TemperateSeasonName,
  seasonalSeeds: Record<TemperateSeasonName, SeedName[]>, // 🔄 Pass as argument
): boolean => {
  if (season !== "spring") return false;
  return seasonalSeeds.spring.includes(`${cropName} Seed` as SeedName);
};
export const isWinterCrop = (
  cropName: CropName | GreenHouseCropName,
  season: TemperateSeasonName,
  seasonalSeeds: Record<TemperateSeasonName, SeedName[]>, // 🔄 Pass as argument
): boolean => {
  if (season !== "winter") return false;
  return seasonalSeeds.winter.includes(`${cropName} Seed` as SeedName);
};

/**
 * When a planted crop is ready, across both boost models. New crops (with
 * `baseDurationMs`) derive their ready time live from the crop-plot speed windows
 * plus any per-plot fertiliser (Rapid Root / Sproutroot Surprise) window; legacy
 * crops use their back-dated `plantedAt` + base grow time.
 *
 * Branching on `baseDurationMs` — NOT the `SPEED_BOOSTS` flag — is intentional:
 * the marker makes a crop permanently speed-rate, so it keeps windowed timing
 * (and its baked permanent boosts) even if the flag is rolled back, matching every
 * other windowed activity. The fertiliser windows are merged unconditionally here
 * for the same reason as the collectible windows; only the plant / fertilise WRITE
 * paths gate on the flag.
 */
export const getCropReadyAt = (
  plantedCrop: PlantedCrop,
  cropDetails: Crop,
  game: GameState,
  fertiliser?: CropFertiliser,
): number => {
  if (plantedCrop.baseDurationMs !== undefined) {
    return computeReadyAt({
      startedAt: plantedCrop.plantedAt,
      baseDurationMs: plantedCrop.baseDurationMs,
      windows: [
        ...getCropPlotBoostWindows(game),
        ...getCropFertiliserWindows(fertiliser),
      ],
    });
  }

  return plantedCrop.plantedAt + cropDetails.harvestSeconds * 1000;
};

export const isReadyToHarvest = (
  now: number,
  plantedCrop: PlantedCrop,
  cropDetails: Crop,
  game: GameState,
  fertiliser?: CropFertiliser,
) => {
  return now >= getCropReadyAt(plantedCrop, cropDetails, game, fertiliser);
};

export function isCropGrowing(plot: CropPlot, game: GameState) {
  const crop = plot.crop;
  if (!crop) return false;

  const cropDetails = CROPS[crop.name];
  return !isReadyToHarvest(
    Date.now(),
    crop,
    cropDetails,
    game,
    plot.fertiliser,
  );
}

/**
 * The crop's real grow duration (ms), used to gate AOE yield-boost
 * re-availability. New crops derive it from the live speed windows so an active
 * Sparrow Shrine shortens it to match the actual time-to-harvest (matching how
 * legacy crops folded the shrine into `boostedTime`); legacy crops keep their
 * back-dated boosted time.
 */
const getCropGrowDurationMs = (
  cropName: CropName | GreenHouseCropName,
  plantedCrop: PlantedCrop | undefined,
  game: GameState,
  fertiliser?: CropFertiliser,
): number => {
  const cropDetails = CROPS[cropName as CropName];
  return plantedCrop?.baseDurationMs !== undefined
    ? getCropReadyAt(plantedCrop, cropDetails, game, fertiliser) -
        plantedCrop.plantedAt
    : cropDetails.harvestSeconds * 1000 - (plantedCrop?.boostedTime ?? 0);
};

type CropYieldAmountArgs = {
  crop: CropName | GreenHouseCropName;
  plot?: CropPlot;
  game: GameState;
  createdAt: number;
  /**
   * When omitted, all chance-based crit drops resolve to `false`. Use
   * this for previews / hover tooltips where probabilistic boosts must
   * not appear.
   */
  prngArgs?: { farmId: number; counter: number };
};

const getMultiplicativeCropYield = ({
  crop,
  game,
  prngArgs,
}: CropYieldAmountArgs) => {
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];
  const chanceBoostsUsed: { name: BoostName; value: string; chance: number }[] =
    [];

  const { inventory } = game;

  const itemId = KNOWN_IDS[crop];
  const criticalDrop = (
    criticalHitName: CriticalHitName,
    chance: number,
    value: string,
  ) => {
    if (!prngArgs) {
      chanceBoostsUsed.push({ name: criticalHitName, value, chance });
      return false;
    }
    return prngChance({ ...prngArgs, itemId, chance, criticalHitName });
  };

  if (
    isWearableActive({ name: "Green Amulet", game }) &&
    criticalDrop("Green Amulet", 10, "x10")
  ) {
    amount *= 10;
    boostsUsed.push({ name: "Green Amulet", value: "x10" });
  }
  if (
    crop === "Cauliflower" &&
    isCollectibleBuilt({ name: "Golden Cauliflower", game })
  ) {
    amount *= 2;
    boostsUsed.push({ name: "Golden Cauliflower", value: "x2" });
  }

  if (crop === "Carrot" && isCollectibleBuilt({ name: "Easter Bunny", game })) {
    amount *= 1.2;
    boostsUsed.push({ name: "Easter Bunny", value: "x1.2" });
  }

  if (
    crop === "Pumpkin" &&
    isCollectibleBuilt({ name: "Victoria Sisters", game })
  ) {
    amount *= 1.2;
    boostsUsed.push({ name: "Victoria Sisters", value: "x1.2" });
  }

  if (crop === "Parsnip" && isWearableActive({ name: "Parsnip", game })) {
    amount *= 1.2;
    boostsUsed.push({ name: "Parsnip", value: "x1.2" });
  }

  if (
    crop === "Beetroot" &&
    isWearableActive({ name: "Beetroot Amulet", game })
  ) {
    amount *= 1.2;
    boostsUsed.push({ name: "Beetroot Amulet", value: "x1.2" });
  }

  if (
    crop === "Sunflower" &&
    isWearableActive({ name: "Sunflower Amulet", game })
  ) {
    amount *= 1.1;
    boostsUsed.push({ name: "Sunflower Amulet", value: "x1.1" });
  }

  // Generic crop multipliers
  const scarecrow = isCollectibleBuilt({ name: "Scarecrow", game });
  const kuebiko = isCollectibleBuilt({ name: "Kuebiko", game });
  if (scarecrow || kuebiko) {
    amount *= 1.2;
    if (kuebiko) boostsUsed.push({ name: "Kuebiko", value: "x1.2" });
    else if (scarecrow) boostsUsed.push({ name: "Scarecrow", value: "x1.2" });
  }

  if (inventory.Coder?.gte(1)) {
    amount *= 1.2;
    boostsUsed.push({ name: "Coder", value: "x1.2" });
  }

  return { amount, boostsUsed, chanceBoostsUsed };
};

/**
 * Based on items, the output will be different
 */
export function getCropYieldAmount({
  crop,
  game,
  plot,
  createdAt,
  prngArgs,
}: CropYieldAmountArgs): {
  amount: number;
  aoe: AOE;
  boostsUsed: { name: BoostName; value: string }[];
  chanceBoostsUsed: { name: BoostName; value: string; chance: number }[];
} {
  const {
    amount: multiplicativeAmount,
    boostsUsed,
    chanceBoostsUsed,
  } = getMultiplicativeCropYield({
    crop,
    game,
    plot,
    createdAt,
    prngArgs,
  });
  let amount = multiplicativeAmount;

  const { bumpkin, buds, aoe } = game;
  const updatedAoe = cloneDeep(aoe);
  // Saltwort (the CHAPTER_CROP_WEEK event crop) ignores upgraded Crops-skill ranks
  // (base skill still applies) — cap here so every downstream yield/AOE read uses
  // the neutralised ranks without touching the player's stored skills.
  const skills =
    crop === CHAPTER_CROP_WEEK_CROP
      ? downgradeChapterCropWeekSkills(bumpkin?.skills ?? {})
      : (bumpkin?.skills ?? {});
  const itemId = KNOWN_IDS[crop];
  const criticalDrop = (
    criticalHitName: CriticalHitName,
    chance: number,
    value: string,
  ) => {
    if (!prngArgs) {
      chanceBoostsUsed.push({ name: criticalHitName, value, chance });
      return false;
    }
    return prngChance({ ...prngArgs, itemId, chance, criticalHitName });
  };

  if (isBuffActive({ buff: "Power hour", game, now: createdAt })) {
    amount += 0.2;
  }

  if (
    crop === "Potato" &&
    isCollectibleBuilt({ name: "Peeled Potato", game }) &&
    criticalDrop("Peeled Potato", 20, "+1")
  ) {
    amount += 1;
    boostsUsed.push({ name: "Peeled Potato", value: "+1" });
  }

  if (
    crop === "Potato" &&
    isCollectibleBuilt({ name: "Potent Potato", game }) &&
    criticalDrop("Potent Potato", 10 / 3, "+10")
  ) {
    amount += 10;
    boostsUsed.push({ name: "Potent Potato", value: "+10" });
  }

  if (
    crop === "Sunflower" &&
    isCollectibleBuilt({ name: "Stellar Sunflower", game }) &&
    criticalDrop("Stellar Sunflower", 10 / 3, "+10")
  ) {
    amount += 10;
    boostsUsed.push({ name: "Stellar Sunflower", value: "+10" });
  }

  if (
    crop === "Radish" &&
    isCollectibleBuilt({ name: "Radical Radish", game }) &&
    criticalDrop("Radical Radish", 10 / 3, "+10")
  ) {
    amount += 10;
    boostsUsed.push({ name: "Radical Radish", value: "+10" });
  }

  if (crop === "Cabbage") {
    // Yields + 0.25 Cabagge with Cabbage boy and +0.5 if Cabbage Boy and Girl are built
    if (isCollectibleBuilt({ name: "Cabbage Boy", game })) {
      amount += 0.25;

      if (isCollectibleBuilt({ name: "Cabbage Girl", game })) {
        amount += 0.25;
        boostsUsed.push({ name: "Cabbage Girl", value: "+0.25" });
      }
      boostsUsed.push({ name: "Cabbage Boy", value: "+0.25" });
    } else if (isCollectibleBuilt({ name: "Karkinos", game })) {
      // Yields +0.1 Cabbage with Karkinos
      amount += 0.1;
      boostsUsed.push({ name: "Karkinos", value: "+0.1" });
    }
  }

  if (
    crop === "Carrot" &&
    isCollectibleBuilt({ name: "Pablo The Bunny", game })
  ) {
    amount += 0.1;
    boostsUsed.push({ name: "Pablo The Bunny", value: "+0.1" });
  }

  if (crop === "Kale" && isCollectibleBuilt({ name: "Foliant", game })) {
    amount += 0.2;
    boostsUsed.push({ name: "Foliant", value: "+0.2" });
  }

  if (
    crop === "Eggplant" &&
    isCollectibleBuilt({ name: "Purple Trail", game })
  ) {
    amount += 0.2;
    boostsUsed.push({ name: "Purple Trail", value: "+0.2" });
  }

  if (crop === "Eggplant" && isCollectibleBuilt({ name: "Maximus", game })) {
    amount += 1;
    boostsUsed.push({ name: "Maximus", value: "+1" });
  }

  if (
    crop === "Eggplant" &&
    isWearableActive({ name: "Eggplant Onesie", game })
  ) {
    amount += 0.1;
    boostsUsed.push({ name: "Eggplant Onesie", value: "+0.1" });
  }

  if (
    crop === "Artichoke" &&
    isCollectibleBuilt({ name: "Giant Artichoke", game })
  ) {
    amount += 2;
    boostsUsed.push({ name: "Giant Artichoke", value: "+2" });
  }

  if (crop === "Yam" && isCollectibleBuilt({ name: "Giant Yam", game })) {
    amount += 0.5;
    boostsUsed.push({ name: "Giant Yam", value: "+0.5" });
  }

  if (crop === "Soybean" && isWearableActive({ name: "Tofu Mask", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Tofu Mask", value: "+0.1" });
  }

  if (crop === "Corn" && isWearableActive({ name: "Corn Onesie", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Corn Onesie", value: "+0.1" });
  }

  if (crop === "Corn" && isWearableActive({ name: "Corn Silk Hair", game })) {
    amount += 2;
    boostsUsed.push({ name: "Corn Silk Hair", value: "+2" });
  }

  if (crop === "Wheat" && isWearableActive({ name: "Sickle", game })) {
    amount += 2;
    boostsUsed.push({ name: "Sickle", value: "+2" });
  }

  // Barley
  if (
    crop === "Barley" &&
    isCollectibleBuilt({ name: "Sheaf of Plenty", game })
  ) {
    amount += 2;
    boostsUsed.push({ name: "Sheaf of Plenty", value: "+2" });
  }

  if (crop === "Kale" && isCollectibleBuilt({ name: "Giant Kale", game })) {
    amount += 2;
    boostsUsed.push({ name: "Giant Kale", value: "+2" });
  }

  const sproutMixYieldFertiliser = plot?.fertiliser?.name;
  if (
    sproutMixYieldFertiliser === "Sprout Mix" ||
    sproutMixYieldFertiliser === "Sproutroot Surprise"
  ) {
    amount += 0.2;
    boostsUsed.push({ name: sproutMixYieldFertiliser, value: "+0.2" });
    if (isCollectibleBuilt({ name: "Knowledge Crab", game })) {
      amount += 0.2;
      boostsUsed.push({ name: "Knowledge Crab", value: "+0.2" });
    }
  }

  //Seasonal Additions
  if (
    isSpringCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Blossom Ward", game })
  ) {
    amount += 1;
    boostsUsed.push({ name: "Blossom Ward", value: "+1" });
  }

  if (
    isWinterCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Frozen Heart", game })
  ) {
    amount += 1;
    boostsUsed.push({ name: "Frozen Heart", value: "+1" });
  }

  // Generic crop additions
  if (isWearableActive({ name: "Infernal Pitchfork", game })) {
    amount += 3;
    boostsUsed.push({ name: "Infernal Pitchfork", value: "+3" });
  }

  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    amount += 1;
    boostsUsed.push({ name: "Legendary Shrine", value: "+1" });
  }

  //Faction Quiver
  const factionName = game.faction?.name;
  if (
    factionName &&
    isWearableActive({
      game,
      name: FACTION_ITEMS[factionName].wings,
    })
  ) {
    amount += 0.25;
    boostsUsed.push({ name: FACTION_ITEMS[factionName].wings, value: "+0.25" });
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds ?? {}, crop);
  amount += yieldBoost;
  if (budUsed)
    boostsUsed.push({ name: budUsed, value: `+${yieldBoost.toString()}` });

  if (isOvernightCrop(crop) && isCollectibleBuilt({ name: "Hoot", game })) {
    amount += 0.5;
    boostsUsed.push({ name: "Hoot", value: "+0.5" });
  }

  if (
    isCollectibleOnFarm({ name: "Scary Mike", game }) &&
    isPlotCrop(crop) &&
    isMediumCrop(crop) &&
    plot &&
    plot.x !== undefined &&
    plot.y !== undefined
  ) {
    const dimensions = COLLECTIBLES_DIMENSIONS["Scary Mike"];
    const coordinates = game.collectibles["Scary Mike"]![0].coordinates!;

    const plotPosition = {
      x: plot.x,
      y: plot.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    const scaryMikePosition = { ...dimensions, ...coordinates };

    if (isWithinAOE("Scary Mike", scaryMikePosition, plotPosition, skills)) {
      const dx = plot.x - coordinates.x;
      const dy = plot.y - coordinates.y;

      const canUseAoe = canUseYieldBoostAOE(
        updatedAoe,
        "Scary Mike",
        { dx, dy },
        getCropGrowDurationMs(crop, plot?.crop, game, plot?.fertiliser),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Scary Mike", { dx, dy }, createdAt);

        const horrorMikeLevel = getSkillLevel(skills, "Horror Mike");
        if (horrorMikeLevel) {
          // Base Scary Mike +0.2 plus the skill's marginal bonus, rounded to
          // avoid float drift (0.2 + 0.1 = 0.30000000000000004).
          const total =
            Math.round(
              (0.2 + SKILL_RANKS["Horror Mike"].aoeYield[horrorMikeLevel - 1]) *
                100,
            ) / 100;
          amount = amount + total;
          boostsUsed.push({ name: "Horror Mike", value: `+${total}` });
        } else {
          amount = amount + 0.2;
          boostsUsed.push({ name: "Scary Mike", value: "+0.2" });
        }
      }
    }
  }

  // Chonky Scarecrow: adds a rank-scaled yield to basic crops inside the Basic
  // Scarecrow AOE. This is net-new (the collectible itself only reduces growth
  // time), and rank 1 grants no yield, so we skip when the bonus is 0. Uses a
  // dedicated "Chonky Scarecrow" cooldown slot so it never clobbers the Basic
  // Scarecrow growth-time AOE's slot.
  const chonkyScarecrowLevel = getSkillLevel(skills, "Chonky Scarecrow");
  if (
    chonkyScarecrowLevel &&
    SKILL_RANKS["Chonky Scarecrow"].aoeYield[chonkyScarecrowLevel - 1] > 0 &&
    isCollectibleOnFarm({ name: "Basic Scarecrow", game }) &&
    isPlotCrop(crop) &&
    isBasicCrop(crop) &&
    plot &&
    plot.x !== undefined &&
    plot.y !== undefined
  ) {
    const coordinates = game.collectibles["Basic Scarecrow"]![0].coordinates!;

    const plotPosition = {
      x: plot.x,
      y: plot.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    const basicScarecrowPosition = {
      ...COLLECTIBLES_DIMENSIONS["Basic Scarecrow"],
      ...coordinates,
    };

    if (
      isWithinAOE(
        "Basic Scarecrow",
        basicScarecrowPosition,
        plotPosition,
        skills,
      )
    ) {
      const dx = plot.x - coordinates.x;
      const dy = plot.y - coordinates.y;

      const canUseAoe = canUseYieldBoostAOE(
        updatedAoe,
        "Chonky Scarecrow",
        { dx, dy },
        getCropGrowDurationMs(crop, plot?.crop, game, plot?.fertiliser),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Chonky Scarecrow", { dx, dy }, createdAt);

        const bonus =
          SKILL_RANKS["Chonky Scarecrow"].aoeYield[chonkyScarecrowLevel - 1];
        amount = amount + bonus;
        boostsUsed.push({ name: "Chonky Scarecrow", value: `+${bonus}` });
      }
    }
  }

  if (
    isCollectibleOnFarm({ name: "Sir Goldensnout", game }) &&
    isPlotCrop(crop) &&
    plot &&
    plot.x !== undefined &&
    plot.y !== undefined
  ) {
    const dimensions = COLLECTIBLES_DIMENSIONS["Sir Goldensnout"];
    const coordinates = game.collectibles["Sir Goldensnout"]![0].coordinates!;
    const plotPosition = {
      x: plot.x,
      y: plot.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    const sirGoldensnoutPosition = { ...dimensions, ...coordinates };
    if (
      isWithinAOE(
        "Sir Goldensnout",
        sirGoldensnoutPosition,
        plotPosition,
        skills,
      )
    ) {
      const dx = plot.x - coordinates.x;
      const dy = plot.y - coordinates.y;

      const canUseAoe = canUseYieldBoostAOE(
        updatedAoe,
        "Sir Goldensnout",
        { dx, dy },
        getCropGrowDurationMs(crop, plot?.crop, game, plot?.fertiliser),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Sir Goldensnout", { dx, dy }, createdAt);
        amount = amount + 0.5;
      }
      boostsUsed.push({ name: "Sir Goldensnout", value: "+0.5" });
    }
  }

  if (
    isCollectibleOnFarm({ name: "Laurie the Chuckle Crow", game }) &&
    isPlotCrop(crop) &&
    isAdvancedCrop(crop) &&
    plot &&
    plot.x !== undefined &&
    plot.y !== undefined
  ) {
    const coordinates =
      game.collectibles["Laurie the Chuckle Crow"]![0].coordinates!;

    const laurieCrowPosition = {
      ...coordinates,
      ...COLLECTIBLES_DIMENSIONS["Laurie the Chuckle Crow"],
    };

    const plotPosition = {
      x: plot.x,
      y: plot.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    if (
      isWithinAOE(
        "Laurie the Chuckle Crow",
        laurieCrowPosition,
        plotPosition,
        skills,
      )
    ) {
      const dx = plotPosition.x - coordinates.x;
      const dy = plotPosition.y - coordinates.y;

      const canUseAoe = canUseYieldBoostAOE(
        updatedAoe,
        "Laurie the Chuckle Crow",
        { dx, dy },
        getCropGrowDurationMs(crop, plot.crop, game, plot.fertiliser),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(
          updatedAoe,
          "Laurie the Chuckle Crow",
          { dx, dy },
          createdAt,
        );
        const lauriesGainsLevel = getSkillLevel(skills, "Laurie's Gains");
        if (lauriesGainsLevel) {
          // Base Laurie +0.2 plus the skill's marginal bonus, rounded to avoid
          // float drift (0.2 + 0.1 = 0.30000000000000004).
          const total =
            Math.round(
              (0.2 +
                SKILL_RANKS["Laurie's Gains"].aoeYield[lauriesGainsLevel - 1]) *
                100,
            ) / 100;
          amount = amount + total;
          boostsUsed.push({ name: "Laurie's Gains", value: `+${total}` });
        } else {
          amount = amount + 0.2;
          boostsUsed.push({ name: "Laurie the Chuckle Crow", value: "+0.2" });
        }
      }
    }
  }

  if (
    isCollectibleOnFarm({ name: "Queen Cornelia", game }) &&
    crop === "Corn" &&
    plot &&
    plot.x !== undefined &&
    plot.y !== undefined
  ) {
    const coordinates = game.collectibles["Queen Cornelia"]![0].coordinates!;

    const queenCorneliaPosition = {
      ...coordinates,
      ...COLLECTIBLES_DIMENSIONS["Queen Cornelia"],
    };

    const plotPosition: Position = {
      x: plot.x,
      y: plot.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };
    if (
      isWithinAOE("Queen Cornelia", queenCorneliaPosition, plotPosition, skills)
    ) {
      const dx = plotPosition.x - coordinates.x;
      const dy = plotPosition.y - coordinates.y;

      const canUseAoe = canUseYieldBoostAOE(
        updatedAoe,
        "Queen Cornelia",
        { dx, dy },
        getCropGrowDurationMs(crop, plot?.crop, game, plot?.fertiliser),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Queen Cornelia", { dx, dy }, createdAt);
        amount = amount + 1;
      }
      boostsUsed.push({ name: "Queen Cornelia", value: "+1" });
    }
  }

  if (
    isCollectibleOnFarm({ name: "Gnome", game }) &&
    isCollectibleOnFarm({ name: "Cobalt", game }) &&
    isCollectibleOnFarm({ name: "Clementine", game }) &&
    isPlotCrop(crop) &&
    (isMediumCrop(crop) || isAdvancedCrop(crop)) &&
    plot &&
    plot.x !== undefined &&
    plot.y !== undefined
  ) {
    const gnomeCoordinates = game.collectibles["Gnome"]![0].coordinates!;
    const cobaltCoordinates = game.collectibles["Cobalt"]![0].coordinates!;
    const clementineCoordinates =
      game.collectibles["Clementine"]![0].coordinates!;

    const isColbatLeftOfGnome =
      cobaltCoordinates.y === gnomeCoordinates.y &&
      cobaltCoordinates.x + 1 === gnomeCoordinates.x;

    const isClementineRightOfGnome =
      clementineCoordinates.y === gnomeCoordinates.y &&
      clementineCoordinates.x - 1 === gnomeCoordinates.x;

    const plotPosition: Position = {
      x: plot.x,
      y: plot.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    if (
      isWithinAOE(
        "Gnome",
        { ...gnomeCoordinates, ...COLLECTIBLES_DIMENSIONS["Gnome"] },
        plotPosition,
        skills,
      ) &&
      isColbatLeftOfGnome &&
      isClementineRightOfGnome
    ) {
      const dx = 0;
      const dy = 1;

      const canUseAoe = canUseYieldBoostAOE(
        updatedAoe,
        "Gnome",
        { dx, dy },
        getCropGrowDurationMs(crop, plot?.crop, game, plot?.fertiliser),
        createdAt,
      );
      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Gnome", { dx, dy }, createdAt);
        amount += 10;
      }
      boostsUsed.push({ name: "Gnome", value: "+10" });
    }
  }

  if (crop === "Corn" && isCollectibleBuilt({ name: "Poppy", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Poppy", value: "+0.1" });
  }

  if (crop === "Pumpkin" && isCollectibleBuilt({ name: "Freya Fox", game })) {
    amount += 0.5;
    boostsUsed.push({ name: "Freya Fox", value: "+0.5" });
  }

  if (
    crop === "Carrot" &&
    isCollectibleBuilt({ name: "Lab Grown Carrot", game })
  ) {
    amount += 0.2;
    boostsUsed.push({ name: "Lab Grown Carrot", value: "+0.2" });
  }

  if (
    crop === "Pumpkin" &&
    isCollectibleBuilt({ name: "Lab Grown Pumpkin", game })
  ) {
    amount += 0.3;
    boostsUsed.push({ name: "Lab Grown Pumpkin", value: "+0.3" });
  }

  if (
    crop === "Radish" &&
    isCollectibleBuilt({ name: "Lab Grown Radish", game })
  ) {
    amount += 0.4;
    boostsUsed.push({ name: "Lab Grown Radish", value: "+0.4" });
  }

  if (plot?.beeSwarm) {
    const count = plot.beeSwarm.count;
    let perSwarm = 0.2;
    boostsUsed.push({
      name: "Bee Swarm Bonus",
      value: `+${(0.2 * count).toFixed(1)}`,
    });
    const pollenPowerUpLevel = getSkillLevel(skills, "Pollen Power Up");
    if (pollenPowerUpLevel) {
      const bonus =
        SKILL_RANKS["Pollen Power Up"].ranks[pollenPowerUpLevel - 1];
      perSwarm += bonus;
      boostsUsed.push({
        name: "Pollen Power Up",
        // toFixed(2) then back to Number to drop float noise AND trailing
        // zeros, so rank 1 still reads "+0.1" (not "+0.10").
        value: `+${Number((bonus * count).toFixed(2))}`,
      });
    }
    amount += perSwarm * count;
  }

  if (crop === "Soybean" && isCollectibleBuilt({ name: "Soybliss", game })) {
    amount += 1;
    boostsUsed.push({ name: "Soybliss", value: "+1" });
  }

  const youngFarmerLevel = getSkillLevel(skills, "Young Farmer");
  if (youngFarmerLevel && isBasicCrop(crop)) {
    const v = SKILL_RANKS["Young Farmer"].ranks[youngFarmerLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Young Farmer", value: `+${v}` });
  }

  const experiencedFarmerLevel = getSkillLevel(skills, "Experienced Farmer");
  if (experiencedFarmerLevel && isMediumCrop(crop)) {
    const v =
      SKILL_RANKS["Experienced Farmer"].ranks[experiencedFarmerLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Experienced Farmer", value: `+${v}` });
  }

  const oldFarmerLevel = getSkillLevel(skills, "Old Farmer");
  if (oldFarmerLevel && isAdvancedCrop(crop)) {
    const v = SKILL_RANKS["Old Farmer"].ranks[oldFarmerLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Old Farmer", value: `+${v}` });
  }

  const acreFarmLevel = getSkillLevel(skills, "Acre Farm");
  if (acreFarmLevel) {
    const { buff, debuff } = SKILL_RANKS["Acre Farm"];
    const up = buff[acreFarmLevel - 1];
    const down = debuff[acreFarmLevel - 1];
    if (isAdvancedCrop(crop)) {
      amount += up;
      boostsUsed.push({ name: "Acre Farm", value: `+${up}` });
    }
    if (isMediumCrop(crop) || isBasicCrop(crop)) {
      amount -= down;
      boostsUsed.push({ name: "Acre Farm", value: `-${down}` });
    }
  }

  const hectareFarmLevel = getSkillLevel(skills, "Hectare Farm");
  if (hectareFarmLevel) {
    const { buff, debuff } = SKILL_RANKS["Hectare Farm"];
    const up = buff[hectareFarmLevel - 1];
    const down = debuff[hectareFarmLevel - 1];
    if (isMediumCrop(crop) || isBasicCrop(crop)) {
      amount += up;
      boostsUsed.push({ name: "Hectare Farm", value: `+${up}` });
    }
    if (isAdvancedCrop(crop)) {
      amount -= down;
      boostsUsed.push({ name: "Hectare Farm", value: `-${down}` });
    }
  }

  if (isCollectibleBuilt({ game, name: "Giant Onion" }) && crop === "Onion") {
    amount += 3;
    boostsUsed.push({ name: "Giant Onion", value: "+3" });
  }

  /**
   * All boosts should be applied above this comment
   * Calendar events should be applied below this comment
   */

  // Insect plague
  const isInsectPlagueActive =
    getActiveCalendarEvent({ calendar: game.calendar }) === "insectPlague";
  const isProtected = game.calendar.insectPlague?.protected;

  if (isInsectPlagueActive && !isProtected) {
    amount = amount * 0.5;
  }

  if (
    getActiveCalendarEvent({ calendar: game.calendar }) === "bountifulHarvest"
  ) {
    amount += 1;
    boostsUsed.push({ name: "bountifulHarvest", value: "+1" });
    const { activeGuardian } = getActiveGuardian({
      game,
    });
    if (activeGuardian) {
      amount += 1;
      boostsUsed.push({ name: activeGuardian, value: "+1" });
    }
  }

  return {
    amount: Number(setPrecision(amount)),
    aoe: updatedAoe,
    boostsUsed,
    chanceBoostsUsed,
  };
}

/**
 * A random reward of items. Opened on harvest.
 */
export function getReward({
  crop,
  skills,
  prngArgs,
}: {
  crop: CropName | GreenHouseCropName;
  skills: Skills;
  prngArgs: { farmId: number; counter: number };
}): {
  reward: Reward | undefined;
  boostUsed: { name: BoostName; value: string }[];
} {
  const items: Reward["items"] = [];
  const boostUsed: { name: BoostName; value: string }[] = [];
  const itemId = KNOWN_IDS[crop];

  const getPrngChance = (criticalHitName: CriticalHitName, chance: number) =>
    prngChance({
      ...prngArgs,
      itemId,
      chance,
      criticalHitName,
    });

  const goldenSunflowerLevel = getSkillLevel(skills, "Golden Sunflower");
  if (
    goldenSunflowerLevel &&
    crop === "Sunflower" &&
    getPrngChance(
      "Golden Sunflower",
      SKILL_RANKS["Golden Sunflower"].ranks[goldenSunflowerLevel - 1],
    )
  ) {
    items.push({
      amount: 0.35,
      name: "Gold",
    });
    boostUsed.push({ name: "Golden Sunflower", value: "+0.35" });
  }

  // 1 out of 20 chance
  if (getPrngChance(crop, 5)) {
    const seedName: SeedName = `${crop} Seed`;
    const amount = getPrngChance(seedName, 50) ? 2 : 3;
    // Return the same seed for them as a reward
    items.push({
      amount,
      name: seedName,
    });
  }

  return items.length > 0
    ? { reward: { items }, boostUsed }
    : { reward: undefined, boostUsed };
}

export function harvestCropFromPlot({
  plotId,
  game,
  createdAt,
  farmId,
}: {
  plotId: string;
  game: GameState;
  createdAt: number;
  farmId: number;
}): {
  updatedPlot: CropPlot;
  amount: number;
  aoe: AOE;
  boostsUsed: { name: BoostName; value: string }[];
  cropName: CropName;
} {
  const { crops: plots, bumpkin } = game;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const plot = plots[plotId];

  if (!plot) {
    throw new Error("Plot does not exist");
  }

  const cropAffectedBy = getAffectedWeather({
    id: plotId,
    game,
  });

  if (cropAffectedBy) {
    throw new Error(`Plot is affected by ${cropAffectedBy}`);
  }

  if (!plot.crop) {
    throw new Error("Nothing was planted");
  }

  const { name: cropName } = plot.crop;

  const counter = game.farmActivity[`${cropName} Harvested`] ?? 0;

  const {
    amount,
    aoe,
    boostsUsed: cropYieldBoostsUsed,
  } = plot.crop.amount
    ? { amount: plot.crop.amount, aoe: game.aoe, boostsUsed: [] }
    : getCropYieldAmount({
        crop: cropName,
        game,
        plot,
        createdAt,
        prngArgs: { farmId, counter },
      });

  if (
    !isReadyToHarvest(
      createdAt,
      plot.crop,
      CROPS[cropName],
      game,
      plot.fertiliser,
    )
  ) {
    throw new Error("Not ready");
  }

  const { reward, boostUsed: rewardBoostsUsed } = plot.crop.reward
    ? { reward: plot.crop.reward, boostUsed: [] }
    : getReward({
        crop: cropName,
        skills: bumpkin.skills ?? {},
        prngArgs: { farmId, counter },
      });

  if (reward) {
    if (reward.coins) {
      game.coins = game.coins + reward.coins;
    }

    if (reward.items) {
      game.inventory = reward.items.reduce((acc, item) => {
        const amount = acc[item.name] || new Decimal(0);

        return {
          ...acc,
          [item.name]: amount.add(item.amount),
        };
      }, game.inventory);
    }
  }

  const activityName: FarmActivityName = `${cropName} Harvested`;
  game.farmActivity = trackFarmActivity(activityName, game.farmActivity);

  // Create updated plot without crop data
  const updatedPlot: CropPlot = {
    ...plot,
  };
  delete updatedPlot.crop;
  delete updatedPlot.fertiliser;
  delete updatedPlot.beeSwarm;

  return {
    updatedPlot,
    amount,
    aoe,
    boostsUsed: [...cropYieldBoostsUsed, ...rewardBoostsUsed],
    cropName,
  };
}

export function harvest({
  state,
  action,
  createdAt = Date.now(),
  farmId = 0,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops: plots } = stateCopy;

    const { updatedPlot, amount, aoe, boostsUsed, cropName } =
      harvestCropFromPlot({
        plotId: action.index,
        game: stateCopy,
        createdAt,
        farmId,
      });

    stateCopy.aoe = aoe;
    plots[action.index] = updatedPlot;

    const cropCount = stateCopy.inventory[cropName] || new Decimal(0);
    stateCopy.inventory = {
      ...stateCopy.inventory,
      [cropName]: cropCount.add(amount),
    };

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    mfTrack("crop_harvested", { crop_type: cropName, amount });

    return stateCopy;
  });
}
