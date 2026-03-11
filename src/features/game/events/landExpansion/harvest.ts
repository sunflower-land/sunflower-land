import {
  AOE,
  BoostName,
  CriticalHitName,
  GameState,
  PlantedCrop,
  Reward,
  Skills,
  TemperateSeasonName,
} from "../../types/game";
import {
  Crop,
  CropName,
  CROPS,
  GreenHouseCropName,
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
  isOvernightCrop,
} from "../../types/crops";
import { SEASONAL_SEEDS, SeedName } from "features/game/types/seeds";
import Decimal from "decimal.js-light";
import { CropPlot } from "features/game/types/game";
import { produce } from "immer";
import {
  Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import {
  isCollectibleBuilt,
  isTemporaryCollectibleActive,
} from "features/game/lib/collectibleBuilt";
import { FACTION_ITEMS } from "features/game/lib/factions";
import {
  getBudYieldBoosts,
  isPlotCrop,
} from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import {
  getActiveCalendarEvent,
  getActiveGuardian,
} from "features/game/types/calendar";
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
  FarmActivityName,
} from "features/game/types/farmActivity";
import { isBuffActive } from "features/game/types/buffs";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
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

export const isReadyToHarvest = (
  createdAt: number,
  plantedCrop: PlantedCrop,
  cropDetails: Crop,
) => {
  return createdAt - plantedCrop.plantedAt >= cropDetails.harvestSeconds * 1000;
};

export function isCropGrowing(plot: CropPlot) {
  const crop = plot.crop;
  if (!crop) return false;

  const cropDetails = CROPS[crop.name];
  return !isReadyToHarvest(Date.now(), crop, cropDetails);
}

type CropYieldAmountArgs = {
  crop: CropName | GreenHouseCropName;
  plot?: CropPlot;
  game: GameState;
  createdAt: number;
  prngArgs: { farmId: number; counter: number };
};

