import Decimal from "decimal.js-light";

import {
  CropName,
  CROPS,
  GreenHouseCropName,
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
  isOvernightCrop,
} from "../../types/crops";
import {
  Buildings,
  CriticalHitName,
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
import { setPrecision } from "lib/utils/formatNumber";
import { SEASONAL_SEEDS, SeedName, SEEDS } from "features/game/types/seeds";
import {
  isWithinAOE,
  Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import {
  isSummerCrop,
  isAutumnCrop,
  isSpringCrop,
  isWinterCrop,
} from "./harvest";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { getBudSpeedBoosts } from "features/game/lib/getBudSpeedBoosts";
import { CropCompostName } from "features/game/types/composters";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import { isWearableActive } from "features/game/lib/wearables";
import { isGreenhouseCrop } from "./plantGreenhouse";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { produce } from "immer";
import {
  CalendarEventName,
  getActiveCalendarEvent,
  isGuardianActive,
} from "features/game/types/calendar";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

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

  // Legacy Seed Specialist skill: 10% reduction
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

  // Cultivator skill: 5% reduction
  if (skills["Cultivator"]) {
    seconds = seconds * 0.95;
  }

  // Lunar calender: 10% reduction
  if (isCollectibleBuilt({ name: "Lunar Calendar", game })) {
    seconds = seconds * 0.9;
  }

  seconds = seconds * getBudSpeedBoosts(buds ?? {}, crop);

  if (
    isCollectibleActive({ name: "Super Totem", game }) ||
    isCollectibleActive({ name: "Time Warp Totem", game })
  ) {
    seconds = seconds * 0.5;
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

  if (skills["Green Thumb"] && !isGreenhouseCrop(crop)) {
    seconds = seconds * 0.95;
  }

  if (skills["Strong Roots"] && isAdvancedCrop(crop)) {
    seconds = seconds * 0.9;
  }

  if (isGreenhouseCrop(crop) && skills["Rice and Shine"]) {
    seconds = seconds * 0.95;
  }

  // Olive Express: 10% reduction
  if (crop === "Olive" && skills["Olive Express"]) {
    seconds = seconds * 0.9;
  }

  // Rice Rocket: 10% reduction
  if (crop === "Rice" && skills["Rice Rocket"]) {
    seconds = seconds * 0.9;
  }

  return seconds;
}

/**
 * Based on boosts, how long a crop will take to grow
 */
export const getCropPlotTime = ({
  crop,
  game,
  plot,
  fertiliser,
}: {
  crop: CropName;
  game: GameState;
  plot?: CropPlot;
  fertiliser?: CropCompostName;
}) => {
  let seconds = CROPS[crop]?.harvestSeconds ?? 0;

  if (game.bumpkin === undefined) return seconds;

  const baseMultiplier = getCropTime({ game, crop });
  seconds *= baseMultiplier;

  // Mysterious Parsnip: 50% reduction
  if (
    crop === "Parsnip" &&
    isCollectibleBuilt({ name: "Mysterious Parsnip", game })
  ) {
    seconds = seconds * 0.5;
  }

  // Bumpkin Wearable Boost
  if (crop === "Carrot" && isWearableActive({ name: "Carrot Amulet", game })) {
    seconds = seconds * 0.8;
  }

  // Cabbage Girl: 50% reduction
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

  if (isCollectibleActive({ name: "Harvest Hourglass", game })) {
    seconds = seconds * 0.75;
  }

  // Any boost added below this line will not be reflected in betty's shop
  if (!plot) return seconds;

  const collectibles = game.collectibles;

  // If within Basic Scarecrow AOE: 20% reduction
  if (collectibles["Basic Scarecrow"]?.[0] && isBasicCrop(crop)) {
    const basicScarecrowCoordinates =
      collectibles["Basic Scarecrow"]?.[0].coordinates;
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
      } else {
        seconds = seconds * 0.8;
      }
    }
  }

  if (fertiliser === "Rapid Root") {
    seconds = seconds * 0.5;
  }

  const isSunshower = getActiveCalendarEvent({ game }) === "sunshower";

  if (isSunshower) {
    seconds = seconds * 0.5;
    if (isGuardianActive({ game })) {
      seconds = seconds * 0.5;
    }
  }

  return seconds;
};

