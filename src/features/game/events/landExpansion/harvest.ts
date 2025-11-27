import {
  AOE,
  BoostName,
  CriticalHitName,
  GameState,
  PlantedCrop,
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
export type LandExpansionHarvestAction = {
  type: "crop.harvested";
  index: string;
};

type Options = {
  state: GameState;
  action: LandExpansionHarvestAction;
  createdAt?: number;
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

/**
 * Based on items, the output will be different
 */
export function getCropYieldAmount({
  crop,
  game,
  plot,
  createdAt,
  criticalDrop = () => false,
}: {
  crop: CropName | GreenHouseCropName;
  plot?: CropPlot;
  game: GameState;
  createdAt: number;
  criticalDrop?: (name: CriticalHitName) => boolean;
}): { amount: number; aoe: AOE; boostsUsed: BoostName[] } {
  let amount = 1;
  const boostsUsed: BoostName[] = [];

  const { inventory, bumpkin, buds, aoe } = game;
  const updatedAoe = cloneDeep(aoe);
  const skills = bumpkin?.skills ?? {};

  // Specific crop multipliers
  if (
    crop === "Cauliflower" &&
    isCollectibleBuilt({ name: "Golden Cauliflower", game })
  ) {
    amount *= 2;
    boostsUsed.push("Golden Cauliflower");
  }

  if (crop === "Carrot" && isCollectibleBuilt({ name: "Easter Bunny", game })) {
    amount *= 1.2;
    boostsUsed.push("Easter Bunny");
  }

  if (
    crop === "Pumpkin" &&
    isCollectibleBuilt({ name: "Victoria Sisters", game })
  ) {
    amount *= 1.2;
    boostsUsed.push("Victoria Sisters");
  }

  if (crop === "Parsnip" && isWearableActive({ name: "Parsnip", game })) {
    amount *= 1.2;
    boostsUsed.push("Parsnip");
  }

  if (
    crop === "Beetroot" &&
    isWearableActive({ name: "Beetroot Amulet", game })
  ) {
    amount *= 1.2;
    boostsUsed.push("Beetroot Amulet");
  }

  if (
    crop === "Sunflower" &&
    isWearableActive({ name: "Sunflower Amulet", game })
  ) {
    amount *= 1.1;
    boostsUsed.push("Sunflower Amulet");
  }

  // Generic crop multipliers
  const scarecrow = isCollectibleBuilt({ name: "Scarecrow", game });
  const kuebiko = isCollectibleBuilt({ name: "Kuebiko", game });
  if (scarecrow || kuebiko) {
    amount *= 1.2;
    if (kuebiko) boostsUsed.push("Kuebiko");
    else if (scarecrow) boostsUsed.push("Scarecrow");
  }

  if (inventory.Coder?.gte(1)) {
    amount *= 1.2;
    boostsUsed.push("Coder");
  }

  if (
    isWearableActive({ name: "Green Amulet", game }) &&
    criticalDrop("Green Amulet")
  ) {
    amount *= 10;
    boostsUsed.push("Green Amulet");
  }

  // Specific crop additions
  if (
    crop === "Potato" &&
    isCollectibleBuilt({ name: "Peeled Potato", game }) &&
    criticalDrop("Peeled Potato")
  ) {
    amount += 1;
    boostsUsed.push("Peeled Potato");
  }

  if (crop === "Cabbage") {
    // Yields + 0.25 Cabagge with Cabbage boy and +0.5 if Cabbage Boy and Girl are built
    if (isCollectibleBuilt({ name: "Cabbage Boy", game })) {
      amount += 0.25;

      if (isCollectibleBuilt({ name: "Cabbage Girl", game })) {
        amount += 0.25;
        boostsUsed.push("Cabbage Girl");
      }
      boostsUsed.push("Cabbage Boy");
    }

    if (!isCollectibleBuilt({ name: "Cabbage Boy", game })) {
      // Yields +0.1 Cabbage with Karkinos
      if (isCollectibleBuilt({ name: "Karkinos", game })) {
        amount += 0.1;
        boostsUsed.push("Karkinos");
      }
    }
  }

  if (
    crop === "Carrot" &&
    isCollectibleBuilt({ name: "Pablo The Bunny", game })
  ) {
    amount += 0.1;
    boostsUsed.push("Pablo The Bunny");
  }

  if (crop === "Kale" && isCollectibleBuilt({ name: "Foliant", game })) {
    amount += 0.2;
    boostsUsed.push("Foliant");
  }

  if (
    crop === "Eggplant" &&
    isCollectibleBuilt({ name: "Purple Trail", game })
  ) {
    amount += 0.2;
    boostsUsed.push("Purple Trail");
  }

  if (crop === "Eggplant" && isCollectibleBuilt({ name: "Maximus", game })) {
    amount += 1;
    boostsUsed.push("Maximus");
  }

  if (
    crop === "Eggplant" &&
    isWearableActive({ name: "Eggplant Onesie", game })
  ) {
    amount += 0.1;
    boostsUsed.push("Eggplant Onesie");
  }

  if (
    crop === "Artichoke" &&
    isCollectibleBuilt({ name: "Giant Artichoke", game })
  ) {
    amount += 2;
    boostsUsed.push("Giant Artichoke");
  }

  if (crop === "Yam" && isCollectibleBuilt({ name: "Giant Yam", game })) {
    amount += 0.5;
    boostsUsed.push("Giant Yam");
  }

  if (crop === "Soybean" && isWearableActive({ name: "Tofu Mask", game })) {
    amount += 0.1;
    boostsUsed.push("Tofu Mask");
  }

  if (crop === "Corn" && isWearableActive({ name: "Corn Onesie", game })) {
    amount += 0.1;
    boostsUsed.push("Corn Onesie");
  }

  if (crop === "Wheat" && isWearableActive({ name: "Sickle", game })) {
    amount += 2;
    boostsUsed.push("Sickle");
  }

  // Barley
  if (
    crop === "Barley" &&
    isCollectibleBuilt({ name: "Sheaf of Plenty", game })
  ) {
    amount += 2;
    boostsUsed.push("Sheaf of Plenty");
  }

  if (crop === "Kale" && isCollectibleBuilt({ name: "Giant Kale", game })) {
    amount += 2;
    boostsUsed.push("Giant Kale");
  }
  // Rice
  if (crop === "Rice" && isWearableActive({ name: "Non La Hat", game })) {
    amount += 1;
    boostsUsed.push("Non La Hat");
  }

  if (crop === "Rice" && isCollectibleBuilt({ name: "Rice Panda", game })) {
    amount += 0.25;
    boostsUsed.push("Rice Panda");
  }

  if (
    isGreenhouseCrop(crop) &&
    isCollectibleBuilt({ name: "Pharaoh Gnome", game })
  ) {
    amount += 2;
    boostsUsed.push("Pharaoh Gnome");
  }

  // Olive
  if (crop === "Olive" && isWearableActive({ name: "Olive Shield", game })) {
    amount += 1;
    boostsUsed.push("Olive Shield");
  }

  // Greenhouse Gamble 25% chance of +1 yield
  if (
    isGreenhouseCrop(crop) &&
    skills["Greenhouse Gamble"] &&
    criticalDrop("Greenhouse Gamble")
  ) {
    amount += 1;
    boostsUsed.push("Greenhouse Gamble");
  }

  if (plot?.fertiliser?.name === "Sprout Mix") {
    amount += 0.2;
    if (isCollectibleBuilt({ name: "Knowledge Crab", game })) {
      amount += 0.2;
      boostsUsed.push("Knowledge Crab");
    }
  }

  if (isGreenhouseCrop(crop) && skills["Glass Room"]) {
    amount += 0.1;
    boostsUsed.push("Glass Room");
  }

  if (isGreenhouseCrop(crop) && skills["Seeded Bounty"]) {
    amount += 0.5;
    boostsUsed.push("Seeded Bounty");
  }

  if (isGreenhouseCrop(crop) && skills["Greasy Plants"]) {
    amount += 1;
    boostsUsed.push("Greasy Plants");
  }

  if (
    crop === "Olive" &&
    isWearableActive({ game, name: "Olive Royalty Shirt" })
  ) {
    amount += 0.25;
    boostsUsed.push("Olive Royalty Shirt");
  }

  //Seasonal Additions
  if (
    isSpringCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Blossom Ward", game })
  ) {
    amount += 1;
    boostsUsed.push("Blossom Ward");
  }

  if (
    isWinterCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Frozen Heart", game })
  ) {
    amount += 1;
    boostsUsed.push("Frozen Heart");
  }

  // Generic crop additions
  if (isWearableActive({ name: "Infernal Pitchfork", game })) {
    amount += 3;
    boostsUsed.push("Infernal Pitchfork");
  }

  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    amount += 1;
    boostsUsed.push("Legendary Shrine");
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
    boostsUsed.push(FACTION_ITEMS[factionName].wings);
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds ?? {}, crop);
  amount += yieldBoost;
  if (budUsed) boostsUsed.push(budUsed);

  if (isOvernightCrop(crop) && isCollectibleBuilt({ name: "Hoot", game })) {
    amount += 0.5;
    boostsUsed.push("Hoot");
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
          boostsUsed.push("Horror Mike");
        } else {
          amount = amount + 0.2;
        }
      }
      boostsUsed.push("Scary Mike");
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
      boostsUsed.push("Sir Goldensnout");
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
          boostsUsed.push("Laurie's Gains");
        } else {
          amount = amount + 0.2;
        }
      }
      boostsUsed.push("Laurie the Chuckle Crow");
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
      boostsUsed.push("Queen Cornelia");
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
      boostsUsed.push("Gnome");
    }
  }

  if (crop === "Corn" && isCollectibleBuilt({ name: "Poppy", game })) {
    amount += 0.1;
    boostsUsed.push("Poppy");
  }

  if (crop === "Pumpkin" && isCollectibleBuilt({ name: "Freya Fox", game })) {
    amount += 0.5;
    boostsUsed.push("Freya Fox");
  }

  if (
    crop === "Carrot" &&
    isCollectibleBuilt({ name: "Lab Grown Carrot", game })
  ) {
    amount += 0.2;
    boostsUsed.push("Lab Grown Carrot");
  }

  if (
    crop === "Pumpkin" &&
    isCollectibleBuilt({ name: "Lab Grown Pumpkin", game })
  ) {
    amount += 0.3;
    boostsUsed.push("Lab Grown Pumpkin");
  }

  if (
    crop === "Radish" &&
    isCollectibleBuilt({ name: "Lab Grown Radish", game })
  ) {
    amount += 0.4;
    boostsUsed.push("Lab Grown Radish");
  }

  if (
    crop === "Potato" &&
    isCollectibleBuilt({ name: "Potent Potato", game }) &&
    criticalDrop("Potent Potato")
  ) {
    amount += 10;
    boostsUsed.push("Potent Potato");
  }

  if (
    crop === "Sunflower" &&
    isCollectibleBuilt({ name: "Stellar Sunflower", game }) &&
    criticalDrop("Stellar Sunflower")
  ) {
    amount += 10;
    boostsUsed.push("Stellar Sunflower");
  }

  if (
    crop === "Radish" &&
    isCollectibleBuilt({ name: "Radical Radish", game }) &&
    criticalDrop("Radical Radish")
  ) {
    amount += 10;
    boostsUsed.push("Radical Radish");
  }

  if (plot?.beeSwarm) {
    let beeSwarmBonus = 0.2;
    if (skills["Pollen Power Up"]) {
      beeSwarmBonus += 0.1;
      boostsUsed.push("Pollen Power Up");
    }
    // Multiply by the amount of stacked beeswarms
    beeSwarmBonus *= plot.beeSwarm.count;
    amount += beeSwarmBonus;
  }

  if (crop === "Soybean" && isCollectibleBuilt({ name: "Soybliss", game })) {
    amount += 1;
    boostsUsed.push("Soybliss");
  }

  if (skills["Young Farmer"] && isBasicCrop(crop)) {
    amount += 0.1;
    boostsUsed.push("Young Farmer");
  }

  if (skills["Experienced Farmer"] && isMediumCrop(crop)) {
    amount += 0.1;
    boostsUsed.push("Experienced Farmer");
  }

  if (skills["Old Farmer"] && isAdvancedCrop(crop)) {
    amount += 0.1;
    boostsUsed.push("Old Farmer");
  }

  if (skills["Acre Farm"] && isAdvancedCrop(crop)) {
    amount += 1;
    boostsUsed.push("Acre Farm");
  }

  if (skills["Acre Farm"] && isMediumCrop(crop)) {
    amount -= 0.5;
    boostsUsed.push("Acre Farm");
  }

  if (skills["Acre Farm"] && isBasicCrop(crop)) {
    amount -= 0.5;
    boostsUsed.push("Acre Farm");
  }

  if (skills["Hectare Farm"] && isAdvancedCrop(crop)) {
    amount -= 0.5;
    boostsUsed.push("Hectare Farm");
  }

  if (skills["Hectare Farm"] && isMediumCrop(crop)) {
    amount += 1;
    boostsUsed.push("Hectare Farm");
  }

  if (skills["Hectare Farm"] && isBasicCrop(crop)) {
    amount += 1;
    boostsUsed.push("Hectare Farm");
  }

  if (isCollectibleBuilt({ game, name: "Giant Onion" }) && crop === "Onion") {
    amount += 3;
    boostsUsed.push("Giant Onion");
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
    const { activeGuardian } = getActiveGuardian({
      game,
    });
    if (activeGuardian) {
      amount += 1;
      boostsUsed.push(activeGuardian);
    }
  }

  return {
    amount: Number(setPrecision(amount)),
    aoe: updatedAoe,
    boostsUsed,
  };
}

export function harvestCropFromPlot({
  plotId,
  game,
  createdAt,
}: {
  plotId: string;
  game: GameState;
  createdAt: number;
}): {
  updatedPlot: CropPlot;
  amount: number;
  aoe: AOE;
  boostsUsed: BoostName[];
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

  const { name: cropName, plantedAt, reward, criticalHit = {} } = plot.crop;

  const { amount, aoe, boostsUsed } = plot.crop.amount
    ? { amount: plot.crop.amount, aoe: game.aoe, boostsUsed: [] }
    : getCropYieldAmount({
        crop: cropName,
        game,
        plot,
        createdAt,
        criticalDrop: (name) => !!(criticalHit[name] ?? 0),
      });

  const { harvestSeconds } = CROPS[cropName];

  if (createdAt - plantedAt < harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

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
    boostsUsed,
    cropName,
  };
}

export function harvest({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops: plots } = stateCopy;

    const { updatedPlot, amount, aoe, boostsUsed, cropName } =
      harvestCropFromPlot({
        plotId: action.index,
        game: stateCopy,
        createdAt,
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
