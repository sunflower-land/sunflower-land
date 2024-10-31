import {
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
} from "../events/landExpansion/harvest";
import { getUniqueAnimalResources } from "../types/animals";
import { Bud, StemTrait, TypeTrait } from "../types/buds";
import {
  GREENHOUSE_CROPS,
  GreenHouseCropName,
  PLOT_CROPS,
  PlotCropName,
} from "../types/crops";
import {
  GREENHOUSE_FRUIT,
  GreenHouseFruitName,
  PATCH_FRUIT,
  PatchFruitName,
} from "../types/fruits";
import { AnimalResource, GameState } from "../types/game";
import { CommodityName, MushroomName } from "../types/resources";

export type Resource =
  | CommodityName
  | PlotCropName
  | PatchFruitName
  | MushroomName
  | GreenHouseCropName
  | GreenHouseFruitName
  | AnimalResource;

export const isPlotCrop = (resource: Resource): resource is PlotCropName => {
  return resource in PLOT_CROPS;
};

export const isCrop = (resource: Resource): resource is PlotCropName => {
  return resource in PLOT_CROPS || resource in GREENHOUSE_CROPS;
};

export const isAnimalProduce = (
  resource: Resource,
): resource is AnimalResource => {
  return getUniqueAnimalResources().includes(resource as AnimalResource);
};

const isMineral = (resource: Resource): boolean => {
  return resource === "Stone" || resource === "Iron" || resource === "Gold";
};

const isFruit = (resource: Resource): boolean => {
  return resource in PATCH_FRUIT() || resource in GREENHOUSE_FRUIT();
};

const getTypeBoost = (bud: Bud, resource: Resource): number => {
  const hasType = (type: TypeTrait) => bud.type === type;

  if (isMineral(resource) && hasType("Cave")) {
    return 0.2;
  }

  if (isPlotCrop(resource) && isBasicCrop(resource) && hasType("Plaza")) {
    return 0.3;
  }

  if (isPlotCrop(resource) && isMediumCrop(resource) && hasType("Castle")) {
    return 0.3;
  }

  if (isPlotCrop(resource) && isAdvancedCrop(resource) && hasType("Snow")) {
    return 0.3;
  }

  if (resource === "Wood" && hasType("Woodlands")) {
    return 0.2;
  }

  if (isAnimalProduce(resource) && hasType("Retreat")) {
    return 0.2;
  }

  if (isFruit(resource) && hasType("Beach")) {
    return 0.2;
  }

  return 0;
};

const getStemBoost = (bud: Bud, resource: Resource): number => {
  const hasStem = (stem: StemTrait) => bud.stem === stem;

  if (isCrop(resource) && hasStem("3 Leaf Clover")) {
    return 0.5;
  }

  if (isPlotCrop(resource) && isBasicCrop(resource) && hasStem("Basic Leaf")) {
    return 0.2;
  }

  if (resource === "Carrot" && hasStem("Carrot Head")) {
    return 0.3;
  }

  if (resource === "Sunflower" && hasStem("Sunflower Hat")) {
    return 0.5;
  }

  if (isMineral(resource) && hasStem("Diamond Gem")) {
    return 0.2;
  }

  if (resource === "Stone" && hasStem("Ruby Gem")) {
    return 0.2;
  }

  if (resource === "Iron" && hasStem("Miner Hat")) {
    return 0.2;
  }

  if (resource === "Gold" && hasStem("Gold Gem")) {
    return 0.2;
  }

  if (resource === "Wild Mushroom" && hasStem("Mushroom")) {
    return 0.3;
  }

  if (resource === "Magic Mushroom" && hasStem("Magic Mushroom")) {
    return 0.2;
  }

  if (resource === "Wood" && hasStem("Acorn Hat")) {
    return 0.1;
  }

  if (resource === "Wood" && hasStem("Tree Hat")) {
    return 0.2;
  }

  if (isFruit(resource) && hasStem("Banana")) {
    return 0.2;
  }

  if (isFruit(resource) && hasStem("Apple Head")) {
    return 0.2;
  }

  if (resource === "Egg" && hasStem("Egg Head")) {
    return 0.2;
  }

  return 0;
};

export const getAuraBoost = (bud: Bud): number => {
  if (bud.aura === "Basic") return 1.05;
  if (bud.aura === "Green") return 1.2;
  if (bud.aura === "Rare") return 2;
  if (bud.aura === "Mythical") return 5;

  return 1;
};

const getBudBoost = (bud: Bud, resource: Resource): number => {
  const typeBoost = getTypeBoost(bud, resource);
  const stemBoost = getStemBoost(bud, resource);
  const auraBoost = getAuraBoost(bud);

  return Number((auraBoost * (typeBoost + stemBoost)).toFixed(4));
};

export const getBudYieldBoosts = (
  buds: NonNullable<GameState["buds"]>,
  resource: Resource,
): number => {
  const boosts = Object.values(buds)
    // Bud must be placed to give a boost
    .filter((bud) => !!bud.coordinates)
    .map((bud) => getBudBoost(bud, resource));

  // Get the highest boost from all the buds on the farm
  return Math.max(0, ...boosts);
};