const getMultiplicativeCropYield = ({
  crop,
  game,
  prngArgs,
}: CropYieldAmountArgs) => {
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const { inventory } = game;

  const itemId = KNOWN_IDS[crop];
  const criticalDrop = (criticalHitName: CriticalHitName, chance: number) =>
    prngChance({ ...prngArgs, itemId, chance, criticalHitName });

  if (
    isWearableActive({ name: "Green Amulet", game }) &&
    criticalDrop("Green Amulet", 10)
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

  return { amount, boostsUsed };
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
} {
  const { amount: multiplicativeAmount, boostsUsed } =
    getMultiplicativeCropYield({
      crop,
      game,
      plot,
      createdAt,
      prngArgs,
    });
  let amount = multiplicativeAmount;

  const { bumpkin, buds, aoe } = game;
  const updatedAoe = cloneDeep(aoe);
  const skills = bumpkin?.skills ?? {};
  const itemId = KNOWN_IDS[crop];
  const criticalDrop = (criticalHitName: CriticalHitName, chance: number) =>
    prngChance({ ...prngArgs, itemId, chance, criticalHitName });

  if (isBuffActive({ buff: "Power hour", game })) {
    amount += 0.2;
  }

  if (
    crop === "Potato" &&
    isCollectibleBuilt({ name: "Peeled Potato", game }) &&
    criticalDrop("Peeled Potato", 20)
  ) {
    amount += 1;
    boostsUsed.push({ name: "Peeled Potato", value: "+1" });
  }

  if (
    crop === "Potato" &&
    isCollectibleBuilt({ name: "Potent Potato", game }) &&
    criticalDrop("Potent Potato", 10 / 3)
  ) {
    amount += 10;
    boostsUsed.push({ name: "Potent Potato", value: "+10" });
  }

  if (
    crop === "Sunflower" &&
    isCollectibleBuilt({ name: "Stellar Sunflower", game }) &&
    criticalDrop("Stellar Sunflower", 10 / 3)
  ) {
    amount += 10;
    boostsUsed.push({ name: "Stellar Sunflower", value: "+10" });
  }

  if (
    crop === "Radish" &&
    isCollectibleBuilt({ name: "Radical Radish", game }) &&
    criticalDrop("Radical Radish", 10 / 3)
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

  if (plot?.fertiliser?.name === "Sprout Mix") {
    amount += 0.2;
    boostsUsed.push({ name: "Sprout Mix", value: "+0.2" });
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
        CROPS[crop].harvestSeconds * 1000 - (plot?.crop?.boostedTime ?? 0),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Scary Mike", { dx, dy }, createdAt);

        if (game.bumpkin.skills["Horror Mike"]) {
          amount = amount + 0.3;
          boostsUsed.push({ name: "Horror Mike", value: "+0.3" });
        } else {
          amount = amount + 0.2;
        }
      }
      boostsUsed.push({ name: "Scary Mike", value: "+0.2" });
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
        CROPS[crop].harvestSeconds * 1000 - (plot?.crop?.boostedTime ?? 0),
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
        CROPS[crop].harvestSeconds * 1000 - (plot.crop?.boostedTime ?? 0),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(
          updatedAoe,
          "Laurie the Chuckle Crow",
          { dx, dy },
          createdAt,
        );
        if (game.bumpkin.skills["Laurie's Gains"]) {
          amount = amount + 0.3;
          boostsUsed.push({ name: "Laurie's Gains", value: "+0.3" });
        } else {
          amount = amount + 0.2;
        }
      }
      boostsUsed.push({ name: "Laurie the Chuckle Crow", value: "+0.2" });
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
        CROPS[crop].harvestSeconds * 1000 - (plot?.crop?.boostedTime ?? 0),
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
        CROPS[crop].harvestSeconds * 1000 - (plot?.crop?.boostedTime ?? 0),
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
    let beeSwarmBonus = 0.2;
    boostsUsed.push({ name: "Bee Swarm Bonus", value: "+0.2" });
    if (skills["Pollen Power Up"]) {
      beeSwarmBonus += 0.1;
      boostsUsed.push({ name: "Pollen Power Up", value: "+0.1" });
    }
    // Multiply by the amount of stacked beeswarms
    beeSwarmBonus *= plot.beeSwarm.count;
    amount += beeSwarmBonus;
  }

  if (crop === "Soybean" && isCollectibleBuilt({ name: "Soybliss", game })) {
    amount += 1;
    boostsUsed.push({ name: "Soybliss", value: "+1" });
  }

  if (skills["Young Farmer"] && isBasicCrop(crop)) {
    amount += 0.1;
    boostsUsed.push({ name: "Young Farmer", value: "+0.1" });
  }

  if (skills["Experienced Farmer"] && isMediumCrop(crop)) {
    amount += 0.1;
    boostsUsed.push({ name: "Experienced Farmer", value: "+0.1" });
  }

  if (skills["Old Farmer"] && isAdvancedCrop(crop)) {
    amount += 0.1;
    boostsUsed.push({ name: "Old Farmer", value: "+0.1" });
  }

  if (skills["Acre Farm"] && isAdvancedCrop(crop)) {
    amount += 1;
    boostsUsed.push({ name: "Acre Farm", value: "+1" });
  }

  if (skills["Acre Farm"] && isMediumCrop(crop)) {
    amount -= 0.5;
    boostsUsed.push({ name: "Acre Farm", value: "-0.5" });
  }

  if (skills["Acre Farm"] && isBasicCrop(crop)) {
    amount -= 0.5;
    boostsUsed.push({ name: "Acre Farm", value: "-0.5" });
  }

  if (skills["Hectare Farm"] && isAdvancedCrop(crop)) {
    amount -= 0.5;
    boostsUsed.push({ name: "Hectare Farm", value: "-0.5" });
  }

  if (skills["Hectare Farm"] && isMediumCrop(crop)) {
    amount += 1;
    boostsUsed.push({ name: "Hectare Farm", value: "+1" });
  }

  if (skills["Hectare Farm"] && isBasicCrop(crop)) {
    amount += 1;
    boostsUsed.push({ name: "Hectare Farm", value: "+1" });
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

  if (
    skills["Golden Sunflower"] &&
    crop === "Sunflower" &&
    getPrngChance("Golden Sunflower", 1 / 7)
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

  const { name: cropName, plantedAt } = plot.crop;

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

  const { harvestSeconds } = CROPS[cropName];

  if (createdAt - plantedAt < harvestSeconds * 1000) {
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

    return stateCopy;
  });
}
