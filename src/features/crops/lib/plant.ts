import sunflowerSeedling from "assets/crops/sunflower/seedling.png";
import sunflowerPlant from "assets/crops/sunflower/planted.png";

import potatoSeedling from "assets/crops/potato/seedling.png";
import potatoPlant from "assets/crops/potato/plant.png";

import pumpkinSeedling from "assets/crops/pumpkin/seedling.png";
import pumpkinPlant from "assets/crops/pumpkin/plant.png";

import carrotSeedling from "assets/crops/carrot/seedling.png";
import carrotPlant from "assets/crops/carrot/plant.png";

import cabbageSeedling from "assets/crops/cabbage/seedling.png";
import cabbagePlant from "assets/crops/cabbage/plant.png";

import beetrootSeedling from "assets/crops/beetroot/seedling.png";
import beetrootPlant from "assets/crops/beetroot/plant.png";

import cauliflowerSeedling from "assets/crops/cauliflower/seedling.png";
import cauliflowerPlant from "assets/crops/cauliflower/plant.png";

import parsnipSeedling from "assets/crops/parsnip/seedling.png";
import parsnipPlant from "assets/crops/parsnip/plant.png";

import radishSeedling from "assets/crops/radish/seedling.png";
import radishPlant from "assets/crops/radish/plant.png";

import wheatSeedling from "assets/crops/wheat/seedling.png";
import wheatPlant from "assets/crops/wheat/plant.png";
import { CropName } from "features/game/types/crops";

export type Lifecycle = {
  seedling: any;
  ready: any;
};

/**
 * Crops and their original prices
 * TODO - use crop name from GraphQL API
 */
export const LIFECYCLE: Record<CropName, Lifecycle> = {
  Sunflower: {
    seedling: sunflowerSeedling,
    ready: sunflowerPlant,
  },
  Potato: {
    seedling: potatoSeedling,
    ready: potatoPlant,
  },
  Pumpkin: {
    seedling: pumpkinSeedling,
    ready: pumpkinPlant,
  },
  Carrot: {
    seedling: carrotSeedling,
    ready: carrotPlant,
  },
  Cabbage: {
    seedling: cabbageSeedling,
    ready: cabbagePlant,
  },
  Beetroot: {
    seedling: beetrootSeedling,
    ready: beetrootPlant,
  },
  Cauliflower: {
    seedling: cauliflowerSeedling,
    ready: cauliflowerPlant,
  },
  Parsnip: {
    seedling: parsnipSeedling,
    ready: parsnipPlant,
  },
  Radish: {
    seedling: radishSeedling,
    ready: radishPlant,
  },
  Wheat: {
    seedling: wheatSeedling,
    ready: wheatPlant,
  },
};
