import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";

import { CropName, CROPS } from "../../types/crops";
import {
  Buildings,
  Bumpkin,
  CropPlot,
  GameState,
  Inventory,
  InventoryItemName,
  PlacedItem,
  Position,
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
import { SEEDS } from "features/game/types/seeds";
import { BuildingName } from "features/game/types/buildings";
import { isWithinAOE } from "features/game/expansion/placeable/lib/collisionDetection";
import {
  isBasicCrop,
  isMediumCrop,
  isAdvancedCrop,
  isOvernightCrop,
} from "./harvest";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { getBudSpeedBoosts } from "features/game/lib/getBudSpeedBoosts";
import { CropCompostName } from "features/game/types/composters";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import { getBumpkinLevel } from "features/game/lib/level";
import { isBuildingEnabled } from "features/game/expansion/lib/buildingRequirements";
import { isWearableActive } from "features/game/lib/wearables";

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
  buildings: Partial<Record<BuildingName, PlacedItem[]>>;
  bumpkin?: Bumpkin;
};

// First 15 plots do not need water
const INITIAL_SUPPORTED_PLOTS = 17;
// Each well can support an additional 8 plots
const WELL_PLOT_SUPPORT = 8;

export const getCompletedWellCount = (
  buildings: Partial<Record<BuildingName, PlacedItem[]>>
) => {
  return (
    buildings["Water Well"]?.filter((well) => well.readyAt < Date.now())
      .length ?? 0
  );
};

export const getEnabledWellCount = (
  buildings: Partial<Record<BuildingName, PlacedItem[]>>,
  bumpkin?: Bumpkin
) => {
  let enabledWells =
    buildings["Water Well"]?.filter((well) => well.readyAt < Date.now())
      .length ?? 0;

  const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);
  while (enabledWells > 0) {
    if (isBuildingEnabled(bumpkinLevel, "Water Well", enabledWells - 1)) break;
    --enabledWells;
  }

  return enabledWells;
};

export function isPlotFertile({
  plotIndex,
  crops,
  buildings,
  bumpkin,
}: IsPlotFertile): boolean {
  // get the well count
  const wellCount = getEnabledWellCount(buildings, bumpkin);
  const cropsWellCanWater =
    wellCount * WELL_PLOT_SUPPORT + INITIAL_SUPPORTED_PLOTS;

  const cropPosition =
    getKeys(crops)
      .sort((a, b) => (crops[a].createdAt > crops[b].createdAt ? 1 : -1))
      .findIndex((plotId) => plotId === plotIndex) + 1;

  return cropPosition <= cropsWellCanWater;
}

/**
 * Based on boosts, how long a crop will take to grow
 */
export const getCropTime = ({
  crop,
  inventory,
  game,
  bumpkin,
  buds,
  plot,
  fertiliser,
}: {
  crop: CropName;
  inventory: Inventory;
  game: GameState;
  bumpkin: Bumpkin;
  buds: NonNullable<GameState["buds"]>;
  plot?: CropPlot;
  fertiliser?: CropCompostName;
}) => {
  const { skills, equipped } = bumpkin;
  const { necklace } = equipped;
  let seconds = CROPS()[crop]?.harvestSeconds ?? 0;

  // Legacy Seed Specialist skill: 10% reduction
  if (inventory["Seed Specialist"]?.gte(1)) {
    seconds = seconds * 0.9;
  }

  // Mysterious Parsnip: 50% reduction
  if (
    crop === "Parsnip" &&
    isCollectibleBuilt({ name: "Mysterious Parsnip", game })
  ) {
    seconds = seconds * 0.5;
  }

  // Bumpkin Wearable Boost
  if (crop === "Carrot" && necklace === "Carrot Amulet") {
    seconds = seconds * 0.8;
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

  seconds = seconds * getBudSpeedBoosts(buds, crop);

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
      height: plot.height,
      width: plot.width,
    };

    if (
      isCollectibleBuilt({ name: "Basic Scarecrow", game }) &&
      isWithinAOE("Basic Scarecrow", scarecrowPosition, plotPosition)
    ) {
      seconds = seconds * 0.8;
    }
  }

  if (fertiliser === "Rapid Root") {
    seconds = seconds * 0.5;
  }

  if (isCollectibleActive({ name: "Time Warp Totem", game })) {
    seconds = seconds * 0.5;
  }

  return seconds;
};

type GetPlantedAtArgs = {
  crop: CropName;
  inventory: Inventory;
  game: GameState;
  buildings: Buildings;
  bumpkin: Bumpkin;
  createdAt: number;
  plot: CropPlot;
  buds: NonNullable<GameState["buds"]>;
  fertiliser?: CropCompostName;
};

/**
 * Set a plantedAt in the past to make a crop grow faster
 */
export function getPlantedAt({
  crop,
  inventory,
  game,
  buildings,
  bumpkin,
  buds,
  createdAt,
  plot,
  fertiliser,
}: GetPlantedAtArgs): number {
  if (!crop) return 0;

  const cropTime = CROPS()[crop].harvestSeconds;
  const boostedTime = getCropTime({
    crop,
    inventory,
    game: game,
    bumpkin,
    buds,
    plot,
    fertiliser,
  });

  const offset = cropTime - boostedTime;

  return createdAt - offset * 1000;
}

/**
 * Based on items, the output will be different
 */