type GetPlantedAtArgs = {
  crop: CropName;
  game: GameState;
  createdAt: number;
  plot: CropPlot;
  fertiliser?: CropCompostName;
};

/**
 * Set a plantedAt in the past to make a crop grow faster
 */
export function getPlantedAt({
  crop,
  game,
  createdAt,
  plot,
  fertiliser,
}: GetPlantedAtArgs): number {
  if (!crop) return 0;

  const cropTime = CROPS[crop].harvestSeconds;
  const boostedTime = getCropPlotTime({ crop, game, plot, fertiliser });

  const offset = cropTime - boostedTime;

  return createdAt - offset * 1000;
}

function isPlotCrop(plant: GreenHouseCropName | CropName): plant is CropName {
  return (plant as CropName) in CROPS;
}

/**
 * Based on items, the output will be different
 */
export function getCropYieldAmount({
  crop,
  game,
  plot,
  criticalDrop = () => false, // False by default as BE will handle this
}: {
  crop: CropName | GreenHouseCropName;
  plot?: CropPlot;
  game: GameState;
  criticalDrop?: (name: CriticalHitName) => boolean;
}): number {
  let amount = 1;

  const { inventory, bumpkin, buds } = game;
  const skills = bumpkin.skills;

  // Specific crop multipliers
  if (
    crop === "Cauliflower" &&
    isCollectibleBuilt({ name: "Golden Cauliflower", game })
  ) {
    amount *= 2;
  }

  if (crop === "Carrot" && isCollectibleBuilt({ name: "Easter Bunny", game })) {
    amount *= 1.2;
  }

  if (
    crop === "Pumpkin" &&
    isCollectibleBuilt({ name: "Victoria Sisters", game })
  ) {
    amount *= 1.2;
  }

  if (crop === "Parsnip" && isWearableActive({ name: "Parsnip", game })) {
    amount *= 1.2;
  }

  if (
    crop === "Beetroot" &&
    isWearableActive({ name: "Beetroot Amulet", game })
  ) {
    amount *= 1.2;
  }

  if (
    crop === "Sunflower" &&
    isWearableActive({ name: "Sunflower Amulet", game })
  ) {
    amount *= 1.1;
  }

  // Generic crop multipliers
  if (
    isCollectibleBuilt({ name: "Scarecrow", game }) ||
    isCollectibleBuilt({ name: "Kuebiko", game })
  ) {
    amount *= 1.2;
  }

  if (inventory.Coder?.gte(1)) {
    amount *= 1.2;
  }

  if (
    isWearableActive({ name: "Green Amulet", game }) &&
    criticalDrop("Green Amulet")
  ) {
    amount *= 10;
  }

  if (skills["Happy Crop"] && criticalDrop("Happy Crop")) {
    amount *= 2;
  }

  if (skills["Master Farmer"]) {
    amount *= 1.1;
  }

  // Specific crop additions
  if (
    crop === "Potato" &&
    isCollectibleBuilt({ name: "Peeled Potato", game }) &&
    criticalDrop("Peeled Potato")
  ) {
    amount += 1;
  }

  if (crop === "Cabbage") {
    // Yields + 0.25 Cabagge with Cabbage boy and +0.5 if Cabbage Boy and Girl are built
    if (isCollectibleBuilt({ name: "Cabbage Boy", game })) {
      amount += 0.25;

      if (isCollectibleBuilt({ name: "Cabbage Girl", game })) {
        amount += 0.25;
      }
    }

    if (!isCollectibleBuilt({ name: "Cabbage Boy", game })) {
      // Yields +0.1 Cabbage with Karkinos
      if (isCollectibleBuilt({ name: "Karkinos", game })) {
        amount += 0.1;
      }
    }
  }

  if (
    crop === "Carrot" &&
    isCollectibleBuilt({ name: "Pablo The Bunny", game })
  ) {
    amount += 0.1;
  }

  if (crop === "Kale" && isCollectibleBuilt({ name: "Foliant", game })) {
    amount += 0.2;
  }

  if (
    crop === "Eggplant" &&
    isCollectibleBuilt({ name: "Purple Trail", game })
  ) {
    amount += 0.2;
  }

  if (crop === "Eggplant" && isCollectibleBuilt({ name: "Maximus", game })) {
    amount += 1;
  }

  if (
    crop === "Eggplant" &&
    isWearableActive({ name: "Eggplant Onesie", game })
  ) {
    amount += 0.1;
  }

  if (crop === "Yam" && isCollectibleBuilt({ name: "Giant Yam", game })) {
    amount += 0.5;
  }

  if (crop === "Soybean" && isWearableActive({ name: "Tofu Mask", game })) {
    amount += 0.1;
  }

  if (crop === "Corn" && isWearableActive({ name: "Corn Onesie", game })) {
    amount += 0.1;
  }

  if (crop === "Wheat" && isWearableActive({ name: "Sickle", game })) {
    amount += 2;
  }

  // Barley
  if (
    crop === "Barley" &&
    isCollectibleBuilt({ name: "Sheaf of Plenty", game })
  ) {
    amount += 2;
  }

  if (crop === "Kale" && isCollectibleBuilt({ name: "Giant Kale", game })) {
    amount += 2;
  }
  // Rice
  if (crop === "Rice" && isWearableActive({ name: "Non La Hat", game })) {
    amount += 1;
  }

  if (crop === "Rice" && isCollectibleBuilt({ name: "Rice Panda", game })) {
    amount += 0.25;
  }

  if (
    isGreenhouseCrop(crop) &&
    isCollectibleBuilt({ name: "Pharaoh Gnome", game })
  ) {
    amount += 2;
  }

  // Olive
  if (crop === "Olive" && isWearableActive({ name: "Olive Shield", game })) {
    amount += 1;
  }

  // Greenhouse Gamble 25% chance of +1 yield
  if (
    isGreenhouseCrop(crop) &&
    skills["Greenhouse Gamble"] &&
    criticalDrop("Greenhouse Gamble")
  ) {
    amount += 1;
  }

  if (plot?.fertiliser?.name === "Sprout Mix") {
    amount += 0.2;
    if (isCollectibleBuilt({ name: "Knowledge Crab", game })) {
      amount += 0.2;
    }
  }

  if (isGreenhouseCrop(crop) && skills["Glass Room"]) {
    amount += 0.1;
  }

  if (isGreenhouseCrop(crop) && skills["Seeded Bounty"]) {
    amount += 0.5;
  }

  if (isGreenhouseCrop(crop) && skills["Greasy Plants"]) {
    amount += 1;
  }

  if (
    crop === "Olive" &&
    isWearableActive({ game, name: "Olive Royalty Shirt" })
  ) {
    amount += 0.25;
  }

  //Seasonal Additions
  if (
    isSpringCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Blossom Ward", game })
  ) {
    amount += 1;
  }

  if (
    isWinterCrop(crop, game.season.season, SEASONAL_SEEDS) &&
    !isGreenhouseCrop(crop) &&
    isWearableActive({ name: "Frozen Heart", game })
  ) {
    amount += 1;
  }

  // Generic crop additions
  if (isWearableActive({ name: "Infernal Pitchfork", game })) {
    amount += 3;
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
  }

  amount += getBudYieldBoosts(buds ?? {}, crop);

  if (isOvernightCrop(crop) && isCollectibleBuilt({ name: "Hoot", game })) {
    amount += 0.5;
  }

  if (
    game.collectibles["Scary Mike"]?.[0] &&
    isPlotCrop(crop) &&
    isMediumCrop(crop) &&
    plot
  ) {
    const scarecrowCoordinates =
      game.collectibles["Scary Mike"]?.[0].coordinates;
    const scarecrowDimensions = COLLECTIBLES_DIMENSIONS["Scary Mike"];

    const scarecrowPosition: Position = {
      x: scarecrowCoordinates.x,
      y: scarecrowCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const plotPosition: Position = {
      x: plot?.x,
      y: plot?.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    if (
      isCollectibleBuilt({ name: "Scary Mike", game }) &&
      isWithinAOE("Scary Mike", scarecrowPosition, plotPosition, skills)
    ) {
      if (game.bumpkin.skills["Horror Mike"]) {
        amount = amount + 0.3;
      } else {
        amount = amount + 0.2;
      }
    }
  }

  if (
    game.collectibles["Sir Goldensnout"] &&
    isCollectibleBuilt({ name: "Sir Goldensnout", game }) &&
    plot
  ) {
    const sirGoldenSnout = game.collectibles["Sir Goldensnout"][0];

    const position: Position = {
      x: sirGoldenSnout.coordinates.x,
      y: sirGoldenSnout.coordinates.y,
      ...COLLECTIBLES_DIMENSIONS["Sir Goldensnout"],
    };

    if (
      isPlotCrop(crop) &&
      isWithinAOE(
        "Sir Goldensnout",
        position,
        {
          ...plot,
          ...RESOURCE_DIMENSIONS["Crop Plot"],
        },
        skills,
      )
    ) {
      amount = amount + 0.5;
    }
  }

  if (
    game.collectibles["Laurie the Chuckle Crow"]?.[0] &&
    isPlotCrop(crop) &&
    isAdvancedCrop(crop) &&
    plot
  ) {
    const scarecrowCoordinates =
      game.collectibles["Laurie the Chuckle Crow"]?.[0].coordinates;
    const scarecrowDimensions =
      COLLECTIBLES_DIMENSIONS["Laurie the Chuckle Crow"];

    const scarecrowPosition: Position = {
      x: scarecrowCoordinates.x,
      y: scarecrowCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const plotPosition: Position = {
      x: plot?.x,
      y: plot?.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    if (
      isCollectibleBuilt({ name: "Laurie the Chuckle Crow", game }) &&
      isWithinAOE(
        "Laurie the Chuckle Crow",
        scarecrowPosition,
        plotPosition,
        skills,
      )
    ) {
      if (game.bumpkin.skills["Laurie's Gains"]) {
        amount = amount + 0.3;
      } else {
        amount = amount + 0.2;
      }
    }
  }

  if (crop === "Corn" && game.collectibles["Queen Cornelia"]?.[0] && plot) {
    const scarecrowCoordinates =
      game.collectibles["Queen Cornelia"]?.[0].coordinates;
    const scarecrowDimensions = COLLECTIBLES_DIMENSIONS["Queen Cornelia"];

    const scarecrowPosition: Position = {
      x: scarecrowCoordinates.x,
      y: scarecrowCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const plotPosition: Position = {
      x: plot?.x,
      y: plot?.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    };

    if (
      isCollectibleBuilt({ name: "Queen Cornelia", game }) &&
      isWithinAOE("Queen Cornelia", scarecrowPosition, plotPosition, skills)
    ) {
      amount = amount + 1;
    }
  }

  if (crop === "Pumpkin" && isCollectibleBuilt({ name: "Freya Fox", game })) {
    amount += 0.5;
  }

  const hasGnome = isCollectibleBuilt({ name: "Gnome", game });

  if (
    isPlotCrop(crop) &&
    (isMediumCrop(crop) || isAdvancedCrop(crop)) &&
    hasGnome &&
    plot
  ) {
    const gnome = game.collectibles["Gnome"]?.[0];

    // Cobalt is to the left
    const cobalt = game.collectibles["Cobalt"]?.[0];
    const cobaltIsLeftOf =
      cobalt?.coordinates.y === gnome?.coordinates.y &&
      (cobalt?.coordinates.x ?? 0) + 1 === gnome?.coordinates.x;

    // Clementine is to the right
    const clementine = game.collectibles["Clementine"]?.[0];
    const clementineIsRightOf =
      clementine?.coordinates.y === clementine?.coordinates.y &&
      (clementine?.coordinates.x ?? 0) - 1 === gnome?.coordinates.x;

    const cropPlot = plot;
    const cropIsBelow =
      cropPlot.x === gnome?.coordinates.x &&
      cropPlot.y + 1 === gnome.coordinates.y;

    // Must be at rest for 24
    const isUndisturbed =
      (gnome?.readyAt ?? gnome?.createdAt ?? 0) <
      Date.now() - 24 * 60 * 60 * 1000;

    if (isUndisturbed && cropIsBelow && cobaltIsLeftOf && clementineIsRightOf) {
      amount += 10;
    }
  }

  if (crop === "Corn" && isCollectibleBuilt({ name: "Poppy", game })) {
    amount += 0.1;
  }

  if (
    crop === "Carrot" &&
    isCollectibleBuilt({ name: "Lab Grown Carrot", game })
  ) {
    amount += 0.2;
  }

  if (
    crop === "Pumpkin" &&
    isCollectibleBuilt({ name: "Lab Grown Pumpkin", game })
  ) {
    amount += 0.3;
  }

  if (
    crop === "Radish" &&
    isCollectibleBuilt({ name: "Lab Grown Radish", game })
  ) {
    amount += 0.4;
  }

  if (
    crop === "Potato" &&
    isCollectibleBuilt({ name: "Potent Potato", game }) &&
    criticalDrop("Potent Potato")
  ) {
    amount += 10;
  }

  if (
    crop === "Sunflower" &&
    isCollectibleBuilt({ name: "Stellar Sunflower", game }) &&
    criticalDrop("Stellar Sunflower")
  ) {
    amount += 10;
  }

  if (
    crop === "Radish" &&
    isCollectibleBuilt({ name: "Radical Radish", game }) &&
    criticalDrop("Radical Radish")
  ) {
    amount += 10;
  }

  if (plot?.beeSwarm) {
    let beeSwarmBonus = 0.2;
    if (skills["Pollen Power Up"]) {
      beeSwarmBonus += 0.1;
    }
    // Multiply by the amount of stacked beeswarms
    beeSwarmBonus *= plot.beeSwarm.count;
    amount += beeSwarmBonus;
  }

  if (crop === "Soybean" && isCollectibleBuilt({ name: "Soybliss", game })) {
    amount += 1;
  }

  if (skills["Young Farmer"] && isBasicCrop(crop)) {
    amount += 0.1;
  }

  if (skills["Experienced Farmer"] && isMediumCrop(crop)) {
    amount += 0.1;
  }

  if (skills["Old Farmer"] && isAdvancedCrop(crop)) {
    amount += 0.1;
  }

  if (skills["Acre Farm"] && isAdvancedCrop(crop)) {
    amount += 1;
  }

  if (skills["Acre Farm"] && isMediumCrop(crop)) {
    amount -= 0.5;
  }

  if (skills["Acre Farm"] && isBasicCrop(crop)) {
    amount -= 0.5;
  }

  if (skills["Hectare Farm"] && isAdvancedCrop(crop)) {
    amount -= 0.5;
  }

  if (skills["Hectare Farm"] && isMediumCrop(crop)) {
    amount += 1;
  }

  if (skills["Hectare Farm"] && isBasicCrop(crop)) {
    amount += 1;
  }

  // Insect plague
  const isInsectPlagueActive =
    getActiveCalendarEvent({ game }) === "insectPlague";
  const isProtected = game.calendar.insectPlague?.protected;

  if (isInsectPlagueActive && !isProtected) {
    amount = amount * 0.5;
  }

  if (getActiveCalendarEvent({ game }) === "bountifulHarvest") {
    amount += 1;
    if (isGuardianActive({ game })) {
      amount += 1;
    }
  }

  return Number(setPrecision(amount));
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

    plots[action.index] = {
      ...plot,
      crop: {
        id: action.cropId,
        plantedAt: getPlantedAt({
          crop: cropName,
          game: stateCopy,
          createdAt,
          plot,
          fertiliser: plot.fertiliser?.name,
        }),
        name: cropName,
      },
    };

    inventory[action.item] = seedCount.sub(1);

    return stateCopy;
  });
}
