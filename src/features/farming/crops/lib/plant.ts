import sunflowerSeedling from "assets/crops/sunflower/seedling.png";
import sunflowerAlmostDone from "assets/crops/sunflower/almost.png";
import sunflowerPlant from "assets/crops/sunflower/planted.png";

import potatoSeedling from "assets/crops/potato/seedling.png";
import potatoAlmostDone from "assets/crops/potato/almost.png";
import potatoPlant from "assets/crops/potato/plant.png";

import pumpkinSeedling from "assets/crops/pumpkin/seedling.png";
import pumpkinAlmostDone from "assets/crops/pumpkin/almost.png";
import pumpkinPlant from "assets/crops/pumpkin/plant.png";

import carrotSeedling from "assets/crops/carrot/seedling.png";
import carrotAlmostDone from "assets/crops/carrot/almost.png";
import carrotPlant from "assets/crops/carrot/plant.png";

import cabbageSeedling from "assets/crops/cabbage/seedling.png";
import cabbageAlmostDone from "assets/crops/cabbage/almost.png";
import cabbagePlant from "assets/crops/cabbage/plant.png";

import beetrootSeedling from "assets/crops/beetroot/seedling.png";
import beetrootAlmostDone from "assets/crops/beetroot/almost.png";
import beetrootPlant from "assets/crops/beetroot/plant.png";

import cauliflowerSeedling from "assets/crops/cauliflower/seedling.png";
import cauliflowerAlmostDone from "assets/crops/cauliflower/almost.png";
import cauliflowerPlant from "assets/crops/cauliflower/plant.png";

import parsnipSeedling from "assets/crops/parsnip/seedling.png";
import parsnipAlmostDone from "assets/crops/parsnip/almost.png";
import parsnipPlant from "assets/crops/parsnip/plant.png";

import radishSeedling from "assets/crops/radish/seedling.png";
import radishAlmostDone from "assets/crops/radish/almost.png";
import radishPlant from "assets/crops/radish/plant.png";

import wheatSeedling from "assets/crops/wheat/seedling.png";
import wheatAlmostDone from "assets/crops/wheat/almost.png";
import wheatPlant from "assets/crops/wheat/plant.png";

import { CropName } from "features/game/types/crops";

export type Lifecycle = {
  seedling: any;
  almost: any;
  ready: any;
};

/**
 * Crops and their original prices
 * TODO - use crop name from GraphQL API
 */
export const LIFECYCLE: Record<CropName, Lifecycle> = {
  Sunflower: {
    seedling: sunflowerSeedling,
    almost: sunflowerAlmostDone,
    ready: sunflowerPlant,
  },
  Potato: {
    seedling: potatoSeedling,
    almost: potatoAlmostDone,
    ready: potatoPlant,
  },
  Pumpkin: {
    seedling: pumpkinSeedling,
    almost: pumpkinAlmostDone,
    ready: pumpkinPlant,
  },
  Carrot: {
    seedling: carrotSeedling,
    almost: carrotAlmostDone,
    ready: carrotPlant,
  },
  Cabbage: {
    seedling: cabbageSeedling,
    almost: cabbageAlmostDone,
    ready: cabbagePlant,
  },
  Beetroot: {
    seedling: beetrootSeedling,
    almost: beetrootAlmostDone,
    ready: beetrootPlant,
  },
  Cauliflower: {
    seedling: cauliflowerSeedling,
    almost: cauliflowerAlmostDone,
    ready: cauliflowerPlant,
  },
  Parsnip: {
    seedling: parsnipSeedling,
    almost: parsnipAlmostDone,
    ready: parsnipPlant,
  },
  Radish: {
    seedling: radishSeedling,
    almost: radishAlmostDone,
    ready: radishPlant,
  },
  Wheat: {
    seedling: wheatSeedling,
    almost: wheatAlmostDone,
    ready: wheatPlant,
  },
};