export function getCropYieldAmount({
  crop,
  plot,
  inventory,
  game,
  buds,
  bumpkin,
  fertiliser,
}: {
  crop: CropName;
  plot: CropPlot;
  inventory: Inventory;
  game: GameState;
  buds: NonNullable<GameState["buds"]>;
  bumpkin: Bumpkin;
  fertiliser?: CropCompostName;
}): number {
  let amount = 1;
  const { skills, equipped } = bumpkin;
  const { tool, necklace, onesie } = equipped;

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

  if (
    isCollectibleBuilt({ name: "Scarecrow", game }) ||
    isCollectibleBuilt({ name: "Kuebiko", game })
  ) {
    amount *= 1.2;
  }

  if (inventory.Coder?.gte(1)) {
    amount *= 1.2;
  }

  //Bumpkin Skill boost Green Thumb Skill
  if (skills["Green Thumb"]) {
    amount *= 1.05;
  }

  //Bumpkin Skill boost Master Farmer Skill
  if (skills["Master Farmer"]) {
    amount *= 1.1;
  }

  //Bumpkin Wearable boost Parsnip tool
  if (crop === "Parsnip" && tool === "Parsnip") {
    amount *= 1.2;
  }

  //Bumpkin Wearable boost Beetroot Amulet
  if (crop === "Beetroot" && necklace === "Beetroot Amulet") {
    amount *= 1.2;
  }
  //Bumpkin Wearable boost Sunflower Amulet
  if (
    crop === "Sunflower" &&
    isWearableActive({ name: "Sunflower Amulet", game })
  ) {
    amount *= 1.1;
  }

  if (crop === "Eggplant" && onesie === "Eggplant Onesie") {
    amount += 0.1;
  }

  if (crop === "Corn" && onesie === "Corn Onesie") {
    amount += 0.1;
  }

  const collectibles = game.collectibles;

  if (collectibles["Scary Mike"]?.[0] && isMediumCrop(crop) && plot) {
    const scarecrowCoordinates = collectibles["Scary Mike"]?.[0].coordinates;
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
      height: plot.height,
      width: plot.width,
    };

    if (
      isCollectibleBuilt({ name: "Scary Mike", game }) &&
      isWithinAOE("Scary Mike", scarecrowPosition, plotPosition)
    ) {
      amount = amount + 0.2;
    }
  }

  if (
    collectibles["Sir Goldensnout"] &&
    isCollectibleBuilt({ name: "Sir Goldensnout", game })
  ) {
    const sirGoldenSnout = collectibles["Sir Goldensnout"][0];

    const position: Position = {
      x: sirGoldenSnout.coordinates.x,
      y: sirGoldenSnout.coordinates.y,
      ...COLLECTIBLES_DIMENSIONS["Sir Goldensnout"],
    };

    if (isWithinAOE("Sir Goldensnout", position, plot)) {
      amount = amount + 0.5;
    }
  }

  if (
    isOvernightCrop(crop) &&
    collectibles["Hoot"] &&
    isCollectibleBuilt({ name: "Hoot", game })
  ) {
    amount = amount + 0.5;
  }

  if (
    collectibles["Laurie the Chuckle Crow"]?.[0] &&
    isAdvancedCrop(crop) &&
    plot
  ) {
    const scarecrowCoordinates =
      collectibles["Laurie the Chuckle Crow"]?.[0].coordinates;
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
      height: plot.height,
      width: plot.width,
    };

    if (
      isCollectibleBuilt({ name: "Laurie the Chuckle Crow", game }) &&
      isWithinAOE("Laurie the Chuckle Crow", scarecrowPosition, plotPosition)
    ) {
      amount = amount + 0.2;
    }
  }

  if (crop === "Corn" && collectibles["Queen Cornelia"]?.[0] && plot) {
    const scarecrowCoordinates =
      collectibles["Queen Cornelia"]?.[0].coordinates;
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
      height: plot.height,
      width: plot.width,
    };

    if (
      isCollectibleBuilt({ name: "Queen Cornelia", game }) &&
      isWithinAOE("Queen Cornelia", scarecrowPosition, plotPosition)
    ) {
      amount = amount + 1;
    }
  }

  if (crop === "Pumpkin" && isCollectibleBuilt({ name: "Freya Fox", game })) {
    amount += 0.5;
  }

  if (crop === "Corn" && isCollectibleBuilt({ name: "Poppy", game })) {
    amount += 0.1;
  }

  if (bumpkin.equipped.tool === "Infernal Pitchfork") {
    amount += 3;
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

  amount += getBudYieldBoosts(buds, crop);

  if (fertiliser === "Sprout Mix") {
    amount += 0.2;
  }

  return Number(setPrecision(new Decimal(amount)));
}

export function plant({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const {
    crops: plots,
    bumpkin,
    collectibles,
    inventory,
    buildings,
  } = stateCopy;
  const buds = stateCopy.buds ?? {};

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!action.index) {
    throw new Error("Plot does not exist");
  }

  const plot = plots[action.index];

  if (!plot) {
    throw new Error("Plot does not exist");
  }

  if (plot.crop?.plantedAt) {
    throw new Error("Crop is already planted");
  }

  if (!action.item) {
    throw new Error("No seed selected");
  }

  if (!(action.item in SEEDS())) {
    throw new Error("Not a seed");
  }

  const seedCount = inventory[action.item] || new Decimal(0);

  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
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
        inventory,
        game: stateCopy,
        buildings,
        bumpkin,
        createdAt,
        plot,
        buds,
        fertiliser: plot.fertiliser?.name,
      }),
      name: cropName,
      amount: getCropYieldAmount({
        crop: cropName,
        inventory,
        game: stateCopy,
        bumpkin,
        plot,
        buds,
        fertiliser: plot.fertiliser?.name,
      }),
    },
  };

  inventory[action.item] = seedCount.sub(1);

  return stateCopy;
}
