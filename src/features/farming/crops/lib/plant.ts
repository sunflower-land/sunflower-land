import sunflowerSeedling from "assets/crops/sunflower/seedling.png";
import sunflowerHalfway from "assets/crops/sunflower/halfway.png";
import sunflowerAlmostDone from "assets/crops/sunflower/almost.png";
import sunflowerPlant from "assets/crops/sunflower/planted.png";
import sunflowerProcSprite from "assets/crops/sunflower/proc_sprite.png";

import potatoSeedling from "assets/crops/potato/seedling.png";
import potatoHalfway from "assets/crops/potato/halfway.png";
import potatoAlmostDone from "assets/crops/potato/almost.png";
import potatoPlant from "assets/crops/potato/plant.png";
import potatoProcSprite from "assets/crops/potato/proc_sprite.png";

import pumpkinSeedling from "assets/crops/pumpkin/seedling.png";
import pumpkinHalfway from "assets/crops/pumpkin/halfway.png";
import pumpkinAlmostDone from "assets/crops/pumpkin/almost.png";
import pumpkinPlant from "assets/crops/pumpkin/plant.png";
import pumpkinProcSprite from "assets/crops/pumpkin/proc_sprite.png";

import carrotSeedling from "assets/crops/carrot/seedling.png";
import carrotHalfway from "assets/crops/carrot/halfway.png";
import carrotAlmostDone from "assets/crops/carrot/almost.png";
import carrotPlant from "assets/crops/carrot/plant.png";
import carrotProcSprite from "assets/crops/carrot/proc_sprite.png";

import cabbageSeedling from "assets/crops/cabbage/seedling.png";
import cabbageHalfway from "assets/crops/cabbage/halfway.png";
import cabbageAlmostDone from "assets/crops/cabbage/almost.png";
import cabbagePlant from "assets/crops/cabbage/plant.png";
import cabbageProcSprite from "assets/crops/cabbage/proc_sprite.png";

import beetrootSeedling from "assets/crops/beetroot/seedling.png";
import beetrootHalfway from "assets/crops/beetroot/halfway.png";
import beetrootAlmostDone from "assets/crops/beetroot/almost.png";
import beetrootPlant from "assets/crops/beetroot/plant.png";
import beetrootProcSprite from "assets/crops/beetroot/proc_sprite.png";

import cauliflowerSeedling from "assets/crops/cauliflower/seedling.png";
import cauliflowerHalfway from "assets/crops/cauliflower/halfway.png";
import cauliflowerAlmostDone from "assets/crops/cauliflower/almost.png";
import cauliflowerPlant from "assets/crops/cauliflower/plant.png";
import cauliflowerProcSprite from "assets/crops/cauliflower/proc_sprite.png";

import parsnipSeedling from "assets/crops/parsnip/seedling.png";
import parsnipHalfway from "assets/crops/parsnip/halfway.png";
import parsnipAlmostDone from "assets/crops/parsnip/almost.png";
import parsnipPlant from "assets/crops/parsnip/plant.png";
import parsnipProcSprite from "assets/crops/parsnip/proc_sprite.png";

import radishSeedling from "assets/crops/radish/seedling.png";
import radishHalfway from "assets/crops/radish/halfway.png";
import radishAlmostDone from "assets/crops/radish/almost.png";
import radishPlant from "assets/crops/radish/plant.png";
import radishProcSprite from "assets/crops/radish/proc_sprite.png";

import wheatSeedling from "assets/crops/wheat/seedling.png";
import wheatHalfway from "assets/crops/wheat/halfway.png";
import wheatAlmostDone from "assets/crops/wheat/almost.png";
import wheatPlant from "assets/crops/wheat/plant.png";
import wheatProcSprite from "assets/crops/wheat/proc_sprite.png";

import kaleSeedling from "assets/crops/kale/seedling.png";
import kaleHalfway from "assets/crops/kale/halfway.png";
import kaleAlmostDone from "assets/crops/kale/almost.png";
import kalePlant from "assets/crops/kale/plant.png";
import kaleProcSprite from "assets/crops/kale/proc_sprite.png";

import { CropName } from "features/game/types/crops";

export const HARVEST_PROC_SPRITES: Record<CropName, any> = {
  Sunflower: sunflowerProcSprite,
  Potato: potatoProcSprite,
  Pumpkin: pumpkinProcSprite,
  Carrot: carrotProcSprite,
  Cabbage: cabbageProcSprite,
  Beetroot: beetrootProcSprite,
  Cauliflower: cauliflowerProcSprite,
  Parsnip: parsnipProcSprite,
  Radish: radishProcSprite,
  Wheat: wheatProcSprite,
  Kale: kaleProcSprite,
};

export const HARVEST_PROC_ANIMATION = {
  size: 36,
  steps: 11,
  fps: 10,
  sprites: HARVEST_PROC_SPRITES,
};

export type Lifecycle = {
  seedling: any;
  halfway: any;
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
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: sunflowerPlant,
  },
  Potato: {
    seedling: potatoSeedling,
    halfway: potatoHalfway,
    almost: potatoAlmostDone,
    ready: potatoPlant,
  },
  Pumpkin: {
    seedling: pumpkinSeedling,
    halfway: pumpkinHalfway,
    almost: pumpkinAlmostDone,
    ready: pumpkinPlant,
  },
  Carrot: {
    seedling: carrotSeedling,
    halfway: carrotHalfway,
    almost: carrotAlmostDone,
    ready: carrotPlant,
  },
  Cabbage: {
    seedling: cabbageSeedling,
    halfway: cabbageHalfway,
    almost: cabbageAlmostDone,
    ready: cabbagePlant,
  },
  Beetroot: {
    seedling: beetrootSeedling,
    halfway: beetrootHalfway,
    almost: beetrootAlmostDone,
    ready: beetrootPlant,
  },
  Cauliflower: {
    seedling: cauliflowerSeedling,
    halfway: cauliflowerHalfway,
    almost: cauliflowerAlmostDone,
    ready: cauliflowerPlant,
  },
  Parsnip: {
    seedling: parsnipSeedling,
    halfway: parsnipHalfway,
    almost: parsnipAlmostDone,
    ready: parsnipPlant,
  },
  Radish: {
    seedling: radishSeedling,
    halfway: radishHalfway,
    almost: radishAlmostDone,
    ready: radishPlant,
  },
  Wheat: {
    seedling: wheatSeedling,
    halfway: wheatHalfway,
    almost: wheatAlmostDone,
    ready: wheatPlant,
  },
  Kale: {
    seedling: kaleSeedling,
    halfway: kaleHalfway,
    almost: kaleAlmostDone,
    ready: kalePlant,
  },
};
